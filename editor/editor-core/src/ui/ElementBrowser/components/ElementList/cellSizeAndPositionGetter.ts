import {
  CollectionCellSizeAndPosition,
  CollectionCellSizeAndPositionGetter,
} from 'react-virtualized/dist/commonjs/Collection';
import { GRID_SIZE, SCROLLBAR_WIDTH } from '../../constants';
import { generateVirtualizedContainerDatum } from './utils';

/**
 * Callback responsible for returning size and offset/position information
 * for a given cell.
 * https://github.com/bvaughn/react-virtualized/blob/master/docs/Collection.md
 **/
export default function cellSizeAndPositionGetter(
  containerWidth: number,
): CollectionCellSizeAndPositionGetter {
  const GUTTER_SIZE = 4;
  /**
   * Save the currently rendered columnY positions.
   * Have to be within the current render scope.
   */
  let columnYMap: number[] = [];
  return ({ index }): CollectionCellSizeAndPosition => {
    const { columnCount, availableWidth } = generateVirtualizedContainerDatum(
      containerWidth,
      {
        gutterSize: GUTTER_SIZE,
        scrollbarWidth: SCROLLBAR_WIDTH,
      },
    );

    const width = Math.floor(availableWidth / columnCount);

    const height = GRID_SIZE * GRID_SIZE;

    const columnPosition = index % (columnCount || 1);

    const x = columnPosition * (GUTTER_SIZE + width);
    const y = columnYMap[columnPosition] || 0;

    columnYMap[columnPosition] = y + height + GUTTER_SIZE;

    return {
      height,
      width,
      x,
      y,
    };
  };
}
