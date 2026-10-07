import { useState, type FormEvent, type ReactNode } from "react";

export interface AuthField {
  name: string;
  label: string;
  type: string;
}

export interface AuthCheckbox {
  name: string;
  label: string;
}

interface AuthFormProps {
  title: string;
  fields: AuthField[];
  checkbox?: AuthCheckbox;
  submitLabel: string;
  onSubmit: (values: Record<string, string | boolean>) => Promise<void>;
  footer?: ReactNode;
  secondaryLink?: ReactNode;
  error?: string;
}

export default function AuthForm({
  title,
  fields,
  checkbox,
  submitLabel,
  onSubmit,
  footer,
  secondaryLink,
  error,
}: AuthFormProps) {
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(name: string, value: string | boolean) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 w-[580px] max-w-full">
      <h1 className="font-display font-medium text-3xl text-black">{title}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {fields.map((field) => {
          const isPassword = field.type === "password";
          const revealed = showPassword[field.name];
          return (
            <div key={field.name} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label htmlFor={field.name} className="font-display text-black">
                  {field.label}
                </label>
                {isPassword && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((s) => ({ ...s, [field.name]: !s[field.name] }))
                    }
                    className="font-display text-black/80 text-sm"
                  >
                    {revealed ? "Hide" : "Show"}
                  </button>
                )}
              </div>
              <input
                id={field.name}
                required
                type={isPassword && revealed ? "text" : field.type}
                value={(values[field.name] as string) || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full h-14 rounded-[12px] bg-cream border border-black/[0.15] px-4 font-body text-lg outline-none focus:border-tan"
              />
            </div>
          );
        })}

        {checkbox && (
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(values[checkbox.name])}
              onChange={(e) => handleChange(checkbox.name, e.target.checked)}
              className="h-5 w-5 rounded accent-espresso"
            />
            <span className="font-display text-[#333]">{checkbox.label}</span>
          </label>
        )}

        {error && (
          <p role="alert" className="text-red-700 font-body text-sm">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-solid w-full">
          {submitting ? "Please wait…" : submitLabel}
        </button>
      </form>

      <div className="flex flex-col items-center gap-4">
        {secondaryLink}
        {footer}
      </div>
    </div>
  );
}