import { useEffect, useState } from 'react';
import { cloneElement } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { branches } from '../data/branches';

function MainLayout({ children, currentPath, onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState('english');
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0].id);

  useEffect(() => {
    setSidebarOpen(false);
  }, [currentPath]);

  return (
    <div className="app-shell" dir={language === 'arabic' ? 'rtl' : 'ltr'}>
      <div className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`} onClick={() => setSidebarOpen(false)} />
      <div className={`sidebar-container${sidebarOpen ? ' open' : ''}`}>
        <Sidebar
          currentPath={currentPath}
          language={language}
          selectedBranchId={selectedBranchId}
          onBranchChange={setSelectedBranchId}
          onLanguageChange={setLanguage}
          onNavigate={() => setSidebarOpen(false)}
        />
      </div>
      <div className="main-column">
        <Header language={language} selectedBranchId={selectedBranchId} onLanguageChange={setLanguage} onMenuToggle={() => setSidebarOpen((isOpen) => !isOpen)} />
        <main className="main-content">{cloneElement(children, { language, selectedBranchId })}</main>
      </div>
    </div>
  );
}

export default MainLayout;
