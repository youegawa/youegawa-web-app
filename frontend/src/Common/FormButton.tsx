// 再作成用のコード例
type Props = {
  type?: "button" | "submit" | "reset";
  label: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const FormButton = ({ type = "button", label, className, onClick, disabled }: Props) => {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default FormButton;
