import { Form, useNavigate } from "@remix-run/react";
import { XIcon } from "lucide-react";
import { useEffect } from "react";
import { t } from '~/src/utils/translate';

interface Field {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "datetime-local";
  options?: {value: string, label: string}[];
  required?: boolean;
  placeholder?: string;
}

interface TrackingModalProps {
  babyId: number;
  title: string;
  fields: Field[];
}

export function TrackingModal({ babyId, title, fields }: TrackingModalProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(`/baby/${babyId}`);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [navigate, babyId]);

  const inputClasses = "w-full p-2 border rounded bg-black text-white";
  const labelClasses = "block text-sm font-medium mb-1 text-white";

  const renderField = (field: Field) => {
    switch (field.type) {
      case "select":
        return (
          <select
            id={field.id}
            name={field.id}
            className={inputClasses}
            required={field.required}
          >
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return (
          <textarea
            id={field.id}
            name={field.id}
            className={inputClasses}
            rows={3}
            placeholder={field.placeholder}
          />
        );
      default:
        return (
          <input
            id={field.id}
            name={field.id}
            type={field.type}
            className={inputClasses}
            required={field.required}
            placeholder={field.placeholder}
            defaultValue={field.type === "datetime-local" ? new Date().toISOString().slice(0, 16) : undefined}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {t('modal.track')} {title}
          </h2>
          <button
            onClick={() => navigate(`/baby/${babyId}`)}
            className="p-1 hover:bg-gray-800 rounded-full text-white"
            aria-label={t('modal.close')}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <Form method="post">
          {fields.map(field => (
            <div key={field.id} className="mb-4">
              <label htmlFor={field.id} className={labelClasses}>
                {field.label}
              </label>
              {renderField(field)}
            </div>
          ))}
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate(`/baby/${babyId}`)}
              className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded"
            >
              {t('modal.actions.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t('modal.actions.save')}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
} 
