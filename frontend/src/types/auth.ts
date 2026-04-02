export type User = {
  user_id: number;
  user_name: string;
  monthly_budget: number;
};

export type Category = {
  category_id: number;
  user_id: number | null;
  category_name: string;
};

export type Detail = {
  detail_id: number;
  user_id: number;
  category_id: number;
  expense_date: string;
  amount: number; 
  description: string;
};
