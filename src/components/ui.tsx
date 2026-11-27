"use client";
import { useEffect, useRef, type ReactNode } from "react";
import {requestWorkflowNavigation} from "@/lib/workflow-navigation";
import { X, ArrowLeft, ArrowUpRight, Plus } from "./icons";
import gsap from "gsap";
import { createPortal } from "react-dom";
import { lockModalBackground, useModalViewport } from "./modal-environment";
export function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variant} ${className}`}
    >
      {children}
    </button>
  );
}
export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  min,
  max,
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
  max?: string;
  step?: string;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required && " *"}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        min={min ?? (type === "number" ? "0" : undefined)}
        max={max}
        step={step ?? (type === "number" ? "any" : undefined)}
      />
    </label>
  );
}
export function TextArea({
  label,
  value,
  onChange,
  placeholder = "Write a little something…",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
    </label>
  );
}
export function Section({
  title,
  children,
  action,
  className = "",
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      <div className="section-heading">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
export function TextLink({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button className="text-link" onClick={onClick}>
      {children}
      <ArrowUpRight size={15} />
    </button>
  );
}
export function PageHeading({
  title,
  description,
  back,
  action,
}: {
  title: string;
  description?: string;
  back?: () => void;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      {back && (
        <button className="back-link" onClick={back}>
          <ArrowLeft size={16} /> Back to overview
        </button>
      )}
      <div className="heading-line">
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}
export function AddButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button className="add-button" onClick={onClick}>
      <Plus size={17} />
      {children}
    </button>
  );
}
export function Sheet({
  title,
  children,
  onClose,
  className = "",
  guardUnsaved = true,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
  guardUnsaved?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const requestClose=()=>guardUnsaved?requestWorkflowNavigation(onClose):onClose();
  closeRef.current = requestClose;
  useModalViewport(ref, true);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement;
    const el = dialogRef.current;
    el?.focus({ preventScroll: true });
    const restoreBackground = lockModalBackground();
    const ctx = gsap.context(() => {
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
        gsap.fromTo(
          ".sheet",
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.28, ease: "power3.out" },
        );
    }, ref);
    const key = (e: KeyboardEvent) => {
      const stack=document.querySelectorAll('.sheet-backdrop');
      if(stack[stack.length-1]!==ref.current)return;
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closeRef.current();
      }
      if (e.key === "Tab" && el) {
        const nodes = el.querySelectorAll<HTMLElement>(
          'button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),a[href],[tabindex="0"]',
        );
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (
          document.activeElement === el ||
          !el.contains(document.activeElement)
        ) {
          e.preventDefault();
          (e.shiftKey ? last : first)?.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      ctx.revert();
      restoreBackground();
      document.removeEventListener("keydown", key);
      if(prev?.isConnected&&!prev.closest("[inert]"))prev.focus({ preventScroll: true });
    };
  }, []);
  return createPortal(
    <div className="sheet-backdrop" ref={ref} tabIndex={-1} onClick={requestClose}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`sheet ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" />
        <header>
          <h2>{title}</h2>
          <button aria-label="Close" className="icon-button" onClick={requestClose}>
            <X size={20} />
          </button>
        </header>
        <div className="sheet-body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
