import React from "react";
import { getTileClass } from "../../utils/utils";
import "./Tile.scss";

const isMoved = (mergedWith, row, prevRow, column, prevColumn) => {
  return (prevRow !== row || prevColumn !== column) || mergedWith
}

function Tile({ tileData }) {
  const { 
    num, 
    row, 
    column, 
    prevRow, 
    prevColumn, 
    mergedWith, 
    isDeleted, 
    isNewTile 
  } = tileData;

  const classArray = ['tile'];
  classArray.push(getTileClass(num));

  if(isDeleted) 
    classArray.push('deleted')
  
  if (!mergedWith || isNewTile) 
    classArray.push('row_' + row + '_column_' + column);
  
  if (isNewTile) 
    classArray.push('new');
  
  if (!isNewTile && isMoved(mergedWith, row, prevRow, column, prevColumn)) {
    classArray.push('move_row_from_' + prevRow + '_to_' + row);
    classArray.push('move_column_from_' + prevColumn + '_to_' + column);
    classArray.push('isMoving');
  }
  const classes = classArray.join(' ')
  
  return (
    <div className={classes}>
      {num}
    </div>
  );
}

export default Tile;
