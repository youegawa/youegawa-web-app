import { useEffect, useState } from "react";
import type { Todo } from "./types/todo";
import { getTodos } from "./api/todos";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初回マウント時に Todo 一覧を取得する
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTodos();
        setTodos(data);
      } catch {
        setError("Todo 一覧の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTodos();
  }, []);

  // 新しく作成された Todo を一覧に追加する
  const handleCreated = (todo: Todo) => {
    setTodos((prev) => [...prev, todo]);
  };

  // 更新された Todo で一覧を更新する
  const handleUpdated = (updated: Todo) => {
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Todo リスト
        </h1>

        {/* 新規 Todo 作成フォーム */}
        <div className="mb-6">
          <AddTodo onCreated={handleCreated} />
        </div>

        {/* Todo 一覧 */}
        {isLoading ? (
          <p className="text-center text-gray-400">読み込み中...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <TodoList todos={todos} onUpdated={handleUpdated} />
        )}
      </div>
    </div>
  );
};

export default App;
