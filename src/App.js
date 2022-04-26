import "./App.scss";
import Board from "./components/Board/Board";

function App() {
  const size = 4;

  return (
    <div className="app">
      <Board rowSize={size} colSize={size} winningNumber={2048} />
    </div>
  );
}

export default App;
