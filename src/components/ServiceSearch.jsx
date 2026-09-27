function ServiceSearch({ query, language, uiLanguage = 'english', onQueryChange, onLanguageChange, onClear }) {
  return (
    <div className="service-search-panel">
      <div className="service-search-box">
        <span className="search-icon" aria-hidden="true">⌕</span>
        <input
          aria-label="Search services and patient questions"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={uiLanguage === 'arabic' ? 'ابحث في الخدمات أو أسئلة المرضى...' : 'Search services or patient questions...'}
        />
        {query && <button className="clear-search" type="button" onClick={onClear} aria-label="Clear search">×</button>}
      </div>
      <div className="language-filter" role="group" aria-label="Search language">
        {[
          { value: 'all', label: 'All' },
          { value: 'english', label: 'English' },
          { value: 'arabic', label: 'العربية' },
        ].map((option) => (
          <button
            className={language === option.value ? 'language-option active' : 'language-option'}
            type="button"
            key={option.value}
            onClick={() => onLanguageChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ServiceSearch;
