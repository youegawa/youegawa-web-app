import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import FormButton from "../Common/FormButton";
import { useNavigate } from "react-router-dom";
import { createDetail, CreateDetailRequest } from "../api/details";
import { useAuth } from "../Common/AuthContext";
import { User } from "../types/auth";
import { dateValidation, categoryValidation, amountValidation, descriptionValidation } from "../Common/validationRules";
import FormField from "../Common/FormField";
import { getPrimaryBtnClass, getSecondaryBtnClass,getButtonGroupClass } from "../Common/styleConstants";

// 型定義
type InputFormValues = {
  expense_date: string;
  category_name: string;
  amount: string;
  description: string;
};

const ExpenseInput = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const today = new Date().toISOString().split("T")[0];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputFormValues>({
    defaultValues: {
      expense_date: "",
      category_name: "",
      amount: "",
      description: "",
    },
  });

  // 画面起動時
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToDashboard = () => navigate("/dashboard");

  const onSubmit = async (data: InputFormValues) => {
    try {
      // ログイン情報
      const userJson = localStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      if (!user || !user.user_id) {
        alert("ログイン情報が見つかりません。再ログインしてください。");
        navigate("/login");
        return;
      }

      // 型定義
      const requestData: CreateDetailRequest = {
        user_id: Number(user.user_id),
        expense_date: data.expense_date,
        category_name: data.category_name,
        amount: Number(data.amount) || 0,
        description: data.description?.trim() || "",
      };

      console.log("バックエンドデータ:", requestData);

      await createDetail(requestData);
      // 成功
      alert("登録完了");
      navigate("/dashboard");
    } catch (error) {
      console.error("登録エラー:", error);
      alert("登録に失敗");
    }
  };

  return (
    <div className="pl-10 pt-10 pb-20 max-w-4xl relative">
      {/* ヘッダー */}
      <div className="absolute top-10 right-10 text-right">
        <p className="text-sm mb-2">名前：{user?.user_name} 様</p>
        <FormButton
          label="ログアウト"
          className={getSecondaryBtnClass()}
          onClick={handleLogout}
        />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-12">支出入力</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* 日付入力欄 */}
        <FormField
          label="日付"
          type="date"
          register={register("expense_date", dateValidation)}
          error={errors.expense_date}
          max={today}
        />

        {/* カテゴリ入力欄 */}
        <FormField
          label="カテゴリ"
          type="text"
          register={register("category_name", categoryValidation)}
          error={errors.category_name}
        />

        {/* 金額入力欄 */}
        <FormField
          label="金額"
          type="number"
          register={register("amount", amountValidation)}
          error={errors.amount}
          suffix="円"
        />

        {/* 費用詳細欄 */}
        <FormField
          label="費用詳細"
          type="text"
          register={register("description", descriptionValidation)}
          error={errors.description}
          isTextArea={true}
        />

        <div className={getButtonGroupClass()}>
          <FormButton
            type="button"
            label="キャンセル"
            className={getPrimaryBtnClass()}
            onClick={goToDashboard}
          />
          <FormButton type="submit" label="確定" className={getPrimaryBtnClass()} />
        </div>
      </form>
    </div>
  );
};

export default ExpenseInput;
