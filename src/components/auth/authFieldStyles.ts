/** Shared auth form field styles — focus glow + error states */
export const AUTH_INPUT_BASE =
  'w-full rounded-xl border bg-wn-bg/45 px-3 py-2.5 text-sm text-wn-text shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)] outline-none transition-[border-color,box-shadow,ring-color] duration-250 ease-out placeholder:text-wn-muted/55'

export const AUTH_INPUT_DEFAULT =
  'border-wn-border/70 focus:border-wn-accent/55 focus:ring-2 focus:ring-wn-accent/25 focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.28),0_0_0_1px_rgba(192,132,252,0.2),0_0_32px_-10px_rgba(192,132,252,0.38)]'

export const AUTH_INPUT_ERROR =
  'border-red-500/55 ring-1 ring-red-500/25 focus:border-red-400/75 focus:ring-2 focus:ring-red-500/30 focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.28),0_0_0_1px_rgba(248,113,113,0.2),0_0_28px_-8px_rgba(248,113,113,0.28)]'

export function authInputClassName(hasError: boolean): string {
  return [
    AUTH_INPUT_BASE,
    hasError ? AUTH_INPUT_ERROR : AUTH_INPUT_DEFAULT,
  ].join(' ')
}

export const AUTH_FIELD_ERROR =
  'mt-1.5 text-xs font-medium text-red-300/95 transition-opacity duration-200'

export const AUTH_LABEL = 'text-xs font-medium text-wn-muted'

export const AUTH_SUBMIT =
  'mt-2 flex h-11 w-full items-center justify-center rounded-xl border border-wn-accent/40 bg-linear-to-r from-wn-accent/35 via-wn-accent/25 to-sky-500/20 text-sm font-semibold text-wn-text shadow-[0_0_28px_-10px_rgba(192,132,252,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-250 ease-out hover:border-wn-accent/55 hover:shadow-[0_0_44px_-6px_rgba(192,132,252,0.58),0_0_24px_-8px_rgba(99,102,241,0.18),inset_0_1px_0_rgba(255,255,255,0.12)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none'
