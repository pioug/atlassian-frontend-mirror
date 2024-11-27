import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	MODE,
	PLATFORMS,
} from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { copyToClipboard } from '@atlaskit/editor-common/clipboard';
import {
	codeBlockWrappedStates,
	isCodeBlockWordWrapEnabled,
} from '@atlaskit/editor-common/code-block';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import {
	contentAllowedInCodeBlock,
	shouldSplitSelectedNodeOnNodeInsertion,
} from '@atlaskit/editor-common/insert';
import type { Command } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import {
	findParentNodeOfType,
	findSelectedNodeOfType,
	isNodeSelection,
	removeParentNodeOfType,
	removeSelectedNode,
	safeInsert,
} from '@atlaskit/editor-prosemirror/utils';

import { ACTIONS } from '../pm-plugins/actions';
import { copySelectionPluginKey } from '../pm-plugins/codeBlockCopySelectionPlugin';
import { type CodeBlockState } from '../pm-plugins/main-state';
import { pluginKey } from '../pm-plugins/plugin-key';
import { transformToCodeBlockAction } from '../pm-plugins/transform-to-code-block';
import { findCodeBlock } from '../pm-plugins/utils';

export const removeCodeBlock: Command = (state, dispatch) => {
	const {
		schema: { nodes },
		tr,
	} = state;
	if (dispatch) {
		let removeTr = tr;
		if (findSelectedNodeOfType(nodes.codeBlock)(tr.selection)) {
			removeTr = removeSelectedNode(tr);
		} else {
			removeTr = removeParentNodeOfType(nodes.codeBlock)(tr);
		}
		dispatch(removeTr);
	}
	return true;
};

export const changeLanguage =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(language: string): Command =>
	(state, dispatch) => {
		const { codeBlock } = state.schema.nodes;
		const pos = pluginKey.getState(state)?.pos;

		if (typeof pos !== 'number') {
			return false;
		}

		const tr = state.tr
			.setNodeMarkup(pos, codeBlock, { language })
			.setMeta('scrollIntoView', false);

		const selection = isNodeSelection(state.selection)
			? NodeSelection.create(tr.doc, pos)
			: tr.selection;

		const result = tr.setSelection(selection);

		if (dispatch) {
			editorAnalyticsAPI?.attachAnalyticsEvent({
				action: ACTION.LANGUAGE_SELECTED,
				actionSubject: ACTION_SUBJECT.CODE_BLOCK,
				attributes: { language },
				eventType: EVENT_TYPE.TRACK,
			})(result);
			dispatch(result);
		}

		return true;
	};

export const copyContentToClipboard: Command = (state, dispatch) => {
	const {
		schema: { nodes },
		tr,
	} = state;

	const codeBlock = findParentNodeOfType(nodes.codeBlock)(tr.selection);
	const textContent = codeBlock && codeBlock.node.textContent;

	if (textContent) {
		copyToClipboard(textContent);
		let copyToClipboardTr = tr;

		copyToClipboardTr.setMeta(pluginKey, {
			type: ACTIONS.SET_COPIED_TO_CLIPBOARD,
			data: true,
		});
		copyToClipboardTr.setMeta(copySelectionPluginKey, 'remove-selection');

		if (dispatch) {
			dispatch(copyToClipboardTr);
		}
	}

	return true;
};

export const resetCopiedState: Command = (state, dispatch) => {
	const { tr } = state;
	const codeBlockState: CodeBlockState | undefined = pluginKey.getState(state);
	let resetCopiedStateTr = tr;

	if (codeBlockState && codeBlockState.contentCopied) {
		resetCopiedStateTr.setMeta(pluginKey, {
			type: ACTIONS.SET_COPIED_TO_CLIPBOARD,
			data: false,
		});
		resetCopiedStateTr.setMeta(copySelectionPluginKey, 'remove-selection');
		if (dispatch) {
			dispatch(resetCopiedStateTr);
		}
	} else {
		const clearSelectionStateTransaction = state.tr;
		clearSelectionStateTransaction.setMeta(copySelectionPluginKey, 'remove-selection');
		// note: dispatch should always be defined when called from the
		// floating toolbar. Howver the Command type which floating toolbar uses
		// (and resetCopiedState) uses suggests it's optional.
		if (dispatch) {
			dispatch(clearSelectionStateTransaction);
		}
	}

	return true;
};

export const ignoreFollowingMutations: Command = (state, dispatch) => {
	const { tr } = state;

	const ignoreFollowingMutationsTr = tr;

	ignoreFollowingMutationsTr.setMeta(pluginKey, {
		type: ACTIONS.SET_SHOULD_IGNORE_FOLLOWING_MUTATIONS,
		data: true,
	});

	if (dispatch) {
		dispatch(ignoreFollowingMutationsTr);
	}

	return true;
};

export const resetShouldIgnoreFollowingMutations: Command = (state, dispatch) => {
	const { tr } = state;

	const ignoreFollowingMutationsTr = tr;

	ignoreFollowingMutationsTr.setMeta(pluginKey, {
		type: ACTIONS.SET_SHOULD_IGNORE_FOLLOWING_MUTATIONS,
		data: false,
	});

	if (dispatch) {
		dispatch(ignoreFollowingMutationsTr);
	}

	return true;
};

/**
 * This function creates a new transaction that inserts a code block,
 * if there is text selected it will wrap the current selection if not it will
 * append the codeblock to the end of the document.
 */
export function createInsertCodeBlockTransaction({
	state,
	isNestingInQuoteSupported,
}: {
	state: EditorState;
	isNestingInQuoteSupported?: boolean;
}) {
	let { tr } = state;
	const { from, $from } = state.selection;
	const { codeBlock } = state.schema.nodes;
	const grandParentNode = state.selection.$from.node(-1);
	const grandParentNodeType = grandParentNode?.type;
	const parentNodeType = state.selection.$from.parent.type;

	/** We always want to append a codeBlock unless we're inserting into a paragraph
	 * AND it's a valid child of the grandparent node.
	 * Insert the current selection as codeBlock content unless it contains nodes other
	 * than paragraphs and inline.
	 */
	const canInsertCodeBlock =
		shouldSplitSelectedNodeOnNodeInsertion({
			parentNodeType,
			grandParentNodeType,
			content: codeBlock.createAndFill() as PMNode,
		}) && contentAllowedInCodeBlock(state);

	if (canInsertCodeBlock) {
		tr = transformToCodeBlockAction(state, from, undefined, isNestingInQuoteSupported);
	} else if (!isNestingInQuoteSupported && grandParentNodeType?.name === 'blockquote') {
		/** we only allow the insertion of a codeblock inside a blockquote if nesting in quotes is supported */
		const grandparentEndPos = $from.start(-1) + grandParentNode.nodeSize - 1;
		safeInsert(codeBlock.createAndFill() as PMNode, grandparentEndPos)(tr).scrollIntoView();
	} else {
		safeInsert(codeBlock.createAndFill() as PMNode)(tr).scrollIntoView();
	}

	return tr;
}

export function insertCodeBlockWithAnalytics(
	inputMethod: INPUT_METHOD,
	analyticsAPI?: EditorAnalyticsAPI,
	isNestingInQuoteSupported?: boolean,
): Command {
	return withAnalytics(analyticsAPI, {
		action: ACTION.INSERTED,
		actionSubject: ACTION_SUBJECT.DOCUMENT,
		actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
		attributes: { inputMethod: inputMethod as INPUT_METHOD.TOOLBAR },
		eventType: EVENT_TYPE.TRACK,
	})(function (state: EditorState, dispatch) {
		let tr = createInsertCodeBlockTransaction({ state, isNestingInQuoteSupported });
		if (dispatch) {
			dispatch(tr);
		}
		return true;
	});
}

/**
 * Add the given node to the codeBlockWrappedStates WeakMap with the toggle boolean value.
 */
export const toggleWordWrapStateForCodeBlockNode =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined): Command =>
	(state, dispatch) => {
		const codeBlockNode = findCodeBlock(state)?.node;
		const { tr } = state;

		if (!codeBlockWrappedStates || !codeBlockNode) {
			return false;
		}

		const updatedToggleState = !isCodeBlockWordWrapEnabled(codeBlockNode);

		codeBlockWrappedStates.set(codeBlockNode, updatedToggleState);

		tr.setMeta(pluginKey, {
			type: ACTIONS.SET_IS_WRAPPED,
			data: updatedToggleState,
		});

		if (dispatch) {
			editorAnalyticsAPI?.attachAnalyticsEvent({
				action: ACTION.TOGGLE_CODE_BLOCK_WRAP,
				actionSubject: ACTION_SUBJECT.CODE_BLOCK,
				attributes: {
					platform: PLATFORMS.WEB,
					mode: MODE.EDITOR,
					wordWrapEnabled: updatedToggleState,
					codeBlockNodeSize: codeBlockNode.nodeSize,
				},
				eventType: EVENT_TYPE.TRACK,
			})(tr);
			dispatch(tr);
		}

		return true;
	};
