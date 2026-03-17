import type { Todo } from "../types/todo";
import TodoItem from "./TodoItem";

type Props = {
  todos: Todo[];
  onUpdated: (updated: Todo) => void;
};

const TodoList = ({ todos, onUpdated }: Props) => {
  if (todos.length === 0) {
    return (
      <p className="text-center text-gray-400 py-8">
        Todo がありません。最初の Todo を追加してみましょう！
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onUpdated={onUpdated} />
      ))}
    </ul>
  );
};

export default TodoList;
