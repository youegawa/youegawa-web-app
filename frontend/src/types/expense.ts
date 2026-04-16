// 支出分類（食費、日用品等）の型定義
export type Category = {
  category_id: number;  // カテゴリーを一意に識別するID（自動採番）
  user_id: number | null;  // カテゴリーを作成したユーザーID,nullの場合デフォルト
  category_name: string; // カテゴリ名称
};

// 支出明細の型定義
export type Detail = {
  detail_id: number;  // 明細を一意に識別するID（自動採番）
  user_id: number;  // 支出を登録したユーザーID
  category_id: number;  // 紐付くカテゴリID
  expense_date: string;  // 支出日
  amount: number;  // 支出金額
  description: string | null;  // 補足説明
};
