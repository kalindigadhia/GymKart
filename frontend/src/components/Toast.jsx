import { useEffect } from "react";

export default function Toast({ open, type = "success", message = "", onClose }) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, 2800);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-2xl shadow-slate-900/10">
      <div className="flex items-start gap-3">
        <div
          className={`mt-1 h-3.5 w-3.5 rounded-full ${
            type === "success" ? "bg-emerald-500" : "bg-rose-500"
          }`}
        />
        <div>
          <p className="text-sm font-semibold text-slate-900">{type === "success" ? "Success" : "Error"}</p>
          <p className="mt-1 text-sm text-slate-600">{message}</p>
        </div>
      </div>
    </div>
  );
}
