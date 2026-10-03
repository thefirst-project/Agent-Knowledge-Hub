import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';
import { DataTable, InfoBanner } from '../../components/admin/AdminComponents';
import { useToast } from '../../components/admin/Toast';
import { useAuth } from '../../context/AuthContext';
import { AdminResourcePage } from './AdminResourcePage';

function AdminDashboard() {
  const { isSuperAdmin } = useAuth();
  const showToast = useToast();
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadOverview() {
      try {
        const branches = await apiFetch('/api/branches');
        const requests = [
          ['services', apiFetch('/api/services')],
          ['offers', apiFetch('/api/offers')],
          ['prices', apiFetch('/api/prices')],
          ['quickReplies', apiFetch('/api/quick-replies')],
          ['call-flows', apiFetch('/api/call-flows')],
          ['media', apiFetch('/api/media')],
          ...(isSuperAdmin ? [['users', apiFetch('/api/users')]] : []),
          ['audit', apiFetch('/api/audit')],
        ];
        const results = await Promise.allSettled(requests.map(([, request]) => request));
        if (!active) return;

        const map = { branches };
        const failures = [];
        results.forEach((result, index) => {
          const [key] = requests[index];
          if (result.status === 'rejected') {
            failures.push(`${key}: ${result.reason.message}`);
            map[key] = null;
            return;
          }
          map[key] = result.value;
        });
        setSummary(map);

        const audit = Array.isArray(map.audit) ? map.audit : [];
        setEvents(audit
          .slice()
          .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime())
          .slice(0, 10));
        if (failures.length) {
          const message = `Some overview data could not be loaded: ${failures.join('; ')}`;
          setError(message);
          showToast(message, 'error');
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
          showToast(`Admin overview could not load: ${loadError.message}`, 'error');
        }
      }
    }
    loadOverview();
    return () => { active = false; };
  }, [isSuperAdmin, showToast]);

  const metrics = [
    ['Branches', summary?.branches?.length],
    ['Services', summary?.services?.length],
    ['Offers', summary?.offers?.length],
    ['Prices', summary?.prices?.length],
    ['Quick replies', summary?.quickReplies?.length],
    ['Call flows', summary?.['call-flows']?.length],
    ['Media', summary?.media?.length],
    ...(isSuperAdmin ? [['Users', summary?.users?.length]] : []),
  ];

  const auditColumns = [
    { key: 'timestamp', label: 'Time', render: (row) => row.timestamp ? new Date(row.timestamp).toLocaleString() : '—' },
    { key: 'table_name', label: 'Table' },
    { key: 'action', label: 'Action' },
    { key: 'record_id', label: 'Record ID' },
    { key: 'record_name', label: 'Record name' },
  ];

  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <div><span className="admin-eyebrow">Knowledge Hub</span><h1>Admin overview</h1><p>Manage the content and reference data used across the workspace.</p></div>
      </header>
      {error && <InfoBanner tone="error" title="Overview unavailable">{error}</InfoBanner>}
      <div className="admin-metric-grid">
        {metrics.map(([label, value]) => <article className="admin-metric-card" key={label}>
          <span>{label}</span><strong>{value == null ? '—' : value}</strong><a href={`#/admin/${label.toLocaleLowerCase().replaceAll(' ', '-')}`}>Manage {label.toLocaleLowerCase()} →</a>
        </article>)}
      </div>

      <InfoBanner title="Recent admin activity">The latest 10 audit events are shown below.</InfoBanner>
      <DataTable columns={auditColumns} rows={events} loading={summary == null && !error} emptyMessage="No audit events found." />
    </section>
  );
}

function AdminAuditLog() {
  const showToast = useToast();
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    apiFetch('/api/audit')
      .then((data) => { if (active) setEvents(Array.isArray(data) ? data : []); })
      .catch((loadError) => {
        if (active) {
          setError(loadError.message);
          showToast(`Audit log could not load: ${loadError.message}`, 'error');
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [showToast]);

  const records = events.filter((event) => JSON.stringify(event).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const columns = [
    { key: 'timestamp', label: 'Time', render: (row) => row.timestamp ? new Date(row.timestamp).toLocaleString() : '—' },
    { key: 'table_name', label: 'Table' },
    { key: 'action', label: 'Action' },
    { key: 'record_id', label: 'Record ID' },
    { key: 'record_name', label: 'Record name' },
  ];

  return (
    <section className="admin-page">
      <header className="admin-page-header"><div><span className="admin-eyebrow">Governance</span><h1>Audit log</h1><p>Review administrative changes and recent activity.</p></div></header>
      {error && <InfoBanner tone="error" title="Audit log unavailable">{error}</InfoBanner>}
      <div className="admin-toolbar">
        <label className="admin-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search activity…" aria-label="Search audit log" /></label>
        <span className="admin-result-count">{records.length} event{records.length === 1 ? '' : 's'}</span>
      </div>
      <DataTable columns={columns} rows={records} loading={loading} emptyMessage="No audit activity found." />
    </section>
  );
}

export { AdminDashboard, AdminAuditLog };
export const AdminBranches = () => <AdminResourcePage resource="branches" />;
export const AdminServices = () => <AdminResourcePage resource="services" />;
export const AdminOffers = () => <AdminResourcePage resource="offers" />;
export const AdminPrices = () => <AdminResourcePage resource="prices" />;
export const AdminQuickReplies = () => <AdminResourcePage resource="quick-replies" />;
export const AdminCallFlows = () => <AdminResourcePage resource="call-flows" />;
export const AdminMedia = () => <AdminResourcePage resource="media" />;
export const AdminUsers = () => <AdminResourcePage resource="users" />;
