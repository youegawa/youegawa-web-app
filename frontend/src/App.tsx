import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  // ログイン済みかの判定
  const isAuthenticated = () => {
    return localStorage.getItem("user") !== null;
  };

  return (
    <BrowserRouter>
      {/* --- どのURLでどの画面を表示させているか --- */}

      <Routes>
        {/* --- ログイン画面・新規登録画面 --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* --- サイトのトップ、ログイン画面 --- */}
        <Route
          path="/"
          element={ <Navigate to="/login" /> }
        />

        {/* 上記以外のURLの場合、サイトトップ（/）へ戻す */}
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
