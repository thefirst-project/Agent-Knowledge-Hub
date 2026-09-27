import { useState } from 'react';
import { branches } from '../data/branches';

function BranchSelector({ language = 'english', selectedBranchId: controlledBranchId, onBranchChange }) {
  const [internalBranchId, setInternalBranchId] = useState(branches[0].id);
  const selectedBranchId = controlledBranchId || internalBranchId;
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const selectedBranch = branches.find((branch) => branch.id === selectedBranchId) || branches[0];
  const isArabic = language === 'arabic';
  const branchLabel = `${isArabic ? selectedBranch.nameAr : selectedBranch.name} — ${isArabic ? selectedBranch.locationAr : selectedBranch.location}`;

  const copyLocation = async () => {
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
      <button className="branch-selector-trigger" type="button" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen}>
        <span className="branch-pin" aria-hidden="true">⌖</span>
        <span className="branch-selected-label" dir={isArabic ? 'rtl' : 'ltr'}>{branchLabel}</span>
        <span aria-hidden="true">⌄</span>
      </button>
      {isOpen && (
        <div className="branch-menu" role="listbox" aria-label="Select branch">
          {branches.map((branch) => {
            const label = `${isArabic ? branch.nameAr : branch.name} — ${isArabic ? branch.locationAr : branch.location}`;
            return <button className={branch.id === selectedBranch.id ? 'branch-option selected' : 'branch-option'} type="button" role="option" aria-selected={branch.id === selectedBranch.id} key={branch.id} onClick={() => { setInternalBranchId(branch.id); onBranchChange?.(branch.id); setIsOpen(false); }} dir={isArabic ? 'rtl' : 'ltr'}>{label}</button>;
          })}
        </div>
      )}
      <button className="copy-location-button" type="button" onClick={copyLocation}>{copied ? '✓ Copied' : 'Copy Location'}</button>
    </div>
  );
}

export default BranchSelector;
