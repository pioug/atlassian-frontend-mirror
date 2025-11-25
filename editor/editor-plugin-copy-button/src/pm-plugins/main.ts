import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { MarkType, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { CopyButtonPluginState } from '../copyButtonPluginType';

import { copyButtonPluginKey } from './plugin-key';

export function getMarkSelectionHelper({
	$pos,
	markType,
}: {
	$pos: ResolvedPos;
	markType: MarkType;
}) {
	const hasMark = $pos.doc.rangeHasMark(
		$pos.pos,
		Math.min($pos.pos + 1, $pos.doc.nodeSize),
		markType,
	);
	if (!hasMark) {
		return false;
	}

	if ($pos.parent.childCount === 1) {
		const nodePosition = $pos.pos;
		const maybeNode = $pos.doc.nodeAt(nodePosition);
		if (!maybeNode || !maybeNode.isText) {
			return false;
		}
		const start = $pos.pos - $pos.parentOffset;
		const end = start + maybeNode.nodeSize;
		return { start, end };
	}

	if ($pos.parent.childCount > 1) {
		const start = $pos.pos - $pos.textOffset;
		const maybeTextNode = $pos.doc.nodeAt(start);
		if (!maybeTextNode || !maybeTextNode.isText) {
			return false;
		}
		const end = start + maybeTextNode.nodeSize;
		return { start, end };
	}

	return false;
}

function getMarkSelectionDecorationStartAndEnd({
	markType,
	transaction,
}: {
	markType: MarkType;
	transaction: ReadonlyTransaction;
}) {
	const anchorPositions = getMarkSelectionHelper({
		$pos: transaction.selection.$anchor,
		markType,
	});
	if (anchorPositions) {
		return {
			...anchorPositions,
			markType,
		};
	}

	const headPositions = getMarkSelectionHelper({
		$pos: transaction.selection.$head,
		markType,
	});
	if (headPositions) {
		return {
			...headPositions,
			markType,
		};
	}

	return undefined;
}

export function copyButtonPlugin() {
	return new SafePlugin({
		key: copyButtonPluginKey,
		state: {
			// @ts-ignore - Workaround for help-center local consumption

			init(): CopyButtonPluginState {
				return {
					copied: false,
					markSelection: undefined,
				};
			},
			// @ts-ignore - Workaround for help-center local consumption

			apply(tr, currentPluginState: CopyButtonPluginState): CopyButtonPluginState {
				const meta = tr.getMeta(copyButtonPluginKey);
				if (meta?.copied !== undefined) {
					return {
						copied: meta.copied,
						markSelection: undefined,
					};
				}
				if (meta?.showSelection) {
					return {
						copied: currentPluginState.copied,
						markSelection: getMarkSelectionDecorationStartAndEnd({
							markType: meta.markType,
							transaction: tr,
						}),
					};
				}
				if (meta?.removeSelection) {
					return {
						copied: currentPluginState.copied,
						markSelection: undefined,
					};
				}

				if (currentPluginState.markSelection) {
					return {
						copied: currentPluginState.copied,
						markSelection: getMarkSelectionDecorationStartAndEnd({
							markType: currentPluginState.markSelection.markType,
							transaction: tr,
						}),
					};
				}

				return currentPluginState;
			},
		},
		props: {
			// @ts-ignore - Workaround for help-center local consumption

			decorations(_state) {
				// Showing visual hints for the hyperlink copy button has been disabled
				// due to an issue where invalid hyperlink marks cause the floating toolbar
				// to jump around when the copy button is hovered.
				// See the following bug for details -- once that is resolved -- the visual
				// hints can be re enabled.
				// https://product-fabric.atlassian.net/browse/DTR-722

				// const copyButtonPluginState = copyButtonPluginKey.getState(
				//   state,
				// ) as CopyButtonPluginState;
				// if (copyButtonPluginState.markSelection) {
				//   const { start, end } = copyButtonPluginState.markSelection;

				//   return DecorationSet.create(state.doc, [
				//     Decoration.inline(start, end, {
				//       class: 'ProseMirror-fake-text-selection',
				//     }),
				//   ]);
				// }

				return DecorationSet.empty;
			},
		},
	});
}

export default copyButtonPlugin;
