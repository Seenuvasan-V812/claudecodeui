import React from 'react';

type AuthInputFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  placeholder: string;
  isDisabled: boolean;
  type?: 'text' | 'password' | 'email';
  name?: string;
  autoComplete?: string;
};

/**
 * A premium styled, labelled input field for authentication forms.
 * Supports autocomplete hints for password managers.
 */
export default function AuthInputField({
  id,
  label,
  value,
  onChange,
  placeholder,
  isDisabled,
  type = 'text',
  name,
  autoComplete,
}: AuthInputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label 
        htmlFor={id} 
        className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name ?? id}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full h-11 px-4 py-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 disabled:opacity-50 transition-all duration-200"
        placeholder={placeholder}
        required
        disabled={isDisabled}
      />
    </div>
  );
}
