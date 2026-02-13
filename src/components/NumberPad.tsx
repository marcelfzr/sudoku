import { useTranslation } from 'react-i18next'

type NumberPadProps = {
  disabled: boolean
  disabledDigits: Set<number>
  onInput: (digit: number) => void
}

export function NumberPad({ disabled, disabledDigits, onInput }: NumberPadProps) {
  const { t } = useTranslation()

  return (
    <div className="number-pad" aria-label={t('a11y.numberInput')}>
      {Array.from({ length: 9 }, (_, index) => index + 1).map((digit) => (
        <button
          key={digit}
          type="button"
          className="number-key"
          onClick={() => onInput(digit)}
          disabled={disabled || disabledDigits.has(digit)}
          aria-label={t('a11y.inputDigit', { digit })}
        >
          {digit}
        </button>
      ))}
    </div>
  )
}
