// This file defines a number of helpers for wiring up user input to
// table-related functionality.

import { keydownHandler } from 'prosemirror-keymap';
import { ResolvedPos, Slice } from 'prosemirror-model';
import { EditorState, Selection, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { CellSelection } from '../cell-selection';
import { Axis, CommandWithView, Direction, Dispatch } from '../types';
import { tableNodeTypes } from '../utils';
import { cellAround, nextCell } from '../utils/cells';
import { inSameTable } from '../utils/tables';

import { tableEditingKey } from './plugin-key';

export const handleKeyDown = keydownHandler({
  ArrowLeft: arrow('horiz', -1),
  ArrowRight: arrow('horiz', 1),
  ArrowUp: arrow('vert', -1),
  ArrowDown: arrow('vert', 1),

  'Shift-ArrowLeft': shiftArrow('horiz', -1),
  'Shift-ArrowRight': shiftArrow('horiz', 1),
  'Shift-ArrowUp': shiftArrow('vert', -1),
  'Shift-ArrowDown': shiftArrow('vert', 1),

  Backspace: deleteCellSelection,
  'Mod-Backspace': deleteCellSelection,
  Delete: deleteCellSelection,
  'Mod-Delete': deleteCellSelection,
});

function maybeSetSelection(
  state: EditorState,
  dispatch: Dispatch,
  selection: Selection,
): boolean {
  if (selection.eq(state.selection)) {
    return false;
  }
  if (dispatch) {
    dispatch(state.tr.setSelection(selection).scrollIntoView());
  }
  return true;
}

function arrow(axis: Axis, dir: Direction): CommandWithView {
  return (state, dispatch, view) => {
    if (dispatch) {
      const sel = state.selection;
      if (sel instanceof CellSelection) {
        return maybeSetSelection(
          state,
          dispatch,
          Selection.near(sel.$headCell, dir),
        );
      }
      if (axis !== 'horiz' && !sel.empty) {
        return false;
      }
      const end = view ? atEndOfCell(view, axis, dir) : null;
      if (end === null) {
        return false;
      }
      if (axis === 'horiz') {
        return maybeSetSelection(
          state,
          dispatch,
          Selection.near(state.doc.resolve(sel.head + dir), dir),
        );
      }
      const $cell = state.doc.resolve(end);
      const $next = nextCell($cell, axis, dir);
      let newSel;
      if ($next) {
        newSel = Selection.near($next, 1);
      } else if (dir < 0) {
        newSel = Selection.near(state.doc.resolve($cell.before(-1)), -1);
      } else {
        newSel = Selection.near(state.doc.resolve($cell.after(-1)), 1);
      }
      return maybeSetSelection(state, dispatch, newSel);
    }

    return true;
  };
}

function shiftArrow(axis: Axis, dir: Direction): CommandWithView {
  return (state, dispatch, view) => {
    let sel = state.selection as CellSelection;
    if (!(sel instanceof CellSelection)) {
      const end = view ? atEndOfCell(view, axis, dir) : null;
      if (end === null) {
        return false;
      }
      sel = new CellSelection(state.doc.resolve(end));
    }
    const $head = nextCell(sel.$headCell, axis, dir);
    if (!$head) {
      return false;
    }
    if (dispatch) {
      return maybeSetSelection(
        state,
        dispatch,
        new CellSelection(sel.$anchorCell, $head),
      );
    }

    return true;
  };
}

function deleteCellSelection(state: EditorState, dispatch: Dispatch): boolean {
  const sel = state.selection;
  if (!(sel instanceof CellSelection)) {
    return false;
  }
  if (dispatch) {
    const { tr } = state;
    const baseContent = tableNodeTypes(state.schema).cell.createAndFill()!
      .content;
    sel.forEachCell((cell, pos) => {
      if (!cell.content.eq(baseContent)) {
        tr.replace(
          tr.mapping.map(pos + 1),
          tr.mapping.map(pos + cell.nodeSize - 1),
          new Slice(baseContent, 0, 0),
        );
      }
    });
    if (tr.docChanged) {
      dispatch(tr);
    }
  }
  return true;
}

export function handleTripleClick(view: EditorView, pos: number): boolean {
  const { doc } = view.state;
  const $cell = cellAround(doc.resolve(pos));
  if (!$cell) {
    return false;
  }
  view.dispatch(view.state.tr.setSelection(new CellSelection($cell)));
  return true;
}

export function handleMouseDown(view: EditorView, event: Event): boolean {
  const startEvent = event as MouseEvent;
  if (startEvent.ctrlKey || startEvent.metaKey) {
    return false;
  }

  const startDOMCell = domInCell(view, startEvent.target as HTMLElement);
  const $anchor = cellAround(view.state.selection.$anchor);
  if (startEvent.shiftKey && view.state.selection instanceof CellSelection) {
    // Adding to an existing cell selection
    setCellSelection(view.state.selection.$anchorCell, startEvent);
    startEvent.preventDefault();
  } else if (
    startEvent.shiftKey &&
    startDOMCell &&
    $anchor !== null &&
    cellUnderMouse(view, startEvent)!.pos !== $anchor.pos
  ) {
    // Adding to a selection that starts in another cell (causing a
    // cell selection to be created).
    setCellSelection($anchor, startEvent);
    startEvent.preventDefault();
  } else if (!startDOMCell) {
    // Not in a cell, let the default behavior happen.
    return false;
  }

  // Create and dispatch a cell selection between the given anchor and
  // the position under the mouse.
  function setCellSelection(
    $selectionAnchor: ResolvedPos,
    event: Event,
  ): boolean | undefined {
    let $head = cellUnderMouse(view, event as MouseEvent);
    const starting = tableEditingKey.getState(view.state) == null;
    if (!$head || !inSameTable($selectionAnchor, $head)) {
      if (starting) {
        $head = $selectionAnchor;
      } else {
        return false;
      }
    }
    const selection = new CellSelection($selectionAnchor, $head);
    if (starting || !view.state.selection.eq(selection)) {
      const tr = view.state.tr.setSelection(selection);
      if (starting) {
        tr.setMeta(tableEditingKey, $selectionAnchor.pos);
      }
      view.dispatch(tr);
    }
  }

  // Stop listening to mouse motion events.
  function stop(): void {
    view.root.removeEventListener('mouseup', stop);
    view.root.removeEventListener('dragstart', stop);
    view.root.removeEventListener('mousemove', move);
    if (tableEditingKey.getState(view.state) != null) {
      view.dispatch(view.state.tr.setMeta(tableEditingKey, -1));
    }
  }

  function move(event: Event): void {
    const anchor = tableEditingKey.getState(view.state);
    let $moveAnchor;
    if (anchor != null) {
      // Continuing an existing cross-cell selection
      $moveAnchor = view.state.doc.resolve(anchor);
    } else if (domInCell(view, event.target as HTMLElement) !== startDOMCell) {
      // Moving out of the initial cell -- start a new cell selection
      $moveAnchor = cellUnderMouse(view, startEvent);
      if (!$moveAnchor) {
        stop();
        return;
      }
    }
    if ($moveAnchor) {
      setCellSelection($moveAnchor, event);
    }
  }
  view.root.addEventListener('mouseup', stop);
  view.root.addEventListener('dragstart', stop);
  view.root.addEventListener('mousemove', move);

  return false;
}

// Check whether the cursor is at the end of a cell (so that further
// motion would move out of the cell)
function atEndOfCell(
  view: EditorView,
  axis: Axis,
  dir: Direction,
): number | null {
  if (!(view.state.selection instanceof TextSelection)) {
    return null;
  }
  const { $head } = view.state.selection;
  for (let d = $head.depth - 1; d >= 0; d--) {
    const parent = $head.node(d);
    const index = dir < 0 ? $head.index(d) : $head.indexAfter(d);
    if (index !== (dir < 0 ? 0 : parent.childCount)) {
      return null;
    }
    if (
      parent.type.spec.tableRole === 'cell' ||
      parent.type.spec.tableRole === 'header_cell'
    ) {
      const cellPos = $head.before(d);
      const dirStr =
        // eslint-disable-next-line no-nested-ternary
        axis === 'vert'
          ? dir > 0
            ? 'down'
            : 'up'
          : dir > 0
          ? 'right'
          : 'left';
      return view.endOfTextblock(dirStr) ? cellPos : null;
    }
  }
  return null;
}

function domInCell(view: EditorView, inputDom?: Node): Node | null {
  let dom: Node | undefined | null = inputDom;
  for (; dom && dom !== view.dom; dom = dom.parentNode) {
    if (dom.nodeName === 'TD' || dom.nodeName === 'TH') {
      return dom;
    }
  }
  return null;
}

function cellUnderMouse(
  view: EditorView,
  event: MouseEvent,
): ResolvedPos | null {
  const mousePos = view.posAtCoords({
    left: event.clientX,
    top: event.clientY,
  });
  if (!mousePos) {
    return null;
  }
  return cellAround(view.state.doc.resolve(mousePos.pos));
}
