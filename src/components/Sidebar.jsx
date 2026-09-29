import BranchSelector from './BranchSelector';
import { useBranchContext } from '../context/BranchContext';

function Sidebar({ currentPath, language = 'english', onLanguageChange, onNavigate }) {
  const { selectedBranch } = useBranchContext();
  const isArabic = language === 'arabic';
  const labels = isArabic
    ? { dashboard: 'لوحة التحكم', services: 'الخدمات', offers: 'العروض', prices: 'الأسعار', quickReplies: 'إجابات سريعة', callFlow: 'دليل المكالمة', workspace: 'مساحة العمل', online: 'قاعدة المعرفة متصلة', english: 'English' }
    : { dashboard: 'Dashboard', services: 'Services', offers: 'Offers', prices: 'Prices', quickReplies: 'Quick Replies', callFlow: 'Call Flow', workspace: 'Workspace', online: 'Knowledge base online', english: 'العربية' };
  const localizedItems = [
    { label: labels.dashboard, path: '#/', icon: '⌂' },
    { label: labels.services, path: '#/services', icon: '✦' },
    { label: labels.offers, path: '#/offers', icon: '◇' },
    { label: labels.prices, path: '#/prices', icon: '▤' },
    { label: labels.quickReplies, path: '#/quick-replies', icon: '☷' },
    {
      label: labels.callFlow,
      path: '#/call-flow',
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
          <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 3 5a1 1 0 0 1 1-1" />
          <path d="M15 7a2 2 0 0 1 2 2M15 3a6 6 0 0 1 6 6" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="sidebar" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="brand">
        <div className="brand-mark">H&amp;P</div>
        <div>
          <strong>{selectedBranch ? (isArabic ? selectedBranch.nameAr : selectedBranch.name) : (isArabic ? 'قاعدة المعرفة' : 'Knowledge Hub')}</strong>
          <span>{selectedBranch ? (isArabic ? selectedBranch.locationAr : selectedBranch.location) : ''}</span>
        </div>
      </div>
      <div className="sidebar-branch-selector">
        <BranchSelector language={language} />
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <span className="nav-label">{labels.workspace}</span>
        {localizedItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <a
              className={`nav-item${isActive ? ' active' : ''}`}
              href={item.path}
              key={item.path}
              onClick={onNavigate}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </a>
          );
        })}
        <span aria-hidden="true" style={{ borderTop: '1px solid #292a3e', margin: '14px 8px 8px' }} />
        <a
          className={`nav-item${currentPath === '#/admin' ? ' active' : ''}`}
          href="#/admin"
          onClick={onNavigate}
          style={{ color: currentPath === '#/admin' ? undefined : '#77798f', fontSize: '15px' }}
        >
          <span className="nav-icon" aria-hidden="true">⚙</span>
          Admin Panel
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="status-dot" />
        <span>{labels.online}</span>
      </div>
      <div className="sidebar-language" role="group" aria-label="Language">
        <span>{isArabic ? 'اللغة' : 'Language'}</span>
        <button className={!isArabic ? 'sidebar-language-option active' : 'sidebar-language-option'} type="button" onClick={() => onLanguageChange('english')}>EN</button>
        <button className={isArabic ? 'sidebar-language-option active' : 'sidebar-language-option'} type="button" onClick={() => onLanguageChange('arabic')}>{labels.english}</button>
      </div>
    </aside>
  );
}

export default Sidebar;
