import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";

vi.mock("../../db/index.js", () => ({
  default: { query: vi.fn() },
}));
import pool from "../../db/index.js";
import todos from "../../routes/todos.js";

const app = new Hono();
app.route("/api/todos", todos);

beforeEach(() => {
  vi.clearAllMocks();
});

// GET /api/todos のテストケース
describe("GET /api/todos", () => {
  it("正常系 - Todo 一覧を取得できる", async () => {
    vi.mocked(pool.query as any).mockResolvedValueOnce([
      [
        {
          id: 1,
          title: "テスト Todo 1",
          completed: 0,
          created_at: "2026-01-01 00:00:00",
          updated_at: "2026-01-01 00:00:00",
        },
        {
          id: 2,
          title: "テスト Todo 2",
          completed: 1,
          created_at: "2026-01-02 00:00:00",
          updated_at: "2026-01-02 00:00:00",
        },
      ],
      [],
    ]);

    const res = await app.request("/api/todos");

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(2);
    expect(body[0].completed).toBe(false);
  });

  it("正常系 - Todo が0件のとき空配列を返す", async () => {
    vi.mocked(pool.query as any).mockResolvedValueOnce([[], []]);

    const res = await app.request("/api/todos");

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual([]);
  });
});

// POST /api/todos のテストケース
describe("POST /api/todos", () => {
  it("正常系 - Todo を作成できる", async () => {
    vi.mocked(pool.query as any)
      .mockResolvedValueOnce([{ insertId: 3 }, []])
      .mockResolvedValueOnce([
        [
          {
            id: 3,
            title: "新しいタスク",
            completed: 0,
            created_at: "2026-01-01 00:00:00",
            updated_at: "2026-01-01 00:00:00",
          },
        ],
        [],
      ]);

    const res = await app.request("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "新しいタスク" }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.title).toBe("新しいタスク");
  });

  it("異常系 - title が空文字のとき400を返す", async () => {
    const res = await app.request("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "" }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toBe("title は必須です");
  });

  it("異常系 - title スペースのみのとき400を返す", async () => {
    const res = await app.request("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "   " }),
    });

    expect(res.status).toBe(400);
  });
});

// PUT /api/todos/:id のテストケース
describe("PUT /api/todos/:id", () => {
  it("正常系 - Todo を更新できる", async () => {
    vi.mocked(pool.query as any)
      .mockResolvedValueOnce([{ affectedRows: 1 }, []])
      .mockResolvedValueOnce([
        [
          {
            id: 1,
            title: "更新後タイトル",
            completed: 1,
            created_at: "2026-01-01 00:00:00",
            updated_at: "2026-01-01 00:00:00",
          },
        ],
        [],
      ]);

    const res = await app.request("/api/todos/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "更新後タイトル", completed: true }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.title).toBe("更新後タイトル");
  });

  it("異常系 - idが数値でないとき400を返す", async () => {
    const res = await app.request("/api/todos/abc", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "タイトル", completed: true }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toBe("id が不正です");
  });

  it("異常系 - 対象の Todo が存在しないとき 404 を返す", async () => {
    vi.mocked(pool.query as any).mockResolvedValueOnce([{ affectedRows: 0 }, []]);

    const res = await app.request("/api/todos/999", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "タイトル", completed: true }),
    });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.message).toBe("Todo が見つかりません");
  });

  it("異常系 - completed が boolean でないとき 400 を返す", async () => {
    const res = await app.request("/api/todos/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "タイトル", completed: "true" }),
    });

    expect(res.status).toBe(400);
  });
});
