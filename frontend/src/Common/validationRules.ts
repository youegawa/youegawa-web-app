// ユーザー名

export const userNameValidation = {
  required: "ユーザー名は必須です",
};

// メールアドレスのバリデーションルール

export const emailValidation = {
  required: "メールアドレスは必須です",
  pattern: {
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "メールアドレスの形式が正しくありません",
  },
};

// パスワードのバリデーションルール

export const passwordValidation = {
  required: "パスワードは必須です",
  minLength: { value: 8, message: "8文字以上で入力してください" },
  maxLength: {
    value: 19,
    message: "20文字未満で入力してください",
  },
  // 英字・数字・記号の混在をチェック
  pattern: {
    value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
    message: "英字・数字・記号をすべて含めてください",
  },
};

// 金額（数値）のバリデーションルール

export const amountValidation = {
  required: "金額を入力してください",
  min: { value: 1, message: "1円以上の金額を入力してください" },
  // 入力値を数値に変換
  setValueAs: (value: string) => (value === "" ? "" : Number(value)),
};

// カテゴリのバリデーション

export const categoryValidation = {
  required: "カテゴリを入力してください",
};

// 費用詳細のバリデーション

export const descriptionValidation = {
  maxLength: {
    value: 20,
    message: "20文字以内で入力してください",
  },
};

// 日付のバリデーション

export const dateValidation = {
  required: "日付を入力してください",
};
