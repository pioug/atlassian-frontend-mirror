import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { stepAddsOneOf } from '@atlaskit/editor-common/utils';
import { getChangedNodes, isReplaceDocOperation } from '@atlaskit/editor-common/utils/document';
import type { Mark, Node, NodeType } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { Step } from '@atlaskit/editor-prosemirror/transform';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorCalculatedWideLayoutWidth,
} from '@atlaskit/editor-shared-styles';

import { BreakoutPlugin } from '../breakoutPluginType';
import type { BreakoutPluginOptions } from '../breakoutPluginType';

import { ResizingMarkView } from './resizing-mark-view';

type AddBreakoutToResizableNodeProps = {
	node: Node;
	pos: number;
	newState: EditorState;
	newTr: Transaction;
	breakoutResizableNodes: Set<NodeType>;
	isFullWidthEnabled: boolean;
};

const addBreakoutToResizableNode = ({
	node,
	pos,
	newState,
	newTr,
	breakoutResizableNodes,
	isFullWidthEnabled,
}: AddBreakoutToResizableNodeProps) => {
	let updatedDocChanged = false;
	let updatedTr = newTr;

	const $pos = newState.doc.resolve(pos);
	const isTopLevelNode = $pos?.depth === 0;

	if (breakoutResizableNodes.has(node.type) && isTopLevelNode) {
		const { breakout } = newState.schema.marks;
		const breakoutMark = node.marks.find((mark) => mark.type === breakout);

		if (!breakoutMark) {
			const width = isFullWidthEnabled ? akEditorFullWidthLayoutWidth : akEditorDefaultLayoutWidth;

			updatedTr = newTr.setNodeMarkup(pos, node.type, node.attrs, [
				breakout.create({ width: width }),
			]);
			updatedDocChanged = true;
		} else if (breakoutMark?.attrs.width === null || breakoutMark?.attrs.width === undefined) {
			const mode = breakoutMark.attrs.mode;
			const newWidth =
				mode === 'wide' ? akEditorCalculatedWideLayoutWidth : akEditorFullWidthLayoutWidth;
			updatedTr = newTr.setNodeMarkup(pos, node.type, node.attrs, [
				breakout.create({ width: newWidth, mode: mode }),
			]);
			updatedDocChanged = true;
		}
	}

	return { updatedTr, updatedDocChanged };
};

export const resizingPluginKey = new PluginKey('breakout-resizing');

export const createResizingPlugin = (
	api: ExtractInjectionAPI<BreakoutPlugin> | undefined,
	options?: BreakoutPluginOptions,
) => {
	return new SafePlugin({
		key: resizingPluginKey,
		props: {
			markViews: {
				breakout: (mark: Mark, view: EditorView) => {
					return new ResizingMarkView(mark, view, api);
				},
			},
		},
		appendTransaction(
			transactions: readonly Transaction[],
			oldState: EditorState,
			newState: EditorState,
		) {
			let newTr = newState.tr;
			let hasDocChanged = false;

			const { expand, codeBlock, layoutSection } = newState.schema.nodes;
			const breakoutResizableNodes = new Set([expand, codeBlock, layoutSection]);

			const isFullWidthEnabled = !(options?.allowBreakoutButton === true);

			if (isReplaceDocOperation(transactions, oldState)) {
				newState.doc.forEach((node: Node, pos: number) => {
					const { updatedTr, updatedDocChanged } = addBreakoutToResizableNode({
						node,
						pos,
						newState,
						newTr,
						breakoutResizableNodes,
						isFullWidthEnabled,
					});

					newTr = updatedTr;
					hasDocChanged = hasDocChanged || updatedDocChanged;
				});
			} else {
				transactions.forEach((tr: Transaction) => {
					const isAddingResizableNodes = tr.steps.some((step: Step) =>
						stepAddsOneOf(step, breakoutResizableNodes),
					);

					if (isAddingResizableNodes) {
						const changedNodes = getChangedNodes(tr);
						changedNodes.forEach(({ node, pos }) => {
							const { updatedTr, updatedDocChanged } = addBreakoutToResizableNode({
								node,
								pos,
								newState,
								newTr,
								breakoutResizableNodes,
								isFullWidthEnabled,
							});

							newTr = updatedTr;
							hasDocChanged = hasDocChanged || updatedDocChanged;
						});
					}
				});
			}

			if (hasDocChanged) {
				return newTr;
			}
		},
	});
};
