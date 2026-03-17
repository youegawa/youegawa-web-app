import type { Todo, CreateTodoPayload, UpdateTodoPayload } from "../types/todo";

const BASE_URL = "/api/todos";

// Todo 一覧を取得する
export const getTodos = async (): Promise<Todo[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch todos: ${res.status}`);
  }
  return res.json() as Promise<Todo[]>;
};

// 新しい Todo を作成する
export const createTodo = async (payload: CreateTodoPayload): Promise<Todo> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to create todo: ${res.status}`);
  }
  return res.json() as Promise<Todo>;
};

// 既存の Todo を更新する（タイトル編集・完了トグル）
export const updateTodo = async (
  id: number,
  payload: UpdateTodoPayload
): Promise<Todo> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to update todo: ${res.status}`);
  }
  return res.json() as Promise<Todo>;
};
