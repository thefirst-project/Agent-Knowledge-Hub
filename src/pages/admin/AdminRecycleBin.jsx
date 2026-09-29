import { useEffect, useState } from 'react';
import { apiFetch, BASE_URL } from '../../api/client';
import { DataTable, InfoBanner } from '../../components/admin/AdminComponents';
import { ConfirmDialog } from '../../components/admin/AdminComponents';
import { useToast } from '../../components/admin/Toast';

const RESOURCES = ['branches','services','offers','prices','quick-replies','call-flows','media','users'];
const RESOURCE_LABELS = {
  branches: 'Branches',
  services: 'Services',
  offers: 'Offers',
  prices: 'Prices',
  'quick-replies': 'Quick replies',
  'call-flows': 'Call flows',
  media: 'Media',
  users: 'Users',
};

export function AdminRecycleBin() {
  const [tab, setTab] = useState(RESOURCES[0]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    apiFetch(`/api/${tab}/deleted`).then((data) => {
      if (!active) return;
      setRows(Array.isArray(data) ? data : []);
    }).catch((err) => { if (active) { setError(err.message); showToast(err.message, 'error'); } }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [tab, showToast]);

  async function restore(row) {
    try {
      await apiFetch(`/api/${tab}/${row.id}/restore`, { method: 'POST' });
      showToast('Record restored.');
      setRows((cur) => cur.filter((r) => r.id !== row.id));
    } catch (err) { showToast(err.message, 'error'); }
  }

  async function permanentDelete() {
    if (!confirm) return;
    setDeleting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/${tab}/deleted/${confirm.row.id}`, { method: 'DELETE' });
      if (!res.ok) {
        let message = res.statusText;
        try {
          const body = await res.json();
          if (typeof body?.error === 'string') message = body.error;
        } catch {
          // Keep the HTTP status text when the response is not JSON.
        }
        throw new Error(`API request failed (${res.status}): ${message}`);
      }
      showToast('Record permanently deleted.');
      setRows((cur) => cur.filter((r) => r.id !== confirm.row.id));
      setConfirm(null);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', render: (row) => row.name_en || row.title_en || row.username || row.name || '—' },
    { key: 'deleted_at', label: 'Deleted', render: (row) => {
      const date = row.deleted_at || row.deletedAt;
      return date ? new Date(date).toLocaleString() : '—';
    } },
  ];

  return (
    <section className="admin-page">
      <header className="admin-page-header"><div><span className="admin-eyebrow">Administration</span><h1>Recycle bin</h1><p>Restore or permanently remove deleted records.</p></div></header>
      <div className="admin-toolbar">
        <div className="admin-recycle-tabs" role="tablist" aria-label="Deleted resource type">
          {RESOURCES.map((resource) => <button
            key={resource}
            id={`recycle-tab-${resource}`}
            className={resource === tab ? 'admin-button primary' : 'admin-button secondary'}
            type="button"
            role="tab"
            aria-selected={resource === tab}
            aria-controls="recycle-records"
            onClick={() => setTab(resource)}
          >{RESOURCE_LABELS[resource]}</button>)}
        </div>
        <span className="admin-result-count">{rows.length} deleted</span>
      </div>

      {error && <InfoBanner tone="error">{error}</InfoBanner>}
      <div id="recycle-records" role="tabpanel" aria-labelledby={`recycle-tab-${tab}`}>
      <DataTable columns={columns} rows={rows} loading={loading} emptyMessage="No deleted records." renderActions={(row) => (
        <>
          <button className="admin-table-action" type="button" onClick={() => restore(row)}>Restore</button>
          <button className="admin-table-action danger-text" type="button" onClick={() => setConfirm({ row })}>Delete forever</button>
        </>
      )} />
      </div>

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Permanently delete record?"
        message={`This permanently deletes record #${confirm?.row?.id} from ${RESOURCE_LABELS[tab]}. This cannot be undone.`}
        confirmLabel="Delete permanently"
        requiredText="DELETE"
        busy={deleting}
        onCancel={() => !deleting && setConfirm(null)}
        onConfirm={permanentDelete}
      />
    </section>
  );
}

export default AdminRecycleBin;
