import { ToastProvider } from '../components/admin/Toast';
import '../styles/admin.css';

const sections = [
  ['Overview', '/admin', 'dashboard'],
  ['Branches', '/admin/branches', 'branches'],
  ['Services', '/admin/services', 'services'],
  ['Quick replies', '/admin/quick-replies', 'replies'],
  ['Offers', '/admin/offers', 'offers'],
  ['Prices', '/admin/prices', 'prices'],
  ['Media', '/admin/media', 'media'],
  ['Call flows', '/admin/call-flows', 'calls'],
  ['Users', '/admin/users', 'users'],
  ['Recycle Bin', '/admin/recycle-bin', 'trash'],
  ['Audit log', '/admin/audit', 'audit'],
];

const pageTitles = Object.fromEntries(sections.map(([label, path]) => [`#${path}`, label]));

function AdminIcon({ type }) {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    branches: <><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01M10 21v-4h4v4" /></>,
    services: <><path d="m14 6 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16z" /><path d="M3 3h4M5 1v4" /></>,
    replies: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" /><path d="M8 11h8M8 15h5" /></>,
    offers: <><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r=".8" /></>,
    prices: <><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>,
    media: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>,
    calls: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.7L7.1 10a16 16 0 0 0 6 6l1.6-1.9a2 2 0 0 1 1.7-.6l3 .5a2 2 0 0 1 1.6 1.9z" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6" /></>,
    audit: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2M3 12h2M19 12h2" /></>,
  };
  return <svg aria-hidden="true" className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">{paths[type]}</svg>;
}

function AdminLayout({ children, currentPath = '#/admin' }) {
  const title = pageTitles[currentPath] || 'Admin Panel';
  return (
    <ToastProvider>
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <a className="admin-brand" href="#/admin">
            <span className="admin-brand-mark">H&amp;P</span>
            <span><strong>Admin Panel</strong><small>Knowledge Hub</small></span>
          </a>
          <nav className="admin-navigation" aria-label="Admin navigation">
            <span className="admin-nav-label">Manage</span>
            {sections.map(([label, to, icon]) => (
              <a key={to} href={`#${to}`} aria-label={label} className={`admin-nav-link${currentPath === `#${to}` ? ' active' : ''}`}>
                <AdminIcon type={icon} />
                <span>{label}</span>
              </a>
            ))}
          </nav>
          <a className="admin-back-link" href="#/"><AdminIcon type="dashboard" /><span>Back to App</span></a>
        </aside>
        <div className="admin-content-shell">
          <header className="admin-topbar">
            <h2>{title}</h2>
            <a href="#/">← Back to Agent App</a>
          </header>
          <main className="admin-main">
            <div className="admin-global-banner" role="note">
              <span aria-hidden="true">i</span>
              <p><strong>Admin Panel</strong> — changes here update the agent app instantly.</p>
            </div>
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

export default AdminLayout;
