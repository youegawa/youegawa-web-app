import type { User } from "../types/auth";

// const BASE_URL = "/api/auth";
const BASE_URL = "http://localhost:3000/api/auth";

// ログイン時
export const login = async (user_name: string, user_password: string): Promise<{ message: string; user?: User }> => {
  const res = await fetch(`${BASE_URL}/login`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_name, user_password }),
  });
  if (!res.ok) {
    throw new Error(`Failed to login: ${res.status}`);
  }
  return res.json() as Promise<{ message: string; user?: User }>;
};

// 新規登録時
export const signup = async (user_name: string, user_password: string, monthly_budget: number)
  : Promise<{ message: string; user?: User }> => {
  const res = await fetch(`${BASE_URL}/signup`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_name, user_password, monthly_budget }),
  });
  if (!res.ok) {
    throw new Error(`Failed to sign-up: ${res.status}`);
  }
  return res.json() as Promise<{ message: string; user?: User }>;
};

// 月額設定額登録
export const updateBudget = async (user_id: number, monthly_budget: number)
  : Promise<{ message: string; monthly_budget: number}> => {
  const res = await fetch(`${BASE_URL}/update-budget`,{
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, monthly_budget }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update budget: ${res.status}`);
  }

  return res.json() as Promise<{ message: string; monthly_budget: number }>;
};
