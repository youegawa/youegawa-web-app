import { getTodos, createTodo, updateTodo } from './../../api/todos';
import type { Todo } from "../../types/todo";
import { describe, it, expect, vi, beforeEach } from "vitest";

// fetch をモックする
vi.stubGlobal("fetch", vi.fn());

const mockTodos: Todo[] = [
  {
    id: 1,
    title: "テスト1",
    completed: false,
    created_at: "2026-01-01 00:00:00",
    updated_at: "2026-01-01 00:00:00",
  },
  {
    id: 2,
    title: "テスト2",
    completed: true,
    created_at: "2026-01-02 00:00:00",
    updated_at: "2026-01-02 00:00:00",
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

// getTodos() のテスト
describe("getTodos()", () => {
  it("正常系 -Todo一覧の取得", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTodos,
    } as Response);

    const result = await getTodos();

    expect(fetch).toHaveBeenCalledWith("/api/todos");
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("テスト1");
  });
  it("異常系 -サーバーエラー(500)", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    await expect(getTodos()).rejects.toThrow();
  });
});

// createTodo() のテスト
describe("createTodo()", () => {
  it("正常系 -Todoの作成", async () => {
    const newTodo: Todo = {
      id: 3,
      title: "新しいタスク",
      completed: false,
      created_at: "2026-01-03 00:00:00",
      updated_at: "2026-01-03 00:00:00",
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => newTodo,
    } as Response);

    const result = await createTodo({ title: "新しいタスク" });

    expect(fetch).toHaveBeenCalledWith("/api/todos", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "新しいタスク" }),
    }));

    expect(result.title).toBe("新しいタスク");
  });

  it("異常系 -作成失敗(400)", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
    } as Response);

    await expect(createTodo({ title: "失敗するタスク"})).rejects.toThrow();
  });
});

//　updateTodo() のテスト
describe("updateTodo()", () => {
  it("正常系 -Todo更新", async () => {
    const updateResult: Todo = {
      id: 1,
      title: "更新後タイトル",
      completed: true,
      created_at: "2026-01-01 00:00:00",
      updated_at: "2026-01-01 00:00:00",
    };

    vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => updateResult,
        } as Response);

    const result = await updateTodo(1, { title: "更新後タイトル", completed: true });

    expect(fetch).toHaveBeenCalledWith("/api/todos/1", expect.objectContaining({
      method: "PUT",
      body: JSON.stringify({ title: "更新後タイトル", completed: true }),
    }));
  });
  it("異常系 -対象が見つからない(404)", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    await expect(updateTodo(999, {title: "存在しないタスク", completed: false })).rejects.toThrow();
  });
});
