import { useEffect, useRef, useState } from 'react';
import { searchKnowledge } from '../data/searchableKnowledge';

function GlobalSearch({ language = 'english', selectedBranchId }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const results = searchKnowledge(query, selectedBranchId).slice(0, 8);

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
          {results.length > 0 ? results.map((result) => (
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
