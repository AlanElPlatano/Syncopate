import { useApp } from '../../context/AppContext';
import './MenuScreen.css';

export const MenuScreen = () => {
  const { goToConfig } = useApp();

  return (
    <div className="menu-screen">
      <h2>Training Modes</h2>
      <div className="mode-buttons">
        <button className="mode-button" onClick={() => goToConfig('chord')}>
          Chord Type Training
        </button>
        <button className="mode-button" onClick={() => goToConfig('interval')}>
          Interval Training
        </button>
        <button className="mode-button" onClick={() => goToConfig('progression')}>
          Chord Progression Training
        </button>
      </div>
    </div>
  );
};
