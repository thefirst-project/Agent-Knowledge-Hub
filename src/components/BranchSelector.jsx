import { useState } from 'react';
import { useBranchContext } from '../context/BranchContext';

function BranchSelector({ language = 'english' }) {
  const { branches, selectedBranch, setSelectedBranch, loading, error } = useBranchContext();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isArabic = language === 'arabic';
  const branchLabel = selectedBranch
    ? `${isArabic ? selectedBranch.nameAr : selectedBranch.name} — ${isArabic ? selectedBranch.locationAr : selectedBranch.location}`
    : loading
      ? (isArabic ? 'جارٍ تحميل المراكز...' : 'Loading centers...')
      : (isArabic ? 'تعذر تحميل المراكز' : 'Centers unavailable');

  const copyLocation = async () => {
    if (!selectedBranch) return;
    try {
      await navigator.clipboard.writeText(isArabic ? selectedBranch.copyTextAr : selectedBranch.copyText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="branch-selector-wrap">
      <button className="branch-selector-trigger" type="button" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen} disabled={loading || branches.length === 0}>
        <span className="branch-pin" aria-hidden="true">⌖</span>
        <span className="branch-selected-label" dir={isArabic ? 'rtl' : 'ltr'}>{branchLabel}</span>
        <span aria-hidden="true">⌄</span>
      </button>
      {error && <span role="alert">{isArabic ? 'تعذر تحميل المراكز.' : 'Unable to load centers.'}</span>}
      {isOpen && selectedBranch && (
        <div className="branch-menu" role="listbox" aria-label="Select branch">
          {branches.map((branch) => {
            const label = `${isArabic ? branch.nameAr : branch.name} — ${isArabic ? branch.locationAr : branch.location}`;
            return <button className={branch.id === selectedBranch.id ? 'branch-option selected' : 'branch-option'} type="button" role="option" aria-selected={branch.id === selectedBranch.id} key={branch.id} onClick={() => { setSelectedBranch(branch.id); setIsOpen(false); }} dir={isArabic ? 'rtl' : 'ltr'}>{label}</button>;
          })}
        </div>
      )}
      <button className="copy-location-button" type="button" onClick={copyLocation} disabled={!selectedBranch}>{copied ? '✓ Copied' : 'Copy Location'}</button>
    </div>
  );
}

export default BranchSelector;
