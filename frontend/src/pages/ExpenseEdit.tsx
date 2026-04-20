import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import FormButton from "../Common/FormButton";
import { useAuth } from "../Common/AuthContext";
import { User } from "../types/auth";
import {
  getDetailItem,
  updateDetailItem,
  CreateDetailRequest,
} from "../api/details";

type InputFormValues = {
  expense_date: string;
  category_name: string;
  amount: number;
  description: string;
};

const ExpenseEdit = () => {
  const { detail_id } = useParams<{ detail_id: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InputFormValues>();

  // 画面起動時にユーザー情報セットとデータ取得
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchDetail = async () => {
      if (!detail_id) return;
      try {
        const data = await getDetailItem(detail_id);

        reset({
          expense_date: data.expense_date,
          category_name: data.category_name,
          amount: data.amount,
          description: data.description || "",
        });
      } catch (error) {
        // alert("データの取得に失敗しました");
        // navigate("/history");
        console.log("テスト中");
      }
    };
    fetchDetail();
  }, [detail_id, reset]);

  // スタイル定義
  const labelClass = "w-32 text-gray-700";
  const btnClass =
    "bg-blue-500 text-black py-2 px-6 rounded-md font-bold text-sm shadow transition-all";
  const inputBase =
    "border-2 py-1 px-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-72 text-sm text-right";
  const logoutBtnClass =
    "ml-4 bg-blue-500 text-white py-1 px-3 rounded text-xs font-bold hover:bg-blue-600 transition-all shadow-sm";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const onSubmit = async (data: InputFormValues) => {
    try {
      if (!user || !detail_id) return;

      const requestData: CreateDetailRequest = {
        user_id: Number(user.user_id),
        expense_date: data.expense_date,
        category_name: data.category_name,
        amount: Number(data.amount),
        description: data.description.trim() || "",
      };

      await updateDetailItem(detail_id, requestData);
      alert("更新完了");
      navigate("/history");
    } catch (error) {
      alert("更新に失敗しました");
    }
  };

  return (
    <div className="pl-10 pt-10 max-w-4xl relative">
      {/* ヘッダー */}
      <div className="absolute top-10 right-10 text-right">
        <p className="text-sm mb-2">名前：{user?.user_name} 様</p>
        <FormButton
          label="ログアウト"
          className={logoutBtnClass}
          onClick={handleLogout}
        />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">支出編集</h1>

      {/* フォーム */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* 日付 */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <label className={labelClass}>日付</label>
            <input
              className={inputBase}
              type="date"
              max={today}
              {...register("expense_date", {
                required: "日付を入力してください",
              })}
            />
          </div>
          <div className="h-4 ml-32">
            {errors.expense_date && (
              <span className="text-red-500 text-xs">
                {errors.expense_date.message}
              </span>
            )}
          </div>
        </div>

        {/* カテゴリ */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <label className={labelClass}>カテゴリ</label>
            <input
              className={`${inputBase} text-left`}
              type="text"
              {...register("category_name", {
                required: "カテゴリを入力してください",
              })}
            />
          </div>
          <div className="h-4 ml-32">
            {errors.category_name && (
              <span className="text-red-500 text-xs">
                {errors.category_name.message}
              </span>
            )}
          </div>
        </div>

        {/* 金額 */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <label className={labelClass}>金額</label>
            <input
              className={inputBase}
              type="number"
              min="0"
              {...register("amount", {
                required: "金額を入力してください",
                min: { value: 1, message: "1円以上の金額を入力してください" },
              })}
            />
            <span className="ml-2 text-sm">円</span>
          </div>
          <div className="h-4 ml-32">
            {errors.amount && (
              <span className="text-red-500 text-xs">
                {errors.amount.message}
              </span>
            )}
          </div>
        </div>

        {/* 費用詳細 */}
        <div className="flex flex-col">
          <div className="flex items-start">
            <label className={`${labelClass} pt-1`}>費用詳細</label>
            <textarea
              className={`${inputBase} text-left p-2 h-auto`}
              rows={2}
              {...register("description", {
                maxLength: {
                  value: 20,
                  message: "20文字以内で入力してください",
                },
              })}
            />
          </div>
          <div className="h-4 ml-32">
            {errors.description && (
              <span className="text-red-500 text-xs">
                {errors.description.message}
              </span>
            )}
          </div>
        </div>

        {/* ボタンエリア */}
        <div className="ml-32 w-72 flex justify-center space-x-4 mt-8">
          <FormButton
            type="button"
            label="キャンセル"
            className={btnClass}
            onClick={() => navigate("/history")}
          />
          <FormButton type="submit" label="保存" className={btnClass} />
        </div>
      </form>
    </div>
  );
};

export default ExpenseEdit;
