import { useEffect, useState } from 'react';
import MainLayout from './layouts/MainLayout';
import CallFlowPage from './pages/CallFlowPage';
import Dashboard from './pages/Dashboard';
import Offers from './pages/Offers';
import Prices from './pages/Prices';
import QuickReplies from './pages/QuickReplies';
import Services from './pages/Services';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAuditLog from './pages/admin/AdminAuditLog';
import AdminBranches from './pages/admin/AdminBranches';
import AdminServices from './pages/admin/AdminServices';
import AdminOffers from './pages/admin/AdminOffers';
import AdminPrices from './pages/admin/AdminPrices';
import AdminQuickReplies from './pages/admin/AdminQuickReplies';
import AdminCallFlows from './pages/admin/AdminCallFlows';
import AdminMedia from './pages/admin/AdminMedia';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRecycleBin from './pages/admin/AdminRecycleBin';
import AdminLogin from './pages/admin/AdminLogin';
import AdminProfile from './pages/admin/AdminProfile';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { BranchProvider } from './context/BranchContext';
import { AuthProvider } from './context/AuthContext';
import './styles.css';

const pages = {
  '#/': Dashboard,
  '#/services': Services,
  '#/offers': Offers,
  '#/prices': Prices,
  '#/quick-replies': QuickReplies,
  '#/call-flow': CallFlowPage,
};

const adminPages = {
  '#/admin': AdminDashboard,
  '#/admin/dashboard': AdminDashboard,
  '#/admin/branches': AdminBranches,
  '#/admin/services': AdminServices,
  '#/admin/quick-replies': AdminQuickReplies,
  '#/admin/offers': AdminOffers,
  '#/admin/prices': AdminPrices,
  '#/admin/media': AdminMedia,
  '#/admin/call-flows': AdminCallFlows,
  '#/admin/users': AdminUsers,
  '#/admin/recycle-bin': AdminRecycleBin,
  '#/admin/audit': AdminAuditLog,
  '#/admin/profile': AdminProfile,
};

function AppRoutes() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setCurrentPath(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const route = currentPath.split('?')[0];
  const isAdminRoute = route.startsWith('#/admin');
  const Page = (isAdminRoute ? adminPages[route] : pages[route]) || Dashboard;
  if (route === '#/admin/login') return <AdminLogin />;
  if (isAdminRoute) {
    return (
      <ProtectedRoute requireSuperAdmin={route === '#/admin/users' || route === '#/admin/recycle-bin'}>
        <BranchProvider>
          <AdminLayout currentPath={route}>
            <Page />
          </AdminLayout>
        </BranchProvider>
      </ProtectedRoute>
    );
  }
  return (
    <BranchProvider>
      <MainLayout currentPath={currentPath} onNavigate={() => setCurrentPath(window.location.hash || '#/')}>
        <Page />
      </MainLayout>
    </BranchProvider>
  );
}

function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>;
}

export default App;
