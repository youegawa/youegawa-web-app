import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Todo } from "../types/todo";

// API モジュールをモックする
vi.mock("../api/todos", () => ({
  getTodos: vi.fn(),
  createTodo: vi.fn(),
  updateTodo: vi.fn(),
}));

import * as todosApi from "../api/todos";
import App from "../App";

const mockTodos: Todo[] = [
  {
    id: 1,
    title: "テスト Todo 1",
    completed: false,
    created_at: "2026-01-01 00:00:00",
    updated_at: "2026-01-01 00:00:00",
  },
  {
    id: 2,
    title: "テスト Todo 2",
    completed: true,
    created_at: "2026-01-02 00:00:00",
    updated_at: "2026-01-02 00:00:00",
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("App", () => {
  it("Todo 一覧を表示する", async () => {
    vi.mocked(todosApi.getTodos).mockResolvedValueOnce(mockTodos);

    render(<App />);

    // 読み込み中が表示される
    expect(screen.getByText("読み込み中...")).toBeInTheDocument();

    // Todo 一覧が表示される
    await waitFor(() => {
      expect(screen.getByText("テスト Todo 1")).toBeInTheDocument();
      expect(screen.getByText("テスト Todo 2")).toBeInTheDocument();
    });
  });

  it("新しい Todo を追加できる", async () => {
    const newTodo: Todo = {
      id: 3,
      title: "新しい Todo",
      completed: false,
      created_at: "2026-01-03 00:00:00",
      updated_at: "2026-01-03 00:00:00",
    };
    vi.mocked(todosApi.getTodos).mockResolvedValueOnce(mockTodos);
    vi.mocked(todosApi.createTodo).mockResolvedValueOnce(newTodo);

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("テスト Todo 1")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("新しい Todo を入力...");
    await user.type(input, "新しい Todo");
    await user.click(screen.getByRole("button", { name: "追加" }));

    await waitFor(() => {
      expect(screen.getByText("新しい Todo")).toBeInTheDocument();
    });
  });

  it("取得失敗時にエラーメッセージを表示する", async () => {
    vi.mocked(todosApi.getTodos).mockRejectedValueOnce(new Error("Network error"));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Todo 一覧の取得に失敗しました。")).toBeInTheDocument();
    });
  });
});
