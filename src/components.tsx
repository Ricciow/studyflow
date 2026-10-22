import type {
  ComponentType,
  ComponentProps,
  CSSProperties,
  ReactNode,
} from "react";
import {
  ArrowLeftIcon,
  PlusIcon,
  ChevronRightIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";
import { KeyboardInput, KeyboardTextarea, useKeyboard } from "./mobile";

export function Icon({
  icon: Comp,
  size = 20,
  ...props
}: {
  icon: ComponentType<any>;
  size?: number;
  [key: string]: any;
}) {
  return <Comp width={size} height={size} aria-hidden="true" {...props} />;
}
export function IconButton({
  icon,
  label,
  onClick,
  className = "",
}: {
  icon: ComponentType<any>;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`icon-button ${className}`}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <Icon icon={icon} />
    </button>
  );
}
export function PageTitle({
  title,
  back,
  action,
}: {
  title: string;
  back?: () => void;
  action?: ReactNode;
}) {
  return (
    <header className="page-title">
      {back && (
        <IconButton
          icon={ArrowLeftIcon}
          label="Voltar à página anterior"
          onClick={back}
        />
      )}
      <h1>{title}</h1>
      {action}
    </header>
  );
}
export function SectionTitle({
  children,
  action,
  onClick,
}: {
  children: ReactNode;
  action?: string;
  onClick?: () => void;
}) {
  return (
    <div className="section-title">
      <h2>{children}</h2>
      {action && (
        <button className="text-button" onClick={onClick}>
          {action}
          <Icon icon={ChevronRightIcon} size={14} />
        </button>
      )}
    </div>
  );
}
export function Empty({
  title,
  children,
  action,
  onClick,
}: {
  title: string;
  children: ReactNode;
  action?: string;
  onClick?: () => void;
}) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <Icon icon={ReaderIcon} size={28} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
      {action && (
        <button className="button primary" onClick={onClick}>
          <Icon icon={PlusIcon} size={16} />
          {action}
        </button>
      )}
    </div>
  );
}
export function Field({
  label,
  children,
  hint,
  group = false,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  group?: boolean;
}) {
  if (group)
    return (
      <div className="field" role="group" aria-label={label}>
        <span>{label}</span>
        {children}
        {hint && <small>{hint}</small>}
      </div>
    );
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
function isTextControl(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
  );
}
export function Input(props: ComponentProps<typeof KeyboardInput>) {
  const keyboard = useKeyboard();
  const textType =
    !props.type ||
    ["text", "email", "search", "tel", "url"].includes(props.type);
  return (
    <KeyboardInput
      {...props}
      pattern={
        props.pattern ?? (props.required && textType ? ".*\\S.*" : undefined)
      }
      onBlur={(event) => {
        if (!isTextControl(event.relatedTarget)) keyboard.hide();
        props.onBlur?.(event);
      }}
    />
  );
}
export function Textarea(props: ComponentProps<typeof KeyboardTextarea>) {
  const keyboard = useKeyboard();
  return (
    <KeyboardTextarea
      {...props}
      onBlur={(event) => {
        if (!isTextControl(event.relatedTarget)) keyboard.hide();
        props.onBlur?.(event);
      }}
    />
  );
}
export function Segments({
  values,
  selected,
  onChange,
}: {
  values: string[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="segments" role="group">
      {values.map((value) => (
        <button
          type="button"
          key={value}
          aria-pressed={selected === value}
          className={selected === value ? "selected" : ""}
          onClick={() => onChange(value)}
        >
          {value}
        </button>
      ))}
    </div>
  );
}
export function Badge({ priority }: { priority: string }) {
  return (
    <span
      className={`badge ${priority === "Alta" ? "high" : priority === "Média" ? "medium" : "low"}`}
    >
      {priority}
    </span>
  );
}
export function Progress({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span
        style={
          { width: `${Math.max(0, Math.min(100, value))}%` } as CSSProperties
        }
      />
    </div>
  );
}
