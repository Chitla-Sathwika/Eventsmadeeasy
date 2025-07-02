import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
    const textareaStyles = `
      block rounded-md border border-gray-300 px-3 py-2 text-sm
      placeholder:text-gray-400 focus:outline-none focus:ring-2 
      focus:ring-blue-500 focus:border-blue-500
      disabled:opacity-50 disabled:bg-gray-100
      ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <textarea ref={ref} className={textareaStyles} {...props} />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;