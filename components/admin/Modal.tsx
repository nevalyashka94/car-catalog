import { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export default function Modal({
  open,
  title,
  children,
  onClose,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">

        <div className="flex items-center justify-between border-b p-5">

          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-3xl leading-none hover:text-red-500"
          >
            ×
          </button>

        </div>

        <div className="p-6">

          {children}

        </div>

      </div>

    </div>
  );
}