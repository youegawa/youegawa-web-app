// 再作成用のコード例
type Props = {
  type?: "button" | "submit" | "reset";
  label: string;
  className?: string;
  onClick?: () => void;
};

const FormButton = ({ type = "button", label, className, onClick }: Props) => {
  return (
    <button type={type} className={className} onClick={onClick}>
      {label}
    </button>
  );
};

export default FormButton;
