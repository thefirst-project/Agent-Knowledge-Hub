import { useState } from 'react';

function CopyButton({ text, label }) {
  const [status, setStatus] = useState('');

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Copied!');
      window.setTimeout(() => setStatus(''), 1800);
    } catch {
      setStatus('Copy failed');
    }
  };

  return <button className="copy-button" type="button" onClick={copyText}>{status || label}</button>;
}

export default CopyButton;
