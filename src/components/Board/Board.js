import React, { useCallback, useEffect, useState } from "react";

import Block from "../Block/Block";
import Tile from "../Tile/Tile";
import "./Board.scss";
import {
  addRandomTiles,
  initializeBoard,
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
  setBoardDetails,
  sortDescendingByNewTile,
} from "../../utils/gameLogic";

function Board({ rowSize, colSize, winningNumber }) {
  const [boardData, setBoardData] = useState(initializeBoard(rowSize, colSize));
  const [tiles, setTiles] = useState([]);
  const [tileCollection, setTileCollection] = useState([]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  const blocks = boardData?.map((row, rowIndex) => {
    return (
      <div className="row" key={rowIndex}>
        {row.map((column, columnIndex) => {
          return <Block key={columnIndex} />;
        })}
      </div>
    );
  });

  const moveBoardData = useCallback(
    (event) => {
      if (won || lost) return;

      let newBoardDetails;

      if (event.keyCode === 37) {
        newBoardDetails = moveLeft(boardData);
      } else if (event.keyCode === 38) {
        newBoardDetails = moveUp(boardData);
      } else if (event.keyCode === 39) {
        newBoardDetails = moveRight(boardData);
      } else if (event.keyCode === 40) {
        newBoardDetails = moveDown(boardData);
      }

      if (newBoardDetails?.newBoardData)
        setBoardDetails({
          newBoardData: newBoardDetails.newBoardData,
          boardData,
          winningNumber,
          won,
          setWon,
          lost,
          setLost,
          setBoardData,
          newTiles: newBoardDetails.newTiles,
          setTileCollection,
        });
    },
    [boardData, won, lost]
  );

  useEffect(() => {
    document.addEventListener("keyup", moveBoardData);

    return () => {
      document.removeEventListener("keyup", moveBoardData);
    };
  }, [moveBoardData]);

  useEffect(() => {
    const newBoardData = addRandomTiles(
      boardData,
      2,
      tileCollection,
      setTileCollection
    );
    setBoardData(newBoardData);
  }, []);

  useEffect(() => {
    const newTiles = tileCollection
      .sort(sortDescendingByNewTile)
      .map((tile, index) => <Tile tileData={tile} key={index} />);
    setTiles(newTiles);
  }, [tileCollection]);

  return (
    <div className="game">
      {won || lost ? (
        <div className="overlay">
          <p className="message">
            {won ? "Congratulations!! You Won" : "You Lost"}
          </p>
        </div>
      ) : null}
      <div className="details">Winning Tile: {winningNumber}</div>

      <div className="board">
        {blocks}
        {tiles}
      </div>
    </div>
  );
}

export default Board;
