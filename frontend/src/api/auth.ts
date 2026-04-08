import type { User } from "../types/auth";

// const BASE_URL = "/api/auth";
const BASE_URL = "/api/auth";

// ログイン時
export const login = async (
  user_password: string,
  user_email: string
  ) : Promise<{ message: string; user?: User }> => {
  // ログインデータを送信
  const res = await fetch(`${BASE_URL}/login`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_password, user_email }),
  });

  // レスポンスチェック
  if (!res.ok) {
    throw new Error(`Failed to login: ${res.status}`);
  }

  // JSONデータとして返却
  return res.json() as Promise<{ message: string; user?: User }>;
};

// 新規登録時
export const signup = async (
  user_name: string,
  user_password: string,
  user_email:string,
  monthly_budget: number
  ) : Promise<{ message: string; user?: User }> => {
  // 新規登録データを送信
  const res = await fetch(`${BASE_URL}/signup`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_name, user_password, user_email, monthly_budget }),
  });

  // レスポンスチェック
  if (!res.ok) {
    throw new Error(`Failed to sign-up: ${res.status}`);
  }

  // JSONデータとして返却
  return res.json() as Promise<{ message: string; user?: User }>;
};

// 月額設定額登録
export const updateBudget = async (
  user_id: number,
  monthly_budget: number
  ) : Promise<{ message: string; monthly_budget: number}> => {
  // 予算データを更新
  const res = await fetch(`${BASE_URL}/update-budget`,{
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, monthly_budget }),
  });

  // レスポンスチェック
  if (!res.ok) {
    throw new Error(`Failed to update budget: ${res.status}`);
  }

  // JSONデータとして返却
  return res.json() as Promise<{ message: string; monthly_budget: number }>;
};
