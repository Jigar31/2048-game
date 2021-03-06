import React, { useCallback, useEffect, useState } from "react";

import Block from "../Block/Block";
import Tile from "../Tile/Tile";
import "./Board.scss";
import {
  addRandomTiles,
  initializeBoard,
  setBoardDetails,
  sortDescendingByNewTile,
} from "../../gameLogic/boardLogic";
import { moveTiles } from "../../gameLogic/moveTiles";
import { getScrollTypeFromArrowKeys } from "../../utils/utils";
import { EVENT_TYPES } from "../../constants/eventTypes.constants";
import { STRING_CONSTANTS } from "../../constants/string.constants";

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
      let scrollType;

      if (event.type === EVENT_TYPES.KEY_UP)
        scrollType = getScrollTypeFromArrowKeys(event.keyCode);

      if (!scrollType) return;
      const newBoardDetails = moveTiles(boardData, scrollType);

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
    [boardData, won, lost, winningNumber]
  );

  useEffect(() => {
    document.addEventListener(EVENT_TYPES.KEY_UP, moveBoardData);

    return () => {
      document.removeEventListener(EVENT_TYPES.KEY_UP, moveBoardData);
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
            {won ? STRING_CONSTANTS.WON_MESSAGE : STRING_CONSTANTS.LOST_MESSAGE}
          </p>
        </div>
      ) : null}
      <div className="details">
        {STRING_CONSTANTS.WINNING_TILE + " " + winningNumber}
      </div>

      <div className="board">
        {blocks}
        {tiles}
      </div>
    </div>
  );
}

export default Board;
