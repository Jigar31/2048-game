import "./App.scss";
import Board from "./components/Board/Board";

function App() {
  const size = parseInt(process.env.REACT_APP_CUSTOM_ENV_VAR_GRID_SIZE);
  const winningNumber = parseInt(
    process.env.REACT_APP_CUSTOM_ENV_VAR_WINNING_NUMBER
  );

  return (
    <div className="app">
      <Board rowSize={size} colSize={size} winningNumber={winningNumber} />
    </div>
  );
}

export default App;
