import { useEffect, useState } from 'react';
import { cloneElement } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useBranchContext } from '../context/BranchContext';

function MainLayout({ children, currentPath, onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState('english');
  const { selectedBranchId } = useBranchContext();

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
          onLanguageChange={setLanguage}
          onNavigate={() => setSidebarOpen(false)}
        />
      </div>
      <div className="main-column">
        <Header language={language} selectedBranchId={selectedBranchId} onMenuToggle={() => setSidebarOpen((isOpen) => !isOpen)} />
        <main className="main-content">{cloneElement(children, { language })}</main>
      </div>
    </div>
  );
}

export default MainLayout;
