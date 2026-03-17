import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";
import type mysql from "mysql2/promise";
import type { Todo } from "../types/todo.js";

// mysql2/promise の pool をモックする
vi.mock("../db/index.js", () => {
  return {
    default: {
      query: vi.fn(),
    },
  };
});

import pool from "../db/index.js";
import todos from "../routes/todos.js";

// テスト内で pool.query のモック戻り値を型安全に組み立てるヘルパー型
type RowsResult<T> = [T[], mysql.FieldPacket[]];
type HeaderResult = [mysql.ResultSetHeader, mysql.FieldPacket[]];

const app = new Hono();
app.route("/api/todos", todos);

// テスト用の固定 Todo データ
const mockTodo: Todo = {
  id: 1,
  title: "テスト Todo",
  completed: false,
  created_at: "2026-01-01 00:00:00",
  updated_at: "2026-01-01 00:00:00",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/todos", () => {
  it("Todo 一覧を返す", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce(
      [[mockTodo], []] as unknown as RowsResult<mysql.RowDataPacket>
    );

    const res = await app.request("/api/todos");
    expect(res.status).toBe(200);

    const body = await res.json() as Todo[];
    expect(body).toHaveLength(1);
    expect(body[0].title).toBe("テスト Todo");
  });
});

describe("POST /api/todos", () => {
  it("新しい Todo を作成して 201 を返す", async () => {
    // INSERT の結果
    vi.mocked(pool.query).mockResolvedValueOnce(
      [{ insertId: 2, affectedRows: 1 } as mysql.ResultSetHeader, []] as unknown as HeaderResult
    );
    // 作成後の SELECT の結果
    vi.mocked(pool.query).mockResolvedValueOnce(
      [[{ ...mockTodo, id: 2, title: "新しい Todo" }], []] as unknown as RowsResult<mysql.RowDataPacket>
    );

    const res = await app.request("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "新しい Todo" }),
    });

    expect(res.status).toBe(201);
    const body = await res.json() as Todo;
    expect(body.title).toBe("新しい Todo");
  });

  it("title が空のとき 400 を返す", async () => {
    const res = await app.request("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "" }),
    });

    expect(res.status).toBe(400);
  });
});

describe("PUT /api/todos/:id", () => {
  it("Todo を更新して 200 を返す", async () => {
    const updated: Todo = { ...mockTodo, title: "更新後のタイトル", completed: true };

    // UPDATE の結果
    vi.mocked(pool.query).mockResolvedValueOnce(
      [{ affectedRows: 1 } as mysql.ResultSetHeader, []] as unknown as HeaderResult
    );
    // 更新後の SELECT の結果
    vi.mocked(pool.query).mockResolvedValueOnce(
      [[updated], []] as unknown as RowsResult<mysql.RowDataPacket>
    );

    const res = await app.request("/api/todos/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "更新後のタイトル", completed: true }),
    });

    expect(res.status).toBe(200);
    const body = await res.json() as Todo;
    expect(body.title).toBe("更新後のタイトル");
    expect(body.completed).toBe(true);
  });

  it("存在しない id のとき 404 を返す", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce(
      [{ affectedRows: 0 } as mysql.ResultSetHeader, []] as unknown as HeaderResult
    );

    const res = await app.request("/api/todos/999", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "タイトル", completed: false }),
    });

    expect(res.status).toBe(404);
  });
});
