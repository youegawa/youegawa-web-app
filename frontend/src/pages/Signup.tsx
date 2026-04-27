import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormButton from "../Common/FormButton";
import { signup } from "../api/auth";
import { userNameValidation, passwordValidation, emailValidation, amountValidation } from "../Common/validationRules";
import { getButtonGroupClass, getPrimaryBtnClass } from "../Common/styleConstants";
import FormFieid from "../Common/FormField";

// 型定義
type SignupFormValues = {
  userName: string;
  userPassword: string;
  userEmail: string;
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
    defaultValues: { userName: "", userPassword: "", userEmail:"", budget: 0 }
  });

  const handleGoToLogin = () => navigate("/login");

  const onSubmit = async (data: SignupFormValues) => {
    setApiError("");
    try {
      const response = await signup(data.userName, data.userPassword, data.userEmail, data.budget);
      if (response.user) {
        alert("登録が完了しました！ログインしてください。");
        navigate("/login");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("登録に失敗しました。");
      }
    }
  };

  return (
    <div className='pl-10 pt-10 max-w-2xl'>
      <h1 className='text-3xl font-bold text-gray-800 mb-8'>新規登録</h1>

      {apiError && <p className="text-red-500 text-sm mb-4">{apiError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6' noValidate>

        {/* ユーザー名入力欄　*/}
        <FormFieid
          label="ユーザー名"
          register={register("userName", userNameValidation)}
          error={errors.userName}
        />

        {/* パスワード入力欄　*/}
        <FormFieid
          label="パスワード"
          type="password"
          register={register("userPassword", passwordValidation)}
          error={errors.userPassword}
        />

        {/* メールアドレス　*/}
        <FormFieid
          label="メールアドレス"
          type="email"
          register={register("userEmail", emailValidation)}
          error={errors.userEmail}
        />

        {/* 月額設定額 */}
        <FormFieid
          label="月額予算"
          type="number"
          register={register("budget", amountValidation)}
          error={errors.budget}
          suffix="円"
        />

        {/* ボタン */}
          <div className={getButtonGroupClass()}>
            <FormButton type="button" label="キャンセル" className={getPrimaryBtnClass()} onClick={handleGoToLogin}
            />
            <FormButton type="submit" label="確定" className={getPrimaryBtnClass()}
            />
          </div>
      </form>
    </div>
  );
};

export default Signup;
