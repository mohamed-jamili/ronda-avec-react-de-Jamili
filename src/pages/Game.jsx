import React, { useEffect } from 'react';
import useRondaGame from '../hooks/useRondaGame';
import Card from '../components/Card';

const Game = ({ playerNames, gameMode, onExit }) => {
  const {
    gameState,
    tableCards,
    player1Hand,
    player2Hand,
    scores,
    capturedCards,
    currentTurn,
    result,
    message,
    announcements,
    startGame,
    playCard
  } = useRondaGame(gameMode);

  useEffect(() => {
    startGame();
  }, [startGame]);

  const p1Name = playerNames.p1 || 'Player 1';
  const p2Name = playerNames.p2 || 'Player 2';
  const currentPlayerName = currentTurn === 'player1' ? p1Name : p2Name;

  return (
    <div className="game-page">
      <div className="game-board-container">
        
        {/* TOP BAR */}
        <div className="top-bar">
             <div className="d-flex justify-content-between align-items-center w-100 px-3">
                <button className="btn btn-exit" onClick={onExit}>Exit</button>
                <div className="game-title-small">RONDA</div>
                <div className={`badge ${gameMode === 'bot' ? 'bg-danger' : 'bg-primary'}`}>
                    {gameMode === 'bot' ? 'Solo' : 'PvP'}
                </div>
             </div>
             
             {/* SCORE PANEL */}
             <div className="d-flex justify-content-between w-100 mt-2 px-2 text-white">
                <div className={`p-2 rounded ${currentTurn === 'player2' ? 'bg-danger' : 'bg-dark bg-opacity-50'}`} style={{minWidth: '120px'}}>
                    <div className="small opacity-75">{p2Name}</div>
                    <div className="d-flex justify-content-between align-items-end">
                        <span className="small opacity-75">{capturedCards.player2.length} cards</span>
                    </div>
                </div>
                <div className={`p-2 rounded ${currentTurn === 'player1' ? 'bg-success' : 'bg-dark bg-opacity-50'}`} style={{minWidth: '120px'}}>
                    <div className="small opacity-75">{p1Name}</div>
                    <div className="d-flex justify-content-between align-items-end">
                        <span className="small opacity-75">{capturedCards.player1.length} cards</span>
                    </div>
                </div>
             </div>
        </div>

        {/* ANNOUNCEMENTS OVERLAY */}
         {announcements.length > 0 && (
            <div className="announcements-container">
                {announcements.slice(-3).map((ann, idx) => (
                    <div key={ann.id || idx} className="announcement-toast fade-in">
                        {ann.type} ({ann.player === 'player1' ? p1Name : p2Name})
                    </div>
                ))}
            </div>
         )}

        {/* PLAYER 2 HAND (Top) */}
        <div className="hand-section top-hand">
            <div className="hand-container">
              {player2Hand.map((card, index) => (
                <Card 
                  key={`p2-${index}`} 
                  card={card}
                  // Hide if Bot Mode
                  isFaceDown={gameMode === 'bot'}
                  // Allow click only if PvP Mode & P2 Turn
                  onClick={gameMode === 'pvp' && currentTurn === 'player2' ? () => playCard(card, 'player2') : undefined}
                  isSelected={currentTurn === 'player2'}
                  isDisabled={currentTurn !== 'player2' && gameMode === 'pvp'} 
                  // In Bot Mode, P2 cards are never clickable by user
                />
              ))}
            </div>
            <div className="player-label text-warning">{p2Name}</div>
        </div>

        {/* TABLE (Center) */}
        <div className="table-section">
           <div className="table-decoration">
              <div className="turn-indicator bg-white text-dark shadow-sm">
                   {currentPlayerName}'s Turn
              </div>

              <div className="table-board">
                {tableCards.length === 0 && <span className="opacity-50">Empty Table</span>}
                {tableCards.map((card, index) => (
                  <Card key={`table-${index}`} card={card} isDisabled={true} />
                ))}
              </div>
              
              {message && <div className="game-message">{message}</div>}
           </div>
        </div>

        {/* PLAYER 1 HAND (Bottom) */}
        <div className="hand-section bottom-hand">
             <div className="player-label text-success">{p1Name}</div>
             <div className="hand-container">
               {player1Hand.map((card, index) => (
                  <Card 
                    key={`p1-${index}`}
                    card={card}
                    onClick={() => playCard(card, 'player1')}
                    isSelected={currentTurn === 'player1'}
                    isDisabled={currentTurn !== 'player1'}
                  />
               ))}
             </div>
        </div>

      </div>

      {/* WINNER MODAL */}
      {gameState === 'finished' && result && (
        <div className="modal-overlay">
          <div className="modal-content-custom">
            <h2 className="display-5 fw-bold mb-3">
                {result.winner === 'draw' ? 'Match Draw' : `Winner: ${result.winner === 'player1' ? p1Name : p2Name}`}
            </h2>
            <p className="text-muted">Game Over</p>

            <div className="scores-grid mt-4">
               <div className="score-box">
                  <span className="label">{p1Name}</span>
                  <span className="value">{scores.player1} pts</span>
                  <span className="small">{capturedCards.player1.length} cards</span>
               </div>
               <div className="score-box">
                  <span className="label">{p2Name}</span>
                  <span className="value">{scores.player2} pts</span>
                  <span className="small">{capturedCards.player2.length} cards</span>
               </div>
            </div>

            <div className="d-flex flex-column gap-2 mt-4">
               <button className="btn btn-primary rounded-pill p-3" onClick={startGame}>New Game</button> 
               <button className="btn btn-secondary rounded-pill p-3" onClick={onExit}>Main Menu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
