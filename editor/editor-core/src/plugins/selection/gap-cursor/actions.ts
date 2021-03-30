import {
  EditorState,
  Selection,
  TextSelection,
  NodeSelection,
  Transaction,
} from 'prosemirror-state';
import { removeNodeBefore, findDomRefAtPos } from 'prosemirror-utils';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common';
import { Direction, isBackward, isForward } from './direction';
import { GapCursorSelection, Side } from './selection';
import { isTextBlockNearPos, getMediaNearPos } from './utils';
import { isValidTargetNode } from './utils/is-valid-target-node';
import { Command } from '../../../types';
import {
  atTheBeginningOfDoc,
  atTheEndOfDoc,
} from '../../../utils/prosemirror/position';
import { gapCursorPluginKey } from '../pm-plugins/gap-cursor-plugin-key';

type MapDirection = { [name in Direction]: number };
const mapDirection: MapDirection = {
  [Direction.LEFT]: -1,
  [Direction.RIGHT]: 1,
  [Direction.UP]: -1,
  [Direction.DOWN]: 1,
  [Direction.BACKWARD]: -1,
  [Direction.FORWARD]: 1,
};

function shouldHandleMediaGapCursor(
  dir: Direction,
  state: EditorState,
): boolean {
  const { doc, schema, selection } = state;
  let $pos = isBackward(dir) ? selection.$from : selection.$to;

  if (selection instanceof TextSelection) {
    // Should not use gap cursor if I am moving from a text selection into a media node
    if (
      (dir === Direction.UP && !atTheBeginningOfDoc(state)) ||
      (dir === Direction.DOWN && !atTheEndOfDoc(state))
    ) {
      const media = getMediaNearPos(doc, $pos, schema, mapDirection[dir]);
      if (media) {
        return false;
      }
    }

    // Should not use gap cursor if I am moving from a text selection into a media node with layout wrap-right or wrap-left
    if (dir === Direction.LEFT || dir === Direction.RIGHT) {
      const media = getMediaNearPos(doc, $pos, schema, mapDirection[dir]);
      const { mediaSingle } = schema.nodes;
      if (
        media &&
        media.type === mediaSingle &&
        (media.attrs.layout === 'wrap-right' ||
          media.attrs.layout === 'wrap-left')
      ) {
        return false;
      }
    }
  }

  if (selection instanceof NodeSelection) {
    // Should not use gap cursor if I am moving left/right from media node with layout wrap right or wrap-left
    if (dir === Direction.LEFT || dir === Direction.RIGHT) {
      const maybeMedia = doc.nodeAt(selection.$from.pos);
      const { mediaSingle } = schema.nodes;
      if (
        maybeMedia &&
        maybeMedia.type === mediaSingle &&
        (maybeMedia.attrs.layout === 'wrap-right' ||
          maybeMedia.attrs.layout === 'wrap-left')
      ) {
        return false;
      }
    }
  }
  return true;
}

export type DirectionString =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'forward'
  | 'backward';

export const arrow = (
  dir: Direction,
  endOfTextblock?: (dir: DirectionString, state?: EditorState) => boolean,
): Command => (state, dispatch, view) => {
  const { doc, schema, selection, tr } = state;

  let $pos = isBackward(dir) ? selection.$from : selection.$to;
  let mustMove = selection.empty;

  // start from text selection
  if (selection instanceof TextSelection) {
    // if cursor is in the middle of a text node, do nothing
    if (!endOfTextblock || !endOfTextblock(dir.toString() as DirectionString)) {
      return false;
    }

    // UP/DOWN jumps to the nearest texblock skipping gapcursor whenever possible
    if (
      (dir === Direction.UP &&
        !atTheBeginningOfDoc(state) &&
        isTextBlockNearPos(doc, schema, $pos, -1)) ||
      (dir === Direction.DOWN &&
        (atTheEndOfDoc(state) || isTextBlockNearPos(doc, schema, $pos, 1)))
    ) {
      return false;
    }
    // otherwise resolve previous/next position
    $pos = doc.resolve(isBackward(dir) ? $pos.before() : $pos.after());
    mustMove = false;
  }

  if (selection instanceof NodeSelection) {
    if (selection.node.isInline) {
      return false;
    }
    if (dir === Direction.UP || dir === Direction.DOWN) {
      // We dont add gap cursor on node selections going up and down
      return false;
    }
  }

  if (!shouldHandleMediaGapCursor(dir, state)) {
    return false;
  }

  // when jumping between block nodes at the same depth, we need to reverse cursor without changing ProseMirror position
  if (
    selection instanceof GapCursorSelection &&
    // next node allow gap cursor position
    isValidTargetNode(isBackward(dir) ? $pos.nodeBefore : $pos.nodeAfter) &&
    // gap cursor changes block node
    ((isBackward(dir) && selection.side === Side.LEFT) ||
      (isForward(dir) && selection.side === Side.RIGHT))
  ) {
    // reverse cursor position
    if (dispatch) {
      dispatch(
        tr
          .setSelection(
            new GapCursorSelection(
              $pos,
              selection.side === Side.RIGHT ? Side.LEFT : Side.RIGHT,
            ),
          )
          .scrollIntoView(),
      );
    }
    return true;
  }

  if (view) {
    const domAtPos = view.domAtPos.bind(view);
    const target = findDomRefAtPos($pos.pos, domAtPos) as HTMLElement;

    if (target && target.textContent === ZERO_WIDTH_SPACE) {
      return false;
    }
  }

  const nextSelection = GapCursorSelection.findFrom(
    $pos,
    isBackward(dir) ? -1 : 1,
    mustMove,
  );

  if (!nextSelection) {
    return false;
  }

  if (
    !isValidTargetNode(
      isForward(dir)
        ? nextSelection.$from.nodeBefore
        : nextSelection.$from.nodeAfter,
    )
  ) {
    // reverse cursor position
    if (dispatch) {
      dispatch(
        tr
          .setSelection(
            new GapCursorSelection(
              nextSelection.$from,
              isForward(dir) ? Side.LEFT : Side.RIGHT,
            ),
          )
          .scrollIntoView(),
      );
    }
    return true;
  }

  if (dispatch) {
    dispatch(tr.setSelection(nextSelection).scrollIntoView());
  }
  return true;
};

export const deleteNode = (dir: Direction): Command => (state, dispatch) => {
  if (state.selection instanceof GapCursorSelection) {
    const { $from, $anchor } = state.selection;
    let { tr } = state;
    if (isBackward(dir)) {
      if (state.selection.side === 'left') {
        tr.setSelection(new GapCursorSelection($anchor, Side.RIGHT));
        if (dispatch) {
          dispatch(tr);
        }
        return true;
      }
      tr = removeNodeBefore(state.tr);
    } else if ($from.nodeAfter) {
      tr = tr.delete($from.pos, $from.pos + $from.nodeAfter.nodeSize);
    }
    if (dispatch) {
      dispatch(
        tr
          .setSelection(
            Selection.near(
              tr.doc.resolve(tr.mapping.map(state.selection.$from.pos)),
            ),
          )
          .scrollIntoView(),
      );
    }
    return true;
  }
  return false;
};

export const setGapCursorAtPos = (
  position: number,
  side: Side = Side.LEFT,
): Command => (state, dispatch) => {
  // @see ED-6231
  if (position > state.doc.content.size) {
    return false;
  }

  const $pos = state.doc.resolve(position);

  if (GapCursorSelection.valid($pos)) {
    if (dispatch) {
      dispatch(state.tr.setSelection(new GapCursorSelection($pos, side)));
    }
    return true;
  }

  return false;
};

// This function captures clicks outside of the ProseMirror contentEditable area
// see also description of "handleClick" in gap-cursor pm-plugin
const captureCursorCoords = (
  event: React.MouseEvent<any>,
  editorRef: HTMLElement,
  posAtCoords: (coords: {
    left: number;
    top: number;
  }) => { pos: number; inside: number } | null | void,
  tr: Transaction,
): { position?: number; side: Side } | null => {
  const rect = editorRef.getBoundingClientRect();

  // capture clicks before the first block element
  if (event.clientY < rect.top) {
    return { position: 0, side: Side.LEFT };
  }

  if (rect.left > 0) {
    // calculate start position of a node that is vertically at the same level
    const coords = posAtCoords({
      left: rect.left,
      top: event.clientY,
    });
    if (coords && coords.inside > -1) {
      const $from = tr.doc.resolve(coords.inside);
      const start = $from.before(1);

      const side = event.clientX < rect.left ? Side.LEFT : Side.RIGHT;
      let position;
      if (side === Side.LEFT) {
        position = start;
      } else {
        const node = tr.doc.nodeAt(start);
        if (node) {
          position = start + node.nodeSize;
        }
      }

      return { position, side };
    }
  }

  return null;
};

export const setSelectionTopLevelBlocks = (
  tr: Transaction,
  event: React.MouseEvent<any>,
  editorRef: HTMLElement,
  posAtCoords: (coords: {
    left: number;
    top: number;
  }) => { pos: number; inside: number } | null | void,
  editorFocused: boolean,
) => {
  const cursorCoords = captureCursorCoords(event, editorRef, posAtCoords, tr);
  if (!cursorCoords) {
    return;
  }

  const $pos =
    cursorCoords.position !== undefined
      ? tr.doc.resolve(cursorCoords.position!)
      : null;

  if ($pos === null) {
    return;
  }

  const isGapCursorAllowed =
    cursorCoords.side === Side.LEFT
      ? isValidTargetNode($pos.nodeAfter)
      : isValidTargetNode($pos.nodeBefore);

  if (isGapCursorAllowed && GapCursorSelection.valid($pos)) {
    // this forces PM to re-render the decoration node if we change the side of the gap cursor, it doesn't do it by default
    if (tr.selection instanceof GapCursorSelection) {
      tr.setSelection(Selection.near($pos));
    } else {
      tr.setSelection(new GapCursorSelection($pos, cursorCoords.side));
    }
  }
  // try to set text selection if the editor isnt focused
  // if the editor is focused, we are most likely dragging a selection outside.
  else if (editorFocused === false) {
    const selectionTemp = Selection.findFrom(
      $pos,
      cursorCoords.side === Side.LEFT ? 1 : -1,
      true,
    );
    if (selectionTemp) {
      tr.setSelection(selectionTemp);
    }
  }
};

export const setCursorForTopLevelBlocks = (
  event: React.MouseEvent<any>,
  editorRef: HTMLElement,
  posAtCoords: (coords: {
    left: number;
    top: number;
  }) => { pos: number; inside: number } | null | void,
  editorFocused: boolean,
): Command => (state, dispatch) => {
  const { tr } = state;
  setSelectionTopLevelBlocks(tr, event, editorRef, posAtCoords, editorFocused);

  if (tr.selectionSet && dispatch) {
    dispatch(tr);
    return true;
  }

  return false;
};

export const hasGapCursorPlugin = (state: EditorState): boolean => {
  return Boolean(gapCursorPluginKey.get(state));
};
