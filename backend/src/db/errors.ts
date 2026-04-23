import { Context } from "hono";

// データベース接続に関する
export const isDatabaseConnectionError = (e: unknown): boolean => {
  if (e !== null && typeof e === "object" && "code" in e) {
    const code = (e as { code: unknown }).code;
    return code === "ECONNREFUSED" || code === "PROTOCOL_CONNECTION_LOST";
  }
  return false;
};

// エラーに応じたレスポンスを返す
export const handleRouteError = (
  c: Context,
  e: unknown,
  defaultMessage: string,
) => {
  if (isDatabaseConnectionError(e)) {
    return c.json({ message: "データベースに接続できません。" }, 503);
  }
  return c.json({ message: defaultMessage }, 500);
};
