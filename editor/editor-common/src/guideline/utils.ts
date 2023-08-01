import {
  akEditorFullWidthLayoutWidth,
  akEditorGutterPadding,
} from '@atlaskit/editor-shared-styles';

import { Position, VerticalPosition } from './types';

export const isNumber = (x: unknown): x is number =>
  typeof x === 'number' && !isNaN(x) && isFinite(x);

export const isVerticalPosition = (pos: Position): pos is VerticalPosition => {
  return isNumber(pos.x);
};

/**
 * Calculates container or full editor width taking in account editor full width layout
 * width and editor gutter padding.
 */
export const getContainerWidthOrFullEditorWidth = (containerWidth: number) =>
  Math.min(
    containerWidth - akEditorGutterPadding * 2,
    akEditorFullWidthLayoutWidth,
  ) / 2;
