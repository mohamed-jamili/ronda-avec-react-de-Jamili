import React from 'react';

const Rules = ({ onBack }) => {
  return (
    <div className="container py-4 text-white">
      <div className="card bg-dark bg-opacity-75 p-4 rounded-4 shadow-lg border-info">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <h2 className="text-info">📖 Règles de la Ronda</h2>
          <button className="btn btn-secondary btn-sm" onClick={onBack}>Retour</button>
        </div>

        <div className="rules-content small" style={{maxHeight: '70vh', overflowY: 'auto', lineHeight: '1.8'}}>
          
          {/* Introduction */}
          <section className="mb-4">
            <h4 className="text-warning">🎴 À Propos du Jeu</h4>
            <p>
              <strong>Ronda Carta</strong> est le jeu de cartes le plus populaire au Maroc, 
              un jeu familial qui nous ramène à l'ancien temps. C'est un jeu amusant, simple, facile et relaxant.
            </p>
            <p>
              L'<strong>objectif principal</strong> est de récolter le <strong>maximum de points</strong> 
              (cartes et bonus). Le jeu se termine lorsqu'il n'y a pas de cartes à distribuer 
              et le <strong>gagnant</strong> est celui avec le <strong>score le plus élevé</strong>.
            </p>
            <p>
              Qui ne se souvient pas de <strong className="text-warning">Ronda</strong>, 
              <strong className="text-warning"> Tringa</strong>, 
              <strong className="text-info"> Missa</strong>, 
              <strong className="text-success"> Souta</strong> et d'autres termes populaires !!
            </p>
          </section>

          {/* Le jeu de cartes */}
          <section className="mb-4">
            <h4 className="text-warning">🃏 Le Jeu de Cartes</h4>
            <p>Il se joue avec <strong>40 cartes</strong> et possède <strong>quatre couleurs</strong> :</p>
            <ul style={{paddingLeft: '1.5rem'}}>
              <li><strong>10 Copas</strong> (Tbaye9) - Coupes</li>
              <li><strong>10 Espadas</strong> (Syouf) - Épées</li>
              <li><strong>10 Oros</strong> (D'hab) - Or/Deniers</li>
              <li><strong>10 Bastos</strong> (Zrawéte) - Bâtons</li>
            </ul>
            <p>
              Les cartes sont numérotées <strong>1-7, 10-12</strong> dans chaque couleur. 
              (Les numéros 8 et 9 sont absents).
            </p>
          </section>

          {/* Déroulement */}
          <section className="mb-4">
            <h4 className="text-warning">⚡ Déroulement du Jeu</h4>
            <p>
              <strong>Ronda</strong> est un <strong>face à face</strong> : il y a un <strong>croupier</strong> 
              qui distribue les cartes et l'<strong>adversaire</strong> qui commence le premier lancer.
            </p>
            <p>
              Chaque joueur reçoit <strong>3 cartes</strong> à chaque donne.
            </p>
          </section>

          {/* Distribution */}
          <section className="mb-4">
            <h4 className="text-warning">🎲 La Donne Initiale</h4>
            <p>
              On détermine par une manière quelconque le donneur. Celui-ci distribue dans le sens 
              inverse de l'aiguille d'une montre (de droite à gauche) <strong>trois cartes par personne</strong> 
              et en retournant <strong>quatre cartes sur le tapis</strong>.
            </p>
            <p className="text-muted small">
              <em>Note : Ces quatre cartes apparentes ne doivent pas constituer une suite et il ne doit pas 
              y avoir de paire.</em>
            </p>
          </section>

          {/* Annonces */}
          <section className="mb-4">
            <h4 className="text-warning">📢 Les Annonces</h4>
            <p>À chaque donne de trois cartes, on peut faire une annonce qui donne des points :</p>
            <ul style={{paddingLeft: '1.5rem'}}>
              <li><strong className="text-info">Ronda</strong> : si vous avez deux cartes identiques → <strong>1 point</strong></li>
              <li><strong className="text-success">Tringla</strong> : si vous avez trois cartes identiques (brelan) → <strong>5 points</strong></li>
            </ul>
            <p className="text-muted small">
              <em>Attention : une annonce qui se fait après que le joueur a joué sa première carte 
              ne donne pas lieu à des points.</em>
            </p>
          </section>

          {/* Cours du jeu */}
          <section className="mb-4">
            <h4 className="text-warning">🎯 Cours du Jeu</h4>
            <p>
              On joue tour à tour, en commençant par la personne à droite du donneur.
            </p>
            <p>
              <strong>Former une paire :</strong> On peut gagner des cartes en formant une paire avec 
              une carte posée sur le tapis, on empoche alors cette paire ainsi que les cartes supérieures 
              qui font une suite.
            </p>
            <p className="text-muted small">
              <em>Exemple : on a 1, 2, 5 en main et 5, 6, 7, 10, 12 sur la table ; on recouvre le 5 
              par son 5, et on remporte 5, 5, 6, 7, 10.</em>
            </p>
            <p>
              <strong>Se défausser :</strong> Si on ne peut pas former une paire, on est obligé de 
              jeter une carte sur le tapis.
            </p>
          </section>

          {/* Missa */}
          <section className="mb-4">
            <h4 className="text-warning">✨ Missa (Table Propre)</h4>
            <p>
              Lorsqu'un joueur parvient à ramasser <strong>toutes les cartes du tapis</strong>, 
              on dit qu'il fait <strong>missa</strong> (ou messa limpia = table propre) et remporte 
              <strong> 1 jeton/point</strong>.
            </p>
            <p>
              En posant sa carte, il annonce <strong>"Missa"</strong>.
            </p>
            <p className="text-muted small">
              <em>Attention : faire missa à la dernière main (après que le donneur a dit « Khlassou ! ») 
              ne rapporte aucun point.</em>
            </p>
          </section>

          {/* Cao */}
          <section className="mb-4">
            <h4 className="text-warning">💥 Cao, Racao, Racacao (Piedra...)</h4>
            <p>
              Lorsqu'on peut former une paire avec une carte qui vient juste d'être jetée par 
              l'adversaire à sa gauche, on a la possibilité de « taper » dessus.
            </p>
            <p>
              On recouvre alors la carte de l'adversaire faisant la paire en criant : 
              <strong> « Bount ! »</strong> ou <strong> « Piedra »</strong> (coup de 1).
            </p>
            <p>
              Si le joueur à droite du « tapeur » dispose aussi de cette carte, il peut la jeter 
              immédiatement formant ainsi un brelan, et crie : <strong> « Khamsa ! »</strong> 
              (coup de 5 / contra piedra).
            </p>
            <p>
              Si le quatrième joueur a de quoi former un carré il crie : 
              <strong> « âachra ! »</strong> (coup de 10 / otra piedra) en jetant la carte.
            </p>
            <p>
              <strong>Points :</strong> 1 jeton pour "Cao", 5 jetons pour "Racao", 10 jetons pour "Racacao".
            </p>
          </section>

          {/* Dernière main */}
          <section className="mb-4">
            <h4 className="text-warning">🏁 Dernière Main</h4>
            <p>
              Lorsque la toute dernière carte est jouée, il est probable qu'il reste des cartes 
              sur la table. C'est alors <strong>celui qui a fait le dernier pli qui remporte tout le tapis</strong>.
            </p>
            <p>
              Le donneur prévient les autres joueurs en indiquant haut et fort : 
              <strong> « Khlassou ! »</strong> (de l'arabe dialectal signifiant qu'il n'en reste plus).
            </p>
          </section>

          {/* Points */}
          <section className="mb-4">
            <h4 className="text-warning">🏆 Comptage des Points</h4>
            <p><strong>En cours de jeu :</strong></p>
            <ul style={{paddingLeft: '1.5rem'}}>
              <li>Annonçant ronda : 1 point</li>
              <li>Annonçant tringla : 5 points</li>
              <li>Faisant missa : 1 point</li>
              <li>Tapant sur l'adversaire : 1, 5 ou 10 points</li>
            </ul>
            <p><strong>À la fin de la manche :</strong></p>
            <p>
              Chacun compte ses cartes gagnées. Pour 2 joueurs : si vous avez <strong>plus de 20 cartes</strong>, 
              chaque carte au-delà de 20 compte pour <strong>1 point</strong>.
            </p>
          </section>

          {/* Fin du jeu */}
          <section className="mb-4">
            <h4 className="text-warning">🎊 Fin du Jeu</h4>
            <p>
              La partie est gagnée lorsqu'un joueur atteint <strong>41 points</strong>.
            </p>
          </section>

          <div className="alert alert-info mt-4 small" role="alert">
            <strong>💡 Note :</strong> Les règles peuvent varier selon les régions et les préférences 
            des joueurs. Cette version présente les règles générales de la Ronda.
          </div>

          <p className="text-muted small mt-3">
            Amusez-vous bien et bon jeu ! 🎴
          </p>
        </div>
      </div>
    </div>
  );
};

export default Rules;
