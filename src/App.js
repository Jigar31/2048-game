import "./App.scss";
import Board from "./components/Board/Board";

function App() {
  const size = parseInt(process.env.REACT_APP_GRID_SIZE || 4);
  const winningNumber = parseInt(process.env.REACT_APP_WINNING_NUMBER || 2048);

  return (
    <div className="app">
      <Board rowSize={size} colSize={size} winningNumber={winningNumber} />
    </div>
  );
}

export default App;
