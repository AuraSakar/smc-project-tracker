import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './A11yBar.css';

export default function A11yBar() {
  const { t, i18n } = useTranslation();
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
      <span className="ab-label" aria-hidden="true">{t('Font Size')}</span>
      <div className="ab-group" role="group" aria-label="Font size">
        <button className={`ab-btn ${fontSize === 'decrease' ? 'on' : ''}`} onClick={() => setFontSize('decrease')} aria-label="Decrease font size" title="A-">A-</button>
        <button className={`ab-btn ${fontSize === 'normal' ? 'on' : ''}`} onClick={() => setFontSize('normal')} aria-label="Reset font size" title="A">A</button>
        <button className={`ab-btn ${fontSize === 'increase' ? 'on' : ''}`} onClick={() => setFontSize('increase')} aria-label="Increase font size" title="A+">A+</button>
      </div>

      <div className="ab-sep" aria-hidden="true"></div>

      <span className="ab-label" aria-hidden="true">{t('Spacing')}</span>
      <div className="ab-group" role="group" aria-label="Line spacing">
        <button className={`ab-btn ${spacing === 'normal' ? 'on' : ''}`} onClick={() => setSpacing('normal')} aria-label="Normal spacing">{t('Normal')}</button>
        <button className={`ab-btn ${spacing === 'wide' ? 'on' : ''}`} onClick={() => setSpacing('wide')} aria-label="Wide spacing">{t('Wide')}</button>
      </div>

      <div className="ab-sep" aria-hidden="true"></div>

      <span className="ab-label" aria-hidden="true">Language</span>
      <div className="ab-group" role="group" aria-label="Language switch">
        <button 
          className="ab-btn" 
          onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'mr' : 'en')}
        >
          {i18n.language === 'en' ? 'मराठी' : 'English'}
        </button>
      </div>

      <div className="ab-sep" aria-hidden="true"></div>

      <span className="ab-label" aria-hidden="true">{t('Theme')}</span>
      <div className="ab-group" role="group" aria-label="Colour theme">
        <button className={`ab-btn ${theme === 'light' ? 'theme-active' : ''}`} onClick={() => setTheme('light')} aria-label="Light theme">☀ {t('Light')}</button>
        <button className={`ab-btn ${theme === 'dark' ? 'theme-active' : ''}`} onClick={() => setTheme('dark')} aria-label="Dark theme">☾ {t('Dark')}</button>
      </div>

      <div className="ab-sep" aria-hidden="true"></div>

      <div className="ab-group" style={{ marginLeft: 'auto' }}>
        {!isReading && !isPaused && (
          <button className="ab-btn" onClick={handleRead} aria-label="Read aloud">▶ {t('Read')}</button>
        )}
        {isReading && !isPaused && (
          <button className="ab-btn" onClick={handlePause} aria-label="Pause reading">⏸ {t('Pause')}</button>
        )}
        {isPaused && (
          <button className="ab-btn" onClick={handleRead} aria-label="Resume reading">▶ {t('Resume')}</button>
        )}
        {(isReading || isPaused) && (
          <button className="ab-btn" onClick={handleStop} aria-label="Stop reading">⏹ {t('Stop')}</button>
        )}
      </div>
    </div>
  );
}
