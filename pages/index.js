import { useState, useEffect } from 'react';

export default function TabataTimer() {
  const WORKOUT_TIME = 1200; // 20 minutes in seconds
  const REST_TIME = 20;
  const TOTAL_ROUNDS = 100;

  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [round, setRound] = useState(1);
  const [endTime, setEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(WORKOUT_TIME);

  useEffect(() => {
    let timer;
    if (isRunning && endTime) {
      timer = setInterval(() => {
        const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          if (isResting) {
            setIsResting(false);
            setRound((prev) => prev + 1);
            if (round >= TOTAL_ROUNDS) {
              setIsRunning(false);
              notify("Tabata Timer", "Workout and rest complete!");
            } else {
              setEndTime(Date.now() + WORKOUT_TIME * 1000);
              notify("Tabata Timer", `Round ${round + 1} - Resume!`);
            }
          } else {
            setIsResting(true);
            setEndTime(Date.now() + REST_TIME * 1000);
            notify("Break", "Rest!");
          }
        }
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isRunning, endTime, isResting, round]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setEndTime(Date.now() + (isResting ? REST_TIME : WORKOUT_TIME) * 1000);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsResting(false);
    setRound(1);
    setEndTime(null);
    setTimeLeft(WORKOUT_TIME);
  };

  const notify = (title, message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body: message });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body: message });
        }
      });
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Tabata Timer</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={startTimer}
          disabled={isRunning}
          style={{
            padding: '10px 20px',
            backgroundColor: isRunning ? '#ccc' : '#ff4d4d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
          }}
        >
          Start Timer
        </button>
        <button
          onClick={stopTimer}
          disabled={!isRunning}
          style={{
            padding: '10px 20px',
            backgroundColor: !isRunning ? '#ccc' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: !isRunning ? 'not-allowed' : 'pointer',
          }}
        >
          Stop Timer
        </button>
        <button
          onClick={resetTimer}
          style={{
            padding: '10px 20px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Reset Timer
        </button>
      </div>
      <p>{isRunning ? (isResting ? "Rest!" : "Timer is running!") : "Timer is not running."}</p>
      <p>Time Left: {formatTime(timeLeft)}</p>
      <p>Round: {round}/{TOTAL_ROUNDS}</p>
    </div>
  );
}
