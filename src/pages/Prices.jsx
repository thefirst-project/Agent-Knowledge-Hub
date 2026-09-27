import PageHeader from '../components/PageHeader';
import { prices } from '../data/prices';
import { branches } from '../data/branches';

function Prices({ language = 'english', selectedBranchId }) {
  const ar = language === 'arabic';
  const selectedBranch = branches.find((branch) => branch.id === selectedBranchId) || branches[0];
  const availablePrices = prices.filter((item) => item.branchIds.includes(selectedBranch.id));
  return (
    <>
      <PageHeader title={ar ? 'الأسعار' : 'Prices'} description={ar ? 'اعثر على معلومات أسعار دقيقة ومحدثة بسهولة.' : 'Find accurate, up-to-date pricing information at a glance.'} language={language} />
      <div className="content-toolbar">
        <span className="result-count">{ar ? 'أسعار الخدمات القياسية' : 'Standard service pricing'} · {ar ? selectedBranch.nameAr : selectedBranch.name}</span>
        <a className="text-button" href="#/services">{ar ? 'تصفح الخدمات' : 'Browse services'} <span aria-hidden="true">→</span></a>
      </div>
      {availablePrices.length > 0 ? <div className="price-table-wrap">
        <table className="price-table">
          <thead><tr><th>{ar ? 'الخدمة' : 'Service'}</th><th>{ar ? 'المدة المعتادة' : 'Typical duration'}</th><th>{ar ? 'السعر الابتدائي' : 'Starting price'}</th><th aria-label="Action" /></tr></thead>
          <tbody>{availablePrices.map((item) => <tr key={item.service}><td><strong>{ar ? item.serviceAr : item.service}</strong></td><td>{ar ? item.durationAr : item.duration}</td><td><strong>{item.price}</strong></td><td><a className="table-link" href="#/services">{ar ? 'التفاصيل' : 'Details'} <span aria-hidden="true">→</span></a></td></tr>)}</tbody>
        </table>
      </div> : <div className="no-results" role="status"><span className="no-results-icon">▤</span><h2>{ar ? 'لا توجد أسعار لهذا المركز حالياً.' : 'No prices are available for this center yet.'}</h2><p>{ar ? selectedBranch.nameAr : selectedBranch.name}</p></div>}
    </>
  );
}

export default Prices;
