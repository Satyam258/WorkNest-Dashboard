import { AnimatePresence, motion } from 'framer-motion'
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

const ease = [0.22, 1, 0.36, 1] as const

const MENU_Z = 160

type Option<T extends string> = { value: T; label: string }

type MenuPos = {
  top: number
  left: number
  width: number
  maxHeight: number
}

type GlassMenuSelectProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: readonly Option<T>[]
  label: string
  minWidthClass?: string
  /** Render menu in a portal with fixed positioning (use inside modals / overflow-hidden parents). */
  menuPortal?: boolean
}

export function GlassMenuSelect<T extends string>({
  value,
  onChange,
  options,
  label,
  minWidthClass = 'sm:min-w-[140px]',
  menuPortal = false,
}: GlassMenuSelectProps<T>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listId = useId()
  const [menuPos, setMenuPos] = useState<MenuPos | null>(null)

  const updateMenuPosition = useCallback(() => {
    const btn = buttonRef.current
    if (!btn) return
    const r = btn.getBoundingClientRect()
    const gap = 4
    const viewportH = window.innerHeight
    const viewportW = window.innerWidth
    const itemH = 44
    const pad = 8
    const naturalH = options.length * itemH + pad
    const maxH = Math.min(280, viewportH - 24)
    const estH = Math.min(naturalH, maxH)
    const spaceBelow = viewportH - r.bottom - gap - 8
    const spaceAbove = r.top - gap - 8
    const openUp = spaceBelow < Math.min(estH, 120) && spaceAbove > spaceBelow

    let top = openUp ? r.top - estH - gap : r.bottom + gap
    let maxHeight = openUp
      ? Math.min(estH, spaceAbove - 8)
      : Math.min(estH, spaceBelow)

    if (top < 8) {
      top = 8
      maxHeight = Math.min(maxHeight, r.top - gap - 16)
    }
    if (top + maxHeight > viewportH - 8) {
      maxHeight = Math.max(120, viewportH - top - 16)
    }

    let left = r.left
    const w = r.width
    if (left + w > viewportW - 8) {
      left = Math.max(8, viewportW - w - 8)
    }

    setMenuPos({
      top,
      left,
      width: w,
      maxHeight,
    })
  }, [options.length])

  useLayoutEffect(() => {
    if (!open) {
      setMenuPos(null)
      return
    }
    if (!menuPortal) {
      setMenuPos(null)
      return
    }
    updateMenuPosition()
    const onWin = () => updateMenuPosition()
    window.addEventListener('resize', onWin)
    window.addEventListener('scroll', onWin, true)
    return () => {
      window.removeEventListener('resize', onWin)
      window.removeEventListener('scroll', onWin, true)
    }
  }, [open, menuPortal, updateMenuPosition])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node
      if (rootRef.current?.contains(t)) return
      if (listRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const selectedLabel = options.find((o) => o.value === value)?.label ?? value

  const listContent = (
    <AnimatePresence>
      {open && (!menuPortal || menuPos) ? (
        <motion.ul
          ref={listRef}
          id={listId}
          role="listbox"
          initial={{ opacity: 0, y: menuPortal ? 0 : -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: menuPortal ? 0 : -4, scale: 0.99 }}
          transition={{ duration: 0.22, ease }}
          style={
            menuPortal && menuPos
              ? {
                  position: 'fixed',
                  top: menuPos.top,
                  left: menuPos.left,
                  width: menuPos.width,
                  maxHeight: menuPos.maxHeight,
                  zIndex: MENU_Z,
                }
              : undefined
          }
          className={[
            'overflow-y-auto overflow-x-hidden rounded-xl border border-wn-border/80 bg-wn-surface/95 p-1 shadow-[0_20px_48px_-14px_rgba(0,0,0,0.55),0_0_36px_-12px_rgba(192,132,252,0.14)] ring-1 ring-white/6 backdrop-blur-xl',
            menuPortal ? '' : 'absolute top-full right-0 left-0 z-30 mt-1',
          ].join(' ')}
        >
          {options.map((opt) => {
            const active = opt.value === value
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={active ? 'true' : 'false'}
                tabIndex={-1}
                className={[
                  'cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-200',
                  active
                    ? 'bg-wn-accent/15 font-semibold text-wn-text shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                    : 'text-wn-muted hover:bg-white/5 hover:text-wn-text',
                ].join(' ')}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onChange(opt.value)
                    setOpen(false)
                  }
                }}
              >
                {opt.label}
              </li>
            )
          })}
        </motion.ul>
      ) : null}
    </AnimatePresence>
  )

  return (
    <div
      ref={rootRef}
      className={`relative flex flex-col gap-1 ${minWidthClass}`}
    >
      <span className="text-xs font-medium text-wn-muted">{label}</span>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open ? 'true' : 'false'}
        aria-haspopup="listbox"
        aria-controls={listId}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-wn-border/70 bg-wn-elevated/75 px-3 text-left text-sm font-medium text-wn-text shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)] transition-all duration-200 hover:border-wn-accent/35 hover:bg-wn-elevated/90 hover:shadow-[0_0_22px_-10px_rgba(192,132,252,0.22)] focus-visible:border-wn-accent/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wn-accent/25"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="truncate">{selectedLabel}</span>
        <Chevron open={open} />
      </button>

      {menuPortal && typeof document !== 'undefined'
        ? createPortal(listContent, document.body)
        : listContent}
    </div>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="text-wn-muted"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2, ease }}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m6 9 6 6 6-6"
        />
      </svg>
    </motion.span>
  )
}
