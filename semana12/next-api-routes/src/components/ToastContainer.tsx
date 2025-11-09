import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: number) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const getToastStyles = (type: Toast['type']) => {
    const baseStyles = 'px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md animate-slide-in';
    
    const typeStyles = {
      success: 'bg-green-600 text-white',
      error: 'bg-red-600 text-white',
      warning: 'bg-yellow-500 text-gray-900',
      info: 'bg-blue-600 text-white',
    };

    return `${baseStyles} ${typeStyles[type]}`;
  };

  const getIcon = (type: Toast['type']) => {
    const iconProps = { className: "w-5 h-5" };
    const icons = {
      success: <CheckCircle {...iconProps} />,
      error: <XCircle {...iconProps} />,
      warning: <AlertTriangle {...iconProps} />,
      info: <Info {...iconProps} />,
    };
    return icons[type];
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={getToastStyles(toast.type)}
        >
          {getIcon(toast.type)}
          <span className="flex-1 font-medium">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="hover:opacity-70 transition-opacity"
            aria-label="Cerrar notificación"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}
