import { useEffect, useState } from 'react';
import MainLayout from './layouts/MainLayout';
import CallFlowPage from './pages/CallFlowPage';
import Dashboard from './pages/Dashboard';
import Offers from './pages/Offers';
import Prices from './pages/Prices';
import QuickReplies from './pages/QuickReplies';
import Services from './pages/Services';
import './styles.css';

const pages = {
  '#/': Dashboard,
  '#/services': Services,
  '#/offers': Offers,
  '#/prices': Prices,
  '#/quick-replies': QuickReplies,
  '#/call-flow': CallFlowPage,
};

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setCurrentPath(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const route = currentPath.split('?')[0];
  const Page = pages[route] || Dashboard;
  return <MainLayout currentPath={currentPath} onNavigate={() => setCurrentPath(window.location.hash || '#/')}><Page /></MainLayout>;
}

export default App;
