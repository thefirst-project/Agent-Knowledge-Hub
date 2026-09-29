import { useEffect, useMemo, useState } from 'react';

const templateFiles = {
  services: 'services-template.xlsx',
  prices: 'prices-template.xlsx',
  offers: 'offers-template.xlsx',
  'quick-replies': 'quick-replies-template.xlsx',
  'call-flows': 'call-flow-template.xlsx',
};

export function InfoBanner({ children, tone = 'info', title, section }) {
  const template = templateFiles[section];
  return (
    <div className={`admin-info-banner ${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <span className="admin-info-icon" aria-hidden="true">{tone === 'error' ? '!' : tone === 'success' ? '✓' : 'i'}</span>
      <div className="admin-info-content">
        {title && <strong>{title}</strong>}
        <div>{children || (section
          ? 'Add records manually, use the available template to prepare data, or upload a document for assisted import.'
          : null)}</div>
        {section && <div className="admin-info-actions">
          {template
            ? <a className="admin-button secondary" href={`/templates/${template}`} download>Download Template</a>
            : <button className="admin-button secondary" type="button" disabled>Template unavailable</button>}
          <button className="admin-button secondary" type="button" disabled title="Coming in next update">Upload File</button>
        </div>}
      </div>
    </div>
  );
}

export function SlidePanel({ open, title, description, onClose, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    document.body.classList.add('admin-panel-open');
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.classList.remove('admin-panel-open');
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="admin-panel-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="admin-slide-panel" role="dialog" aria-modal="true" aria-labelledby="admin-panel-title">
        <header className="admin-panel-header">
          <div><h2 id="admin-panel-title">{title}</h2>{description && <p>{description}</p>}</div>
          <button className="admin-icon-button" type="button" aria-label="Close panel" onClick={onClose}>×</button>
        </header>
        <div className="admin-panel-content">{children}</div>
        {footer && <footer className="admin-panel-footer">{footer}</footer>}
      </section>
    </div>
  );
}

export function ConfirmDialog({ open, title = 'Confirm action', message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', requiredText, busy = false, onConfirm, onCancel }) {
  const [typedText, setTypedText] = useState('');
  useEffect(() => {
    if (open) setTypedText('');
  }, [open, requiredText]);
  if (!open) return null;
  return (
    <div className="admin-panel-backdrop admin-dialog-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !busy) onCancel();
    }}>
      <section className="admin-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="admin-confirm-title">
        <span className="admin-dialog-warning" aria-hidden="true">!</span>
        <h2 id="admin-confirm-title">{title}</h2>
        <p>{message}</p>
        {requiredText && (
          <label className="admin-field">
            <span>Type <strong>{requiredText}</strong> to confirm</span>
            <input autoComplete="off" value={typedText} onChange={(event) => setTypedText(event.target.value)} />
          </label>
        )}
        <div className="admin-dialog-actions">
          <button className="admin-button secondary" type="button" disabled={busy} onClick={onCancel}>{cancelLabel}</button>
          <button className="admin-button danger" type="button" disabled={busy || (requiredText && typedText !== requiredText)} onClick={onConfirm}>
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

export function DataTable({
  columns,
  rows,
  rowKey = 'id',
  emptyMessage = 'No records found.',
  renderActions,
  loading = false,
  pageSize = 10,
  sortable = true,
  paginate = true,
}) {
  const [sort, setSort] = useState({ key: '', direction: 'asc' });
  const [page, setPage] = useState(0);
  const sortedRows = useMemo(() => {
    if (!sortable || !sort.key) return rows;
    return [...rows].sort((first, second) => {
      const firstValue = first[sort.key];
      const secondValue = second[sort.key];
      const comparison = typeof firstValue === 'number' && typeof secondValue === 'number'
        ? firstValue - secondValue
        : String(firstValue ?? '').localeCompare(String(secondValue ?? ''), undefined, {
          numeric: true,
          sensitivity: 'base',
        });
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [rows, sort, sortable]);
  const pageCount = paginate ? Math.max(1, Math.ceil(sortedRows.length / pageSize)) : 1;
  const currentPage = Math.min(page, pageCount - 1);
  const visibleRows = paginate
    ? sortedRows.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
    : sortedRows;

  return (
    <>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr>{columns.map((column) => (
            <th key={column.key} scope="col">
              {sortable ? <button
                className="admin-sort-button"
                type="button"
                aria-label={`Sort by ${column.label}`}
                onClick={() => {
                  setSort((current) => ({
                    key: column.key,
                    direction: current.key === column.key && current.direction === 'asc' ? 'desc' : 'asc',
                  }));
                  setPage(0);
                }}
              >
                {column.label}{sort.key === column.key ? (sort.direction === 'asc' ? ' ↑' : ' ↓') : ''}
              </button> : column.label}
            </th>
          ))}{renderActions && <th scope="col" className="admin-actions-heading">Actions</th>}</tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={columns.length + (renderActions ? 1 : 0)} className="admin-table-state">Loading records…</td></tr>
              : sortedRows.length === 0 ? <tr><td colSpan={columns.length + (renderActions ? 1 : 0)} className="admin-table-state">{emptyMessage}</td></tr>
                : visibleRows.map((row, index) => (
                  <tr key={row[rowKey] ?? index}>
                    {columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : (row[column.key] ?? '—')}</td>)}
                    {renderActions && <td className="admin-row-actions">{renderActions(row, paginate ? currentPage * pageSize + index : index)}</td>}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {paginate && !loading && sortedRows.length > pageSize && <div className="admin-table-pagination">
        <span>{currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, sortedRows.length)} of {sortedRows.length}</span>
        <div>
          <button className="admin-button secondary" type="button" disabled={currentPage === 0} onClick={() => setPage((value) => Math.max(0, value - 1))}>Previous</button>
          <button className="admin-button secondary" type="button" disabled={currentPage >= pageCount - 1} onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))}>Next</button>
        </div>
      </div>}
    </>
  );
}
