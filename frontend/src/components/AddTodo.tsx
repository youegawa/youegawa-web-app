import { useState } from "react";
import type { Todo } from "../types/todo";
import { createTodo } from "../api/todos";

type Props = {
  onCreated: (todo: Todo) => void;
};

const AddTodo = ({ onCreated }: Props) => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim() === "") return;

    setIsLoading(true);
    setError(null);
    try {
      const todo = await createTodo({ title: title.trim() });
      onCreated(todo);
      setTitle("");
    } catch {
      setError("Todo の作成に失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新しい Todo を入力..."
        disabled={isLoading}
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || title.trim() === ""}
        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "追加中..." : "追加"}
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </form>
  );
};

export default AddTodo;
