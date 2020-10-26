import { TableMap } from '@atlaskit/editor-tables/table-map';

export const getCellIndex = (map: TableMap, row: number, col: number) => {
  return row * map.width + col;
};

export function hasMergedColumns(map: TableMap, row: number, col: number) {
  const index = getCellIndex(map, row, col);
  return (
    (col > 0 && map.map[index - 1] === map.map[index]) ||
    (col < map.width - 1 && map.map[index + 1] === map.map[index])
  );
}
export function hasMergedRows(map: TableMap, row: number, col: number) {
  const index = getCellIndex(map, row, col);
  return (
    (row > 0 && map.map[index - map.width] !== map.map[index]) ||
    (row < map.height - 1 && map.map[index + map.width] === map.map[index])
  );
}
export function isRootRow(map: TableMap, row: number, col: number) {
  const index = getCellIndex(map, row, col);
  return row > 0 ? map.map[index - map.width] !== map.map[index] : true;
}
export function isRootCol(map: TableMap, row: number, col: number) {
  const index = getCellIndex(map, row, col);
  return row > 0 ? map.map[index - 1] !== map.map[index] : true;
}
