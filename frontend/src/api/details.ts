import { Detail } from './../types/expense';

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

// 全履歴取得用の型定義
export type HistoryItem = Omit<Detail, "category_id"> & {
  category_name: string;
}
export interface HistoryResponse{
  message: string;
  history: HistoryItem[];
  totalCount: number;
  totalPages: number;
}

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

// 予算額の更新
export const updateMonthlyBudget = async (user_id: number, budget: number): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/users/${user_id}/budget`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ monthly_budget: budget }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update budget: ${res.status}`);
  }

  return res.json() as Promise<{ message: string }>;
};

// 支出履歴の取得
export const getAllHistory = async (user_id: number, page: number = 1): Promise<HistoryResponse> => {
  const res = await fetch(`${BASE_URL}/history/${user_id}?page=${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch history data: ${res.status}`);
  }
  return res.json() as Promise<HistoryResponse>;
};
