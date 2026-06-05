import { isNumber } from './isNumber';
import type { Position, VerticalPosition } from './types';

export const isVerticalPosition = (pos: Position): pos is VerticalPosition => isNumber(pos.x);

// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isNumber } from './isNumber';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isRange } from './isRange';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getGuidelineTypeFromKey } from './getGuidelineTypeFromKey';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getContainerWidthOrFullEditorWidth } from './getContainerWidthOrFullEditorWidth';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getMediaSingleDimensions } from './getMediaSingleDimensions';
