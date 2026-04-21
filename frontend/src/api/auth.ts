import type { User } from "../types/auth";

// const BASE_URL = "/api/auth";
const BASE_URL = "/api/auth";

// ログイン時
export const login = async (
  useremail: string,
  userpassword: string,
): Promise<{ message: string; user?: User }> => {
  // ログインデータを送信
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_email: useremail,
      user_password: userpassword,
    }),
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
  userName: string,
  userPassword: string,
  userEmail: string,
  budget: number | null,
): Promise<{ message: string; user?: User }> => {
  // 新規登録データを送信
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_name: userName,
      user_password: userPassword,
      user_email: userEmail,
      monthly_budget: budget,
    }),
  });

  // レスポンスチェック
  if (!res.ok) {
    throw new Error(`Failed to sign-up: ${res.status}`);
  }

  // JSONデータとして返却
  return res.json() as Promise<{ message: string; user?: User }>;
};
