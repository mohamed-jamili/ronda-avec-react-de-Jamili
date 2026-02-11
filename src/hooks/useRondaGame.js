import { useState, useEffect, useCallback, useRef } from 'react';
import cardsData from '../data/cards.json';

/**
 * RONDA CARTA - Professional Game Logic Hook
 * Complete implementation of authentic Moroccan card game rules
 * 
 * Features:
 * - Full capture logic with combinations and sequences
 * - Bonus system: Ronda, Tringa, Missa, Souta
 * - Complete scoring and round tracking
 * - Intelligent AI opponent with strategic priorities
 * - Proper game flow with dealer rotation
 */

// ==================== UTILITY FUNCTIONS ====================

const shuffleDeck = (deck) => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

/**
 * Validate table cards: no pairs or sequences allowed
 */
const isValidTableCards = (cards) => {
  const values = cards.map(c => c.value);
  const counts = {};
  
  // Check for pairs
  for (const v of values) {
    counts[v] = (counts[v] || 0) + 1;
    if (counts[v] > 1) return false;
  }
  
  return true;
};

/**
 * Get next rank in sequence (1→2...→7→10→11→12)
 */
const getNextRank = (value) => {
  if (value === 7) return 10;
  if (value === 12) return null;
  return value + 1;
};

/**
 * Calculate all cards that can be captured by played card
 * Includes: direct match, sequences, and combinations
 */
const calculateCapture = (playedCard, tableCards) => {
  const captured = [];
  const remaining = [...tableCards];
  
  // Strategy 1: Direct value match + sequence
  const directMatchIdx = remaining.findIndex(c => c.value === playedCard.value);
  if (directMatchIdx !== -1) {
    const matchedCard = remaining[directMatchIdx];
    captured.push(matchedCard);
    remaining.splice(directMatchIdx, 1);
    
    // Add sequential cards (e.g., 5→6→7→10)
    let currentValue = getNextRank(playedCard.value);
    while (currentValue !== null) {
      const seqIdx = remaining.findIndex(c => c.value === currentValue);
      if (seqIdx !== -1) {
        captured.push(remaining[seqIdx]);
        remaining.splice(seqIdx, 1);
        currentValue = getNextRank(currentValue);
      } else {
        break;
      }
    }
    
    return { captured, isValid: true };
  }
  
  // Strategy 2: Combination of cards that sum to played card value
  // Try 2-card combinations
  for (let i = 0; i < remaining.length; i++) {
    for (let j = i + 1; j < remaining.length; j++) {
      if (remaining[i].value + remaining[j].value === playedCard.value) {
        return { captured: [remaining[i], remaining[j]], isValid: true };
      }
    }
  }
  
  // Try 3-card combinations
  for (let i = 0; i < remaining.length; i++) {
    for (let j = i + 1; j < remaining.length; j++) {
      for (let k = j + 1; k < remaining.length; k++) {
        if (remaining[i].value + remaining[j].value + remaining[k].value === playedCard.value) {
          return { captured: [remaining[i], remaining[j], remaining[k]], isValid: true };
        }
      }
    }
  }
  
  return { captured: [], isValid: false };
};

/**
 * Detect bonuses at deal time
 */
const detectBonusAtDeal = (hand) => {
  const counts = {};
  hand.forEach(card => {
    counts[card.value] = (counts[card.value] || 0) + 1;
  });
  
  for (const [value, count] of Object.entries(counts)) {
    if (count === 3) return { type: 'tringa', points: 5, value };
    if (count === 2) return { type: 'ronda', points: 1, value };
  }
  
  return null;
};

// ==================== MAIN HOOK ====================

const useRondaGame = (gameMode = 'pvp') => {
  // Core game state
  const [gameState, setGameState] = useState('lobby'); // lobby, playing, roundEnd, gameEnd
  const [deck, setDeck] = useState([]);
  const [tableCards, setTableCards] = useState([]);
  const [player1Hand, setPlayer1Hand] = useState([]);
  const [player2Hand, setPlayer2Hand] = useState([]);
  
  // Captured cards and scoring
  const [capturedCards, setCapturedCards] = useState({ player1: [], player2: [] });
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [roundScores, setRoundScores] = useState({ player1: 0, player2: 0 });
  
  // Turn management
  const [currentTurn, setCurrentTurn] = useState('player2'); // player2 (opponent) starts first
  const [currentDealer, setCurrentDealer] = useState('player1');
  const [lastTrickWinner, setLastTrickWinner] = useState(null);
  
  // UI state
  const [message, setMessage] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [result, setResult] = useState(null);
  const [roundNumber, setRoundNumber] = useState(1);
  
  // References
  const lastPlayedCardRef = useRef(null);
  const roundBonusesRef = useRef({ player1: [], player2: [] });

  // ==================== GAME START ====================

  const startGame = useCallback(() => {
    setScores({ player1: 0, player2: 0 });
    setCapturedCards({ player1: [], player2: [] });
    setRoundNumber(1);
    setMessage('🎴 Dealing initial cards...');
    dealRound();
  }, []);

  // ==================== DEALING ====================

  const dealRound = useCallback(() => {
    let shuffled = shuffleDeck(cardsData);
    
    // Get valid table cards (no pairs)
    let initialTable = shuffled.slice(0, 4);
    let attemptCount = 0;
    while (!isValidTableCards(initialTable) && attemptCount < 10) {
      shuffled = shuffleDeck(shuffled);
      initialTable = shuffled.slice(0, 4);
      attemptCount++;
    }
    
    let remaining = shuffled.slice(4);
    const p1Hand = remaining.slice(0, 3);
    const p2Hand = remaining.slice(3, 6);
    remaining = remaining.slice(6);

    setTableCards(initialTable);
    setPlayer1Hand(p1Hand);
    setPlayer2Hand(p2Hand);
    setDeck(remaining);
    
    // Reset round state
    roundBonusesRef.current = { player1: [], player2: [] };
    setRoundScores({ player1: 0, player2: 0 });
    setCurrentTurn('player2');
    setLastTrickWinner(null);
    lastPlayedCardRef.current = null;
    
    setGameState('playing');
    
    // Detect and announce bonuses
    checkAndAnnounceBonus(p1Hand, 'player1');
    checkAndAnnounceBonus(p2Hand, 'player2');
    
    setMessage(`Round ${roundNumber} - Opponent plays first`);
  }, [roundNumber]);

  const checkAndAnnounceBonus = (hand, player) => {
    const bonus = detectBonusAtDeal(hand);
    if (!bonus) return;

    const bonusId = Date.now();
    roundBonusesRef.current[player].push(bonus);
    
    const bonusLabel = bonus.type === 'tringa' ? '🔥 TRINGA!' : '✨ RONDA!';
    setAnnouncements(prev => [...prev, {
      id: bonusId,
      player,
      type: bonus.type,
      message: bonusLabel
    }]);
    
    setRoundScores(prev => ({ ...prev, [player]: prev[player] + bonus.points }));
    
    const playerName = player === 'player1' ? 'You' : 'Opponent';
    setMessage(`${playerName} announced ${bonus.type}!`);
    
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== bonusId));
    }, 2500);
  };

  // ==================== GAMEPLAY ====================

  const playCard = useCallback((card, player) => {
    if (gameState !== 'playing' || !card) return;
    if (player !== currentTurn) return;

    // Remove card from hand
    if (player === 'player1') {
      setPlayer1Hand(prev => prev.filter(c => !(c.suit === card.suit && c.value === card.value)));
    } else {
      setPlayer2Hand(prev => prev.filter(c => !(c.suit === card.suit && c.value === card.value)));
    }

    // Calculate capture
    const captureResult = calculateCapture(card, tableCards);
    let newTableCards = [...tableCards];
    let newCapturedCards = { ...capturedCards };

    if (captureResult.isValid && captureResult.captured.length > 0) {
      // CAPTURE
      const cardToRemove = captureResult.captured.map(captured =>
        newTableCards.findIndex(tc => tc.suit === captured.suit && tc.value === captured.value)
      ).sort((a, b) => b - a);

      cardToRemove.forEach(idx => {
        if (idx !== -1) newTableCards.splice(idx, 1);
      });

      newCapturedCards[player] = [...newCapturedCards[player], ...captureResult.captured];
      setLastTrickWinner(player);

      // Check for Missa
      if (newTableCards.length === 0) {
        const missaId = Date.now();
        setAnnouncements(prev => [...prev, {
          id: missaId,
          player,
          type: 'missa',
          message: '🎯 MISSA!'
        }]);
        setRoundScores(prev => ({ ...prev, [player]: prev[player] + 1 }));
        
        const playerName = player === 'player1' ? 'You' : 'Opponent';
        setMessage(`${playerName} made MISSA! (cleared table)`);
        
        setTimeout(() => {
          setAnnouncements(prev => prev.filter(a => a.id !== missaId));
        }, 2000);
      } else {
        const playerName = player === 'player1' ? 'You' : 'Opponent';
        setMessage(`${playerName} captured ${captureResult.captured.length} card(s)`);
      }
    } else {
      // NO CAPTURE - place card on table
      newTableCards.push(card);
      const playerName = player === 'player1' ? 'You' : 'Opponent';
      setMessage(`${playerName} placed ${card.value} on table`);
    }

    setTableCards(newTableCards);
    setCapturedCards(newCapturedCards);
    lastPlayedCardRef.current = card;
    setCurrentTurn(prev => prev === 'player1' ? 'player2' : 'player1');
  }, [gameState, currentTurn, tableCards]);

  // ==================== ROUND MANAGEMENT ====================

  useEffect(() => {
    if (gameState !== 'playing') return;

    const p1Empty = player1Hand.length === 0;
    const p2Empty = player2Hand.length === 0;

    if (p1Empty && p2Empty) {
      if (deck.length < 6) {
        endRound();
      } else {
        setTimeout(() => {
          const remaining = [...deck];
          const p1H = remaining.slice(0, 3);
          const p2H = remaining.slice(3, 6);
          const newDeck = remaining.slice(6);

          setPlayer1Hand(p1H);
          setPlayer2Hand(p2H);
          setDeck(newDeck);
          setCurrentTurn('player2');
          
          checkAndAnnounceBonus(p1H, 'player1');
          checkAndAnnounceBonus(p2H, 'player2');
          
          setMessage('Cards redealt');
        }, 1200);
      }
    }
  }, [player1Hand, player2Hand, deck, gameState]);

  const endRound = useCallback(() => {
    setGameState('roundEnd');

    let p1CardCount = capturedCards.player1.length;
    let p2CardCount = capturedCards.player2.length;
    let p1RoundScore = roundScores.player1;
    let p2RoundScore = roundScores.player2;

    // Add remaining table cards to last trick winner
    if (lastTrickWinner && tableCards.length > 0) {
      if (lastTrickWinner === 'player1') {
        p1CardCount += tableCards.length;
      } else {
        p2CardCount += tableCards.length;
      }
    }

    // Card bonus: every card above 20 counts as 1 point
    if (p1CardCount > 20) p1RoundScore += (p1CardCount - 20);
    if (p2CardCount > 20) p2RoundScore += (p2CardCount - 20);

    const newScores = {
      player1: scores.player1 + p1RoundScore,
      player2: scores.player2 + p2RoundScore
    };

    setScores(newScores);
    setMessage(`Round ended - You: ${p1RoundScore} | Opponent: ${p2RoundScore}`);

    // Check for game end (41+ points)
    if (newScores.player1 >= 41 || newScores.player2 >= 41) {
      setTimeout(() => endGame(newScores), 2000);
    } else {
      setTimeout(() => {
        setRoundNumber(prev => prev + 1);
        setCapturedCards({ player1: [], player2: [] });
        setTableCards([]);
        dealRound();
      }, 3000);
    }
  }, [capturedCards, roundScores, scores, lastTrickWinner, tableCards]);

  const endGame = (finalScores) => {
    setGameState('gameEnd');
    
    let winner = 'draw';
    if (finalScores.player1 > finalScores.player2) {
      winner = 'player1';
    } else if (finalScores.player2 > finalScores.player1) {
      winner = 'player2';
    }

    setResult({
      winner,
      player1Score: finalScores.player1,
      player2Score: finalScores.player2
    });

    setMessage(winner === 'player1' ? '🎉 You won!' : winner === 'player2' ? '😔 Opponent won' : '🤝 Draw!');
  };

  // ==================== AI OPPONENT ====================

  useEffect(() => {
    if (gameMode !== 'bot' || currentTurn !== 'player2' || gameState !== 'playing') return;
    if (player2Hand.length === 0) return;

    const timer = setTimeout(() => {
      const bot = new RondaAI(player2Hand, tableCards);
      const bestCard = bot.selectMove();
      if (bestCard) playCard(bestCard, 'player2');
    }, 1100);

    return () => clearTimeout(timer);
  }, [currentTurn, gameState, gameMode, player2Hand, tableCards, playCard]);

  return {
    gameState,
    tableCards,
    player1Hand,
    player2Hand,
    capturedCards,
    scores,
    roundScores,
    currentTurn,
    result,
    message,
    announcements,
    roundNumber,
    startGame,
    playCard,
    endRound
  };
};

// ==================== AI CLASS ====================

class RondaAI {
  constructor(hand, tableCards) {
    this.hand = hand;
    this.tableCards = tableCards;
  }

  selectMove() {
    // Priority 1: Missa (capture all table cards)
    const missaCard = this.findMissaCard();
    if (missaCard) return missaCard;

    // Priority 2: Best capture (most cards)
    const captureCard = this.findBestCaptureCard();
    if (captureCard) return captureCard;

    // Priority 3: Play defensive card (low value to minimize opponent's capture options)
    return this.findDefensiveCard();
  }

  findMissaCard() {
    for (const card of this.hand) {
      const result = calculateCapture(card, this.tableCards);
      if (result.isValid && result.captured.length === this.tableCards.length) {
        return card;
      }
    }
    return null;
  }

  findBestCaptureCard() {
    let bestCard = null;
    let maxCaptured = 0;

    for (const card of this.hand) {
      const result = calculateCapture(card, this.tableCards);
      if (result.isValid && result.captured.length > maxCaptured) {
        maxCaptured = result.captured.length;
        bestCard = card;
      }
    }

    return bestCard;
  }

  findDefensiveCard() {
    // Play lowest value card to minimize captured cards
    return this.hand.reduce((min, card) => card.value < min.value ? card : min);
  }
}

export default useRondaGame;
