import React, { useState, useEffect } from "react";

const App = () => {
  const [highScore, setHighScore] = useState(
    JSON.parse(localStorage.getItem("highScore")) || { name: "", score: 0, time: Infinity }
  );
  const [showGame, setShowGame] = useState(true);

  const updateHighScore = (newHighScore) => {
    setHighScore(newHighScore);
    localStorage.setItem("highScore", JSON.stringify(newHighScore));
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Welcher Hunderter liegt näher?</h1>
      {showGame ? (
        <Game highScore={highScore} updateHighScore={updateHighScore} onGameOver={() => setShowGame(false)} />
      ) : (
        <Result highScore={highScore} onRestart={() => setShowGame(true)} />
      )}
    </div>
  );
};

const Game = ({ highScore, updateHighScore, onGameOver }) => {
  const generateRandomNumber = () => Math.floor(Math.random() * 1001);

  const [questionNumber, setQuestionNumber] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [currentNumber, setCurrentNumber] = useState(generateRandomNumber());
  const [results, setResults] = useState([]);

  const handleAnswer = (answer) => {
    const lowerHundred = Math.floor(currentNumber / 100) * 100;
    const upperHundred = lowerHundred + 100;
    const correctAnswer = Math.abs(currentNumber - lowerHundred) <= Math.abs(currentNumber - upperHundred)
      ? lowerHundred
      : upperHundred;

    const isCorrect = answer === correctAnswer;
    setResults((prev) => [...prev, isCorrect]);
    if (isCorrect) setCorrectCount((prev) => prev + 1);

    if (questionNumber === 25) {
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000;

      if (
        correctCount + (isCorrect ? 1 : 0) > highScore.score ||
        (correctCount + (isCorrect ? 1 : 0) === highScore.score && timeTaken < highScore.time)
      ) {
        const playerName = prompt("Neuer Rekord! Bitte gib deinen Namen ein:");
        updateHighScore({ name: playerName, score: correctCount + (isCorrect ? 1 : 0), time: timeTaken });
      }

      onGameOver();
    } else {
      setQuestionNumber((prev) => prev + 1);
      setCurrentNumber(generateRandomNumber());
    }
  };

  const lowerHundred = Math.floor(currentNumber / 100) * 100;
  const upperHundred = lowerHundred + 100;

  return (
    <div>
      <h2>Frage {questionNumber}/25</h2>
      <h3>Welche Hunderterzahl liegt näher an {currentNumber}?</h3>
      <div>
        <button onClick={() => handleAnswer(lowerHundred)}>{lowerHundred}</button>
        <button onClick={() => handleAnswer(upperHundred)}>{upperHundred}</button>
      </div>
    </div>
  );
};

const Result = ({ highScore, onRestart }) => {
  return (
    <div>
      <h2>Spiel beendet!</h2>
      <h3>Highscore</h3>
      <p>
        Name: {highScore.name} <br />
        Richtige Antworten: {highScore.score} <br />
        Benötigte Zeit: {highScore.time.toFixed(2)} Sekunden
      </p>
      <button onClick={onRestart}>Neues Spiel starten</button>   
    </div>
  );
};

export default App;
