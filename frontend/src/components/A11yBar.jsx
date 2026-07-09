import { useState, useEffect } from 'react';
import './A11yBar.css';

export default function A11yBar() {
  const [fontSize, setFontSize] = useState('normal'); // 'decrease', 'normal', 'increase'
  const [spacing, setSpacing] = useState('normal'); // 'normal', 'wide'
  const [theme, setTheme] = useState('light'); // 'light', 'dark'
  
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Sync state to HTML document classes
  useEffect(() => {
    const html = document.documentElement;
    
    // Font Size
    html.classList.remove('font-dec', 'font-inc');
    if (fontSize === 'decrease') html.classList.add('font-dec');
    if (fontSize === 'increase') html.classList.add('font-inc');

    // Spacing
    html.classList.remove('wide-spacing');
    if (spacing === 'wide') html.classList.add('wide-spacing');

    // Theme
    html.classList.remove('dark-theme');
    if (theme === 'dark') html.classList.add('dark-theme');
    
  }, [fontSize, spacing, theme]);

  // Text-to-Speech functionality
  const handleRead = () => {
    if (!('speechSynthesis' in window)) {
      alert("Sorry, your browser doesn't support text to speech!");
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    if (isReading) return;

    // Get the main content text
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    // Create a new utterance
    const textToRead = mainContent.innerText || mainContent.textContent;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
    };
    
    utterance.onerror = () => {
      setIsReading(false);
      setIsPaused(false);
    };

    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
  };

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div id="a11y-bar" role="toolbar" aria-label="Accessibility Controls">
      <span className="ab-label" aria-hidden="true">Font Size</span>
      <div className="ab-group" role="group" aria-label="Font size">
        <button className={`ab-btn ${fontSize === 'decrease' ? 'on' : ''}`} onClick={() => setFontSize('decrease')} aria-label="Decrease font size" title="A-">A-</button>
        <button className={`ab-btn ${fontSize === 'normal' ? 'on' : ''}`} onClick={() => setFontSize('normal')} aria-label="Reset font size" title="A">A</button>
        <button className={`ab-btn ${fontSize === 'increase' ? 'on' : ''}`} onClick={() => setFontSize('increase')} aria-label="Increase font size" title="A+">A+</button>
      </div>

      <div className="ab-sep" aria-hidden="true"></div>

      <span className="ab-label" aria-hidden="true">Spacing</span>
      <div className="ab-group" role="group" aria-label="Line spacing">
        <button className={`ab-btn ${spacing === 'normal' ? 'on' : ''}`} onClick={() => setSpacing('normal')} aria-label="Normal spacing">Normal</button>
        <button className={`ab-btn ${spacing === 'wide' ? 'on' : ''}`} onClick={() => setSpacing('wide')} aria-label="Wide spacing">Wide</button>
      </div>

      <div className="ab-sep" aria-hidden="true"></div>

      <span className="ab-label" aria-hidden="true">Theme</span>
      <div className="ab-group" role="group" aria-label="Colour theme">
        <button className={`ab-btn ${theme === 'light' ? 'theme-active' : ''}`} onClick={() => setTheme('light')} aria-label="Light theme">☀ Light</button>
        <button className={`ab-btn ${theme === 'dark' ? 'theme-active' : ''}`} onClick={() => setTheme('dark')} aria-label="Dark theme">☾ Dark</button>
      </div>

      <div className="ab-sep" aria-hidden="true"></div>

      <div className="ab-group" style={{ marginLeft: 'auto' }}>
        {!isReading && !isPaused && (
          <button className="ab-btn" onClick={handleRead} aria-label="Read aloud">▶ Read</button>
        )}
        {isReading && !isPaused && (
          <button className="ab-btn" onClick={handlePause} aria-label="Pause reading">⏸ Pause</button>
        )}
        {isPaused && (
          <button className="ab-btn" onClick={handleRead} aria-label="Resume reading">▶ Resume</button>
        )}
        {(isReading || isPaused) && (
          <button className="ab-btn" onClick={handleStop} aria-label="Stop reading">⏹ Stop</button>
        )}
      </div>
    </div>
  );
}
