import { InsertDraftPosition, Position, TextPosition } from '../types';

export const calcInsertDraftPositionOnText = (
  { start: startTextPosition, end: endTextPosition }: TextPosition,
  position: Position,
): InsertDraftPosition | false => {
  const isRangePositionAroundText =
    position.from <= startTextPosition && position.to >= endTextPosition;

  if (isRangePositionAroundText) {
    return InsertDraftPosition.AROUND_TEXT;
  }

  const isRangePositionInsideText =
    position.from > startTextPosition &&
    position.from < endTextPosition &&
    position.to < endTextPosition &&
    position.to > startTextPosition;

  if (isRangePositionInsideText) {
    return InsertDraftPosition.INSIDE;
  }

  const isRangePositionStartingAtText =
    position.from >= startTextPosition &&
    position.from <= endTextPosition &&
    position.to >= endTextPosition;

  if (isRangePositionStartingAtText) {
    return InsertDraftPosition.END;
  }

  const isRangePositionEndingAtText =
    position.from <= startTextPosition &&
    position.to >= startTextPosition &&
    position.to <= endTextPosition;

  if (isRangePositionEndingAtText) {
    return InsertDraftPosition.START;
  }

  return false;
};
