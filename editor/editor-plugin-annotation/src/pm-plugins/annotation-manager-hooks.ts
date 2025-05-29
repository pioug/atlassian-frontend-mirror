import { type AnnotationId, AnnotationTypes } from '@atlaskit/adf-schema';
import type {
	ApplyDraftResult,
	ClearAnnotationResult,
	ClearDraftResult,
	GetDraftResult,
	HoverAnnotationResult,
	SelectAnnotationResult,
	StartDraftResult,
} from '@atlaskit/editor-common/annotation';
import {
	getAnnotationInlineNodeTypes,
	getRangeInlineNodeNames,
} from '@atlaskit/editor-common/utils';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	setInlineCommentDraftState,
	createAnnotation,
	setSelectedAnnotation,
	closeComponent,
	setHoveredAnnotation,
	removeInlineCommentFromDoc,
} from '../editor-commands';
import { AnnotationSelectionType } from '../types';

import type { InlineCommentPluginOptions } from './types';
import { inlineCommentPluginKey, isSelectionValid } from './utils';

const ERROR_REASON_DRAFT_NOT_STARTED = 'draft-not-started';
const ERROR_REASON_DRAFT_IN_PROGRESS = 'draft-in-progress';
const ERROR_REASON_RANGE_MISSING = 'range-no-longer-exists';
const ERROR_REASON_RANGE_INVALID = 'invalid-range';
const ERROR_REASON_ID_INVALID = 'id-not-valid';

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
		const { isDrafting, selectedAnnotations } =
			inlineCommentPluginKey.getState(editorView.state) || {};

		if (isDrafting) {
			return {
				success: false,
				reason: ERROR_REASON_DRAFT_IN_PROGRESS,
			};
		}

		if (!!selectedAnnotations?.length && fg('platform_editor_comments_api_manager_select')) {
			// if there are selected annotations when starting a draft, we need to clear the selected annotations
			// before we start the draft.
			closeComponent()(editorView.state, editorView.dispatch);

			// not only that but we need to also deselect any other annotations that are currently selected.
			selectedAnnotations?.forEach((annotation) => {
				options.annotationManager?.emit({
					name: 'annotationSelectionChanged',
					data: {
						annotationId: annotation.id,
						isSelected: false,
						inlineNodeTypes: getAnnotationInlineNodeTypes(editorView.state, annotation.id) ?? [],
					},
				});
			});
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

		// When a draft is applied it is automatically selected, so we need to set the selected annotation.
		// emit the event for the selected annotation.
		options.annotationManager?.emit({
			name: 'annotationSelectionChanged',
			data: {
				annotationId: id,
				isSelected: true,
				inlineNodeTypes: getAnnotationInlineNodeTypes(editorView.state, id) ?? [],
			},
		});

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

export const setIsAnnotationSelected =
	(editorView: EditorView, options: InlineCommentPluginOptions) =>
	(id: AnnotationId, isSelected: boolean): SelectAnnotationResult => {
		const { annotations, isDrafting, selectedAnnotations } =
			inlineCommentPluginKey.getState(editorView.state) || {};

		if (isDrafting) {
			return {
				success: false,
				reason: ERROR_REASON_DRAFT_IN_PROGRESS,
			};
		}

		// If there is no annotation state with this id then we can assume the annotation is invalid.
		if (!annotations?.hasOwnProperty(id)) {
			return {
				success: false,
				reason: ERROR_REASON_ID_INVALID,
			};
		}

		const isCurrentlySelectedIndex =
			selectedAnnotations?.findIndex((annotation) => annotation.id === id) ?? -1;
		const isCurrentlySelected = isCurrentlySelectedIndex !== -1;

		if (isSelected !== isCurrentlySelected) {
			// the annotation is selection is changing.
			if (isCurrentlySelected && !isSelected) {
				// the selected annotaion is being unselected, so we need to close the view.
				closeComponent()(editorView.state, editorView.dispatch);

				options.annotationManager?.emit({
					name: 'annotationSelectionChanged',
					data: {
						annotationId: id,
						isSelected: false,
						inlineNodeTypes: getAnnotationInlineNodeTypes(editorView.state, id) ?? [],
					},
				});
			} else if (!isCurrentlySelected && isSelected) {
				// the annotation is currently not selected and is being selected, so we need to open the view.
				setSelectedAnnotation(id)(editorView.state, editorView.dispatch);

				// the current annotations are going to be unselected. So we need to notify listeners of this change also.
				selectedAnnotations?.forEach((annotation) => {
					if (annotation.id !== id) {
						options.annotationManager?.emit({
							name: 'annotationSelectionChanged',
							data: {
								annotationId: annotation.id,
								isSelected: false,
								inlineNodeTypes:
									getAnnotationInlineNodeTypes(editorView.state, annotation.id) ?? [],
							},
						});
					}
				});

				// Lastly we need to emit the event for the selected annotation.
				options.annotationManager?.emit({
					name: 'annotationSelectionChanged',
					data: {
						annotationId: id,
						isSelected: true,
						inlineNodeTypes: getAnnotationInlineNodeTypes(editorView.state, id) ?? [],
					},
				});
			}
		}

		return {
			success: true,
			isSelected,
		};
	};

export const setIsAnnotationHovered =
	(editorView: EditorView, options: InlineCommentPluginOptions) =>
	(id: AnnotationId, isHovered: boolean): HoverAnnotationResult => {
		const { annotations, hoveredAnnotations } =
			inlineCommentPluginKey.getState(editorView.state) || {};

		// If there is no annotation state with this id then we can assume the annotation is invalid.
		if (!annotations?.hasOwnProperty(id)) {
			return {
				success: false,
				reason: ERROR_REASON_ID_INVALID,
			};
		}

		const isCurrentlyHoveredIndex =
			hoveredAnnotations?.findIndex((annotation) => annotation.id === id) ?? -1;
		const isCurrentlyHovered = isCurrentlyHoveredIndex !== -1;

		if (isHovered !== isCurrentlyHovered) {
			// the annotation in hovered is changing.
			if (isCurrentlyHovered && !isHovered) {
				// the hovered annotaion is being unhovered, so we should remove the hover state.
				setHoveredAnnotation('')(editorView.state, editorView.dispatch);
			} else if (!isCurrentlyHovered && isHovered) {
				// the annotation is currently not hovered and is being hovered.
				setHoveredAnnotation(id)(editorView.state, editorView.dispatch);
			}
		}

		return {
			success: true,
			isHovered,
		};
	};

export const clearAnnotation =
	(editorView: EditorView, options: InlineCommentPluginOptions) =>
	(id: AnnotationId): ClearAnnotationResult => {
		const { annotations } = inlineCommentPluginKey.getState(editorView.state) || {};

		// If there is no annotation state with this id then we can assume the annotation is invalid.
		if (!annotations?.hasOwnProperty(id)) {
			return {
				success: false,
				reason: ERROR_REASON_ID_INVALID,
			};
		}

		removeInlineCommentFromDoc(options.editorAnalyticsAPI)(
			id,
			options.provider.supportedBlockNodes,
		)(editorView.state, editorView.dispatch);

		return {
			success: true,
			actionResult: undefined,
		};
	};
