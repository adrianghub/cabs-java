interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: FormFieldProps) {
  return (
    <div className="mb-3">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
}: SelectFieldProps) {
  return (
    <div className="mb-3">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
