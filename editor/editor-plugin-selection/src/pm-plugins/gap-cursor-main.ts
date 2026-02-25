import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
	GapCursorSelection,
	Side as GapCursorSide,
	hideCaretModifier,
	JSON_ID,
	setGapCursorAtPos,
	Side,
} from '@atlaskit/editor-common/selection';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findPositionOfNodeBefore } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { selectionPluginKey } from '../types';

import { gapCursorPluginKey } from './gap-cursor-plugin-key';
import { deleteNode } from './gap-cursor/actions';
import { Direction } from './gap-cursor/direction';
import { getLayoutModeFromTargetNode, isIgnoredClick } from './gap-cursor/utils';
import { toDOM } from './gap-cursor/utils/place-gap-cursor';

const plugin = new SafePlugin({
	key: gapCursorPluginKey,
	state: {
		init: () => ({
			selectionIsGapCursor: false,
			displayGapCursor: true,
			hideCursor: false,
		}),
		apply: (tr, pluginState, _oldState, newState) => {
			const meta = tr.getMeta(gapCursorPluginKey);
			const selectionMeta = tr.getMeta(selectionPluginKey);
			const selectionIsGapCursor = newState.selection instanceof GapCursorSelection;

			return {
				selectionIsGapCursor,
				// only attempt to hide gap cursor if selection is gap cursor
				displayGapCursor: selectionIsGapCursor
					? (meta?.displayGapCursor ?? pluginState.displayGapCursor)
					: true,
				// track hideCursor state from selection plugin
				hideCursor: selectionMeta?.hideCursor ?? pluginState.hideCursor,
			};
		},
	},
	view: (view) => {
		/**
		 * If the selection is at the beginning of a document and is a NodeSelection,
		 * convert to a GapCursor selection. This is to stop users accidentally replacing
		 * the first node of a document by accident.
		 */
		if (view.state.selection.anchor === 0 && view.state.selection instanceof NodeSelection) {
			// This is required otherwise the dispatch doesn't trigger in the correct place
			window.requestAnimationFrame(() => {
				view.dispatch(
					view.state.tr.setSelection(
						new GapCursorSelection(view.state.doc.resolve(0), GapCursorSide.LEFT),
					),
				);
			});
		}
		return {
			update(view) {
				if (expValEquals('platform_synced_block', 'isEnabled', true) && fg('platform_synced_block_patch_4')) {
					// Caret visibility now handled directly via CSS selector in gapCursorStyles.ts
					return;
				}
				const { selectionIsGapCursor } = gapCursorPluginKey.getState(view.state);
				/**
				 * Starting with prosemirror-view 1.19.4, cursor wrapper that previously was hiding cursor doesn't exist:
				 * https://github.com/ProseMirror/prosemirror-view/commit/4a56bc7b7e61e96ef879d1dae1014ede0fc09e43
				 *
				 * Because it was causing issues with RTL: https://github.com/ProseMirror/prosemirror/issues/948
				 *
				 * This is the work around which uses `caret-color: transparent` in order to hide regular caret,
				 * when gap cursor is visible.
				 *
				 * Browser support is pretty good: https://caniuse.com/#feat=css-caret-color
				 */
				view.dom.classList.toggle(hideCaretModifier, selectionIsGapCursor);
			},
		};
	},

	props: {
		decorations: (editorState: EditorState) => {
			const { doc, selection } = editorState;
			const { displayGapCursor, hideCursor } = gapCursorPluginKey.getState(editorState);
			if (selection instanceof GapCursorSelection && displayGapCursor && !hideCursor) {
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
				const layoutMode = node && getLayoutModeFromTargetNode(node);

				return DecorationSet.create(doc, [
					Decoration.widget(position, toDOM, {
						key: `${JSON_ID}-${side}-${layoutMode}`,
						side: layoutMode ? -1 : 0,
					}),
				]);
			}

			return null;
		},

		// render gap cursor only when its valid
		createSelectionBetween(view: EditorView, $anchor: ResolvedPos, $head: ResolvedPos) {
			if (view && view.state && view.state.selection instanceof CellSelection) {
				// Do not show GapCursor when there is a CellSection happening
				return null;
			}

			if ($anchor.pos === $head.pos && GapCursorSelection.valid($head)) {
				return new GapCursorSelection($head);
			}
			return null;
		},
		handleClick(view: EditorView, nodePos: number, event: MouseEvent) {
			const posAtCoords = view.posAtCoords({
				left: event.clientX,
				top: event.clientY,
			});
			if (
				!posAtCoords ||
				isIgnoredClick(event.target instanceof HTMLElement ? event.target : null)
			) {
				return false;
			}

			const isInsideTheTarget = posAtCoords.pos === posAtCoords.inside;
			if (isInsideTheTarget) {
				return false;
			}

			const leftSideOffsetX = 20;
			const side = event.offsetX > leftSideOffsetX ? Side.RIGHT : Side.LEFT;

			const $pos = view.state.doc.resolve(nodePos);
			// In the new prosemirror-view posAtCoords  is not returning a precise value for our media nodes
			if ($pos.parent?.type.name === 'mediaSingle') {
				const $insidePos = view.state.doc.resolve(Math.max(posAtCoords.inside, 0));
				// We don't have GapCursors problems when the node target is inside the root level
				if ($insidePos.depth <= 1) {
					return false;
				}
				const mediaGapCursor = !$pos.nodeBefore ? $pos.before() : $pos.after();

				return setGapCursorAtPos(mediaGapCursor, side)(view.state, view.dispatch);
			}

			const docSize = view.state.doc.content.size;
			const nodeInside =
				posAtCoords.inside < 0 || posAtCoords.inside > docSize
					? null
					: view.state.doc.nodeAt(posAtCoords.inside);
			if (nodeInside?.isAtom) {
				return false;
			}

			return setGapCursorAtPos(nodePos, side)(view.state, view.dispatch);
		},
		handleDOMEvents: {
			/**
			 * Android composition events aren't handled well by Prosemirror
			 * We've added a couple of beforeinput hooks to help PM out when trying to delete
			 * certain nodes. We can remove these when PM has better composition support.
			 * @see https://github.com/ProseMirror/prosemirror/issues/543
			 */
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
