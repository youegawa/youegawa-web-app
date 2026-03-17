import { useState } from "react";
import type { Todo } from "../types/todo";
import { updateTodo } from "../api/todos";

type Props = {
  todo: Todo;
  onUpdated: (updated: Todo) => void;
};

const TodoItem = ({ todo, onUpdated }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);

  // 完了/未完了のトグル
  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const updated = await updateTodo(todo.id, {
        title: todo.title,
        completed: !todo.completed,
      });
      onUpdated(updated);
    } finally {
      setIsLoading(false);
    }
  };

  // タイトルの保存
  const handleSave = async () => {
    if (editTitle.trim() === "") return;
    setIsLoading(true);
    try {
      const updated = await updateTodo(todo.id, {
        title: editTitle.trim(),
        completed: todo.completed,
      });
      onUpdated(updated);
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      void handleSave();
    }
    if (e.key === "Escape") {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <li className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
      {/* 完了チェックボックス */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => void handleToggle()}
        disabled={isLoading}
        className="w-5 h-5 accent-blue-500 cursor-pointer"
      />

      {/* タイトル表示 or 編集フォーム */}
      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 border border-blue-400 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      ) : (
        <span
          className={`flex-1 text-sm ${
            todo.completed ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {todo.title}
        </span>
      )}

      {/* アクションボタン */}
      {isEditing ? (
        <div className="flex gap-2">
          <button
            onClick={() => void handleSave()}
            disabled={isLoading}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            保存
          </button>
          <button
            onClick={() => {
              setEditTitle(todo.title);
              setIsEditing(false);
            }}
            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            キャンセル
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          disabled={isLoading}
          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          編集
        </button>
      )}
    </li>
  );
};

export default TodoItem;
