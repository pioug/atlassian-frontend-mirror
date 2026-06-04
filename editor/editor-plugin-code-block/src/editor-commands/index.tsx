import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	MODE,
	PLATFORMS,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { copyToClipboard, getAnalyticsPayload } from '@atlaskit/editor-common/clipboard';
import {
	codeBlockWrappedStates,
	getDefaultCodeBlockAttrs,
	isCodeBlockWordWrapEnabled,
} from '@atlaskit/editor-common/code-block';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import {
	contentAllowedInCodeBlock,
	shouldSplitSelectedNodeOnNodeInsertion,
} from '@atlaskit/editor-common/insert';
import { editorCommandToPMCommand } from '@atlaskit/editor-common/preset';
import { findCodeBlock } from '@atlaskit/editor-common/transforms';
import type {
	Command,
	EditorCommand,
	ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import {
	findParentNodeOfType,
	findSelectedNodeOfType,
	isNodeSelection,
	removeParentNodeOfType,
	removeSelectedNode,
	safeInsert,
} from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { CodeBlockPlugin } from '../codeBlockPluginType';
import { ACTIONS } from '../pm-plugins/actions';
import { autoDetectPluginKey, type AutoDetectEntry } from '../pm-plugins/auto-detect-state';
import { copySelectionPluginKey } from '../pm-plugins/codeBlockCopySelectionPlugin';
import type {
	CodeBlockState,
	PendingFormatRequest,
	ResolveFormatCodeOutcome,
} from '../pm-plugins/main-state';
import { pluginKey } from '../pm-plugins/plugin-key';
import { transformToCodeBlockAction } from '../pm-plugins/transform-to-code-block';
import type { LanguagePickerSelectionSource } from '../ui/language-picker-options';
import {
	createAutoDetectEntry,
	getLocalId,
	hasEnoughTextForAutoDetection,
} from '../utils/auto-detect-state';
import {
	formatCode,
	isSupportedFormatLanguage,
} from '../utils/format-code/formatter';
import type {
	FormatCodeResult,
	LanguageSource,
} from '../utils/format-code/formatter';

export const removeCodeBlockWithAnalytics = (
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): Command => {
	return withAnalytics(editorAnalyticsAPI, {
		action: ACTION.DELETED,
		actionSubject: ACTION_SUBJECT.CODE_BLOCK,
		attributes: { inputMethod: INPUT_METHOD.FLOATING_TB },
		eventType: EVENT_TYPE.TRACK,
	})(removeCodeBlock);
};

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
	(language: string | null, selectionSource?: LanguagePickerSelectionSource): Command =>
	(state, dispatch) => {
		const { codeBlock } = state.schema.nodes;
		const pos = pluginKey.getState(state)?.pos;

		if (typeof pos !== 'number') {
			return false;
		}

		const node = state.doc.nodeAt(pos);
		const localId = node?.attrs.localId;
		const previousAutoDetectEntry: AutoDetectEntry | undefined =
			expValEquals('platform_editor_code_block_q4_lovability', 'isEnabled', true) &&
			fg('platform_editor_code_block_language_detection_flow')
				? autoDetectPluginKey.getState(state)?.languageDetectionMap[localId]
				: undefined;
		const tr = state.tr
			.setNodeMarkup(pos, codeBlock, { ...node?.attrs, language })
			.setMeta('scrollIntoView', false);

		if (
			expValEquals('platform_editor_code_block_q4_lovability', 'isEnabled', true) &&
			fg('platform_editor_code_block_language_detection_flow')
		) {
			tr.setMeta(autoDetectPluginKey, {
				type: ACTIONS.REMOVE_AUTO_DETECT_ENTRY,
				data: { localId },
			});
		}

		const selection = isNodeSelection(state.selection)
			? NodeSelection.create(tr.doc, pos)
			: tr.selection;

		const result = tr.setSelection(selection);

		if (dispatch) {
			editorAnalyticsAPI?.attachAnalyticsEvent({
				action: ACTION.LANGUAGE_SELECTED,
				actionSubject: ACTION_SUBJECT.CODE_BLOCK,
				attributes: {
					language: language ?? 'none',
					...(selectionSource ? { selectionSource } : {}),
					autoDetectionResult: previousAutoDetectEntry?.detectionResult,
					autoDetectedLanguage: previousAutoDetectEntry?.autoDetectedLanguage,
				},
				eventType: EVENT_TYPE.TRACK,
			})(result);
			dispatch(result);
		}

		return true;
	};

/** Queue auto-detection for selected code block. */
export const detectLanguage = (): Command => (state, dispatch) => {
	const pos = pluginKey.getState(state)?.pos;

	if (typeof pos !== 'number') {
		return false;
	}

	const node = state.doc.nodeAt(pos);

	if (!node) {
		return false;
	}

	const localId = getLocalId(node);
	if (!localId) {
		return false;
	}

	const autoDetectState = autoDetectPluginKey.getState(state);
	const previousEntry = autoDetectState?.languageDetectionMap[localId];
	const entry = createAutoDetectEntry(
		node,
		pos,
		hasEnoughTextForAutoDetection(node.textContent),
		previousEntry,
	);
	const tr = state.tr
		.setNodeMarkup(pos, state.schema.nodes.codeBlock, { ...node.attrs, language: null })
		.setMeta(autoDetectPluginKey, {
			type: ACTIONS.SET_AUTO_DETECT_ENTRY,
			data: { localId, entry },
		})
		.setMeta('scrollIntoView', false);
	const selection = isNodeSelection(state.selection)
		? NodeSelection.create(tr.doc, pos)
		: tr.selection;
	const result = tr.setSelection(selection);

	if (dispatch) {
		dispatch(result);
	}

	return true;
};

const setResolveFormatCodeMeta = (
	tr: Transaction,
	{
		languageSource,
		localId,
		outcome,
		requestId,
		errorType,
	}: {
		errorType?: Extract<FormatCodeResult, { status: 'failed' }>['errorType'];
		languageSource: LanguageSource;
		localId: string;
		outcome: ResolveFormatCodeOutcome;
		requestId: string;
	},
): Transaction =>
	tr.setMeta(pluginKey, {
		type: ACTIONS.RESOLVE_FORMAT_CODE,
		data: {
			languageSource,
			localId,
			outcome,
			requestId,
			...(errorType ? { errorType } : {}),
		},
	});

const replaceCodeBlockText = ({
	codeBlockNode,
	content,
	pos,
	tr,
}: {
	codeBlockNode: PMNode;
	content: string;
	pos: number;
	tr: Transaction;
}): Transaction => {
	const from = pos + 1;
	const to = pos + codeBlockNode.nodeSize - 1;
	tr.delete(from, to);

	if (content) {
		tr.insertText(content, from);
	}

	// The editor scroll plugin scrolls doc-changing transactions by default.
	return tr.setMeta('scrollIntoView', false);
};

const attachFormatCodeAnalytics = ({
	editorAnalyticsAPI,
	languageSource,
	result,
	tr,
}: {
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
	languageSource: LanguageSource;
	result: FormatCodeResult;
	tr: Transaction;
}): void => {
	if (result.status === 'failed') {
		editorAnalyticsAPI?.attachAnalyticsEvent({
			action: ACTION.ERRORED,
			actionSubject: ACTION_SUBJECT.CODE_BLOCK,
			attributes: {
				errorType: result.errorType,
				language: result.language,
				languageSource,
			},
			eventType: EVENT_TYPE.TRACK,
		})(tr);
		return;
	}

	editorAnalyticsAPI?.attachAnalyticsEvent({
		action: ACTION.FORMATTED,
		actionSubject: ACTION_SUBJECT.CODE_BLOCK,
		attributes: {
			language: result.language,
			languageSource,
			outcome: result.status,
		},
		eventType: EVENT_TYPE.TRACK,
	})(tr);
};

const createResolveFormatCodeTransaction = ({
	editorAnalyticsAPI,
	localId,
	pendingFormat,
	result,
	tr,
}: {
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
	localId: string;
	pendingFormat: PendingFormatRequest;
	result: FormatCodeResult;
	tr: Transaction;
}): Transaction => {
	const { languageSource, requestId } = pendingFormat;
	const codeBlockNode = tr.doc.nodeAt(pendingFormat.pos);
	const hasMatchingCodeBlock =
		codeBlockNode?.type === tr.doc.type.schema.nodes.codeBlock &&
		codeBlockNode?.attrs.localId === localId;

	if (!hasMatchingCodeBlock) {
		// Keep failure telemetry even when the target block is no longer available.
		if (result.status === 'failed') {
			attachFormatCodeAnalytics({
				editorAnalyticsAPI,
				languageSource,
				result,
				tr,
			});
		}

		return setResolveFormatCodeMeta(tr, {
			languageSource,
			localId,
			outcome: 'unchanged',
			requestId,
		});
	}

	let resultTransaction = tr;

	if (result.status === 'formatted') {
		resultTransaction = replaceCodeBlockText({
			codeBlockNode,
			content: result.content,
			pos: pendingFormat.pos,
			tr,
		});
	}

	attachFormatCodeAnalytics({
		editorAnalyticsAPI,
		languageSource,
		result,
		tr: resultTransaction,
	});

	return setResolveFormatCodeMeta(resultTransaction, {
		errorType: result.status === 'failed' ? result.errorType : undefined,
		languageSource,
		localId,
		outcome: result.status,
		requestId,
	});
};

export const createFormatCodeOnClick =
	(
		{
			api,
			editorAnalyticsAPI,
		}: {
			api?: ExtractInjectionAPI<CodeBlockPlugin>;
			editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
		},
	): Command =>
	(state, dispatch) => {
		const currentCodeBlockState = pluginKey.getState(state);
		const currentPos = currentCodeBlockState?.pos;

		if (!currentCodeBlockState || typeof currentPos !== 'number') {
			return false;
		}

		const currentNode = state.doc.nodeAt(currentPos);
		if (!currentNode || currentNode.type !== state.schema.nodes.codeBlock) {
			return false;
		}

		const currentLanguage = currentNode.attrs.language;
		if (!isSupportedFormatLanguage(currentLanguage)) {
			return true;
		}

		const currentLocalId = currentNode.attrs.localId;
		if (currentCodeBlockState.pendingFormats[currentLocalId]) {
			return true;
		}

		const autoDetectEntry =
			autoDetectPluginKey.getState(state)?.languageDetectionMap[currentLocalId];
		const languageSource = autoDetectEntry?.autoDetectedLanguage === currentLanguage
			? 'auto-detected'
			: 'selected';
		const content = currentNode.textContent;
		const requestId = crypto.randomUUID();

		api?.core?.actions.execute(({ tr }) =>
			tr.setMeta(pluginKey, {
				type: ACTIONS.START_FORMAT_CODE,
				data: {
					languageSource,
					localId: currentLocalId,
					pos: currentPos,
					requestId,
				},
			}),
		);

		void formatCode({ content, language: currentLanguage }).then((result) => {
			const pendingFormat =
				api?.codeBlock?.sharedState.currentState()?.pendingFormats[currentLocalId];

			if (!pendingFormat || pendingFormat.requestId !== requestId) {
				return;
			}

			api?.core?.actions.execute(({ tr }) =>
				createResolveFormatCodeTransaction({
					editorAnalyticsAPI,
					localId: currentLocalId,
					pendingFormat,
					result,
					tr,
				}),
			);
		});

		return true;
	};

export const copyContentToClipboardWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined): Command =>
	(state, dispatch) => {
		const {
			schema: { nodes },
			tr,
		} = state;

		const codeBlock = findParentNodeOfType(nodes.codeBlock)(tr.selection);
		const textContent = codeBlock && codeBlock.node.textContent;

		if (textContent) {
			copyToClipboard(textContent);
			const copyToClipboardTr = tr;

			copyToClipboardTr.setMeta(pluginKey, {
				type: ACTIONS.SET_COPIED_TO_CLIPBOARD,
				data: true,
			});
			copyToClipboardTr.setMeta(copySelectionPluginKey, 'remove-selection');

			if (editorAnalyticsAPI) {
				const analyticsPayload = getAnalyticsPayload(state, ACTION.COPIED);

				if (analyticsPayload) {
					analyticsPayload.attributes.inputMethod = INPUT_METHOD.FLOATING_TB;
					analyticsPayload.attributes.nodeType = codeBlock?.node.type.name;
					editorAnalyticsAPI.attachAnalyticsEvent(analyticsPayload)(copyToClipboardTr);
				}
			}

			if (dispatch) {
				dispatch(copyToClipboardTr);
			}
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
		const copyToClipboardTr = tr;

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
	const resetCopiedStateTr = tr;

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
export function createInsertCodeBlockTransaction({ state }: { state: EditorState }): Transaction {
	let { tr } = state;
	const { from } = state.selection;
	const { codeBlock } = state.schema.nodes;
	const codeBlockAttrs = getDefaultCodeBlockAttrs();
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
		tr = transformToCodeBlockAction(state, from, codeBlockAttrs);
	} else {
		safeInsert(codeBlock.createAndFill(codeBlockAttrs) as PMNode)(tr).scrollIntoView();
	}

	return tr;
}

export function insertCodeBlockWithAnalytics(
	inputMethod: INPUT_METHOD,
	analyticsAPI?: EditorAnalyticsAPI,
): Command {
	return withAnalytics(analyticsAPI, {
		action: ACTION.INSERTED,
		actionSubject: ACTION_SUBJECT.DOCUMENT,
		actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
		attributes: { inputMethod: inputMethod as INPUT_METHOD.TOOLBAR },
		eventType: EVENT_TYPE.TRACK,
	})(function (state: EditorState, dispatch) {
		const tr = createInsertCodeBlockTransaction({ state });
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
		const codeBlock = findCodeBlock(state);
		const codeBlockNode = codeBlock?.node;
		const { tr } = state;

		if (!codeBlockWrappedStates || !codeBlockNode) {
			return false;
		}

		const updatedToggleState = !isCodeBlockWordWrapEnabled(codeBlockNode);

		if (expValEquals('platform_editor_code_block_q4_lovability', 'isEnabled', true)) {
			tr.setNodeMarkup(codeBlock.pos, undefined, {
				...codeBlockNode.attrs,
				wrap: updatedToggleState,
			});
		} else {
			codeBlockWrappedStates.set(codeBlockNode, updatedToggleState);
		}

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

export const toggleLineNumbersForCodeBlockNodeEditorCommand =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined): EditorCommand =>
	({ tr }) => {
		const { codeBlock: codeBlockType } = tr.doc.type.schema.nodes;
		const codeBlock =
			findSelectedNodeOfType(codeBlockType)(tr.selection) ||
			findParentNodeOfType(codeBlockType)(tr.selection);

		if (!codeBlock) {
			return null;
		}

		const codeBlockNode = codeBlock.node;
		const lineNumbersHidden = !Boolean(codeBlockNode.attrs.hideLineNumbers);

		tr.setNodeMarkup(codeBlock.pos, undefined, {
			...codeBlockNode.attrs,
			hideLineNumbers: lineNumbersHidden,
		});

		editorAnalyticsAPI?.attachAnalyticsEvent({
			action: ACTION.TOGGLE_CODE_BLOCK_LINE_NUMBERS,
			actionSubject: ACTION_SUBJECT.CODE_BLOCK,
			attributes: {
				platform: PLATFORMS.WEB,
				lineNumbersHidden,
				codeBlockNodeSize: codeBlockNode.nodeSize,
			},
			eventType: EVENT_TYPE.TRACK,
		})(tr);

		return tr;
	};

export const toggleLineNumbersForCodeBlockNode = (
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): Command =>
	editorCommandToPMCommand(toggleLineNumbersForCodeBlockNodeEditorCommand(editorAnalyticsAPI));
