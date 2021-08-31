import { useEffect, useState } from "react";
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
  const [secondGuess, setSecondGuess] = useState(null);
  const [correctGuesses, setCorrectGuesses] = useState([]);

  function handleCardClick(event) {
    const cardElem = event.target;
    console.log(cardElem.name);
    const cardIndex = cardElem.name;
    const cardValue = cards[cardIndex];
    console.log(cardValue);
    if (correctGuesses.includes(cardIndex)) {
      console.log("you already know this :P");
      return;
    }
    if (firstGuess === null) {
      setFirstGuess({ cardIndex, cardValue });
      return;
    }

    if (secondGuess === null && firstGuess.cardIndex !== cardIndex) {
      setSecondGuess({ cardIndex, cardValue });
      return;
    }

    if (firstGuess.cardIndex === cardIndex) {
      console.log("you already clicked this :P");
      return;
    }

    if (secondGuess.cardIndex === cardIndex) {
      console.log("you already clicked this :P");
      return;
    }
  }

  useEffect(() => {
    let handle = 0;
    if (firstGuess !== null && secondGuess !== null) {
      handle = setTimeout(() => {
        if (firstGuess.cardValue === secondGuess.cardValue) {
          console.log("you found a match :P");
          setCorrectGuesses([
            ...correctGuesses,
            firstGuess.cardIndex,
            secondGuess.cardIndex
          ]);
        } else {
          console.log("you did not find a match :P");
        }
        setFirstGuess(null);
        setSecondGuess(null);
      }, 1000);
    }
    return () => clearTimeout(handle);
  }, [firstGuess, secondGuess, setFirstGuess, setSecondGuess]);

  return (
    <div className="app">
      <h1>Tiny Elephant</h1>
      <div className="card-container">
        {cards.map((card, i) => (
          <button key={i} className="card" onClick={handleCardClick} name={i}>
            {i.toString() === firstGuess?.cardIndex ||
            i.toString() === secondGuess?.cardIndex ||
            correctGuesses.includes(i.toString())
              ? card
              : ""}
          </button>
        ))}
      </div>
    </div>
  );
}
