import PageHeader from '../components/PageHeader';
import { offers } from '../data/offers';
import { branches } from '../data/branches';

function Offers({ language = 'english', selectedBranchId }) {
  const ar = language === 'arabic';
  const selectedBranch = branches.find((branch) => branch.id === selectedBranchId) || branches[0];
  const availableOffers = offers.filter((offer) => offer.branchIds.includes(selectedBranch.id));
  return (
    <>
      <PageHeader title={ar ? 'العروض' : 'Offers'} description={ar ? 'تابع أحدث العروض والفرص المتاحة للعملاء.' : 'Keep up with the latest promotions and customer opportunities.'} language={language} />
      {availableOffers.length > 0 ? <div className="offers-grid">
        {availableOffers.map((offer) => (
          <article className={`offer-card ${offer.tone}`} key={offer.title}>
            <div className="offer-topline"><span className="offer-icon">◇</span><span className="offer-status">{ar ? 'نشط' : 'Active'}</span></div>
            <h2>{ar ? offer.titleAr : offer.title}</h2>
            <p>{ar ? offer.detailAr : offer.detail}</p>
            <div className="offer-footer"><span>{ar ? offer.expiryAr : offer.expiry}</span><a href="#/services">{ar ? 'عرض الخدمات' : 'See services'} <span aria-hidden="true">→</span></a></div>
          </article>
        ))}
      </div> : <div className="no-results" role="status"><span className="no-results-icon">◇</span><h2>{ar ? 'لا توجد عروض لهذا المركز حالياً.' : 'No offers are available for this center yet.'}</h2><p>{ar ? selectedBranch.nameAr : selectedBranch.name}</p></div>}
    </>
  );
}

export default Offers;
