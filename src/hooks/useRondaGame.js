import { useState, useEffect, useCallback, useRef } from 'react';
import cardsData from '../data/cards.json';

const shuffleDeck = (deck) => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

const useRondaGame = (gameMode = 'pvp') => { // DEFAULT pvp
  const [deck, setDeck] = useState([]);
  const [tableCards, setTableCards] = useState([]);
  const [player1Hand, setPlayer1Hand] = useState([]);
  const [player2Hand, setPlayer2Hand] = useState([]); 
  const [capturedCards, setCapturedCards] = useState({ player1: [], player2: [] });
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [currentTurn, setCurrentTurn] = useState('player1'); 
  const [lastTrickWinner, setLastTrickWinner] = useState(null); // Track who last captured cards
  
  const [gameState, setGameState] = useState('lobby'); 
  const [result, setResult] = useState(null); 
  const [message, setMessage] = useState('');
  const [announcements, setAnnouncements] = useState([]); // Store announcements like "Ronda", "Tringla", "Missa"

  const lastPlayedCardRef = useRef(null); // To track for Cao (Roaring)

  const startGame = useCallback(() => {
    setScores({ player1: 0, player2: 0 });
    setCapturedCards({ player1: [], player2: [] });
    setAnnouncements([]);
    setLastTrickWinner(null);
    lastPlayedCardRef.current = null;
    
    let shuffled = shuffleDeck(cardsData);
    
    // Initial Deal: 4 cards to table
    const initialTable = shuffled.slice(0, 4);
    let remainingDeck = shuffled.slice(4);

    // Validate table cards: No pairs allowed initially
    // (Simplified validation: if pair exists, just reshuffle for now or swap - keeping it simple for this iteration)
    // A robust solution would swap duplicates with cards from the deck bottom.
    
    setTableCards(initialTable);
    
    // Deal first hand to players
    const p1Hand = remainingDeck.slice(0, 3);
    const p2Hand = remainingDeck.slice(3, 6);
    remainingDeck = remainingDeck.slice(6);

    setPlayer1Hand(p1Hand);
    setPlayer2Hand(p2Hand);
    setDeck(remainingDeck);
    
    setCurrentTurn('player1');
    setGameState('playing');
    setMessage('Game Started');
    setResult(null);

    // checkAnnouncements(p1Hand, p2Hand); // Initial check for Ronda/Tringla
  }, []);

  // Check for Ronda/Tringla immediately after dealing a new hand
  useEffect(() => {
    if (gameState === 'playing' && player1Hand.length === 3 && player2Hand.length === 3) {
      if (currentTurn === 'player1') { // Ideally check both but usually handled at turn start or deal
         // For simplicity, check both hands on deal.
         checkAnnouncements(player1Hand, 'player1');
         checkAnnouncements(player2Hand, 'player2');
      }
    }
  }, [player1Hand.length, player2Hand.length, gameState]); // Trigger when hands are reset to 3

  const checkAnnouncements = (hand, player) => {
      const counts = {};
      hand.forEach(card => {
          counts[card.value] = (counts[card.value] || 0) + 1;
      });

      let announcement = null;
      let points = 0;

      if (Object.values(counts).includes(3)) {
          announcement = 'Tringla';
          points = 5;
      } else if (Object.values(counts).includes(2)) {
          announcement = 'Ronda';
          points = 1;
      }

        if (announcement) {
          const annId = Date.now();
          setMessage(`${player === 'player1' ? 'Player 1' : 'Player 2'} announced ${announcement}!`);
          setScores(prev => ({ ...prev, [player]: prev[player] + points }));
          setAnnouncements(prev => [...prev, { player, type: announcement, id: annId }]);
          
          // Clear announcement after 3s
          setTimeout(() => setAnnouncements(prev => prev.filter(a => a.id !== annId)), 3000);
        }
  };

  const nextRound = useCallback(() => {
    if (deck.length === 0) {
      endGame();
      return;
    }
    
    let availableDeck = [...deck];
    // Check if enough cards
    if (availableDeck.length < 6) {
        endGame();
        return;
    }

    const p1Hand = availableDeck.slice(0, 3);
    const p2Hand = availableDeck.slice(3, 6);
    const remaining = availableDeck.slice(6);

    setPlayer1Hand(p1Hand);
    setPlayer2Hand(p2Hand);
    setDeck(remaining);
    setMessage('Next Round Dealt');
  }, [deck]); 

  // Check Round End
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (player1Hand.length === 0 && player2Hand.length === 0) {
      if (deck.length === 0) {
        endGame();
      } else {
        setMessage('Round Over. Dealing...');
        setTimeout(nextRound, 1500);
      }
    }
  }, [player1Hand, player2Hand, gameState, deck, nextRound]);

  const endGame = () => {
    // Determine winner based on total card count > 20
    let p1Count = capturedCards.player1.length;
    let p2Count = capturedCards.player2.length;
    
    let p1FinalScore = scores.player1;
    let p2FinalScore = scores.player2;

    // Add remaining table cards to last trick winner
    if (lastTrickWinner === 'player1') {
        p1Count += tableCards.length;
    } else if (lastTrickWinner === 'player2') {
        p2Count += tableCards.length;
    }
    
    if (p1Count > 20) p1FinalScore += (p1Count - 20);
    if (p2Count > 20) p2FinalScore += (p2Count - 20);

    setGameState('finished');
    
    let winnerId = 'draw';
    if (p1FinalScore > p2FinalScore) winnerId = 'player1';
    else if (p2FinalScore > p1FinalScore) winnerId = 'player2';

    setScores({ player1: p1FinalScore, player2: p2FinalScore });
    setResult({ winner: winnerId, s1: p1FinalScore, s2: p2FinalScore });
  };

  const playCard = (card, player) => {
    if (gameState !== 'playing') return;
    if (player !== currentTurn) return;

    // Remove card from hand
    if (player === 'player1') setPlayer1Hand(prev => prev.filter(c => !(c.suit === card.suit && c.value === card.value)));
    else setPlayer2Hand(prev => prev.filter(c => !(c.suit === card.suit && c.value === card.value)));

    let newTableCards = [...tableCards];
    // find all candidate matches (same value)
    const candidateIndices = newTableCards.map((c, i) => c.value === card.value ? i : -1).filter(i => i !== -1);

    if (candidateIndices.length > 0) {
      // Choose the candidate that yields the longest capture sequence
      const simulateCaptureLength = (startIdx) => {
        const temp = [...newTableCards];
        let length = 1; // matched card itself
        // remove the matched at startIdx
        temp.splice(startIdx, 1);
        const getNextRank = (val) => {
          if (val === 7) return 10;
          if (val === 12) return null;
          return val + 1;
        };
        let currentVal = getNextRank(card.value);
        while (currentVal) {
          const idx = temp.findIndex(c => c.value === currentVal);
          if (idx !== -1) {
            length += 1;
            temp.splice(idx, 1);
            currentVal = getNextRank(currentVal);
          } else break;
        }
        return length;
      };

      let bestIdx = candidateIndices[0];
      let bestLen = simulateCaptureLength(bestIdx);
      for (let k = 1; k < candidateIndices.length; k++) {
        const idx = candidateIndices[k];
        const len = simulateCaptureLength(idx);
        if (len > bestLen) {
          bestLen = len;
          bestIdx = idx;
        }
      }

      // CAPTURE using bestIdx
      const matchedCard = newTableCards[bestIdx];
      let captured = [card, matchedCard];
      newTableCards.splice(bestIdx, 1);

        // Cao (Roaring) Check: compare by suit+value instead of object reference
        if (lastPlayedCardRef.current && matchedCard.suit === lastPlayedCardRef.current.suit && matchedCard.value === lastPlayedCardRef.current.value) {
          setMessage(`${player === 'player1' ? 'Player 1' : 'Player 2'} made Cao!`);
          setScores(prev => ({ ...prev, [player]: prev[player] + 1 }));
        }

      // Sequence (Estera) Logic 
        const getNextRank = (val) => {
          if (val === 7) return 10;
          if (val === 12) return null;
          return val + 1;
        };

        let currentVal = getNextRank(card.value);
      while (currentVal) {
          const seqIndex = newTableCards.findIndex(c => c.value === currentVal);
          if (seqIndex !== -1) {
              captured.push(newTableCards[seqIndex]);
              newTableCards.splice(seqIndex, 1);
              currentVal = getNextRank(currentVal);
          } else {
              break;
          }
      }

      setCapturedCards(prev => ({ ...prev, [player]: [...prev[player], ...captured] }));
      setLastTrickWinner(player);

      // Missa
      if (newTableCards.length === 0) {
          setMessage(`${player === 'player1' ? 'Player 1' : 'Player 2'} made Missa!`);
          setScores(prev => ({ ...prev, [player]: prev[player] + 1 }));
          setAnnouncements(prev => [...prev, { player, type: 'Missa', id: Date.now() }]);
      }
      
    } else {
      // PLACE
      newTableCards.push(card);
    }

    setTableCards(newTableCards);
    lastPlayedCardRef.current = card;
    setCurrentTurn(prev => prev === 'player1' ? 'player2' : 'player1');
  };

  // BOT LOGIC
  useEffect(() => {
    if (gameMode === 'bot' && currentTurn === 'player2' && gameState === 'playing') {
      const timer = setTimeout(() => {
        if (player2Hand.length > 0) {
          // 1. Try to match (Capture)
           const match = player2Hand.find(c => tableCards.some(tc => tc.value === c.value));
           if (match) {
               playCard(match, 'player2');
           } else {
               // 2. Play Random
               const randomIndex = Math.floor(Math.random() * player2Hand.length);
               const card = player2Hand[randomIndex];
               playCard(card, 'player2');
           }
        }
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [currentTurn, gameState, gameMode, player2Hand, tableCards]);

  return {
    gameState, tableCards, player1Hand, player2Hand, capturedCards, scores, currentTurn, result, message, announcements,
    startGame, playCard
  };
};

export default useRondaGame;
