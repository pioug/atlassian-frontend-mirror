import { Path } from '../domain';

export function pathsEqual(path1: Path, path2: Path) {
  if (
    !Array.isArray(path1) ||
    !Array.isArray(path2) ||
    path1.length !== path2.length
  ) {
    return false;
  }

  const isEqual = path1.reduce((wasEqual, folder, i) => {
    return wasEqual && folder.id === path2[i].id;
  }, true);

  return isEqual;
}
