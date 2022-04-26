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
