import { Plugin } from 'prosemirror-state';

import { handlePaste } from '../utils';
import { drawCellSelection } from '../utils/draw-cell-selection';
import { fixTables } from '../utils/fix-tables';
import { normalizeSelection } from '../utils/normalize-selection';

import { handleKeyDown, handleMouseDown, handleTripleClick } from './input';
import { tableEditingKey } from './plugin-key';

// :: () → Plugin
//
// Creates a [plugin](http://prosemirror.net/docs/ref/#state.Plugin)
// that, when added to an editor, enables cell-selection, handles
// cell-based copy/paste, and makes sure tables stay well-formed (each
// row has the same width, and cells don't overlap).
//
// You should probably put this plugin near the end of your array of
// plugins, since it handles mouse and arrow key events in tables
// rather broadly, and other plugins, like the gap cursor or the
// column-width dragging plugin, might want to get a turn first to
// perform more specific behavior.
export function tableEditing({ allowTableNodeSelection = false } = {}): Plugin {
  return new Plugin({
    key: tableEditingKey,

    // This piece of state is used to remember when a mouse-drag
    // cell-selection is happening, so that it can continue even as
    // transactions (which might move its anchor cell) come in.
    state: {
      init() {
        return null;
      },
      apply(tr, cur) {
        const set = tr.getMeta(tableEditingKey);
        if (set != null) {
          return set === -1 ? null : set;
        }
        if (cur == null || !tr.docChanged) {
          return cur;
        }
        const { deleted, pos } = tr.mapping.mapResult(cur);
        return deleted ? null : pos;
      },
    },

    props: {
      decorations: drawCellSelection,

      handleDOMEvents: {
        mousedown: handleMouseDown,
      },

      createSelectionBetween(view) {
        if (tableEditingKey.getState(view.state) != null) {
          return view.state.selection;
        }

        return null;
      },

      handleTripleClick,

      handleKeyDown,

      handlePaste,
    },

    appendTransaction(_, oldState, state) {
      return normalizeSelection(
        state,
        fixTables(state, oldState),
        allowTableNodeSelection,
      );
    },
  });
}
