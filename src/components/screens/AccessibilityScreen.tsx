import { useApp, FontSize } from '../../context/AppContext';
import './AccessibilityScreen.css';

export const AccessibilityScreen = () => {
  const {
    goToMenu,
    highContrastMode,
    fontSize,
    toggleHighContrast,
    setFontSize
  } = useApp();

  const fontSizeOptions: { value: FontSize; label: string; description: string }[] = [
    { value: 'small', label: 'Small', description: 'Compact text size' },
    { value: 'medium', label: 'Medium', description: 'Default text size' },
    { value: 'large', label: 'Large', description: 'Larger text for better readability' },
    { value: 'extra-large', label: 'Extra Large', description: 'Maximum text size' },
  ];

  return (
    <div className="accessibility-screen">
      <header className="accessibility-header">
        <button
          className="back-button"
          onClick={goToMenu}
          aria-label="Return to main menu"
        >
          ← Back
        </button>
        <h2>Accessibility Settings</h2>
      </header>

      <div className="accessibility-content">
        <section className="accessibility-section">
          <h3>Visual Settings</h3>
          <p className="section-description">
            Customize the visual appearance for better visibility and comfort
          </p>

          {/* High Contrast Mode */}
          <div className="setting-item">
            <div className="setting-header">
              <label htmlFor="high-contrast-toggle" className="setting-label">
                High Contrast Mode
              </label>
              <button
                id="high-contrast-toggle"
                className={`toggle-button ${highContrastMode ? 'active' : ''}`}
                onClick={toggleHighContrast}
                aria-pressed={highContrastMode}
                aria-label={`High contrast mode is ${highContrastMode ? 'enabled' : 'disabled'}. Click to ${highContrastMode ? 'disable' : 'enable'}.`}
              >
                <span className="toggle-slider"></span>
              </button>
            </div>
            <p className="setting-description">
              Enhances color contrast for improved visibility. Recommended for users with low vision or color blindness.
            </p>
          </div>

          {/* Font Size */}
          <div className="setting-item">
            <div className="setting-header">
              <label className="setting-label">Text Size</label>
            </div>
            <p className="setting-description">
              Adjust the text size throughout the application
            </p>
            <div
              className="font-size-options"
              role="radiogroup"
              aria-label="Text size options"
            >
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  className={`font-size-option ${fontSize === option.value ? 'selected' : ''}`}
                  onClick={() => setFontSize(option.value)}
                  role="radio"
                  aria-checked={fontSize === option.value}
                  aria-label={`${option.label}: ${option.description}`}
                >
                  <span className="option-label">{option.label}</span>
                  <span className="option-description">{option.description}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="accessibility-section">
          <h3>Keyboard Navigation</h3>
          <div className="keyboard-info">
            <p>This application supports full keyboard navigation:</p>
            <ul className="keyboard-shortcuts">
              <li>
                <kbd>Tab</kbd> - Navigate between interactive elements
              </li>
              <li>
                <kbd>Enter</kbd> or <kbd>Space</kbd> - Activate buttons and controls
              </li>
              <li>
                <kbd>Esc</kbd> - Close dialogs or return to previous screen
              </li>
            </ul>
          </div>
        </section>

        <section className="accessibility-section">
          <h3>Screen Reader Support</h3>
          <div className="screen-reader-info">
            <p>
              This application includes ARIA labels and semantic HTML for compatibility
              with screen readers like NVDA, JAWS, and VoiceOver.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};