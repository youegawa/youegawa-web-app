import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormButton from "../Common/FormButton";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../Common/AuthContext";
import { emailValidation, passwordValidation } from "../Common/validationRules";
import { getButtonGroupClass, getPrimaryBtnClass } from "../Common/styleConstants";
import FormFieid from "../Common/FormField";

// 型定義
type LoginFormValues = {
  userPassword: string;
  userEmail: string;
};

const Login = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const { login: authLogin } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { userPassword: "", userEmail: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setApiError("");
    try {
      const response = await loginApi(data.userEmail, data.userPassword);

      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        authLogin();

        navigate("/dashboard");
      }
    } catch (error) {
      setApiError("メールアドレスまたはパスワードが違います");
    }
  };

  const goToSignup = () => navigate("/signup");

  return (
    <div className="pl-10 pt-10 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">ログイン</h1>

      {apiError && <p className="text-red-500 text-sm mb-4">{apiError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* パスワード入力欄 */}

        <FormFieid
          label="パスワード"
          type="password"
          register={register("userPassword", passwordValidation)}
          error={errors.userPassword}
        />

        {/* メールアドレス入力欄 */}

        <FormFieid
          label="メールアドレス"
          type="email"
          register={register("userEmail", emailValidation)}
          error={errors.userEmail}
        />

        {/* ボタン */}

        <div className={getButtonGroupClass()}>
          <FormButton
            type="button"
            label="新規作成"
            className={getPrimaryBtnClass()}
            onClick={goToSignup}
          />
          <FormButton type="submit" label="ログイン" className={getPrimaryBtnClass()} />
        </div>
      </form>
    </div>
  );
};

export default Login;
