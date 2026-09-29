import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { normalizeOffer } from '../api/normalize';
import { useBranchContext } from '../context/BranchContext';
import ApiStatus from '../components/ApiStatus';
import PageHeader from '../components/PageHeader';

function Offers({ language = 'english' }) {
  const ar = language === 'arabic';
  const { selectedBranch, selectedBranchId, loading: branchesLoading, error: branchError } = useBranchContext();
  const [availableOffers, setAvailableOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedBranchId) {
      setAvailableOffers([]);
      setLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    setLoading(true);
    setError('');
    apiFetch(`/api/offers?branch_id=${encodeURIComponent(selectedBranchId)}`, { signal: controller.signal })
      .then((data) => setAvailableOffers(
        data.filter((offer) => offer.is_active !== false).map(normalizeOffer),
      ))
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
      <PageHeader title={ar ? 'العروض' : 'Offers'} description={ar ? 'تابع أحدث العروض والفرص المتاحة للعملاء.' : 'Keep up with the latest promotions and customer opportunities.'} language={language} />
      <ApiStatus loading={isLoading} error={loadError} language={language} />
      {!(isLoading || loadError) && (availableOffers.length > 0 ? <div className="offers-grid">
        {availableOffers.map((offer) => (
          <article className={`offer-card ${offer.tone}`} key={offer.title}>
            <div className="offer-topline"><span className="offer-icon">◇</span><span className="offer-status">{ar ? 'نشط' : 'Active'}</span></div>
            <h2>{ar ? offer.titleAr : offer.title}</h2>
            <p>{ar ? offer.detailAr : offer.detail}</p>
            <div className="offer-footer"><span>{ar ? offer.expiryAr : offer.expiry}</span><a href="#/services">{ar ? 'عرض الخدمات' : 'See services'} <span aria-hidden="true">→</span></a></div>
          </article>
        ))}
      </div> : <div className="no-results" role="status"><span className="no-results-icon">◇</span><h2>{ar ? 'لا توجد عروض لهذا المركز حالياً.' : 'No offers are available for this center yet.'}</h2><p>{selectedBranch ? (ar ? selectedBranch.nameAr : selectedBranch.name) : ''}</p></div>)}
    </>
  );
}

export default Offers;
