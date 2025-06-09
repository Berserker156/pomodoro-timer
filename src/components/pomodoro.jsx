import React, { useState, useEffect, useRef } from 'react';

const defaultDurations = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export default function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(defaultDurations.work);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' | 'shortBreak' | 'longBreak'
  const [sessionCount, setSessionCount] = useState(0);

  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleSessionEnd = () => {
    new Audio('/ringtone.ogg').play();


    if (mode === 'work') {
      setSessionCount((prev) => prev + 1);
      if ((sessionCount + 1) % 4 === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    } else {
      switchMode('work');
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(defaultDurations[newMode]);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div>
      <h2>{mode === 'work' ? 'Work' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}</h2>
      <h1>{formatTime(timeLeft)}</h1>
      <div>
        {isRunning ? (
          <button onClick={() => setIsRunning(false)}>Pause</button>
        ) : (
          <button onClick={() => setIsRunning(true)}>{timeLeft === 0 ? 'Restart' : 'Start'}</button>
        )}
        <button onClick={() => switchMode('work')}>Reset</button>
      </div>
      <p>Completed Sessions: {sessionCount}</p>
    </div>
  );
}


// Note: Ensure you have a notification sound file at the specified path ('/notification.mp3') for the session end alert.