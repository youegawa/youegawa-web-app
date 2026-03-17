-- 接続文字コードを明示的に設定する（日本語文字化け防止）
SET NAMES utf8mb4;

-- todos テーブルの作成
CREATE TABLE IF NOT EXISTS todos (
  id         INT          NOT NULL AUTO_INCREMENT,
  title      VARCHAR(255) NOT NULL,
  completed  BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- サンプルデータ
INSERT INTO todos (title, completed) VALUES
  ('Hono の公式ドキュメントを読む', FALSE),
  ('Docker Compose でローカル環境を構築する', TRUE),
  ('フロントエンドのコンポーネントを実装する', FALSE);
