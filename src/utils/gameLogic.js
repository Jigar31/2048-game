// import cloneDeep from "lodash/cloneDeep";
// import { DIRECTIONS } from "../constants/direction.constants";

// const initialBoardCellData = (row, column) => {
//   return {
//     id: row + "" + column,
//     num: 0,
//     prevNum: -1,
//     mergedWith: null,
//     row,
//     column,
//     prevRow: row,
//     prevColumn: column,
//   };
// };

// export const initializeBoard = (rowSize, colSize) => {
//   const newBoardData = [];
//   for (let i = 0; i < rowSize; i++) {
//     newBoardData[i] = [];
//     for (let j = 0; j < colSize; j++) {
//       newBoardData[i][j] = initialBoardCellData(i, j);
//     }
//   }
//   return newBoardData;
// };

// // const clearMergeWith = (row) => {
// //   return row.map((column) => {
// //     column.mergedWith = null;
// //     return column;
// //   });
// // };

// // const moveZerosToRight = (row, clearMergeWith) => {
// //   const filteredRow = row.filter((column) => column.num !== 0);
// //   const zeroCells = row.filter((column) => column.num === 0);

// //   return [...filteredRow, ...zeroCells];
// // };

// // const canMergeWithNextCell = (cell1, cell2) => {
// //   return cell1.num !== 0 && cell1.num === cell2.num;
// // };

// // const updateMergeValues = ({ cell, num, prevNum, mergedWith }) => {
// //   const newCell = cloneDeep(cell);
// //   newCell.num = num;
// //   newCell.prevNum = prevNum;
// //   newCell.mergedWith = mergedWith;

// //   return newCell;
// // };

// // const mergeTwoCells = (cell1, cell2) => {
// //   const newCell1 = updateMergeValues({
// //     cell: cell1,
// //     num: cell1.num * 2,
// //     prevNum: cell1.num,
// //     mergedWith: cell1.id,
// //   });

// //   const newCell2 = updateMergeValues({
// //     cell: cell2,
// //     num: 0,
// //     prevNum: cell2.num,
// //     mergedWith: cell1.id,
// //   });

// //   return { newCell1, newCell2 };
// // };

// // const resetCellPreviousDetails = (cell) => {
// //   const newCell = cloneDeep(cell);
// //   newCell.prevNum = cell.num;
// //   newCell.mergedWith = null;
// //   return newCell;
// // };

// // const generateNewRowWithMergedCells = (row) => {
// //   for (let column = 0; column < row.length - 1; column++) {
// //     if (canMergeWithNextCell(row[column], row[column + 1])) {
// //       const { newCell1, newCell2 } = mergeTwoCells(
// //         row[column],
// //         row[column + 1]
// //       );
// //       row[column] = newCell1;
// //       row[column + 1] = newCell2;
// //       column++;
// //     } else {
// //       row[column] = resetCellPreviousDetails(row[column]);
// //     }
// //   }

// //   return row;
// // };

// // const slideLeft = (row) => {
// //   let newRow = clearMergeWith(row);
// //   newRow = moveZerosToRight(newRow);
// //   newRow = generateNewRowWithMergedCells(newRow);
// //   newRow = moveZerosToRight(newRow);
// //   return newRow;
// // };

// // const isNewTile = (cell) => {
// //   return cell.num !== cell.prevNum;
// // };

// // const formatNonZeroTile = (cell) => {
// //   const newTile = cloneDeep(cell);
// //   if (isNewTile(cell)) newTile.isNewTile = true;
// //   return newTile;
// // };

// // const getMergedTile = (row, mergedWith) => {
// //   return row.filter((col) => col.id === mergedWith)[0];
// // };

// // const formatToBeMergedTile = (row, rowNum) => {
// //   const newTile = cloneDeep(row[rowNum]);
// //   const mergedTile = getMergedTile(row, newTile.mergedWith);
// //   if (mergedTile) {
// //     newTile.num = newTile.prevNum;
// //     newTile.isDeleted = true;
// //     newTile.row = mergedTile.row;
// //     newTile.column = mergedTile.column;

// //     return newTile;
// //   }
// // };

// // const generateTiles = (newRow) => {
// //   let newTiles = [];

// //   for (let row = 0; row < newRow.length; row++) {
// //     if (newRow[row].num > 0) {
// //       const newTile = formatNonZeroTile(newRow[row]);
// //       newTiles.push(newTile);
// //     }

// //     if (newRow[row].mergedWith) {
// //       const newTile = formatToBeMergedTile(newRow, row);
// //       if (newTile) newTiles.push(newTile);
// //     }
// //   }

// //   return newTiles;
// // };

// // const slideRight = (row) => {
// //   let newRow = cloneDeep(row);
// //   newRow.reverse();
// //   newRow = slideLeft(newRow);
// //   newRow.reverse();
// //   return newRow;
// // };

// // const slide = (row, direction) => {
// //   return direction === DIRECTIONS.LEFT || direction === DIRECTIONS.UP
// //     ? slideLeft(row)
// //     : slideRight(row);
// // };

// // const resetPositionForHorizontalCells = (row) => {
// //   const newRow = cloneDeep(row);
// //   for (let column = 0; column < newRow.length; column++) {
// //     newRow[column].prevColumn = newRow[column].column;
// //     newRow[column].column = column;
// //     newRow[column].prevRow = newRow[column].row;
// //   }

// //   return newRow;
// // };

// // const moveHorizontal = (boardData, direction) => {
// //   const newBoardData = cloneDeep(boardData);

// //   let newTiles = [];
// //   for (let row = 0; row < newBoardData.length; row++) {
// //     let newRow = slide(newBoardData[row], direction);
// //     newRow = resetPositionForHorizontalCells(newRow);

// //     const generatedTiles = generateTiles(newRow);
// //     newTiles = [...newTiles, ...generatedTiles];

// //     newBoardData[row] = newRow;
// //   }

// //   return {
// //     newBoardData,
// //     newTiles,
// //   };
// // };

// // const generateColumnArray = (boardData, column) => {
// //   const columnArray = [];
// //   for (let row = 0; row < boardData.length; row++) {
// //     columnArray.push(boardData[row][column]);
// //   }
// //   return columnArray;
// // };

// // const resetPositionForVertical = (columnArray) => {
// //   const newColumnArray = cloneDeep(columnArray);
// //   for (let row = 0; row < newColumnArray.length; row++) {
// //     newColumnArray[row].prevRow = newColumnArray[row].row;
// //     newColumnArray[row].row = row;
// //     newColumnArray[row].prevColumn = newColumnArray[row].column;
// //   }

// //   return newColumnArray;
// // };

// // const moveVertical = (boardData, direction) => {
// //   const newBoardData = cloneDeep(boardData);
// //   let newTiles = [];

// //   for (let column = 0; column < newBoardData[0].length; column++) {
// //     let columnArray = generateColumnArray(newBoardData, column);
// //     columnArray = slide(columnArray, direction);
// //     columnArray = resetPositionForVertical(columnArray);

// //     const generatedTiles = generateTiles(columnArray);
// //     newTiles = [...newTiles, ...generatedTiles];

// //     for (let row = 0; row < columnArray.length; row++) {
// //       newBoardData[row][column] = columnArray[row];
// //     }
// //   }

// //   return {
// //     newBoardData,
// //     newTiles,
// //   };
// // };

// const getBoardDetails = (newBoardData, prevBoardData, winNum = 2048) => {
//   let hasTileMoved = false;
//   let hasWon = false;
//   let hasEmptyTile = false;

//   for (let i = 0; i < newBoardData.length; i++) {
//     for (let j = 0; j < newBoardData.length; j++) {
//       if (newBoardData[i][j].num !== prevBoardData[i][j].num)
//         hasTileMoved = true;
//       if (newBoardData[i][j].num === winNum) hasWon = true;
//       if (newBoardData[i][j].num === 0) hasEmptyTile = true;
//     }
//   }

//   return {
//     hasTileMoved,
//     hasWon,
//     hasLost: !hasEmptyTile && !hasWon,
//   };
// };

// export const setBoardDetails = ({
//   newBoardData,
//   boardData,
//   winningNumber,
//   won,
//   setWon,
//   lost,
//   setLost,
//   setBoardData,
//   newTiles,
//   setTileCollection,
// }) => {
//   const { hasTileMoved, hasWon, hasLost } = getBoardDetails(
//     newBoardData,
//     boardData,
//     winningNumber
//   );

//   if (hasTileMoved)
//     newBoardData = addRandomTiles(newBoardData, 1, newTiles, setTileCollection);

//   if (won !== hasWon) setWon(hasWon);
//   if (lost !== hasLost) setLost(hasLost);

//   setBoardData(newBoardData);
// };

// const getEmptyCells = (boardData) => {
//   const emptyCells = [];

//   for (var row = 0; row < boardData.length; row++) {
//     for (var column = 0; column < boardData[row].length; column++) {
//       if (boardData[row][column].num === 0) {
//         emptyCells.push({ row, column });
//       }
//     }
//   }

//   return emptyCells;
// };

// const setToNewTile = (cell) => {
//   const newTile = cloneDeep(cell);
//   newTile.isNewTile = true;
//   return newTile;
// };

// const updateCellValues = (cell, newNum) => {
//   const newCell = cloneDeep(cell);
//   newCell.num = newNum;
//   newCell.prevNum = newNum;
//   newCell.mergedWith = null;

//   return newCell;
// };

// const updateNumOfRandomEmptyCell = (emptyCells, boardData) => {
//   const randomIndex = parseInt(Math.random() * emptyCells.length);
//   const randomCell = emptyCells[randomIndex];

//   const newNum = Math.random() > 0.5 ? 4 : 2;
//   const cell = boardData[randomCell.row][randomCell.column];
//   return updateCellValues(cell, newNum);
// };

// export const addRandomTiles = (
//   boardData,
//   noOfTiles = 1,
//   tileCollection,
//   setTileCollection
// ) => {
//   const emptyCells = getEmptyCells(boardData);
//   const newBoardData = cloneDeep(boardData);

//   const newTiles = [];
//   for (let i = 0; i < noOfTiles; i++) {
//     const cell = updateNumOfRandomEmptyCell(emptyCells, boardData);
//     newBoardData[cell.row][cell.column] = cell;
//     const newTile = setToNewTile(cell);
//     newTiles.push(newTile);
//   }

//   setTileCollection([...tileCollection, ...newTiles]);

//   return newBoardData;
// };

// export const sortDescendingByNewTile = (a, b) => {
//   if (a.isNewTile !== null && a.isNewTile === b.isNewTile) return 0;

//   if (a.isNewTile && !b.isNewTile) return 1;

//   if (!a.isNewTile && b.isNewTile) return -1;
// };

// // export const moveTiles = (boardData, scrollType) => {
// //   if (scrollType === DIRECTIONS.LEFT)
// //     return moveHorizontal(boardData, DIRECTIONS.LEFT);
// //   else if (scrollType === DIRECTIONS.RIGHT)
// //     return moveHorizontal(boardData, DIRECTIONS.RIGHT);
// //   else if (scrollType === DIRECTIONS.UP)
// //     return moveVertical(boardData, DIRECTIONS.UP);
// //   else if (scrollType === DIRECTIONS.DOWN)
// //     return moveVertical(boardData, DIRECTIONS.DOWN);
// // };
