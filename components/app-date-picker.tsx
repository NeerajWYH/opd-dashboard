import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

function formatSingle(date: Date | undefined) {
  return date ? format(date, "LLL dd, y") : null
}

function formatRange(range: DateRange | undefined) {
  if (!range?.from) return null
  if (range.to)
    return `${format(range.from, "LLL dd, y")} – ${format(range.to, "LLL dd, y")}`
  return format(range.from, "LLL dd, y")
}

interface CommonProps {
  placeholder?: string
  numberOfMonths?: number
  className?: string
  buttonId?: string
  onBlur?: () => void
  isInvalid?: boolean
  minDate?: Date
  maxDate?: Date
}

export interface DatePickerSingleProps extends CommonProps {
  mode: "single"
  value: Date | undefined
  onChange: (date: Date | undefined) => void
}

export interface DatePickerRangeProps extends CommonProps {
  mode?: "range"
  value: DateRange | undefined
  onChange: (range: DateRange | undefined) => void
}

export type AppDatePickerProps = DatePickerSingleProps | DatePickerRangeProps

const TriggerButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & {
    open: boolean
    isInvalid?: boolean
  }
>(({ id, open, isInvalid, className, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      id={id}
      type="button"
      aria-invalid={isInvalid}
      className={cn(
        "justify-start bg-white font-normal text-black",
        "cursor-pointer border border-input transition-colors",
        open && !isInvalid && "border-ring ring-3 ring-ring/50",
        isInvalid && "border-destructive ring-3 ring-destructive/20",
        className
      )}
      {...props}
    >
      <CalendarIcon data-icon="inline-start" />
      {children}
    </Button>
  )
})
TriggerButton.displayName = "TriggerButton"

export function AppDatePicker(props: AppDatePickerProps) {
  const {
    placeholder = "Pick a date",
    numberOfMonths,
    className,
    buttonId,
    onBlur,
    isInvalid,
    minDate,
    maxDate,
  } = props

  const [open, setOpen] = React.useState(false)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) onBlur?.()
  }

  if (props.mode === "single") {
    const { value, onChange } = props
    const label = formatSingle(value) ?? (
      <span className="text-muted-foreground">{placeholder}</span>
    )

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          render={
            <TriggerButton
              id={buttonId ?? "date-picker-single"}
              open={open}
              isInvalid={isInvalid}
              className={className}
            >
              {label}
            </TriggerButton>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            defaultMonth={value}
            numberOfMonths={numberOfMonths ?? 1}
            captionLayout="dropdown"
            disabled={{
              before: minDate as Date,
              after: maxDate as Date,
            }}
          />
        </PopoverContent>
      </Popover>
    )
  }

  const { value, onChange } = props
  const label = formatRange(value) ?? (
    <span className="text-muted-foreground">{placeholder}</span>
  )

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <TriggerButton
            id={buttonId ?? "date-picker-range"}
            open={open}
            isInvalid={isInvalid}
            className={className}
          >
            {label}
          </TriggerButton>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={value?.from}
          selected={value}
          onSelect={onChange}
          numberOfMonths={numberOfMonths ?? 2}
          captionLayout="dropdown"
          disabled={{
            before: minDate as Date,
            after: maxDate as Date,
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
