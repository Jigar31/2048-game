import cloneDeep from "lodash/cloneDeep";

export const initialBoardCellData = (row, column) => {
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

const moveZerosToRight = (row, clearMergeWith) => {
  const filteredRow = row.filter((column) => column.num !== 0);
  const zeroCells = row.filter((column) => column.num === 0);

  let newRow = [...filteredRow, ...zeroCells];

  if (clearMergeWith)
    newRow = newRow.map((column) => {
      column.mergedWith = null;
      return column;
    });

  return newRow;
};

const slideLeft = (row) => {
  let newRow = moveZerosToRight(row, true);
  for (let column = 0; column < newRow.length - 1; column++) {
    if (
      newRow[column].num !== 0 &&
      newRow[column].num === newRow[column + 1].num
    ) {
      newRow[column].prevNum = newRow[column].num;
      newRow[column + 1].prevNum = newRow[column + 1].num;

      newRow[column].num *= 2;
      newRow[column + 1].num = 0;

      newRow[column].mergedWith = newRow[column].id;
      newRow[column + 1].mergedWith = newRow[column].id;
      column++;
    } else {
      newRow[column].prevNum = newRow[column].num;
      newRow[column].mergedWith = null;
    }
  }

  newRow = moveZerosToRight(newRow);

  return newRow;
};

const generateTiles = (newRow) => {
  let newTiles = [];

  for (let row = 0; row < newRow.length; row++) {
    if (newRow[row].num > 0) {
      const newTile = cloneDeep(newRow[row]);
      if (newTile.num !== newTile.prevNum) newTile.isNewTile = true;

      newTiles.push(newTile);
    }
    if (newRow[row].mergedWith) {
      const newTile = cloneDeep(newRow[row]);
      const mergedTile = newRow.filter(
        (col) => col.id === newTile.mergedWith
      )[0];
      if (mergedTile) {
        newTile.num = newTile.prevNum;
        newTile.isDeleted = true;
        newTile.row = mergedTile.row;
        newTile.column = mergedTile.column;

        newTiles.push(newTile);
      }
    }
  }

  return newTiles;
};

const moveHorizontal = (boardData, direction) => {
  const newBoardData = cloneDeep(boardData);

  let newTiles = [];
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
      newRow[column].prevRow = newRow[column].row;
    }

    const generatedTiles = generateTiles(newRow);
    newTiles = [...newTiles, ...generatedTiles];

    newBoardData[i] = newRow;
  }

  return {
    newBoardData,
    newTiles,
  };
};

export const moveLeft = (boardData) => {
  return moveHorizontal(boardData, "left");
};

export const moveRight = (boardData) => {
  return moveHorizontal(boardData, "right");
};

const moveVertical = (boardData, direction) => {
  const newBoardData = cloneDeep(boardData);
  let newTiles = [];

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
      newRow[row].prevColumn = newRow[row].column;
    }

    const generatedTiles = generateTiles(newRow);
    newTiles = [...newTiles, ...generatedTiles];

    for (let j = 0; j < newRow.length; j++) {
      newBoardData[j][i] = newRow[j];
    }
  }
  return {
    newBoardData,
    newTiles,
  };
};

export const moveUp = (boardData) => {
  return moveVertical(boardData, "up");
};

export const moveDown = (boardData) => {
  return moveVertical(boardData, "down");
};

export const getBoardDetails = (newBoardData, prevBoardData, winNum = 2048) => {
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

export const addRandomTiles = (
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

  const newTiles = [];
  for (let i = 0; i < noOfTiles; i++) {
    const randomIndex = parseInt(Math.random() * emptyCells.length);
    const cell = emptyCells[randomIndex];

    var newValue = Math.random() > 0.5 ? 4 : 2;
    newBoardData[cell.row][cell.column].num = newValue;
    newBoardData[cell.row][cell.column].prevNum = newValue;
    newBoardData[cell.row][cell.column].mergedWith = null;

    const newTile = cloneDeep(newBoardData[cell.row][cell.column]);
    newTile.isNewTile = true;
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
