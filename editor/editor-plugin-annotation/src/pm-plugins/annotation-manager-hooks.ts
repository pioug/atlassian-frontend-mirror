import { type AnnotationId, AnnotationTypes } from '@atlaskit/adf-schema';
import type {
	ApplyDraftResult,
	ClearDraftResult,
	GetDraftResult,
	StartDraftResult,
} from '@atlaskit/editor-common/annotation';
import { getRangeInlineNodeNames } from '@atlaskit/editor-common/utils';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

import { setInlineCommentDraftState, createAnnotation } from '../editor-commands';
import { AnnotationSelectionType } from '../types';

import { InlineCommentPluginOptions } from './types';
import { inlineCommentPluginKey, isSelectionValid } from './utils';

const ERROR_REASON_DRAFT_NOT_STARTED = 'draft-not-started';
const ERROR_REASON_DRAFT_IN_PROGRESS = 'draft-in-progress';
const ERROR_REASON_RANGE_MISSING = 'range-no-longer-exists';
const ERROR_REASON_RANGE_INVALID = 'invalid-range';

const domRefFromPos = (view: EditorView, position: number) => {
	let dom: HTMLElement | undefined;
	try {
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		dom = findDomRefAtPos(position, view.domAtPos.bind(view)) as HTMLElement;
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn(error);
		return undefined;
	}
	return dom;
};

export const allowAnnotation =
	(editorView: EditorView, options: InlineCommentPluginOptions) => (): boolean => {
		const { isDrafting, draftDecorationSet } =
			inlineCommentPluginKey.getState(editorView.state) || {};

		if (isDrafting) {
			return false;
		}

		const decoration = draftDecorationSet?.find();

		// If a draft decoration exists then we should block the user from creating a new one.
		if (!!decoration?.length) {
			return false;
		}

		return isSelectionValid(editorView.state) === AnnotationSelectionType.VALID;
	};

export const startDraft =
	(editorView: EditorView, options: InlineCommentPluginOptions) => (): StartDraftResult => {
		const { isDrafting } = inlineCommentPluginKey.getState(editorView.state) || {};

		if (isDrafting) {
			return {
				success: false,
				reason: ERROR_REASON_DRAFT_IN_PROGRESS,
			};
		}

		setInlineCommentDraftState(options.editorAnalyticsAPI)(true)(
			editorView.state,
			editorView.dispatch,
		);

		const { draftDecorationSet } = inlineCommentPluginKey.getState(editorView.state) || {};

		const decorations = draftDecorationSet?.find();

		// If the matching decorations is not found containing the id, it means something went wrong with the draft.
		if (!decorations?.length) {
			return {
				success: false,
				reason: ERROR_REASON_RANGE_INVALID,
			};
		}

		const from = decorations[0].from;
		const targetElement = domRefFromPos(editorView, from);
		const inlineNodeTypes =
			getRangeInlineNodeNames({
				doc: editorView.state.doc,
				pos: { from, to: decorations[decorations.length - 1].to },
			}) ?? [];

		options.annotationManager?.emit({
			name: 'draftAnnotationStarted',
			data: {
				targetElement,
				actionResult: undefined,
				inlineNodeTypes,
			},
		});

		return {
			success: true,
			targetElement,
			// In Editor the action result is undefined, because the editor will perform the transaction on the document.
			actionResult: undefined,
			inlineNodeTypes,
		};
	};

export const clearDraft =
	(editorView: EditorView, options: InlineCommentPluginOptions) => (): ClearDraftResult => {
		const { isDrafting, draftDecorationSet } =
			inlineCommentPluginKey.getState(editorView.state) || {};

		if (!isDrafting) {
			return {
				success: false,
				reason: ERROR_REASON_DRAFT_NOT_STARTED,
			};
		}

		const decorations = draftDecorationSet?.find();

		if (!decorations?.length) {
			return {
				success: false,
				reason: ERROR_REASON_DRAFT_NOT_STARTED,
			};
		}

		setInlineCommentDraftState(options.editorAnalyticsAPI)(false)(
			editorView.state,
			editorView.dispatch,
		);

		!editorView.hasFocus() && editorView.focus();

		return {
			success: true,
		};
	};

export const applyDraft =
	(editorView: EditorView, options: InlineCommentPluginOptions) =>
	(id: AnnotationId): ApplyDraftResult => {
		const { isDrafting, draftDecorationSet, bookmark } =
			inlineCommentPluginKey.getState(editorView.state) || {};

		if (!isDrafting) {
			return {
				success: false,
				reason: ERROR_REASON_DRAFT_NOT_STARTED,
			};
		}

		const decorations = draftDecorationSet?.find();

		if (!decorations?.length || !bookmark) {
			return {
				success: false,
				reason: ERROR_REASON_RANGE_MISSING,
			};
		}

		const from = decorations[0].from;

		createAnnotation(options.editorAnalyticsAPI, options.api)(
			id,
			AnnotationTypes.INLINE_COMMENT,
			options.provider.supportedBlockNodes,
		)(editorView.state, editorView.dispatch);

		!editorView.hasFocus() && editorView.focus();

		// Using the original decoration from position we should be able to locate the new target element.
		// This is because the new annotation will be created at the same position as the draft decoration.
		const targetElement = domRefFromPos(editorView, from);

		return {
			success: true,
			// Get the dom element from the newly created annotation and return it here.
			targetElement,
			// In Editor this is undefined, because the editor will update the document.
			actionResult: undefined,
		};
	};

export const getDraft =
	(editorView: EditorView, options: InlineCommentPluginOptions) => (): GetDraftResult => {
		const { isDrafting, draftDecorationSet } =
			inlineCommentPluginKey.getState(editorView.state) || {};

		if (!isDrafting) {
			return {
				success: false,
				reason: ERROR_REASON_DRAFT_NOT_STARTED,
			};
		}

		const decorations = draftDecorationSet?.find();

		if (!decorations?.length) {
			return {
				success: false,
				reason: ERROR_REASON_DRAFT_NOT_STARTED,
			};
		}

		const from = decorations[0].from;
		const targetElement = domRefFromPos(editorView, from);
		const inlineNodeTypes =
			getRangeInlineNodeNames({
				doc: editorView.state.doc,
				pos: { from, to: decorations[decorations.length - 1].to },
			}) ?? [];

		return {
			success: true,
			inlineNodeTypes,
			targetElement,
			actionResult: undefined,
		};
	};
