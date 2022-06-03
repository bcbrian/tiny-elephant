import { useEffect, useState } from "react";
import "./styles.css";

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  return array;
}

const APP_STATE_STAGES = {
  START: "start",
  PLAYING: "playing",
  END: "end"
};

const DIFFICULTY = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD"
};

function getNumberOfRows(difficulty) {
  switch (difficulty) {
    case DIFFICULTY.HARD:
      return 6;

    case DIFFICULTY.MEDIUM:
      return 4;

    case DIFFICULTY.EASY:
    default:
      return 2;
  }
}

function getPokemonNumber(indexToPokemonNumber, index) {
  if (indexToPokemonNumber[index]) return indexToPokemonNumber[index];
  while (!indexToPokemonNumber[index]) {
    const pokemonNumber = Math.ceil(Math.random() * 151);
    const alreadyUsed = indexToPokemonNumber.find(
      (num) => num === pokemonNumber
    );
    if (!alreadyUsed) {
      indexToPokemonNumber[index] = pokemonNumber;
    }
  }
  return indexToPokemonNumber[index];
}

async function getCards(numberOfCards) {
  const indexToPokemonNumber = [];
  const pokedex = {};
  const cards = await Promise.all(
    Array(numberOfCards)
      .fill(null)
      .map(async (_, idx) => {
        if (true) {
          const index = Math.ceil((idx + 1) / 2);
          const pokemonNumber = getPokemonNumber(indexToPokemonNumber, index);

          const pokemon =
            pokedex[`${pokemonNumber}`] ?? (await getPokemon(pokemonNumber));
          pokedex[`${pokemonNumber}`] = pokemon;
          return {
            index,
            pokemonNumber,
            img: pokemon.sprites.front_default
          };
        }
      })
  );
  return shuffle(cards);
}

async function getPokemon(number) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);
  return await response.json();
}

export default function App() {
  const [appState, setAppState] = useState(null);

  async function initState() {
    setAppState({
      stage: APP_STATE_STAGES.START,
      numberOfRows: 6,
      cards: await getCards(6 * 6),
      correctGuesses: []
    });
  }

  useEffect(() => {
    initState();
  }, []);

  const [firstGuess, setFirstGuess] = useState(null);
  const [secondGuess, setSecondGuess] = useState(null);

  function getHandleStartGame(difficulty) {
    return async function handleStartGame() {
      const numberOfRows = getNumberOfRows(difficulty);
      setAppState({
        stage: APP_STATE_STAGES.PLAYING,
        numberOfRows,
        cards: await getCards(numberOfRows * numberOfRows),
        correctGuesses: []
      });
    };
  }

  function getHandleCardClick(cardIndex) {
    return function handleCardClick(event) {
      event.stopPropagation();
      const cardValue = appState.cards[cardIndex].pokemonNumber;
      if (appState.correctGuesses.includes(cardIndex)) {
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
    };
  }

  useEffect(() => {
    let handle = 0;
    if (firstGuess !== null && secondGuess !== null) {
      handle = setTimeout(() => {
        if (firstGuess.cardValue === secondGuess.cardValue) {
          console.log("you found a match :P");
          setAppState({
            ...appState,
            correctGuesses: [
              ...appState.correctGuesses,
              firstGuess.cardIndex,
              secondGuess.cardIndex
            ]
          });
        } else {
          console.log("you did not find a match :P");
        }
        setFirstGuess(null);
        setSecondGuess(null);
      }, 1000);
    }
    return () => clearTimeout(handle);
  }, [firstGuess, secondGuess, setFirstGuess, setSecondGuess]);
  useEffect(() => {
    if (
      appState?.cards &&
      appState?.correctGuesses &&
      appState?.cards.length === appState?.correctGuesses?.length
    ) {
      console.log("you won! BOOM! POP! Goes the DYNAMITE");
      initState();
    }
  }, [appState]);

  const notPlaying = appState?.stage !== APP_STATE_STAGES.PLAYING;

  return appState === null ? null : (
    <div className="app">
      <h1 className="title">POKEMATCH</h1>

      <div
        className="card-container"
        style={{
          filter: notPlaying ? "blur(6px)" : "none"
        }}
      >
        {appState?.cards?.map((card, i) => {
          const isFlipped =
            i === firstGuess?.cardIndex ||
            i === secondGuess?.cardIndex ||
            appState.correctGuesses.includes(i);
          return (
            <div
              key={i}
              className={`card ${isFlipped ? "is-flipped" : ""}`}
              onClick={getHandleCardClick(i)}
              style={{
                margin: "12px",
                flex: `0 0 calc(${100 / appState.numberOfRows}% - 24px)`,
                paddingTop: `calc(${100 / appState.numberOfRows}% - 24px)`
              }}
            >
              {/* <span className="card__value" onClick={getHandleCardClick(i)}>
                {isFlipped ? card : ""}
              </span> */}
              <div
                className="card__face card__face--front"
                style={{
                  top: 0
                }}
              ></div>
              <div
                className="card__face card__face--back"
                style={{
                  top: 0
                }}
              >
                <img width="100%" src={card.img} alt="pokemon name goes here" />
              </div>
            </div>
          );
        })}
      </div>
      {notPlaying ? (
        <div className="app-modal">
          <h2>Can you match'em all?</h2>
          <button
            className="app-modal__button app-modal__button--easy"
            onClick={getHandleStartGame(DIFFICULTY.EASY)}
          >
            {DIFFICULTY.EASY}
          </button>
          <button
            className="app-modal__button app-modal__button--medium"
            onClick={getHandleStartGame(DIFFICULTY.MEDIUM)}
          >
            {DIFFICULTY.MEDIUM}
          </button>
          <button
            className="app-modal__button app-modal__button--hard"
            onClick={getHandleStartGame(DIFFICULTY.HARD)}
          >
            {DIFFICULTY.HARD}
          </button>
        </div>
      ) : null}
    </div>
  );
}
