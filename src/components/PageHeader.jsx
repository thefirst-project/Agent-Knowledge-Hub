function PageHeader({ eyebrow = 'Knowledge Hub', title, description, language = 'english' }) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <span className="updated-badge">● {language === 'arabic' ? 'محدث اليوم' : 'Updated today'}</span>
    </div>
  );
}

export default PageHeader;
