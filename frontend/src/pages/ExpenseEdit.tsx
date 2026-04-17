import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import FormButton from "../Common/FormButton";
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
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InputFormValues>();

  //
  useEffect(() => {
    const fetchDetail = async () => {
      if (!detail_id) return;
      try {
        const data = await getDetailItem(detail_id);
        reset(data);
      } catch (error) {
        alert("データの取得に失敗しました");
        navigate("/history");
      }
    };
    fetchDetail();
  }, [detail_id, reset, navigate]);

  // スタイル定義（Inputと同じものを使用）
  const labelClass = "w-32 text-gray-700";
  const btnClass =
    "bg-blue-500 text-black py-2 px-6 rounded-md font-bold text-sm hover:bg-blue-600 transition-all shadow";
  const inputBase =
    "border-2 py-1 px-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-72 text-sm text-right";

  const goBack = () => navigate(-1); // 一つ前の画面（履歴）に戻る

  const onSubmit = async (data: InputFormValues) => {
    try {
      const userJson = localStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;
      if (!user || !detail_id) return;

      const requestData: CreateDetailRequest = {
        user_id: Number(user.user_id),
        expense_date: data.expense_date,
        category_name: data.category_name,
        amount: Number(data.amount),
        description: data.description?.trim() || "",
      };

      await updateDetailItem(detail_id, requestData); // ★PUTで更新
      alert("更新完了");
      navigate(-1); // 履歴画面に戻る
    } catch (error) {
      alert("更新に失敗しました");
    }
  };

  return (
    <div className="pl-10 pt-10 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">支出編集</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="ml-32 w-72 flex justify-center space-x-4 mt-8">
          <FormButton
            type="button"
            label="キャンセル"
            className={btnClass}
            onClick={goBack}
          />
          <FormButton type="submit" label="保存" className={btnClass} />
        </div>
      </form>
    </div>
  );
};

export default ExpenseEdit;
