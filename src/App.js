import "./App.scss";
import Board from "./components/Board/Board";

function App() {
  const size = parseInt(process.env.REACT_APP_GRID_SIZE);
  const winningNumber = parseInt(process.env.REACT_APP_WINNING_NUMBER);

  return (
    <div className="app">
      <Board rowSize={size} colSize={size} winningNumber={winningNumber} />
    </div>
  );
}

export default App;
