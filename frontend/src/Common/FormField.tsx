import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { getLabelClass, getInputClass, getErrorContainerClass } from "./styleConstants";

type FormFieldProps = {
  label: string;
  type?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  suffix?: string;
  isTextArea?: boolean;
  max?: string,
};

const FormField = ({
  label,
  type = "text",
  register,
  error,
  suffix,
  isTextArea = false,
  max,
}: FormFieldProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-start">
        <label className={getLabelClass()}>{label}</label>

        {isTextArea ? (
          <textarea
            className={`${getInputClass()} h-auto p-2`}
            rows={2}
            {...register}
          />
        ) : (
        <input
          type={type}
          className={getInputClass()}
          max={max}
          {...register}
        />
        )}
        {suffix && <span className="ml-2 text-sm">{suffix}</span>}
      </div>

      <div className={getErrorContainerClass()}>
        {error && (
          <span className="text-red-500 text-xs">{error.message}</span>
        )}
      </div>
    </div>
  );
};

export default FormField;
