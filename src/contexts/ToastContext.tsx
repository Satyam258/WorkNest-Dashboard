import { AnimatePresence, motion } from 'framer-motion'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export type ToastPayload = {
  message: string
  tone?: 'default' | 'success' | 'warning'
}

type ToastItem = ToastPayload & { id: string }

type ToastContextValue = {
  toast: (payload: ToastPayload) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const DISMISS_MS = 3000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const timers = useRef<Map<string, number>>(new Map())

  const remove = useCallback((id: string) => {
    const t = timers.current.get(id)
    if (t) window.clearTimeout(t)
    timers.current.delete(id)
    setItems((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const toast = useCallback(
    (payload: ToastPayload) => {
      const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `t-${Date.now()}`
      setItems((prev) => [...prev, { ...payload, id }])
      const tid = window.setTimeout(() => remove(id), DISMISS_MS)
      timers.current.set(id, tid)
    },
    [remove],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed top-4 right-4 z-[200] flex max-w-sm flex-col gap-2 md:top-5 md:right-5"
        aria-live="polite"
        aria-relevant="additions"
      >
        <AnimatePresence mode="popLayout">
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 16, scale: 0.96 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto"
            >
              <button
                type="button"
                onClick={() => remove(t.id)}
                className={[
                  'w-full rounded-xl border px-4 py-3 text-left text-sm font-medium shadow-[0_16px_48px_-12px_rgba(0,0,0,0.45),0_0_32px_-10px_rgba(192,132,252,0.15)] ring-1 backdrop-blur-xl transition-[box-shadow,transform] duration-200 hover:scale-[1.01] active:scale-[0.99]',
                  t.tone === 'success'
                    ? 'border-emerald-500/35 bg-wn-surface/90 text-wn-text ring-emerald-500/15'
                    : t.tone === 'warning'
                      ? 'border-amber-500/40 bg-wn-surface/90 text-wn-text ring-amber-500/15'
                      : 'border-wn-border/80 bg-wn-surface/92 text-wn-text ring-white/8',
                ].join(' ')}
              >
                {t.message}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
