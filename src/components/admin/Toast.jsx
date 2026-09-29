import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function Toast({ toast, onDismiss }) {
  if (!toast) return null;
  return (
    <div className={`admin-toast ${toast.type || 'success'}`} role={toast.type === 'error' ? 'alert' : 'status'}>
      <span className="admin-toast-icon" aria-hidden="true">{toast.type === 'error' ? '!' : '✓'}</span>
      <span>{toast.message}</span>
      <button type="button" aria-label="Dismiss notification" onClick={onDismiss}>×</button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToast({ message, type, id });
    window.setTimeout(() => setToast((current) => current?.id === id ? null : current), 4500);
  }, []);
  const dismissToast = useCallback(() => setToast(null), []);
  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="admin-toast-region" aria-live="polite" aria-atomic="true">
        <Toast toast={toast} onDismiss={dismissToast} />
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside AdminLayout.');
  return context.showToast;
}
