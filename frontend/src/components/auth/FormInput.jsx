import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const FormInput = ({
  field,
  form: { touched, errors },
  label,
  type = 'text',
  ...props
}) => {
  const hasError = touched[field.name] && errors[field.name];

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          {...field}
          {...props}
          className={`
            block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset 
            ${hasError
              ? 'border-red-300 ring-red-300 focus:ring-red-500'
              : 'border-gray-300 ring-gray-300 focus:ring-indigo-600'
            }
            placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6
          `}
        />
        {hasError && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {hasError && (
        <p className="mt-2 text-sm text-red-600">{errors[field.name]}</p>
      )}
    </div>
  );
};

export default FormInput;
