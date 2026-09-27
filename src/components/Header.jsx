import GlobalSearch from './GlobalSearch';

function Header({ language, selectedBranchId, onLanguageChange, onMenuToggle }) {
  return (
    <header className="top-header">
      <button className="menu-button" type="button" onClick={onMenuToggle} aria-label="Toggle navigation">
        ☰
      </button>
      <GlobalSearch language={language} selectedBranchId={selectedBranchId} />
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label="Notifications">♧</button>
        <div className="agent-profile">
          <div className="avatar">AM</div>
          <div className="agent-info">
            <strong>Agent workspace</strong>
            <span>Support team</span>
          </div>
          <span className="profile-chevron">⌄</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
