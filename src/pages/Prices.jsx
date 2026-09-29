import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { normalizePrice } from '../api/normalize';
import { useBranchContext } from '../context/BranchContext';
import ApiStatus from '../components/ApiStatus';
import PageHeader from '../components/PageHeader';

function Prices({ language = 'english' }) {
  const ar = language === 'arabic';
  const { selectedBranch, selectedBranchId, loading: branchesLoading, error: branchError } = useBranchContext();
  const [availablePrices, setAvailablePrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedBranchId) {
      setAvailablePrices([]);
      setLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    setLoading(true);
    setError('');
    apiFetch(`/api/prices?branch_id=${encodeURIComponent(selectedBranchId)}`, { signal: controller.signal })
      .then((data) => setAvailablePrices(data.map(normalizePrice)))
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') setError(fetchError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [selectedBranchId]);

  const isLoading = branchesLoading || loading;
  const loadError = branchError || error;

  return (
    <>
      <PageHeader title={ar ? 'الأسعار' : 'Prices'} description={ar ? 'اعثر على معلومات أسعار دقيقة ومحدثة بسهولة.' : 'Find accurate, up-to-date pricing information at a glance.'} language={language} />
      <ApiStatus loading={isLoading} error={loadError} language={language} />
      {!(isLoading || loadError) && <>
      <div className="content-toolbar">
        <span className="result-count">{ar ? 'أسعار الخدمات القياسية' : 'Standard service pricing'} · {selectedBranch ? (ar ? selectedBranch.nameAr : selectedBranch.name) : ''}</span>
        <a className="text-button" href="#/services">{ar ? 'تصفح الخدمات' : 'Browse services'} <span aria-hidden="true">→</span></a>
      </div>
      {availablePrices.length > 0 ? <div className="price-table-wrap">
        <table className="price-table">
          <thead><tr><th>{ar ? 'الخدمة' : 'Service'}</th><th>{ar ? 'المدة المعتادة' : 'Typical duration'}</th><th>{ar ? 'السعر الابتدائي' : 'Starting price'}</th><th aria-label="Action" /></tr></thead>
          <tbody>{availablePrices.map((item) => <tr key={item.service}><td><strong>{ar ? item.serviceAr : item.service}</strong></td><td>{ar ? item.durationAr : item.duration}</td><td><strong>{item.price}</strong></td><td><a className="table-link" href="#/services">{ar ? 'التفاصيل' : 'Details'} <span aria-hidden="true">→</span></a></td></tr>)}</tbody>
        </table>
      </div> : <div className="no-results" role="status"><span className="no-results-icon">▤</span><h2>{ar ? 'لا توجد أسعار لهذا المركز حالياً.' : 'No prices are available for this center yet.'}</h2><p>{selectedBranch ? (ar ? selectedBranch.nameAr : selectedBranch.name) : ''}</p></div>}
      </>}
    </>
  );
}

export default Prices;
