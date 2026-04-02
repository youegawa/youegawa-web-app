import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import FormButton from '../Common/FormButton';
import { login } from '../api/auth';

// 型定義
type LoginFormValues = {
  userName: string;
  userPassword: string;
};

const Login = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { userName: "", userPassword: "" }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setApiError("");
    try {
      const response = await login(data.userName, data.userPassword);
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        navigate("/dashboard");
      }
    } catch (error) {
      setApiError("ユーザーIDまたはパスワードが違います");
    }
  };

  const goToSignup = () => navigate("/signup");

  // スタイル定義
  const labelClass = "w-24 text-gray-700";
  const btnClass = "bg-blue-500 text-black py-2 px-6 rounded-md font-bold text-sm hover:bg-blue-600 transition-all shadow";
  const inputBase = "border-2 py-1 px-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-72 text-sm text-right";

  return (
    <div className='pl-10 pt-10 max-w-2xl'>
      <h1 className='text-3xl font-bold text-gray-800 mb-8'>ログイン</h1>

      {apiError && <p className="text-red-500 text-sm mb-4">{apiError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        
        {/* ユーザーID入力欄 */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <label className={labelClass}>ユーザID</label>
            <input 
              className={`${inputBase} ${errors.userName ? 'border-red-500' : 'border-gray-400'}`}
              {...register("userName", {
                required: "ユーザIDを入力してください",
                minLength: { value: 8, message: "8文字以上で入力してください" },
                maxLength: { value: 19, message: "20文字未満で入力してください" },
                pattern: {
                  value: /^[a-zA-Z0-9]+$/,
                  message: "英数字のみで入力してください"                
                }
              })} 
            />
          </div>
          <div className='h-4 ml-24'>
            {/* 入力項目の下に赤エラーメッセージを表示 */}
            {errors.userName && (
              <span className='text-red-500 text-xs'>{errors.userName.message}</span>)}
          </div>
        </div>
        
        {/* パスワード入力欄 */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <label className={labelClass}>パスワード</label>
            <input 
              type="password"
              className={`${inputBase} ${errors.userPassword ? 'border-red-500' : 'border-gray-400'}`}
              {...register("userPassword", { 
                required: "パスワードを入力してください",
                minLength: { value: 8, message: "8文字以上で入力してください" },
                maxLength: { value: 19, message: "20文字未満で入力してください" },
                // 英字・数字・記号の混在をチェック
                pattern: {
                value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
                message: "英字・数字・記号をすべて含めてください"              
                }
              })} 
            />
          </div>
          {/* エラーメッセージ表示の定義 */}
          <div className='h-4 ml-24'>
            {errors.userPassword && <span className='text-red-500 text-xs'>{errors.userPassword.message}</span>}
          </div>
        </div>

        <div className='ml-24 w-72 flex justify-center space-x-4 mt-8'>
          <FormButton type="regist" label="新規作成" className={btnClass} onClick={goToSignup} />
          <FormButton type="submit" label="ログイン" className={btnClass} />
        </div>
      </form>
    </div>
  );
};

export default Login;
