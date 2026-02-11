import React from 'react';

const Card = ({ card, onClick, isFaceUp = true, isFaceDown = false, isDisabled = false, isSelected = false }) => {
  const imagePath = isFaceDown 
    ? '/cards/back.gif' 
    : `/cards/${card.image}`;

  return (
    <div 
      className={`playing-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
      onClick={() => !isDisabled && onClick && onClick(card)}
    >
      <img src={imagePath} alt="card" className="card-img" />
    </div>
  );
};

export default Card;
