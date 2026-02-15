import { useState, useEffect } from 'react';

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function App() {
  const [stopwatches, setStopwatches] = useState([]);

  function addStopwatch() {
    setStopwatches([...stopwatches, { id: Date.now() }]);
  }

  function deleteStopwatch(id) {
  setStopwatches(stopwatches.filter(sw => sw.id !== id));
}

  const watches = stopwatches.map((stopwatch, index) => {
    return (
      <li key={stopwatch.id}>
        <Stopwatch id={stopwatch.id} index={index + 1} deleteStopwatch={deleteStopwatch} />
      </li>
    );
  });


  return (
     <>
      <div className="app">
        <div className="app-header">
          <span className="app-title">Stopwatch</span>
          <button className="btn-add" onClick={addStopwatch}>New timer</button>
        </div>
        {stopwatches.length === 0 ? (
          <div className="empty-state">— no timers yet —</div>
        ) : (
          <ol className="watches-list">{watches}</ol>
        )}
      </div>
    </>
  );
}

function Stopwatch({ id, index, deleteStopwatch }) {
  const [time, setTime] = useState(0);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (status === "running") {
      const interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  let buttons;
  if (status === "idle") {
    buttons = (
      <button className="btn btn-start" onClick={() => setStatus("running")}>Start</button>
    );
  } else if (status === "running") {
    buttons = (
      <>
        <button className="btn btn-pause" onClick={() => setStatus("paused")}>Pause</button>
        <button className="btn btn-clear" onClick={() => { setStatus("idle"); setTime(0); }}>Clear</button>
      </>
    );
  } else if (status === "paused") {
    buttons = (
      <>
        <button className="btn btn-resume" onClick={() => setStatus("running")}>Resume</button>
        <button className="btn btn-clear" onClick={() => { setStatus("idle"); setTime(0); }}>Clear</button>
      </>
    );
  }

  return (
    <div className={`card ${status}`}>
      <div className="card-top">
        <span className="card-label">Timer {String(index).padStart(2, "0")}</span>
        <button className="btn-delete" onClick={() => deleteStopwatch(id)}>×</button>
      </div>
      <div className={`time-display ${status}`}>{formatTime(time)}</div>
      <div className="card-actions">{buttons}</div>
    </div>
  );
}
