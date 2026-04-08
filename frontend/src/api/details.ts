import type { Detail } from "../types/auth";

// 支出明細登録に必要なデータの型定義
export type CreateDetailRequest = Omit<Detail, "detail_id" | "category_id"> & {
  category_name: string;
};

// ダッシュボード取得用の型定義
export interface DashboardDataResponse {
  message: string;
  monthlyTotal: number;
  recentHistory: {
    expense_date: string;
    category_name: string;
    amount: number;
    description: string;
  }[];
};

const BASE_URL = "http://localhost:3000/api/details";

// 支出明細の新規登録
export const createDetail = async (data: CreateDetailRequest): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to create detail: ${res.status}`);
  }

  return res.json() as Promise<{ message: string }>;
};

// ダッシュボードデータの取得

export const getDashboardData = async (user_id: number): Promise<DashboardDataResponse> => {
  const res = await fetch(`${BASE_URL}/dashboard/${user_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard data: ${res.status}`);
  }

  return res.json() as Promise<DashboardDataResponse>;
};
