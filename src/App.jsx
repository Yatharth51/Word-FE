import { useEffect } from 'react';
import { useState } from 'react'
import './App.css'

const API_ENDPOINT = "http://localhost:3000/wordle-words";
const WORD_LENGTH = 5;
const TOTAL_GUESSES = 6;


function Word({ guess, isFinal,solution }) {
  const tiles = [];

  for (let i = 0; i < WORD_LENGTH; i++) {
    let className = "tile";
    const char = guess[i] ;
    if (isFinal) {
      if (char === solution[i]) {
        className += " correct";
      }
      else if (solution.includes(char)) {
        className += ' close';
      }
      else {
        className += ' wrong'
      }
    }

    tiles.push(<div key={i} className={className}>{char}</div>)
  }

  return (<div className='line'>{tiles}</div>);
}


function App() {
  const [solution, setSolution] = useState(null);
  const [guesses, setGuesses] = useState(Array(TOTAL_GUESSES).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {

    const getData = async () => {
      const response = await fetch(API_ENDPOINT);
      const json = await response.json();
      const sol = json[Math.floor(Math.random() * json.length)];
      setSolution(sol);
      console.log(sol);
    }

    getData();
  }, []);

  useEffect(() => {

    function handleType(event) {
      if (isGameOver) return;

      const key = event.key;

      if (key === "Enter") {
        if (currentGuess.length != 5) { return };
        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex(val => val == null)] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess('');
        const isCorrect = solution === currentGuess;
        if (isCorrect) {
          setIsGameOver(true);
        }
      }



      if (currentGuess.length == 5 && key!== "Backspace") return;

      if (key == "Backspace") {
        setCurrentGuess(oldGuess => oldGuess.slice(0, -1));
        return;
      }

      if (/^[a-zA-Z]$/.test(key)) {
        setCurrentGuess(oldGuess => (oldGuess + key).toUpperCase().slice(0, WORD_LENGTH));
      }
    }

    window.addEventListener('keydown', handleType);

    return (() => window.removeEventListener("keydown", handleType));

  }, [currentGuess, guesses, isGameOver, solution])

  function reset(){
    setGuesses(Array(TOTAL_GUESSES).fill(null)) ;
    setCurrentGuess('');
    setIsGameOver(false) ;
  }

  return (
    <div className='bg'>
    <div className='block'>
      {guesses.map((guess, index) => {
        const isCurrentGuess = index === guesses.findIndex(val => val == null);
        return <Word key={index} guess={isCurrentGuess ? currentGuess : guess ?? ""}
          isFinal={!isCurrentGuess && guess != null} solution= {solution}
        />
      })}
      <div>{currentGuess}</div>
      <div><button className='butt' onClick={()=>{reset()}}>RESET</button></div>
    </div>
    </div>
  )
}

export default App
