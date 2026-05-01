import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";

vi.mock("../../db/index.js", () => ({
  default: {
    query: vi.fn(),
    getConnection: vi.fn(),
  },
}));

import pool from "../../db/index.js";
import details from "../../routes/details.js";

// getConnection モックのヘルパー関数
const mockConnection = {
  beginTransaction: vi.fn(),
  query: vi.fn(),
  commit: vi.fn(),
  rollback: vi.fn(),
  release: vi.fn(),
};

const app = new Hono();
app.route("/api/details", details);

beforeEach(() => {
  vi.clearAllMocks();
  // 各テストの beforeEach で設定する
  vi.mocked(pool.getConnection).mockResolvedValue(mockConnection as never);
});

// POST /api/details のテストケース
describe("POST /api/details", () => {

  it("正常系 - 支出明細の登録が成功する", async () => {
    vi.mocked(mockConnection.query)
      .mockResolvedValueOnce([[{ category_id: 1 }], []])
      .mockResolvedValueOnce([{ insertId: 10 }, []]);

    const res = await app.request("/api/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: 1,
        expense_date: "2026-04-01",
        category_name: "食費",
        amount: 1000,
        description: "ランチ",
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.message).toBe("支出を登録しました");
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).toHaveBeenCalled();
  });

  it("正常系 - 新しいカテゴリが自動作成される", async () => {
    vi.mocked(mockConnection.query)
      .mockResolvedValueOnce([[], []])
      .mockResolvedValueOnce([{ insertId: 5 }, []])
      .mockResolvedValueOnce([{ insertId: 10 }, []]);

    const res = await app.request("/api/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: 1,
        expense_date: "2026-04-01",
        category_name: "交通費",
        amount: 2000,
        description: "電車代",
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.message).toBe("支出を登録しました");
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).toHaveBeenCalled();
  });

  it("異常系 - 必須項目が欠けているとき 400 を返す", async () => {
    const res = await app.request("/api/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expense_date: "2026-04-01",
        category_name: "食費",
        amount: 1000,
        description: "ランチ",
      }),
    });

    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.message).toBe("必須項目が不足しています");
  });

  it("異常系 - amoutが 0以下のとき 400 を返す", async () => {
    const res = await app.request("/api/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: 1,
        expense_date: "2026-04-01",
        category_name: "食費",
        amount: 0,
        description: "ランチ",
      }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toBe("金額は１以上で入力してください");
  });

  it("異常系 - DB エラー発生時に rollback が呼ばれる", async () => {
    vi.mocked(mockConnection.query)
      .mockResolvedValueOnce([[{ category_id: 1 }], []])
      .mockRejectedValue(new Error("DB Error"));

    const res = await app.request("/api/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: 1,
        expense_date: "2026-04-01",
        category_name: "食費",
        amount: 1000,
        description: "ランチ",
      }),
    });

    expect(res.status).toBe(500);
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });
});

// GET /api/details/dashboard/:user_id のテストケース
describe("GET /api/details/dashboard/:user_id", () => {

  it("正常系 - ダッシュボードデータを取得できる", async () => {
    vi.mocked(pool.query as any)
      .mockResolvedValueOnce([[{ user_id: 1 }], []])
      .mockResolvedValueOnce([[{ total: 15000 }], []])
      .mockResolvedValueOnce([
        [
          {
            id: 1,
            category_name: "食費",
            amout: 1000,
            expense_date: "2026-04-01",
          },
          {
            id: 2,
            category_name: "交通費",
            amout: 2000,
            expense_date: "2026-04-02",
          },
        ],
        [],
      ]);

    const res = await app.request("/api/details/dashboard/1", {
      method: "GET",
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.monthlyTotal).toBe(15000);
  });

  it("異常系 - ユーザーが存在しないとき 404 を返す", async () => {
    vi.mocked(pool.query as any).mockResolvedValueOnce([[], []]);

    const res = await app.request("/api/details/dashboard/999", {
      method: "GET",
    });

    expect(res.status).toBe(404);
  });
});

// PUT /api/details/users/:user_id/budget のテストケース
describe("PUT /api/details/users/:user_id/budget", () => {

  it("正常系 - 予算を更新できる", async () => {
    vi.mocked(pool.query as any).mockResolvedValueOnce([
      { affectedRows: 1 },
      [],
    ]);

    const res = await app.request("/api/details/users/1/budget", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monthly_budget: 80000 }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBe("予算を更新しました");
  });

  it("異常系 - monthly_budget が負の値のとき 400 を返す", async () => {
    const res = await app.request("/api/details/users/1/budget", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monthly_budget: -1 }),
    });

    expect(res.status).toBe(400);
  });

  it("異常系 - ユーザーが存在しないとき 404 を返す", async () => {
    vi.mocked(pool.query as any).mockResolvedValueOnce([
      { affectedRows: 0 },
      [],
    ]);

    const res = await app.request("/api/details/users/999/budget", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monthly_budget: 1000 }),
    });

    expect(res.status).toBe(404);
  });
});
// GET /api/details/history/:user_id のテストケース
describe("GET /api/details/history/:user_id", () => {

  it("正常系 - 履歴データとページネーション情報を取得できる", async () => {
    vi.mocked(pool.query as any)
      .mockResolvedValueOnce([
        new Array(10).fill({
          id: 1,
          category_name: "食費",
          amount: 1000,
          expense_date: "2026-04-01",
        }),
        [],
      ])
      .mockResolvedValueOnce([[{ totalCount: 25 }], []]);

    const res = await app.request("/api/details/history/1?page=1", {
      method: "GET",
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.totalCount).toBe(25);
    expect(body.totalPages).toBe(3);
  });

  it("正常系 - page パラメータを指定してページネーションが動作する", async () => {
    vi.mocked(pool.query as any)
      .mockResolvedValueOnce([[], []])
      .mockResolvedValueOnce([[{ totalCount: 25 }], []]);

    await app.request("/api/details/history/1?page=2", {
      method: "GET",
    });

    const calls = vi.mocked(pool.query as any).mock.calls;
    console.log("1回目のクエリ:", calls[0][0]);
    console.log("2回目のクエリ:", calls[1][0]);

    expect(pool.query as any ).toHaveBeenCalledWith(
      expect.stringContaining("LIMIT ? OFFSET ?"),
      expect.arrayContaining([10, 10]),
    );
  });
});
