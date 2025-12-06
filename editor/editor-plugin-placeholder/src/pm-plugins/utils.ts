import type { DocNode } from '@atlaskit/adf-schema';
import { placeholderTextMessages as messages } from '@atlaskit/editor-common/messages';
import {
	bracketTyped,
	hasDocAsParent,
	isEmptyDocument,
	isEmptyParagraph,
} from '@atlaskit/editor-common/utils';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findParentNode } from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { pluginKey } from '../placeholderPlugin';

import {
	createLongEmptyNodePlaceholderADF,
	createShortEmptyNodePlaceholderADF,
} from './adf-builders';
import {
	nodeTypesWithLongPlaceholderText,
	nodeTypesWithShortPlaceholderText,
	nodeTypesWithSyncBlockPlaceholderText,
} from './constants';
import type { PlaceHolderState, CreatePlaceholderStateProps, UserInteractionState } from './types';

export function getPlaceholderState(editorState: EditorState): PlaceHolderState {
	return pluginKey.getState(editorState);
}

export function setPlaceHolderState({
	placeholderText,
	pos,
	placeholderPrompts,
	typedAndDeleted,
	userHadTyped,
	canShowOnEmptyParagraph,
	showOnEmptyParagraph,
	contextPlaceholderADF,
}: {
	canShowOnEmptyParagraph?: boolean;
	contextPlaceholderADF?: DocNode;
	placeholderPrompts?: string[];
	placeholderText?: string;
	pos?: number;
	showOnEmptyParagraph?: boolean;
	typedAndDeleted?: boolean;
	userHadTyped?: boolean;
}): PlaceHolderState {
	return {
		hasPlaceholder: true,
		placeholderText,
		placeholderPrompts,
		contextPlaceholderADF,
		pos: pos ? pos : 1,
		typedAndDeleted,
		userHadTyped,
		canShowOnEmptyParagraph,
		showOnEmptyParagraph,
	};
}

export const emptyPlaceholder = ({
	placeholderText,
	placeholderPrompts,
	userHadTyped,
	pos,
	canShowOnEmptyParagraph,
	showOnEmptyParagraph,
}: {
	canShowOnEmptyParagraph?: boolean;
	placeholderPrompts?: string[];
	placeholderText: string | undefined;
	pos?: number;
	showOnEmptyParagraph?: boolean;
	userHadTyped?: boolean;
}): PlaceHolderState => ({
	hasPlaceholder: false,
	placeholderText,
	placeholderPrompts,
	userHadTyped,
	typedAndDeleted: false,
	canShowOnEmptyParagraph,
	showOnEmptyParagraph,
	pos,
});

export function createPlaceHolderStateFrom({
	isInitial,
	isEditorFocused,
	editorState,
	isTypeAheadOpen,
	defaultPlaceholderText,
	intl,
	bracketPlaceholderText,
	emptyLinePlaceholder,
	placeholderADF,
	placeholderPrompts,
	typedAndDeleted,
	userHadTyped,
	isPlaceholderHidden,
	withEmptyParagraph,
	showOnEmptyParagraph,
}: CreatePlaceholderStateProps): PlaceHolderState {
	if (isPlaceholderHidden && fg('platform_editor_ai_aifc_patch_beta')) {
		return {
			...emptyPlaceholder({
				placeholderText: defaultPlaceholderText,
				placeholderPrompts,
				userHadTyped,
			}),
			isPlaceholderHidden,
		};
	}

	if (isTypeAheadOpen?.(editorState)) {
		return emptyPlaceholder({
			placeholderText: defaultPlaceholderText,
			placeholderPrompts,
			userHadTyped,
		});
	}

	if (
		(defaultPlaceholderText || placeholderPrompts || placeholderADF) &&
		isEmptyDocument(editorState.doc)
	) {
		return setPlaceHolderState({
			placeholderText: defaultPlaceholderText,
			pos: 1,
			placeholderPrompts,
			typedAndDeleted,
			userHadTyped,
		});
	}

	if (fg('platform_editor_ai_aifc_patch_beta_2') || fg('platform_editor_ai_aifc_patch_ga')) {
		const { from, to, $to } = editorState.selection;
		if (
			(defaultPlaceholderText || placeholderADF) &&
			withEmptyParagraph &&
			isEditorFocused &&
			!isInitial &&
			!isEmptyDocument(editorState.doc) &&
			from === to &&
			isEmptyParagraph($to.parent) &&
			hasDocAsParent($to)
		) {
			return showOnEmptyParagraph
				? setPlaceHolderState({
						placeholderText: defaultPlaceholderText,
						pos: to,
						placeholderPrompts,
						typedAndDeleted,
						userHadTyped,
						canShowOnEmptyParagraph: true,
						showOnEmptyParagraph: true,
					})
				: emptyPlaceholder({
						placeholderText: defaultPlaceholderText,
						placeholderPrompts,
						userHadTyped,
						canShowOnEmptyParagraph: true,
						showOnEmptyParagraph: false,
						pos: to,
					});
		}
	}

	if (isEditorFocused && editorExperiment('platform_editor_controls', 'variant1')) {
		const { $from, $to } = editorState.selection;

		if ($from.pos !== $to.pos) {
			return emptyPlaceholder({
				placeholderText: defaultPlaceholderText,
				placeholderPrompts,
				userHadTyped,
			});
		}

		const parentNode = $from.node($from.depth - 1);
		const parentType = parentNode?.type.name;

		if (emptyLinePlaceholder && parentType === 'doc') {
			const isEmptyLine = isEmptyParagraph($from.parent);
			if (isEmptyLine) {
				return setPlaceHolderState({
					placeholderText: emptyLinePlaceholder,
					pos: $from.pos,
					placeholderPrompts,
					typedAndDeleted,
					userHadTyped,
				});
			}
		}

		const isEmptyNode =
			parentNode?.childCount === 1 &&
			parentNode.firstChild?.content.size === 0 &&
			parentNode.firstChild?.type.name === 'paragraph';

		if (nodeTypesWithShortPlaceholderText.includes(parentType) && isEmptyNode) {
			const table = findParentNode((node) => node.type === editorState.schema.nodes.table)(
				editorState.selection,
			);

			if (!table) {
				return emptyPlaceholder({
					placeholderText: defaultPlaceholderText,
					placeholderPrompts,
					userHadTyped,
				});
			}

			const isFirstCell = table?.node.firstChild?.content.firstChild === parentNode;
			if (isFirstCell) {
				return setPlaceHolderState({
					placeholderText: !fg('platform_editor_ai_aifc_patch_ga')
						? intl.formatMessage(messages.shortEmptyNodePlaceholderText)
						: undefined,
					contextPlaceholderADF: fg('platform_editor_ai_aifc_patch_ga')
						? createShortEmptyNodePlaceholderADF(intl)
						: undefined,
					pos: $from.pos,
					placeholderPrompts,
					typedAndDeleted,
					userHadTyped,
				});
			}
		}

		if (nodeTypesWithLongPlaceholderText.includes(parentType) && isEmptyNode) {
			return setPlaceHolderState({
				placeholderText: !fg('platform_editor_ai_aifc_patch_ga')
					? intl.formatMessage(messages.longEmptyNodePlaceholderText)
					: undefined,
				contextPlaceholderADF: fg('platform_editor_ai_aifc_patch_ga')
					? createLongEmptyNodePlaceholderADF(intl)
					: undefined,
				pos: $from.pos,
				placeholderPrompts,
				typedAndDeleted,
				userHadTyped,
			});
		}

		if (
			nodeTypesWithSyncBlockPlaceholderText.includes(parentType) &&
			isEmptyNode &&
			editorExperiment('platform_synced_block', true)
		) {
			return setPlaceHolderState({
				placeholderText: intl.formatMessage(messages.syncBlockPlaceholderText),
				pos: $from.pos,
				placeholderPrompts,
				typedAndDeleted,
				userHadTyped,
			});
		}

		return emptyPlaceholder({
			placeholderText: defaultPlaceholderText,
			placeholderPrompts,
			userHadTyped,
		});
	}

	if (bracketPlaceholderText && bracketTyped(editorState) && isEditorFocused) {
		const { $from } = editorState.selection;
		// Space is to account for positioning of the bracket
		const bracketHint = '  ' + bracketPlaceholderText;
		return setPlaceHolderState({
			placeholderText: bracketHint,
			pos: $from.pos - 1,
			placeholderPrompts,
			typedAndDeleted,
			userHadTyped,
		});
	}

	return emptyPlaceholder({
		placeholderText: defaultPlaceholderText,
		placeholderPrompts,
		userHadTyped,
	});
}

export function calculateUserInteractionState({
	placeholderState,
	oldEditorState,
	newEditorState,
}: UserInteractionState): { typedAndDeleted: boolean; userHadTyped: boolean } {
	const wasEmpty = oldEditorState ? isEmptyDocument(oldEditorState.doc) : true;
	const isEmpty = isEmptyDocument(newEditorState.doc);
	const hasEverTyped =
		Boolean(placeholderState?.userHadTyped) || // Previously typed
		!wasEmpty || // Had content before
		(wasEmpty && !isEmpty); // Just added content
	const justDeletedAll = hasEverTyped && isEmpty && !wasEmpty;
	const isInTypedAndDeletedState =
		justDeletedAll || (Boolean(placeholderState?.typedAndDeleted) && isEmpty);
	// Only reset user interaction tracking when editor is cleanly empty
	const shouldResetInteraction = isEmpty && !isInTypedAndDeletedState;

	return {
		userHadTyped: shouldResetInteraction ? false : hasEverTyped,
		typedAndDeleted: isInTypedAndDeletedState,
	};
}
