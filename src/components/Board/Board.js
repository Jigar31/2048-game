import React, { useCallback, useEffect, useState } from "react";

import cloneDeep from "lodash/cloneDeep";

import Block from "../Block/Block";
import Tile from "../Tile/Tile";
import "./Board.scss";

const getNewTile = (value, row, column) => {
  return {
    num: value || 0,
    mergedWith: null,
    idDeleted: false,
    row: row || -1,
    column: column || -1,
    prevRow: -1,
    prevColumn: -1,
  };
};

const initialBoardData = (row, column) => {
  return {
    num: 0,
    prevNum: 0,
    mergedWith: null,
    idDeleted: null,
    row,
    column,
    prevRow: row,
    prevColumn: column,
  };
};

const initializeBoard = (rowSize, colSize) => {
  const newBoardData = [];
  for (let i = 0; i < rowSize; i++) {
    newBoardData[i] = [];
    for (let j = 0; j < colSize; j++) {
      newBoardData[i][j] = initialBoardData(i, j);
    }
  }
  return newBoardData;
};

const getTiles = (boardData, key) => {
  const newTiles = [];

  for (let i = 0; i < boardData.length; i++) {
    for (let j = 0; j < boardData[i].length; j++) {
      if (boardData[i][j][key]) newTiles.push(boardData[i][j]);
    }
  }

  return newTiles;
};

const moveZerosToRight = (row) => {
  const filteredRow = row.filter((column) => column.num !== 0);
  const zeroCells = row.filter((column) => column.num === 0);

  return [...filteredRow, ...zeroCells];
};

const slideLeft = (row) => {
  let newRow = moveZerosToRight(row);

  for (let column = 0; column < newRow.length - 1; column++) {
    if (
      newRow[column].num !== 0 &&
      newRow[column].num === newRow[column + 1].num
    ) {
      newRow[column].prevNum = newRow[column].num;
      newRow[column].num *= 2;
      newRow[column + 1].prevNum = newRow[column + 1].num;
      newRow[column + 1].num = 0;
    }
  }

  newRow = moveZerosToRight(newRow);

  return newRow;
};

const moveHorizontal = (boardData, direction) => {
  const newBoardData = cloneDeep(boardData);
  for (let i = 0; i < newBoardData.length; i++) {
    let newRow = [];
    if (direction === "left") {
      newRow = slideLeft(newBoardData[i]);
    } else {
      newRow = cloneDeep(newBoardData[i]);
      newRow.reverse();
      newRow = slideLeft(newRow);
      newRow.reverse();
    }
    for (let column = 0; column < newRow.length; column++) {
      newRow[column].prevColumn = newRow[column].column;
      newRow[column].column = column;
    }

    newBoardData[i] = newRow;
  }
  return newBoardData;
};

const moveLeft = (boardData) => {
  return moveHorizontal(boardData, "left");
};

const moveRight = (boardData) => {
  return moveHorizontal(boardData, "right");
};

const moveVertical = (boardData, direction, setTiles) => {
  const newBoardData = cloneDeep(boardData);

  for (let i = 0; i < newBoardData.length; i++) {
    let newRow = [];

    for (let j = 0; j < newBoardData[i].length; j++) {
      newRow[j] = newBoardData[j][i];
    }

    if (direction === "up") {
      newRow = slideLeft(newRow);
    } else {
      newRow.reverse();
      newRow = slideLeft(newRow);
      newRow.reverse();
    }

    for (let row = 0; row < newRow.length; row++) {
      newRow[row].prevRow = newRow[row].row;
      newRow[row].row = row;
    }

    for (let j = 0; j < newRow.length; j++) {
      newBoardData[j][i] = newRow[j];
    }
  }

  return newBoardData;
};

const moveUp = (boardData) => {
  return moveVertical(boardData, "up");
};

const moveDown = (boardData) => {
  return moveVertical(boardData, "down");
};

const getBoardDetails = (newBoardData, prevBoardData, winNum = 2048) => {
  let hasTileMoved = false;
  let hasWon = false;
  let hasEmptyTile = false;

  for (let i = 0; i < newBoardData.length; i++) {
    for (let j = 0; j < newBoardData.length; j++) {
      if (newBoardData[i][j].num !== prevBoardData[i][j].num)
        hasTileMoved = true;
      if (newBoardData[i][j].num === winNum) hasWon = true;
      if (newBoardData[i][j].num === 0) hasEmptyTile = true;
    }
  }

  return {
    hasTileMoved,
    hasWon,
    hasLost: !hasEmptyTile && !hasWon,
  };
};

const setBoardDetails = ({
  newBoardData,
  boardData,
  won,
  setWon,
  lost,
  setLost,
  setBoardData,
  tileCollection,
  setTileCollection,
}) => {
  const { hasTileMoved, hasWon, hasLost } = getBoardDetails(
    newBoardData,
    boardData
  );

  if (hasTileMoved)
    newBoardData = addRandomTiles(
      newBoardData,
      1,
      tileCollection,
      setTileCollection
    );

  if (won !== hasWon) setWon(hasWon);
  if (lost !== hasLost) setLost(hasLost);

  setBoardData(newBoardData);
};

const addRandomTiles = (
  boardData,
  noOfTiles = 1,
  tileCollection,
  setTileCollection
) => {
  const emptyCells = [];
  for (var row = 0; row < boardData.length; row++) {
    for (var column = 0; column < boardData[row].length; column++) {
      if (boardData[row][column].num === 0) {
        emptyCells.push({ row, column });
      }
    }
  }

  const newBoardData = cloneDeep(boardData);

  for (let i = 0; i < noOfTiles; i++) {
    const randomIndex = parseInt(Math.random() * emptyCells.length);
    const cell = emptyCells[randomIndex];

    var newValue = Math.random() > 0.5 ? 4 : 2;
    newBoardData[cell.row][cell.column].num = newValue;
    newBoardData[cell.row][cell.column].prevNum = newValue;

    const newTile = getNewTile(newValue, cell.row, cell.column);
    setTileCollection([...tileCollection, newTile]);
  }

  return newBoardData;
};

const setPreviousPositionToCurrentPosition = (boardData, setBoardData) => {
  const newBoardData = cloneDeep(boardData);
  for (let i = 0; i < newBoardData.length; i++)
    for (let j = 0; j < newBoardData[i].length; j++) {
      newBoardData[i][j].prevColumn = newBoardData[i][j].column;
      newBoardData[i][j].prevRow = newBoardData[i][j].row;
    }

  setBoardData(newBoardData);
};

function Board({ rowSize, colSize, winningNumber }) {
  const [boardData, setBoardData] = useState(initializeBoard(rowSize, colSize));
  const [tiles, setTiles] = useState([]);
  const [tileCollection, setTileCollection] = useState([]);
  const [tileMoveAnimationEnded, setTileMoveAnimationEnded] = useState(false);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [count, setCount] = useState(0);

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
      let newBoardData;

      if (event.keyCode === 37) {
        newBoardData = moveLeft(boardData);
      } else if (event.keyCode === 38) {
        newBoardData = moveUp(boardData);
      } else if (event.keyCode === 39) {
        newBoardData = moveRight(boardData);
      } else if (event.keyCode === 40) {
        newBoardData = moveDown(boardData);
      }

      if (newBoardData)
        setBoardDetails({
          newBoardData,
          boardData,
          won,
          setWon,
          lost,
          setLost,
          setBoardData,
          tileCollection,
          setTileCollection,
        });
    },
    [boardData]
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
    if (!tileMoveAnimationEnded) {
      const newTiles = getTiles(boardData, "prevNum").map((tile, index) => (
        <Tile
          tileData={tile}
          key={index}
          setTileMoveAnimationEnded={setTileMoveAnimationEnded}
        />
      ));
      setTotalCount(newTiles.length);
      setTiles(newTiles);
    }
  }, [boardData, tileMoveAnimationEnded]);

  useEffect(() => {
    if (count + 1 !== totalCount) setCount(count + 1);
    console.log(count, totalCount);
    if (tileMoveAnimationEnded && count + 1 === totalCount) {
      setCount(0);
      setTotalCount(0);
      setPreviousPositionToCurrentPosition(boardData, setBoardData);
      const newTiles = getTiles(boardData, "num").map((tile, index) => (
        <Tile
          tileData={tile}
          key={index}
          setTileMoveAnimationEnded={setTileMoveAnimationEnded}
        />
      ));
      setTiles(newTiles);
      setTileMoveAnimationEnded(false);
    }
  }, [tileMoveAnimationEnded]);

  useEffect(() => {
    console.log({ tileCollection });
  }, [tileCollection]);

  return (
    <>
      {won ? <div className="won">Congratulations!! You Won</div> : null}
      {lost ? <div className="lost">You Lost</div> : null}
      <div className="board">
        {blocks}
        {tiles}
      </div>
    </>
  );
}

export default Board;
