import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Todo } from "../types/todo";

vi.mock("../api/todos", () => ({
  updateTodo: vi.fn(),
}));

import * as todosApi from "../api/todos";
import TodoItem from "../components/TodoItem";

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

describe("TodoItem", () => {
  it("タイトルとチェックボックスを表示する", () => {
    render(<TodoItem todo={mockTodo} onUpdated={vi.fn()} />);
    expect(screen.getByText("テスト Todo")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("チェックボックスをクリックすると updateTodo が呼ばれる", async () => {
    const updated: Todo = { ...mockTodo, completed: true };
    vi.mocked(todosApi.updateTodo).mockResolvedValueOnce(updated);
    const onUpdated = vi.fn();

    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} onUpdated={onUpdated} />);

    await user.click(screen.getByRole("checkbox"));

    expect(todosApi.updateTodo).toHaveBeenCalledWith(1, {
      title: "テスト Todo",
      completed: true,
    });
  });

  it("「編集」ボタンをクリックすると編集フォームが表示される", async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} onUpdated={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "編集" }));

    expect(screen.getByDisplayValue("テスト Todo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
  });

  it("編集して保存すると updateTodo が呼ばれる", async () => {
    const updated: Todo = { ...mockTodo, title: "更新後タイトル" };
    vi.mocked(todosApi.updateTodo).mockResolvedValueOnce(updated);
    const onUpdated = vi.fn();

    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} onUpdated={onUpdated} />);

    await user.click(screen.getByRole("button", { name: "編集" }));
    const input = screen.getByDisplayValue("テスト Todo");
    await user.clear(input);
    await user.type(input, "更新後タイトル");
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(todosApi.updateTodo).toHaveBeenCalledWith(1, {
      title: "更新後タイトル",
      completed: false,
    });
  });
});
