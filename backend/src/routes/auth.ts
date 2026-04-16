import { Hono } from "hono";
import mysql from "mysql2/promise";
import pool from "../db/index.js";

const auth = new Hono();

// POST /api/auth/signup　新規登録
auth.post("/signup", async (c) => {
  const body = await c.req.json();
  const { user_name, user_password, user_email, monthly_budget } = body;

  // 入力項目の必須チェック
  if (!user_name || !user_password || !user_email) {
    return c.json(
      { message: "ユーザー名、パスワード、メールアドレスは必須です" },
      400,
    );
  }

  try {
    // usersテーブルにデータを挿入、月額設定額がゼロの場合、ゼロを設定する
    const [result] = await pool.query<mysql.ResultSetHeader>(
      "INSERT INTO users (user_name, user_password, user_email, monthly_budget) VALUES (?, ?, ?, ?)",
      [user_name, user_password, user_email, monthly_budget || 0],
    );

    // ユーザー登録成功した場合
    return c.json(
      {
        message: "新規ユーザー登録が完了しました。",
        user: {
          user_id: result.insertId,
          user_name: user_name,
          monthly_budget: monthly_budget || 0,
        },
      },
      201,
    );
  } catch (e) {
    // 接続エラー等の場合
    console.error(e);

    // エラーオブジェクトを型定義
    const error = e as { code?: string };

    // 重複の場合
    if (error.code === "ER_DUP_ENTRY") {
      return c.json({ message: "メールアドレスが既に使われています。" }, 409);
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
    const { user_email, user_password } = body;

    // 型定義と必須チェック
    if (
      typeof user_email !== "string" ||
      typeof user_password !== "string" ||
      !user_email ||
      !user_password
    ) {
      return c.json({ message: "メールアドレスとパスワードは必須です" }, 400);
    }

    // 名前とパスワードが両方とも一致するデータがあるか検索
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      "SELECT * FROM users WHERE user_email = ? AND user_password = ?",
      [user_email, user_password],
    );

    // ユーザー名パスワードを取得できなかった場合
    if (rows.length === 0) {
      return c.json(
        { message: "メールアドレスまたはパスワードが正しくありません" },
        401,
      );
    }

    // 複数ある場合
    if (rows.length > 1) {
      return c.json({ message: "メールアドレスが重複しています" }, 500);
    }

    const user = rows[0];

    // ログインに成功した場合
    return c.json({
      message: "ログインに成功しました",
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        monthly_budget: user.monthly_budget,
      },
    });
  } catch (e) {
    // 例外処理
    console.error(e);
    return c.json({ message: "ログインに失敗しました" }, 500);
  }
});

export default auth;
