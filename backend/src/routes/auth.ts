import { Hono } from "hono";
import mysql from "mysql2/promise";
import pool from "../db/index.js";

const auth = new Hono();

// POST /api/auth/signup　新規登録
auth.post("/signup", async (c) => {
  const body = await c.req.json();
  const { user_name, user_password, monthly_budget } = body;

  // 入力項目の必須チェック
  if (!user_name || !user_password) {
    return c.json({ message: "ユーザー名とパスワードは必須です"}, 400);
  }

  try {
    // usersテーブルにデータを挿入、月額設定額が未設定の場合、０を設定する
    const budget = monthly_budget ?? 0;

    const [result] = await pool.query<mysql.ResultSetHeader>(
      "INSERT INTO users (user_name, user_password, monthly_budget) VALUES (?, ?, ?)",
      [user_name, user_password, budget]
    );

    // ユーザー登録成功した場合
    return c.json({
      message: "新規ユーザー登録が完了しました。",
      user:{
        user_id: result.insertId,
        user_name: user_name,
        monthly_budget: budget
      }
    }, 201);
  } catch (e) {
    // 接続エラー等の場合
    console.error(e);

    // エラーオブジェクトを型定義
    const error = e as { code?: string };

    // 重複の場合
    if (error.code === "ER_DUP_ENTRY") {

      return c.json({ message: "名前が既に使われています。" }, 409);
    }

    // DB接続エラーの場合
    return c.json({ message: "登録に失敗しました。" }, 500);
  }
});

// POST /api/auth/login - ログイン
auth.post("/login", async (c) => {
  try {
    // 入力されたユーザー名とパスワードを取得する
    const body = await c.req.json();
    const { user_name, user_password } = body;

    // 型定義と必須チェック
    if (
      typeof user_name !== "string" ||
      typeof user_password !== "string" ||
      !user_name ||
      !user_password
    ) {
      return c.json({ message: "ユーザー名とパスワードは必須です" }, 400);
    }

    // 名前とパスワードが両方とも一致するデータがあるか検索
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      "SELECT * FROM users WHERE user_name = ? AND user_password = ?",
      [user_name, user_password]
    );

    // ユーザー名パスワードを取得できなかった場合
    if (rows.length === 0) {
      return c.json({ message: "ユーザー名またはパスワードが正しくありません" }, 401);
    }

    // ユーザー名パスワードが複数ある場合
    if (rows.length > 1) {
      return c.json({ message: "ユーザー名が重複しています" }, 500);
    }

    const user = rows[0];

    // ログインに成功した場合
    return c.json({
      message: "ログインに成功しました",
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        monthly_budget: user.monthly_budget
      }
    });

  } catch (e) {
    // 例外処理
    console.error(e);
    return c.json({ message: "ログインに失敗しました" }, 500);
  }
});

// api/auth/update-budget　-月額設定
auth.post("/update-budget", async (c) => {
  try {
    const body = await c.req.json();
    const { user_id, monthly_budget } = body;

    if (!user_id || monthly_budget === undefined){
      return c.json({ message: "ユーザーIDと予算額が必要です"}, 400);
    }
    const [result] = await pool.query<mysql.ResultSetHeader>(
      "UPDATE users SET monthly_budget = ? WHERE user_id = ?",
      [monthly_budget, user_id]
    );
    if(result.affectedRows === 0){
      return c.json({ message: "ユーザーが見つかりませんでした"}, 404);
    }
    return c.json({
      message: "予算額を更新しました",
      monthly_budget: monthly_budget
    });

  } catch(e){
    console.error(e);
    return c.json({ message: "予算の更新処理中に予期せぬエラーが発生しました" }, 500);
  }
});

export default auth;
