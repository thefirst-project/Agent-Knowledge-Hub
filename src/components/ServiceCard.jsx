function ServiceCard({ service, language = 'english', onSelect }) {
  const ar = language === 'arabic';
  return (
    <button className="knowledge-service-card" type="button" onClick={() => onSelect(service)}>
      <span className="service-card-icon">✦</span>
      <span className="service-card-title">{ar ? service.nameAr : service.name}</span>
      <span className="service-card-ar" dir="rtl">{ar ? service.name : service.nameAr}</span>
      <span className="service-card-description">{ar ? service.shortDescriptionAr : service.shortDescription}</span>
      <span className="service-card-link">{ar ? 'فتح المعلومات' : 'Open knowledge'} <span aria-hidden="true">→</span></span>
    </button>
  );
}

export default ServiceCard;
