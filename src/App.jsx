import React, { useState } from 'react';
import Home from './pages/Home';
import Game from './pages/Game';

const App = () => {
  const [view, setView] = useState('home'); 
  const [gameMode, setGameMode] = useState('pvp'); 
  const [playerNames, setPlayerNames] = useState({ p1: '', p2: '' });

  const handleStartGame = (p1, p2, mode) => {
    setPlayerNames({ p1, p2 });
    setGameMode(mode);
    setView('game');
  };

  const handleExit = () => {
    setView('home');
    setPlayerNames({ p1: '', p2: '' });
  };

  return (
    <>
      {view === 'home' && <Home onStartGame={handleStartGame} />}
      {view === 'game' && <Game playerNames={playerNames} gameMode={gameMode} onExit={handleExit} />}
    </>
  );
};

export default App;
