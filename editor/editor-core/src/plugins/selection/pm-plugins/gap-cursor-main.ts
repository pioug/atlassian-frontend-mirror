import { EditorState, Plugin, NodeSelection } from 'prosemirror-state';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { ResolvedPos } from 'prosemirror-model';
import { findPositionOfNodeBefore } from 'prosemirror-utils';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { hideCaretModifier } from '../gap-cursor/styles';
import {
  GapCursorSelection,
  JSON_ID,
  Side as GapCursorSide,
  Side,
} from '../gap-cursor/selection';
import {
  getBreakoutModeFromTargetNode,
  isIgnoredClick,
} from '../gap-cursor/utils';
import { toDOM } from '../gap-cursor/utils/place-gap-cursor';
import { deleteNode, setGapCursorAtPos } from '../gap-cursor/actions';
import { Direction } from '../gap-cursor/direction';
import { gapCursorPluginKey } from './gap-cursor-plugin-key';

const plugin = new Plugin({
  key: gapCursorPluginKey,
  state: {
    init: () => false,
    apply: (_tr, _pluginState, _oldState, newState) => {
      return newState.selection instanceof GapCursorSelection;
    },
  },
  view: (view) => {
    /**
     * If the selection is at the beginning of a document and is a NodeSelection,
     * convert to a GapCursor selection. This is to stop users accidentally replacing
     * the first node of a document by accident.
     */
    if (
      view.state.selection.anchor === 0 &&
      view.state.selection instanceof NodeSelection
    ) {
      // This is required otherwise the dispatch doesn't trigger in the correct place
      window.requestAnimationFrame(() => {
        view.dispatch(
          view.state.tr.setSelection(
            new GapCursorSelection(
              view.state.doc.resolve(0),
              GapCursorSide.LEFT,
            ),
          ),
        );
      });
    }
    return {
      update(view, state) {
        const pluginState = gapCursorPluginKey.getState(state);
        /**
         * Starting with prosemirror-view 1.19.4, cursor wrapper that previousely was hiding cursor doesn't exist:
         * https://github.com/ProseMirror/prosemirror-view/commit/4a56bc7b7e61e96ef879d1dae1014ede0fc09e43
         *
         * Because it was causing issues with RTL: https://github.com/ProseMirror/prosemirror/issues/948
         *
         * This is the work around which uses `caret-color: transparent` in order to hide regular caret,
         * when gap cursor is visible.
         *
         * Browser support is pretty good: https://caniuse.com/#feat=css-caret-color
         */
        view.dom.classList.toggle(hideCaretModifier, pluginState);
      },
    };
  },

  props: {
    decorations: ({ doc, selection }: EditorState) => {
      if (selection instanceof GapCursorSelection) {
        const { $from, side } = selection;

        // render decoration DOM node always to the left of the target node even if selection points to the right
        // otherwise positioning of the right gap cursor is a nightmare when the target node has a nodeView with vertical margins
        let position = selection.head;
        const isRightCursor = side === Side.RIGHT;
        if (isRightCursor && $from.nodeBefore) {
          const nodeBeforeStart = findPositionOfNodeBefore(selection);
          if (typeof nodeBeforeStart === 'number') {
            position = nodeBeforeStart;
          }
        }

        const node = isRightCursor ? $from.nodeBefore : $from.nodeAfter;
        const breakoutMode = node && getBreakoutModeFromTargetNode(node);
        return DecorationSet.create(doc, [
          Decoration.widget(position, toDOM, {
            key: `${JSON_ID}-${side}-${breakoutMode}`,
            side: breakoutMode ? -1 : 0,
          }),
        ]);
      }

      return null;
    },

    // render gap cursor only when its valid
    createSelectionBetween(
      view: EditorView,
      $anchor: ResolvedPos,
      $head: ResolvedPos,
    ) {
      if (view && view.state && view.state.selection instanceof CellSelection) {
        // Do not show GapCursor when there is a CellSection happening
        return;
      }

      if ($anchor.pos === $head.pos && GapCursorSelection.valid($head)) {
        return new GapCursorSelection($head);
      }
      return;
    },

    // there's no space between top level nodes and the wrapping ProseMirror contenteditable area and handleClick won't capture clicks, there's nothing to click on
    // it handles only attempts to set gap cursor for nested nodes, where we have space between parent and child nodes
    // top level nodes are handled by <ClickAreaBlock>
    handleClick(view: EditorView, position: number, event: MouseEvent) {
      const posAtCoords = view.posAtCoords({
        left: event.clientX,
        top: event.clientY,
      });

      // this helps to ignore all of the clicks outside of the parent (e.g. nodeView controls)
      if (
        posAtCoords &&
        posAtCoords.inside !== position &&
        !isIgnoredClick(event.target as HTMLElement)
      ) {
        // max available space between parent and child from the left side in px
        // this ensures the correct side of the gap cursor in case of clicking in between two block nodes
        const leftSideOffsetX = 20;
        const side = event.offsetX > leftSideOffsetX ? Side.RIGHT : Side.LEFT;
        return setGapCursorAtPos(position, side)(view.state, view.dispatch);
      }
      return false;
    },
    handleDOMEvents: {
      /**
       * Android composition events aren't handled well by Prosemirror
       * We've added a couple of beforeinput hooks to help PM out when trying to delete
       * certain nodes. We can remove these when PM has better composition support.
       * @see https://github.com/ProseMirror/prosemirror/issues/543
       */
      beforeinput: (view, event: any) => {
        if (
          event.inputType === 'deleteContentBackward' &&
          view.state.selection instanceof GapCursorSelection
        ) {
          event.preventDefault();
          return deleteNode(Direction.BACKWARD)(view.state, view.dispatch);
        }

        return false;
      },
    },
  },
});

export default plugin;
