import React, { useState } from 'react';
import Rules from './Rules';

const Home = ({ onStartGame }) => {
  const [viewState, setViewState] = useState('menu'); // 'menu', 'pvp-setup', 'rules'
  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');

  const handleStartPvP = () => {
    if (p1Name.trim() && p2Name.trim()) {
      onStartGame(p1Name, p2Name, 'pvp');
    }
  };

  const handleStartBot = () => {
    if (p1Name.trim()) {
      onStartGame(p1Name, 'Bot', 'bot');
    }
  };

  return (
    <div className="home-bg text-center text-white">
      <div className="container" style={{ maxWidth: '600px' }}>
        
        <h1 className="game-title-large mb-4">RONDA CARTA</h1>
        <h3 className="game-title-large mb-4">created by Mohamed Jamili</h3>
        
        {viewState === 'menu' && (
            <div className="d-flex flex-column align-items-center gap-3 animate-fade-in">
                <p className="lead fw-light mb-4 text-white opacity-75" style={{maxWidth: '550px'}}>
                  <strong className="text-warning">Ronda Carta</strong> est le jeu de cartes le plus populaire au Maroc, 
                  un jeu familial qui nous ramène à l'ancien temps. C'est un jeu amusant, simple, facile et relaxant.<br/><br/>
                  L'objectif principal est de récolter le <strong>maximum de points</strong> (cartes et bonus).<br/><br/>
                  Qui ne se souvient pas de <strong className="text-warning">Ronda</strong>, 
                  <strong className="text-warning"> Tringa</strong>, 
                  <strong className="text-info"> Missa</strong>, 
                  <strong className="text-success"> Souta</strong> et d'autres termes populaires !!
                </p>

                <div className="d-flex flex-column gap-3 w-100" style={{maxWidth: '300px'}}>
                    <button className="btn-custom-home btn-pvp" onClick={() => setViewState('pvp-setup')}>
                        Jouer à Deux (PvP)
                    </button>
                    <button className="btn-custom-home btn-bot" onClick={() => setViewState('bot-setup')}>
                         Jouer vs Bot (Solo)
                    </button>
                    <button className="btn btn-link text-white opacity-75 border-top pt-2" 
                            onClick={() => setViewState('rules')}
                            style={{textDecoration: 'none', fontSize: '0.95rem'}}>
                      📖 Règles du jeu
                    </button>
                </div>
            </div>
        )}

        {viewState === 'rules' && (
          <Rules onBack={() => setViewState('menu')} />
        )}

        {viewState === 'pvp-setup' && (
            <div className="card bg-dark bg-opacity-75 p-4 rounded-4 shadow-lg border-warning animate-fade-in">
                <h3 className="mb-4 text-warning">Configuration PvP</h3>
                <div className="d-flex flex-column gap-3">
                  <input 
                    type="text" 
                    className="form-control form-control-lg text-center" 
                    placeholder="Nom Joueur 1" 
                    value={p1Name}
                    onChange={(e) => setP1Name(e.target.value)}
                    autoFocus
                  />
                  <div className="text-white opacity-50 fs-4">VS</div>
                  <input 
                    type="text" 
                    className="form-control form-control-lg text-center" 
                    placeholder="Nom Joueur 2" 
                    value={p2Name}
                    onChange={(e) => setP2Name(e.target.value)}
                  />
                </div>
                
                <div className="d-flex gap-2 justify-content-center mt-4">
                    <button className="btn btn-secondary px-4 rounded-pill" onClick={() => setViewState('menu')}>Retour</button>
                    <button 
                        className="btn btn-warning px-4 rounded-pill fw-bold" 
                        onClick={handleStartPvP}
                        disabled={!p1Name.trim() || !p2Name.trim()}
                    >
                        Commencer
                    </button>
                </div>
            </div>
        )}

        {viewState === 'bot-setup' && (
            <div className="card bg-dark bg-opacity-75 p-4 rounded-4 shadow-lg border-danger animate-fade-in">
                <h3 className="mb-4 text-danger">Configuration Solo</h3>
                <div className="d-flex flex-column gap-3">
                  <input 
                    type="text" 
                    className="form-control form-control-lg text-center" 
                    placeholder="Votre Nom" 
                    value={p1Name}
                    onChange={(e) => setP1Name(e.target.value)}
                    autoFocus
                  />
                </div>
                
                <div className="d-flex gap-2 justify-content-center mt-4">
                    <button className="btn btn-secondary px-4 rounded-pill" onClick={() => setViewState('menu')}>Retour</button>
                    <button 
                        className="btn btn-danger px-4 rounded-pill fw-bold" 
                        onClick={handleStartBot}
                        disabled={!p1Name.trim()}
                    >
                        JOUER
                    </button>
                </div>
            </div>
        )}

        <div className="mt-5 opacity-50 small">
            © 2026 Ronda Maroc - Ambiance Traditionnelle
        </div>

      </div>
    </div>
  );
};

export default Home;
