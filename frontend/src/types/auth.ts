// ユーザー情報を型定義
export type User = {
  user_id: number;  // ユーザーを一意に識別するID（自動採番）
  user_name: string; // ユーザー名
  user_email: string; // メールアドレス
  monthly_budget: number | null; // ユーザーが設定した１ヶ月あたりの予算
};
