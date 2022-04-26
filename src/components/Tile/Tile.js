import React, { useEffect, useState } from "react";
import { getTileClass } from "../../utils/utils";
import "./Tile.scss";

const getPosition = (value) => {
  return `${80 * value + 3 * value + 3 * (value + 1) + 5}px`;
};

const getAnimationStyle = ({
  animate,
  prevValue,
  value,
  row,
  column,
  mergedWith,
  oldNum,
  num,
}) => {
  const fromValue = getPosition(prevValue);
  const toValue = getPosition(value);

  if (animate === "column")
    return {
      top: getPosition(row),
      "--from-left": fromValue,
      "--to-left": toValue,
      "--from-tile-row": 0,
      "--to-tileRow": 0,
      animation: "slideHorizontal 1s ease",
      // animation: `slideHorizontal_${prevValue}_to_${value} 1s ease`,
      animationFillMode: "forwards",
    };
  else if (animate === "row")
    return {
      left: getPosition(column),
      "--from-top": fromValue,
      "--to-top": toValue,
      "--from-tile-row": 0,
      "--to-tileRow": 0,
      animation: "slideVertical 1s ease",
      // animation: `slideVertical_${prevValue}_to_${value} 1s ease`,
      animationFillMode: "forwards",
    };
};

function Tile({ tileData, setTileMoveAnimationEnded }) {
  const { num, prevNum, row, column, prevRow, prevColumn, mergedWith } =
    tileData;

  const [tileNum, setTileNum] = useState(prevNum);
  const [rowChange, setRowChange] = useState(prevRow !== row);
  const [columnChange, setColumnChange] = useState(prevColumn !== column);
  const [movingAnimation, setMovingAnimation] = useState(
    rowChange || columnChange
  );
  const [style, setStyle] = useState({
    top: getPosition(row),
    left: getPosition(column),
  });

  useEffect(() => {
    setRowChange(prevRow !== row);
    setColumnChange(prevColumn !== column);
  }, [tileData]);

  useEffect(() => {
    const newMovingAnimation = rowChange || columnChange;
    setMovingAnimation(newMovingAnimation);
  }, [rowChange, columnChange]);

  useEffect(() => {
    let newStyle;

    if (movingAnimation) {
      let animationStyleObj = {
        animate: rowChange ? "row" : "column",
        prevValue: rowChange ? prevRow : prevColumn,
        value: rowChange ? row : column,
        row,
        column,
        mergedWith,
      };

      console.log(animationStyleObj);

      let animationStyle = getAnimationStyle(animationStyleObj);
      console.log(animationStyle);

      newStyle = animationStyle;
    } else
      newStyle = {
        top: getPosition(row),
        left: getPosition(column),
        animation: "",
      };

    setStyle(newStyle);
  }, [movingAnimation, row, column, num]);

  return (
    <div
      className={`tile ${getTileClass(tileNum)}`}
      style={style}
      onAnimationEnd={() => {
        let newStyle;

        if (num === 0)
          newStyle = {
            display: "none",
          };
        else
          newStyle = {
            top: getPosition(row),
            left: getPosition(column),
            animation: "",
          };
        setStyle(newStyle);
        setTileNum(num);
        setTileMoveAnimationEnded(true);
      }}
    >
      {tileNum}
    </div>
  );
}

export default Tile;
