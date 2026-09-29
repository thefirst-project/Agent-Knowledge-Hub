import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../api/client';
import { normalizeBranch } from '../api/normalize';

const BranchContext = createContext(null);

export function BranchProvider({ children }) {
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadBranches() {
      setLoading(true);
      setError('');
      try {
        const data = await apiFetch('/api/branches', { signal: controller.signal });
        const activeBranches = data.map(normalizeBranch).filter((branch) => branch.is_active !== false);
        setBranches(data.map(normalizeBranch));
        setSelectedBranchId((currentId) => (
          activeBranches.some((branch) => branch.id === currentId)
            ? currentId
            : activeBranches[0]?.id ?? null
        ));
      } catch (loadError) {
        if (loadError.name !== 'AbortError') setError(loadError.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadBranches();
    return () => controller.abort();
  }, []);

  const setSelectedBranch = useCallback((branchOrId) => {
    const branchId = typeof branchOrId === 'object' && branchOrId !== null
      ? branchOrId.id
      : branchOrId;
    if (branches.some((branch) => branch.id === branchId && branch.is_active !== false)) {
      setSelectedBranchId(branchId);
    }
  }, [branches]);

  const selectedBranch = branches.find((branch) => branch.id === selectedBranchId) || null;
  const value = useMemo(() => ({
    branches,
    selectedBranch,
    selectedBranchId,
    setSelectedBranch,
    loading,
    error,
  }), [branches, selectedBranch, selectedBranchId, setSelectedBranch, loading, error]);

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export function useBranchContext() {
  const context = useContext(BranchContext);
  if (!context) throw new Error('useBranchContext must be used inside BranchProvider.');
  return context;
}
