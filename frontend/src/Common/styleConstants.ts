// ラベル
export const getLabelClass = () => "w-32 text-gray-700 pt-1 flex-shrink-0 text-left";

// 入力フィールド（常に右寄せに固定）
export const getInputClass = () =>
  "border-2 border-gray-400 py-1 px-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-72 text-sm text-right transition-all";

// エラー表示領域
export const getErrorContainerClass = () => "h-6 ml-32";

// ボタン配置エリア
export const getButtonGroupClass = () => "ml-32 w-72 flex justify-center space-x-4 mt-8";

// メインボタン
export const getPrimaryBtnClass = () =>
  "bg-blue-500 text-black py-2 px-6 rounded-md font-bold text-sm hover:bg-blue-600 transition-all shadow active:transform active:scale-95";

// ログアウトボタン
export const getSecondaryBtnClass = () =>
  "bg-blue-500 text-white py-1 px-3 rounded text-xs font-bold hover:bg-blue-600 transition-all shadow-sm";
