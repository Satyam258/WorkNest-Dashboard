import { useId, useState } from 'react'
import { authInputClassName, AUTH_FIELD_ERROR, AUTH_LABEL } from './authFieldStyles'

type AuthPasswordFieldProps = {
  id?: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  autoComplete: string
  placeholder?: string
  onClearError?: () => void
}

export function AuthPasswordField({
  id: idProp,
  label,
  value,
  onChange,
  error,
  autoComplete,
  placeholder = '••••••••',
  onClearError,
}: AuthPasswordFieldProps) {
  const uid = useId()
  const id = idProp ?? uid
  const [visible, setVisible] = useState(false)
  const hasError = Boolean(error)

  return (
    <div>
      <label htmlFor={id} className={AUTH_LABEL}>
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          name="password"
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            onClearError?.()
          }}
          {...(hasError ? { 'aria-invalid': true } : {})}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={`${authInputClassName(hasError)} pr-11`}
          placeholder={placeholder}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-wn-muted transition-[color,background-color,box-shadow] duration-200 hover:bg-white/6 hover:text-wn-text hover:shadow-[0_0_16px_-6px_rgba(192,132,252,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wn-accent/35"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {error ? (
        <p id={`${id}-error`} className={AUTH_FIELD_ERROR} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function EyeIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.7 10.7a3 3 0 0 0 4.2 4.2M9.88 5.09A10.14 10.14 0 0 1 12 5c6.5 0 10 7 10 7a18.32 18.32 0 0 1-3.29 4.67M6.11 6.11A18.55 18.55 0 0 0 2 12s3.5 7 10 7a9.88 9.88 0 0 0 4.13-.98M2 2l20 20"
      />
    </svg>
  )
}
