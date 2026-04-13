import { useForm } from 'react-hook-form';
import FormButton from '../Common/FormButton';
import { useNavigate } from 'react-router-dom';
import { createDetail, CreateDetailRequest } from '../api/details';

// 型定義
type InputFormValues = {
  expense_date: string;
  category_name: string;
  amount: number;
  description: string;
}

const ExpenseInput = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputFormValues>({
    defaultValues: { expense_date: "", category_name: "",
      amount: "" as any, description: "" }
  });

  // スタイル定義
  const labelClass = "w-32 text-gray-700";
  const btnClass = "bg-blue-500 text-black py-2 px-6 rounded-md font-bold text-sm hover:bg-blue-600 transition-all shadow";
  const inputBase = "border-2 py-1 px-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-72 text-sm text-right";

  const goToDashboard = () => navigate("/dashboard");

  const onSubmit = async (data: InputFormValues) => {
    try {
      // ログイン情報
      const userJson = localStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      if (!user || !user.user_id){
        alert("ログイン情報が見つかりません。再ログインしてください。");
        navigate("/login");
        return;
      }

      // 型定義
      const requestData: CreateDetailRequest = {
        user_id: Number(user.user_id),
        expense_date: data.expense_date,
        category_name: data.category_name,
        amount: Number(data.amount),
        description: data.description?.trim() || ""
      };

      console.log("バックエンドデータ:", requestData);

      await createDetail(requestData);
      // 成功
      alert ("登録完了");
      navigate("/dashboard");

    } catch (error){
      console.error("登録エラー:", error);
      alert("登録に失敗");
    }
  };

  return (

    <div className='pl-10 pt-10 max-w-2xl'>
      <h1 className='text-3xl font-bold text-gray-800 mb-8'>支出入力</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6' noValidate>

        {/* 日付入力欄 */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <label className={labelClass}>日付</label>
            <input
              className={inputBase}
              type="date"
              max={today}
              {...register("expense_date",{
                required: "日付を入力してください",

              })}
            />
          </div>
          {/* エラーメッセージ表示の定義 */}
          <div className='h-4 ml-32'>
            {errors.expense_date && <span className='text-red-500 text-xs'>{errors.expense_date.message}</span>}
          </div>
        </div>

        {/* カテゴリ入力欄 */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <label className={labelClass}>カテゴリ</label>
            <input
              className={`${inputBase} text-left`}
              type="text"
              {...register("category_name",{
                required: "カテゴリを入力してください"
              })}
            />
          </div>
          {/* エラーメッセージ表示の定義 */}
          <div className='h-4 ml-32'>
            {errors.category_name && <span className='text-red-500 text-xs'>{errors.category_name.message}</span>}
          </div>
        </div>

        {/* 金額入力欄 */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <label className={labelClass}>金額</label>
            <input
              className={inputBase}
              type="number"
              min="0"
              {...register("amount",{
                required: "金額を入力してください",
                min: { value: 1, message: "１円以上の金額を入力して下さい" },
              })}
            />
            <span className='ml-2 text-sm'>円</span>
          </div>
          {/* エラーメッセージ表示の定義 */}
          <div className='h-4 ml-32'>
            {errors.amount && <span className='text-red-500 text-xs'>{errors.amount.message}</span>}
          </div>
        </div>

        {/* 費用詳細欄 */}
        <div className='flex flex-col'>
          <div className='flex items-start'>
            <label className={`${labelClass} pt-1`}>費用詳細</label>
            <textarea
              className={`${inputBase} text-left p-2 h-auto`}
              rows={2}
              {...register("description",{
              maxLength: { value: 20, message: "20文字以内で入力してください"},
              })}
            />
          </div>
          {/* エラーメッセージ表示の定義 */}
          <div className='h-4 ml-32'>
            {errors.description && <span className='text-red-500 text-xs'>{errors.description.message}</span>}
          </div>
        </div>

        <div className='ml-32 w-72 flex justify-center space-x-4 mt-8'>
          <FormButton type="button" label="キャンセル" className={btnClass} onClick={goToDashboard} />
          <FormButton type="submit" label="確定" className={btnClass} />
        </div>
      </form>
    </div>
  )
}

export default ExpenseInput
