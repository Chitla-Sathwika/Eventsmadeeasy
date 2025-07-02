import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, fullWidth = false, className = '', onChange, ...props }, ref) => {
    const selectStyles = `
      block rounded-md border border-gray-300 px-3 py-2 text-sm
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      disabled:opacity-50 disabled:bg-gray-100
      ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={selectStyles}
          onChange={handleChange}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;