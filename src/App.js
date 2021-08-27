import { useState } from "react";
import "./styles.css";

/**
 * keep track of guesses
 * flip cards over/hide values FLIP CARDS ANIMATION...
 *        animation is nonblock for timing game?
 * keep face up if matched/dont hide these
 * style
 * scale/levels easy medium hard
 * rand values/shuffling use math.rand and splice?
 * some ux options show the whole thing for a set amount of time
 * track how quick you do it?
 */
export default function App() {
  const NUMBER_OF_CARDS = 4;
  const cards = [1, 1, 2, 2];

  const [firstGuess, setFirstGuess] = useState(null);

  function handleCardClick(event) {
    const cardElem = event.target;
    console.log(cardElem.name);
    const cardIndex = cardElem.name;
    const cardValue = cards[cardIndex];
    console.log(cardValue);
    if (firstGuess === null) {
      setFirstGuess({ cardIndex, cardValue });
      return;
    }

    if (firstGuess.cardIndex === cardIndex) {
      console.log("you already clicked this :P");
      return;
    }

    if (firstGuess.cardValue === cardValue) {
      console.log("you found a match :P");
      setFirstGuess(null);
      return;
    }
    console.log("you did not find a match :P");
    setFirstGuess(null);
  }

  return (
    <div className="app">
      <h1>Tiny Elephant</h1>
      <div className="card-container">
        {cards.map((card, i) => (
          <button key={i} className="card" onClick={handleCardClick} name={i}>
            {card}
          </button>
        ))}
      </div>
    </div>
  );
}
