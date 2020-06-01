import { Selection } from 'prosemirror-state';
import { findDomRefAtPos, DomAtPos } from 'prosemirror-utils';
import { findSelectionPos } from './find-selection-pos';

export const findSelectionRef = (
  selection: Selection,
  domAtPos: DomAtPos,
): HTMLElement | null => {
  const $pos = findSelectionPos(selection);

  if ($pos === null) {
    return null;
  }

  return findDomRefAtPos($pos.pos, domAtPos) as HTMLElement | null;
};
