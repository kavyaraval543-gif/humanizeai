'use client';
import { useState } from 'react';
import styles from './page.module.css';

const MODES = [
  { id: 'light', label: 'Light touch', desc: 'Smooth out robotic phrasing, keep structure' },
  { id: 'medium', label: 'Medium', desc: 'Natural rewrites with better flow' },
  { id: 'heavy', label: 'Full rewrite', desc: 'Complete human transformation' },
];

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [copied, setCopied] = useState(false);

  async function humanize() {
    if (!input.trim()) { setStatus('Please paste some text first.'); return; }
    setLoading(true);
    setOutput('');
    setStatus('');
    try {
      const res = await fetch('/api/humanize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, mode }),
      });
      const data = await res.json();
      if (data.error) { setStatus('Error: ' + data.error); }
      else { setOutput(data.result); setStatus('done'); }
    } catch {
      setStatus('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function clear() {
    setInput(''); setOutput(''); setStatus('');
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.logo}>Humanize<span>AI</span></h1>
          <p className={styles.tagline}>Paste AI-generated text — get back human-sounding writing instantly</p>
        </header>

        <div className={styles.modeRow}>
          <span className={styles.modeLabel}>Intensity</span>
          <div className={styles.chips}>
            {MODES.map(m => (
              <button
                key={m.id}
                className={`${styles.chip} ${mode === m.id ? styles.chipActive : ''}`}
                onClick={() => setMode(m.id)}
                title={m.desc}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.cols}>
          <div className={styles.panel}>
            <div className={styles.panelLabel}>AI text input</div>
            <textarea
              className={styles.textarea}
              placeholder="Paste your AI-generated text here..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <div className={styles.panelFooter}>
              <span className={styles.wc}>{wordCount(input)} words</span>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelLabel}>Humanized output</div>
            <textarea
              className={styles.textarea}
              placeholder="Your human-sounding text will appear here..."
              value={output}
              readOnly
            />
            <div className={styles.panelFooter}>
              <span className={styles.wc}>{wordCount(output)} words</span>
              {output && (
                <button className={styles.copyBtn} onClick={copyOutput}>
                  {copied ? 'Copied!' : 'Copy text'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={styles.btnRow}>
          <button className={styles.mainBtn} onClick={humanize} disabled={loading}>
            {loading ? 'Humanizing...' : 'Humanize it ✦'}
          </button>
          <button className={styles.clearBtn} onClick={clear}>Clear</button>
        </div>

        {status && status !== 'done' && (
          <p className={`${styles.status} ${status.startsWith('Error') ? styles.statusErr : ''}`}>
            {status}
          </p>
        )}
        {status === 'done' && (
          <p className={styles.statusOk}>Done! Your text has been humanized.</p>
        )}

        <footer className={styles.footer}>
          Powered by Claude AI · Built with Next.js
        </footer>
      </div>
    </main>
  );
}
