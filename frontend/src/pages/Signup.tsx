import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormButton from "../Common/FormButton";
import { signup } from "../api/auth";

// 型定義
type SignupFormValues = {
  userName: string;
  userPassword: string;
  budget: number;
};

const Signup = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    defaultValues: { userName: "", userPassword: "", budget: 0 }
  });

  const handleGoToLogin = () => navigate("/login");

  const onSubmit = async (data: SignupFormValues) => {
    setApiError("");
    try {
      const response = await signup(data.userName, data.userPassword, data.budget);
      if (response.user) {
        alert("登録が完了しました！ログインしてください。");
        navigate("/login");
      }
    } catch (error) {
      setApiError("登録に失敗しました。");
    }
  };

  // スタイル定義
  const labelClass = "w-24 text-gray-700";
  const inputBase = "border-2 py-1 px-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-72 text-sm text-right";
  const btnClass = "bg-blue-500 text-black py-2 px-6 rounded-md font-bold text-sm hover:bg-blue-600 transition-all shadow";

  return (
    <div className='pl-10 pt-10 max-w-2xl'>
      <h1 className='text-3xl font-bold text-gray-800 mb-8'>新規登録</h1>

      {apiError && <p className="text-red-500 text-sm mb-4">{apiError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>

        {/* ユーザー名入力欄　*/}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <label className={labelClass}>ユーザー名</label>
            <input
              className={`${inputBase} ${errors.userName ? 'border-red-500' : 'border-gray-400'}`}
              {...register("userName", {
                required: "ユーザー名は必須です",
                minLength: { value: 8, message: "8文字以上で入力してください" },
                maxLength: { value: 19, message: "20文字未満で入力してください" },
                pattern: { value: /^[a-zA-Z0-9]+$/, message: "英数字のみで入力してください" }
              })}
            />
          </div>
          <div className='h-4 ml-24'>
            {errors.userName && <span className='text-red-500 text-xs'>{errors.userName.message}</span>}
          </div>
        </div>

        {/* パスワード入力欄　*/}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <label className={labelClass}>パスワード</label>
            <input
              type="password"
              className={`${inputBase} ${errors.userPassword ? 'border-red-500' : 'border-gray-400'}`}
              {...register("userPassword", {
                required: "パスワードは必須です",
                minLength: { value: 8, message: "8文字以上で入力してください" },
                maxLength: { value: 19, message: "20文字未満で入力してください" },
                pattern: {
                  value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
                  message: "英字・数字・記号をすべて含めてください"
                }
              })}
            />
          </div>
          <div className='h-4 ml-24'>
            {errors.userPassword && <span className='text-red-500 text-xs'>{errors.userPassword.message}</span>}
          </div>
        </div>

        {/* 月額設定額 */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <label className={labelClass}>月額予算</label>
            <input
              type="number"
              min="0"
              className={`${inputBase} ${errors.budget ? 'border-red-500' : 'border-gray-400'}`}
              {...register("budget", {
                valueAsNumber: true,
                min: { value: 0, message: "0円以上の金額を入力して下さい" }
              })}
            />
            <span className='ml-2 text-sm'>円</span>
          </div>

          <div className='h-6 ml-24 mt-1'>
            {/* エラーがある時は赤メッセージ */}
            {errors.budget && (
              <span className='text-red-500 text-xs'>
                {errors.budget.message}
              </span>
            )}
          </div>
        </div>

        <div className='ml-24 w-72 flex justify-center space-x-4 mt-8'>
          <FormButton type="button" label="キャンセル" className={btnClass} onClick={handleGoToLogin} />
          <FormButton type="submit" label="確定" className={btnClass} />
        </div>
      </form>
    </div>
  );
};

export default Signup;
