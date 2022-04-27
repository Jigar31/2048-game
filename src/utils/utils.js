import { DIRECTIONS } from "../constants/direction.constants";
import { KEY_CODES } from "../constants/keyCodes.constants";

export const getTileClass = (blockData) => {
  switch (blockData) {
    case 2:
      return "tile-2";
    case 4:
      return "tile-4";
    case 8:
      return "tile-8";
    case 16:
      return "tile-16";
    case 32:
      return "tile-32";
    case 64:
      return "tile-64";
    case 128:
      return "tile-128";
    case 256:
      return "tile-256";
    case 512:
      return "tile-512";
    case 1024:
      return "tile-1024";
    case 2048:
      return "tile-2048";
    case 4096:
      return "tile-4096";
    case 8192:
      return "tile-8192";
    case 16384:
      return "tile-16384";
    case 32768:
      return "tile-32768";
    case 65536:
      return "tile-65536";
    default:
      return "";
  }
};

export const getScrollTypeFromArrowKeys = (keyCode) => {
  if (keyCode === KEY_CODES.LEFT_ARROW) {
    return DIRECTIONS.LEFT;
  } else if (keyCode === KEY_CODES.UP_ARROW) {
    return DIRECTIONS.UP;
  } else if (keyCode === KEY_CODES.RIGHT_ARROW) {
    return DIRECTIONS.RIGHT;
  } else if (keyCode === KEY_CODES.DOWN_ARROW) {
    return DIRECTIONS.DOWN;
  }
};

export const getScrollTypeFromScroll = (event) => {
  return getDirection(event.wheelDeltaX, event.wheelDeltaY);
};

export const getScrollTypeFromTouchMove = (currentTouch, lastTouch) => {
  const deltaX = currentTouch.clientX - lastTouch.clientX;
  const deltaY = currentTouch.clientY - lastTouch.clientY;

  return getDirection(deltaX, deltaY);
};

const getDirection = (deltaX, deltaY) => {
  const isHorizontalScroll = Math.abs(deltaX) > Math.abs(deltaY) ? true : false;

  if (isHorizontalScroll) {
    if (deltaX < 0) {
      return DIRECTIONS.LEFT;
    } else if (deltaX > 0) {
      return DIRECTIONS.RIGHT;
    }
  }

  if (!isHorizontalScroll) {
    if (deltaY < 0) {
      return DIRECTIONS.UP;
    } else if (deltaY > 0) {
      return DIRECTIONS.DOWN;
    }
  }
};

let timerId;

export const throttle = (func, delay) => {
  if (timerId) return;

  timerId = setTimeout(() => {
    func();
    clearTimeout(timerId);
    timerId = undefined;
  }, delay);
};
