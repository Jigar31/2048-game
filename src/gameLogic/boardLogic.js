import cloneDeep from "lodash/cloneDeep";

export const initializeBoard = (rowSize, colSize) => {
  const newBoardData = [];
  for (let i = 0; i < rowSize; i++) {
    newBoardData[i] = [];
    for (let j = 0; j < colSize; j++) {
      newBoardData[i][j] = initialBoardCellData(i, j);
    }
  }
  return newBoardData;
};

export const addRandomTiles = (
  boardData,
  noOfTiles = 1,
  tileCollection,
  setTileCollection
) => {
  const emptyCells = getEmptyCells(boardData);
  const newBoardData = cloneDeep(boardData);

  const newTiles = [];
  for (let i = 0; i < noOfTiles; i++) {
    const cell = updateNumOfRandomEmptyCell(emptyCells, boardData);
    newBoardData[cell.row][cell.column] = cell;
    const newTile = setToNewTile(cell);
    newTiles.push(newTile);
  }

  setTileCollection([...tileCollection, ...newTiles]);

  return newBoardData;
};

export const sortDescendingByNewTile = (a, b) => {
  if (a.isNewTile !== null && a.isNewTile === b.isNewTile) return 0;

  if (a.isNewTile && !b.isNewTile) return 1;

  if (!a.isNewTile && b.isNewTile) return -1;
};

export const setBoardDetails = ({
  newBoardData,
  boardData,
  winningNumber,
  won,
  setWon,
  lost,
  setLost,
  setBoardData,
  newTiles,
  setTileCollection,
}) => {
  const { hasTileMoved, hasWon, hasLost } = getBoardDetails(
    newBoardData,
    boardData,
    winningNumber
  );

  if (hasTileMoved)
    newBoardData = addRandomTiles(newBoardData, 1, newTiles, setTileCollection);

  if (won !== hasWon) setWon(hasWon);
  if (lost !== hasLost) setLost(hasLost);

  setBoardData(newBoardData);
};

const initialBoardCellData = (row, column) => {
  return {
    id: row + "" + column,
    num: 0,
    prevNum: -1,
    mergedWith: null,
    row,
    column,
    prevRow: row,
    prevColumn: column,
  };
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

const getEmptyCells = (boardData) => {
  const emptyCells = [];

  for (var row = 0; row < boardData.length; row++) {
    for (var column = 0; column < boardData[row].length; column++) {
      if (boardData[row][column].num === 0) {
        emptyCells.push({ row, column });
      }
    }
  }

  return emptyCells;
};

const setToNewTile = (cell) => {
  const newTile = cloneDeep(cell);
  newTile.isNewTile = true;
  return newTile;
};

const updateCellValues = (cell, newNum) => {
  const newCell = cloneDeep(cell);
  newCell.num = newNum;
  newCell.prevNum = newNum;
  newCell.mergedWith = null;

  return newCell;
};

const updateNumOfRandomEmptyCell = (emptyCells, boardData) => {
  const randomIndex = parseInt(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomIndex];

  const newNum = Math.random() > 0.5 ? 4 : 2;
  const cell = boardData[randomCell.row][randomCell.column];
  return updateCellValues(cell, newNum);
};
