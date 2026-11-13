/**
 * `platform_editor_block_control_inp` treatment for the block control quick insert button.
 *
 * `openQuickInsert` in `BlockControlQuickInsertButton.tsx` prepares the cursor across several
 * dispatched transactions and then opens the typeahead in another dispatch. This applies the same
 * steps to a single transaction and opens the typeahead on it, so a click dispatches once.
 *
 * Each helper below is a copy of the same-named function in `./BlockControlQuickInsertButton.tsx`,
 * changed only to read from and write to `tr` instead of `view.state` / dispatching. Compare them
 * side by side when reviewing or keeping them in sync.
 *
 * TODO: EDITOR-10075 - When cleaning up `platform_editor_block_control_inp`, remove
 * `openQuickInsert` and its helpers from `BlockControlQuickInsertButton.tsx`.
 */
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { isEmptyNode } from '@atlaskit/editor-common/utils';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNode, findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { QuickInsertPlugin } from '../quickInsertPluginType';

/** Copy of `TEXT_PARENT_TYPES` in `./BlockControlQuickInsertButton.tsx`. */
const TEXT_PARENT_TYPES = ['paragraph', 'heading', 'blockquote', 'taskItem', 'decisionItem'];

/**
 * Copy of `createNewLine` in `./BlockControlQuickInsertButton.tsx`, as a plain function that
 * mutates `tr` instead of an `EditorCommand`.
 */
const createNewLine = (tr: Transaction, start: number): void => {
	const nodeSize = tr.doc.nodeAt(start)?.nodeSize;
	if (nodeSize === undefined) {
		return;
	}
	const position = start + nodeSize;
	tr.insert(position, tr.doc.type.schema.nodes.paragraph.create());
	tr.setSelection(TextSelection.near(tr.doc.resolve(position)));
};

/**
 * Copy of `isSelectionInNode` in `./BlockControlQuickInsertButton.tsx`, reading `tr` instead of
 * `view.state`.
 */
const isSelectionInNode = (tr: Transaction, start: number): boolean => {
	const node = tr.doc.nodeAt(start);
	if (!node) {
		return false;
	}
	const { $from, $to } = tr.selection;
	return $from.pos >= start && $to.pos <= start + node.nodeSize;
};

/**
 * Copy of `isNonEditableBlock` in `./BlockControlQuickInsertButton.tsx`, reading `tr` instead of
 * `view.state`.
 */
const isNonEditableBlock = (tr: Transaction, start: number): boolean => {
	const node = tr.doc.nodeAt(start);
	if (!node) {
		return false;
	}
	if (node.type.name === 'mediaGroup' || node.type.name === 'mediaSingle') {
		return true;
	}
	return node.isBlock && (node.isAtom || node.isLeaf);
};

/**
 * Copy of `getNextEmptyParagraphPosition` in `./BlockControlQuickInsertButton.tsx`, reading
 * `tr` instead of `view.state`.
 */
const getNextEmptyParagraphPosition = (tr: Transaction, start: number): number | undefined => {
	const node = tr.doc.nodeAt(start);
	if (!node) {
		return undefined;
	}
	const positionAfterTarget = start + node.nodeSize;
	const nextNode = tr.doc.resolve(positionAfterTarget).nodeAfter;
	const { schema } = tr.doc.type;
	if (nextNode?.type !== schema.nodes.paragraph || nextNode.marks.length > 0) {
		return undefined;
	}
	if (!isEmptyNode(schema)(nextNode)) {
		return undefined;
	}
	return positionAfterTarget + 1;
};

/**
 * Copy of the cursor preparation in `openQuickInsert` in `./BlockControlQuickInsertButton.tsx`
 * (everything before `openTypeAhead()`). Each `api.core.actions.execute(...)` step there is
 * applied to `tr` here, and `tr.doc` / `tr.selection` are read wherever `openQuickInsert`
 * re-reads `view.state` after a dispatch. The empty paragraph reuse always applies because this
 * path only runs with `platform_editor_block_control_inp` enabled.
 */
const prepareCursor = (
	api: ExtractInjectionAPI<QuickInsertPlugin>,
	tr: Transaction,
	start: number,
): void => {
	if (
		isExperimentEnabled('platform_editor_collapsible_headings') &&
		api.blockCollapse?.sharedState.currentState()?.collapsedHeadingPositions.has(start)
	) {
		api.blockCollapse?.commands.expandHeading(start)({ tr });
		createNewLine(tr, start);
		return;
	}

	const isSelectionInsideNode = isSelectionInNode(tr, start);
	const shouldCreateNewLine = !isSelectionInsideNode || isNonEditableBlock(tr, start);
	const reusableParagraphPosition = shouldCreateNewLine
		? getNextEmptyParagraphPosition(tr, start)
		: undefined;
	if (shouldCreateNewLine && reusableParagraphPosition === undefined) {
		createNewLine(tr, start);
	} else if (
		reusableParagraphPosition !== undefined &&
		!(tr.selection.empty && tr.selection.from === reusableParagraphPosition)
	) {
		tr.setSelection(TextSelection.create(tr.doc, reusableParagraphPosition));
	}

	const codeBlockParentNode = findParentNodeOfType(tr.doc.type.schema.nodes.codeBlock)(
		tr.selection,
	);
	if (codeBlockParentNode) {
		createNewLine(tr, codeBlockParentNode.pos);
		return;
	}

	if (!isSelectionInsideNode || reusableParagraphPosition !== undefined) {
		return;
	}

	const currentSelection = tr.selection;

	if (
		(currentSelection instanceof TextSelection ||
			(currentSelection instanceof NodeSelection && currentSelection.node.isInline)) &&
		currentSelection.from !== currentSelection.to
	) {
		const currentParagraphNode = findParentNode((node) =>
			TEXT_PARENT_TYPES.includes(node.type.name),
		)(currentSelection);
		if (currentParagraphNode) {
			const newPos =
				currentSelection.anchor === currentSelection.to
					? currentParagraphNode.pos
					: currentParagraphNode.pos + currentParagraphNode.node.nodeSize - 1;
			tr.setSelection(TextSelection.create(tr.doc, newPos));
		}
	}

	if (currentSelection instanceof NodeSelection && currentSelection.$from.depth > 0) {
		const { from } = tr.selection;
		createNewLine(tr, from);
		if (!isNonEditableBlock(tr, from)) {
			tr.setSelection(TextSelection.create(tr.doc, from));
		}
	}

	if (currentSelection instanceof CellSelection) {
		const lastInlinePosition = TextSelection.near(tr.selection.$to, -1);
		// Mirrors the guard in `openQuickInsert`.
		if (lastInlinePosition) {
			if (lastInlinePosition instanceof TextSelection) {
				tr.setSelection(lastInlinePosition);
			} else {
				createNewLine(tr, lastInlinePosition.from);
				tr.setSelection(TextSelection.create(tr.doc, lastInlinePosition.to));
			}
		}
	}
};

/**
 * Prepares the cursor and opens the Quick Insert typeahead in one transaction.
 * Returns `false`, without changing anything, when the Quick Insert typeahead handler is missing.
 */
export const openQuickInsertInSingleTransaction = (
	api: ExtractInjectionAPI<QuickInsertPlugin>,
	start: number,
): boolean => {
	const triggerHandler = api.typeAhead?.actions.findHandlerByTrigger('/');
	if (!triggerHandler) {
		return false;
	}

	api.core.actions.execute(({ tr }) => {
		prepareCursor(api, tr, start);

		// Opening the typeahead over a text range or inline node selection deletes the selected
		// content, so make sure it always opens at a collapsed cursor.
		if (
			(tr.selection instanceof TextSelection && !tr.selection.empty) ||
			(tr.selection instanceof NodeSelection && tr.selection.node.isInline)
		) {
			tr.setSelection(TextSelection.create(tr.doc, tr.selection.to));
		}

		api.typeAhead.actions.openAtTransaction({
			triggerHandler,
			inputMethod: 'blockControl',
			removePrefixTriggerOnCancel: true,
		})(tr);
		return tr;
	});
	return true;
};
