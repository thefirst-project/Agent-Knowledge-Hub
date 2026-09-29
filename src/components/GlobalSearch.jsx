import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../api/client';

function GlobalSearch({ language = 'english', selectedBranchId }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery || !selectedBranchId) {
      setResults([]);
      setLoading(false);
      setError('');
      return undefined;
    }

    const controller = new AbortController();
    const branchFilter = `branch_id=${encodeURIComponent(selectedBranchId)}`;
    setLoading(true);
    setError('');

    Promise.all([
      apiFetch(`/api/services?${branchFilter}`, { signal: controller.signal }),
      apiFetch(`/api/offers?${branchFilter}`, { signal: controller.signal }),
      apiFetch(`/api/prices?${branchFilter}`, { signal: controller.signal }),
    ])
      .then(([services, offers, prices]) => {
        const serviceResults = services.map((service) => {
          const details = service.details || {};
          const title = service.name_en || '';
          const arabicTitle = service.name_ar || '';
          const description = details.shortDescription || service.description_en || '';
          const searchText = [
            title,
            arabicTitle,
            description,
            service.description_ar,
            ...Object.values(details).flatMap((value) => (
              Array.isArray(value)
                ? value.flatMap((item) => (typeof item === 'object' ? Object.values(item) : [item]))
                : [value]
            )),
          ].filter((value) => typeof value === 'string').join(' ').toLocaleLowerCase();
          return {
            type: 'Service',
            title,
            description,
            arabicTitle,
            path: `#/services?service=${service.id}`,
            searchText,
          };
        });
        const offerResults = offers.map((offer) => ({
          type: 'Offer',
          title: offer.title_en || '',
          description: offer.description_en || '',
          arabicTitle: offer.title_ar || '',
          path: '#/offers',
          searchText: [offer.title_en, offer.title_ar, offer.description_en, offer.description_ar]
            .filter(Boolean).join(' ').toLocaleLowerCase(),
        }));
        const priceResults = prices.map((price) => ({
          type: 'Price',
          title: price.service_name_en || '',
          description: `${price.currency || 'AED'} ${price.price}`,
          arabicTitle: price.service_name_ar || '',
          path: '#/prices',
          searchText: [price.service_name_en, price.service_name_ar, price.price, price.currency]
            .filter(Boolean).join(' ').toLocaleLowerCase(),
        }));
        setResults([...serviceResults, ...offerResults, ...priceResults]
          .filter((result) => result.searchText.includes(normalizedQuery))
          .slice(0, 8));
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') setError(fetchError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [query, selectedBranchId]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!searchRef.current?.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    const focusSearch = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('keydown', focusSearch);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('keydown', focusSearch);
    };
  }, []);

  const handleResultClick = (path) => {
    setQuery('');
    setIsOpen(false);
    window.location.hash = path.slice(1);
  };

  return (
    <div className="global-search" ref={searchRef}>
      <div className="global-search-input">
        <span aria-hidden="true">⌕</span>
        <input
          aria-expanded={isOpen}
          aria-label="Search the entire knowledge hub"
          placeholder={language === 'arabic' ? 'ابحث في قاعدة المعرفة...' : 'Search the knowledge hub...'}
          ref={inputRef}
          type="search"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => { setQuery(event.target.value); setIsOpen(true); }}
        />
        {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear global search">×</button>}
        <kbd>⌘ K</kbd>
      </div>
      {isOpen && query.trim() && (
        <div className="global-search-results" role="listbox">
          {loading ? <div className="global-no-results" role="status">Loading...</div>
            : error ? <div className="global-no-results" role="alert">Unable to search the knowledge hub.</div>
              : results.length > 0 ? results.map((result) => (
            <button className="global-result" type="button" key={`${result.type}-${result.path}-${result.title}`} onClick={() => handleResultClick(result.path)}>
              <span className={`result-type ${result.type.toLowerCase()}`}>{result.type}</span>
              <span className="result-content"><strong>{result.title}</strong><span>{result.description}</span>{result.arabicTitle && <b dir="rtl">{result.arabicTitle}</b>}</span>
              <span className="result-arrow" aria-hidden="true">→</span>
            </button>
          )) : <div className="global-no-results">No results found</div>}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;
