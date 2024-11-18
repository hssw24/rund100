import React, { useState, useEffect } from "react";

const App = () => {
  const [highScore, setHighScore] = useState(
    JSON.parse(localStorage.getItem("highScore")) || {
      name: "",
      score: 0,
      time: Infinity,
      totalRounds: 0,
      totalMistakes: 0,
    }
  );
  const [showGame, setShowGame] = useState(true);

  const updateHighScore = (newHighScore) => {
    setHighScore(newHighScore);
    localStorage.setItem("highScore", JSON.stringify(newHighScore));
  };

  const resetHighScore = () => {
    setHighScore({
      name: "",
      score: 0,
      time: Infinity,
      totalRounds: 0,
      totalMistakes: 0,
    });
    localStorage.removeItem("highScore");
    alert("Highscore wurde zurückgesetzt.");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcher Hunderter liegt näher?</h1>
      {showGame ? (
        <Game
          highScore={highScore}
          updateHighScore={updateHighScore}
          onGameOver={() => setShowGame(false)}
        />
      ) : (
        <Result
          highScore={highScore}
          onRestart={() => setShowGame(true)}
          onResetHighScore={resetHighScore}
        />
      )}
    </div>
  );
};

const Game = ({ highScore, updateHighScore, onGameOver }) => {
  const generateRandomNumber = () => Math.floor(Math.random() * 1001);

  const [questionNumber, setQuestionNumber] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [startTime] = useState(Date.now()); // Startzeit der gesamten Runde
  const [currentNumber, setCurrentNumber] = useState(generateRandomNumber());
  const [isAnswering, setIsAnswering] = useState(true);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false); // Für roten Hintergrund
  const [roundTime, setRoundTime] = useState(0); // Speichert die Zeit der aktuellen Runde

  const handleAnswer = (answer) => {
    const lowerHundred = Math.floor(currentNumber / 100) * 100;
    const upperHundred = lowerHundred + 100;

    const distanceToLower = Math.abs(currentNumber - lowerHundred);
    const distanceToUpper = Math.abs(currentNumber - upperHundred);
    const correctAnswer =
      distanceToLower === distanceToUpper
        ? upperHundred
        : distanceToLower < distanceToUpper
        ? lowerHundred
        : upperHundred;

    if (answer === correctAnswer) {
      setCorrectCount((prev) => prev + 1);
      nextQuestion();
    } else {
      setMistakeCount((prev) => prev + 1);
      setIsWrongAnswer(true); // Rot anzeigen
      setIsAnswering(false); // Pause
      setTimeout(() => {
        setIsWrongAnswer(false); // Hintergrund zurücksetzen
        setIsAnswering(true);
      }, 2000);
    }
  };

  const nextQuestion = () => {
    if (questionNumber === 25) {
      const endTime = Date.now();
      const totalTime = (endTime - startTime) / 1000; // Zeit der Runde
      setRoundTime(totalTime); // Speichert die Zeit der aktuellen Runde

      const totalRounds = highScore.totalRounds + 1;
      const totalMistakes = highScore.totalMistakes + mistakeCount;

      if (
        correctCount > highScore.score ||
        (correctCount === highScore.score && totalTime < highScore.time)
      ) {
        const playerName = prompt("Neuer Rekord! Bitte gib deinen Namen ein:");
        updateHighScore({
          name: playerName,
          score: correctCount + 1, // Letzte Runde mitzählen
          time: totalTime,
          totalRounds,
          totalMistakes,
        });
      } else {
        alert("Kein neuer Rekord.");
        updateHighScore({ ...highScore, totalRounds, totalMistakes });
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
    <div
      style={{
        ...styles.gameContainer,
        backgroundColor: isWrongAnswer ? "#FFCCCC" : "white", // Rot bei falscher Antwort
      }}
    >
      <h2 style={styles.subTitle}>Frage {questionNumber}/25</h2>
      <h3 style={styles.question}>
        Welche Hunderterzahl liegt näher an {currentNumber}?
      </h3>
      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onClick={() => isAnswering && handleAnswer(lowerHundred)}
        >
          {lowerHundred}
        </button>
        <button
          style={styles.button}
          onClick={() => isAnswering && handleAnswer(upperHundred)}
        >
          {upperHundred}
        </button>
      </div>
    </div>
  );
};

const Result = ({ highScore, onRestart, onResetHighScore }) => {
  return (
    <div>
      <h2 style={styles.subTitle}>Spiel beendet!</h2>
      <h3 style={styles.question}>Ergebnisse</h3>
      <p style={styles.resultText}>
        <strong>Aktuelle Runde:</strong> <br />
        - Richtige Antworten: {highScore.score} <br />
        - Fehler: {highScore.totalMistakes} <br />
        - Zeit der aktuellen Runde:{" "}
        {highScore.time === Infinity
          ? "—"
          : highScore.time.toFixed(2) + " Sekunden"}{" "}
        <br />
        <strong>Highscore:</strong> <br />
        Name: {highScore.name || "—"} <br />
        Beste Zeit:{" "}
        {highScore.time === Infinity
          ? "—"
          : highScore.time.toFixed(2) + " Sekunden"}
      </p>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={onRestart}>
          Neues Spiel starten
        </button>
        <button style={styles.resetButton} onClick={onResetHighScore}>
          Highscore zurücksetzen
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  subTitle: {
    fontSize: "20px",
    marginBottom: "10px",
  },
  question: {
    fontSize: "18px",
    marginBottom: "20px",
  },
  gameContainer: {
    transition: "background-color 0.5s",
    padding: "20px",
    borderRadius: "8px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  button: {
    padding: "15px 20px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    minWidth: "100px",
  },
  resetButton: {
    padding: "15px 20px",
    fontSize: "16px",
    backgroundColor: "#FF5733",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    minWidth: "100px",
  },
  resultText: {
    fontSize: "16px",
    marginBottom: "20px",
  },
};

export default App;
