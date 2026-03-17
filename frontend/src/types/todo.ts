export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateTodoPayload = {
  title: string;
};

export type UpdateTodoPayload = {
  title: string;
  completed: boolean;
};
