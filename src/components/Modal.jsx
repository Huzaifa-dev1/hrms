// src/components/Modal.jsx
import { useEffect } from "react";

export default function Modal({
  open,
  title = "Modal",
  children,
  onClose,
  footer,
  width = 720,
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "auto";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={() => onClose?.()}>
      <div
        className="modal glass-card"
        style={{ width: `min(${width}px, 95vw)` }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal__head">
          <div className="modal__title">{title}</div>
          <button className="icon-btn" onClick={() => onClose?.()} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal__body">{children}</div>

        {footer ? <div className="modal__footer">{footer}</div> : null}

        <style>{`
          .modal__head{
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(255,255,255,0.10);
            margin-bottom: 12px;
          }
          .modal__title{
            font-weight: 900;
            letter-spacing: 0.2px;
            font-size: 16px;
          }
          .modal__body{
            padding: 6px 0 2px;
          }
          .modal__footer{
            margin-top: 14px;
            padding-top: 12px;
            border-top: 1px solid rgba(255,255,255,0.10);
            display:flex;
            justify-content:flex-end;
            gap: 10px;
          }
        `}</style>
      </div>
    </div>
  );
}
