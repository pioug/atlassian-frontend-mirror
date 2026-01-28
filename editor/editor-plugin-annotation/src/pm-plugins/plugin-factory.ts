import { pluginFactory } from '@atlaskit/editor-common/utils';
import type { Mark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	type EditorState,
	NodeSelection,
	type ReadonlyTransaction,
	type SelectionBookmark,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import reducer from './reducer';
import type { InlineCommentPluginState, InlineCommentMap } from './types';
import {
	decorationKey,
	findAnnotationsInSelection,
	inlineCommentPluginKey,
	isBlockNodeAnnotationsSelected,
	isSelectedAnnotationsChanged,
} from './utils';

const handleDocChanged = (
	tr: ReadonlyTransaction,
	prevPluginState: InlineCommentPluginState,
): InlineCommentPluginState => {
	if (!tr.getMeta('replaceDocument')) {
		return getSelectionChangedHandler(false)(tr, prevPluginState);
	}

	return { ...prevPluginState, dirtyAnnotations: true };
};

/**
 * Creates a handleDocChanged function with its own deleted annotations cache.
 * This ensures each editor instance has its own cache, avoiding cross-contamination.
 */
const createHandleDocChanged = () => {
	// Cache for preserving deleted annotation resolved states through delete/undo cycles
	// This lives in closure scope per editor instance to avoid serialization and reduce state size
	const deletedAnnotationsCache: InlineCommentMap = {};

	return (
		tr: ReadonlyTransaction,
		prevPluginState: InlineCommentPluginState,
	): InlineCommentPluginState => {
		if (tr.getMeta('replaceDocument')) {
			return { ...prevPluginState, dirtyAnnotations: true };
		}

		const updatedState = getSelectionChangedHandler(false)(tr, prevPluginState);

		// Collect annotation IDs currently in the document
		const annotationIdsInDocument = new Set<string>();
		tr.doc.descendants((node: PMNode) => {
			node.marks.forEach((mark: Mark) => {
				if (mark.type.name === 'annotation') {
					annotationIdsInDocument.add(mark.attrs.id);
				}
			});
		});

		const annotationIdsInState = Object.keys(prevPluginState.annotations);

		// Early return if annotations haven't changed
		const annotationsHaveChanged =
			annotationIdsInDocument.size !== annotationIdsInState.length ||
			annotationIdsInState.some((id) => !annotationIdsInDocument.has(id));

		if (!annotationsHaveChanged) {
			return updatedState;
		}

		// Cache deleted annotations to be able to restore their resolved states on undo
		const updatedAnnotations: InlineCommentMap = {};
		annotationIdsInState.forEach((id) => {
			if (!annotationIdsInDocument.has(id)) {
				deletedAnnotationsCache[id] = prevPluginState.annotations[id];
			}
		});

		// Update annotations to match document state, preserving resolved states through delete/undo
		// Only include annotations that have a known resolved state - don't default new annotations to false
		// as this would cause them to briefly appear as unresolved before the provider sets their actual state
		annotationIdsInDocument.forEach((id) => {
			const knownState = prevPluginState.annotations[id] ?? deletedAnnotationsCache[id];
			if (knownState !== undefined) {
				updatedAnnotations[id] = knownState;
			}
		});

		return { ...updatedState, annotations: updatedAnnotations };
	};
};

/**
 * We clear bookmark on the following conditions:
 * 1. if current selection is an empty selection, or
 * 2. if the current selection and bookmark selection are different
 * @param tr
 * @param editorState
 * @param bookmark
 * @example
 */
export const shouldClearBookMarkCheck = (
	tr: ReadonlyTransaction | Transaction,
	editorState: EditorState,
	bookmark?: SelectionBookmark,
): boolean => {
	if (editorState.selection.empty || !bookmark) {
		return true;
	} else if (editorState.selection instanceof NodeSelection) {
		const bookmarkSelection = bookmark?.resolve(tr.doc);
		if (bookmarkSelection instanceof NodeSelection) {
			const selectionNode = editorState.selection.node;
			const bookmarkNode = bookmarkSelection.node;

			/**
			 * Currently, after updating the alt text of a mediaSingle node,
			 * the selection moves to the media node.
			 * (then will append a transaction to its parent node)
			 */
			if (selectionNode.type.name === 'media' && bookmarkNode.type.name === 'mediaSingle') {
				return !bookmarkNode.firstChild?.eq(selectionNode);
			} else {
				return !bookmarkNode.eq(selectionNode);
			}
		}
	}

	// by default we discard bookmark
	return true;
};

const getSelectionChangeHandlerOld =
	(reopenCommentView: boolean) =>
	(tr: ReadonlyTransaction, pluginState: InlineCommentPluginState): InlineCommentPluginState => {
		if (pluginState.skipSelectionHandling) {
			return {
				...pluginState,
				skipSelectionHandling: false,
				...(reopenCommentView && {
					isInlineCommentViewClosed: false,
				}),
			};
		}
		if (
			// If pluginState.selectedAnnotations is annotations of block node, i.e. when a new comment is created,
			// we keep it as it is so that we can show comment view component with the newly created comment
			isBlockNodeAnnotationsSelected(tr.selection, pluginState.selectedAnnotations)
		) {
			return {
				...pluginState,
				...(reopenCommentView && {
					isInlineCommentViewClosed: false,
				}),
			};
		}

		const selectedAnnotations = findAnnotationsInSelection(tr.selection, tr.doc);
		if (selectedAnnotations.length === 0) {
			return {
				...pluginState,
				selectedAnnotations,
				isInlineCommentViewClosed: true,
				selectAnnotationMethod: undefined,
			};
		}
		if (isSelectedAnnotationsChanged(selectedAnnotations, pluginState.selectedAnnotations)) {
			return {
				...pluginState,
				selectedAnnotations,
				selectAnnotationMethod: undefined,
				...(reopenCommentView && {
					isInlineCommentViewClosed: false,
				}),
			};
		}
		return {
			...pluginState,
			...(reopenCommentView && {
				isInlineCommentViewClosed: false,
			}),
			selectAnnotationMethod: undefined,
		};
	};

const getSelectionChangeHandlerNew =
	(reopenCommentView: boolean) =>
	(tr: ReadonlyTransaction, pluginState: InlineCommentPluginState): InlineCommentPluginState => {
		if (pluginState.skipSelectionHandling) {
			return {
				...pluginState,
				skipSelectionHandling: false,
				...(reopenCommentView && {
					isInlineCommentViewClosed: false,
				}),
			};
		}

		const selectedAnnotations = findAnnotationsInSelection(tr.selection, tr.doc);

		// NOTE: I've left this commented code here as a reference that the previous old code would reset the selected annotations
		// if the selection is empty. If this is no longer needed, we can remove this code.
		// if (selectedAnnotations.length === 0) {
		// 	return {
		// 		...pluginState,
		// 		pendingSelectedAnnotations: selectedAnnotations,
		// 		pendingSelectedAnnotationsUpdateCount:
		// 			pluginState.pendingSelectedAnnotationsUpdateCount + 1,
		// 		isInlineCommentViewClosed: true,
		// 		selectAnnotationMethod: undefined,
		// 	};
		// }

		if (isSelectedAnnotationsChanged(selectedAnnotations, pluginState.pendingSelectedAnnotations)) {
			return {
				...pluginState,
				pendingSelectedAnnotations: selectedAnnotations,
				pendingSelectedAnnotationsUpdateCount:
					pluginState.pendingSelectedAnnotationsUpdateCount + 1,
				...(reopenCommentView && {
					isInlineCommentViewClosed: false,
				}),
			};
		}

		return {
			...pluginState,
			...(reopenCommentView && {
				isInlineCommentViewClosed: false,
			}),
			selectAnnotationMethod: undefined,
		};
	};

const getSelectionChangedHandler =
	(reopenCommentView: boolean) =>
	(tr: ReadonlyTransaction, pluginState: InlineCommentPluginState): InlineCommentPluginState =>
		pluginState.isAnnotationManagerEnabled
			? // if platform_editor_comments_api_manager == true
				getSelectionChangeHandlerNew(reopenCommentView)(tr, pluginState)
			: // else if platform_editor_comments_api_manager == false
				getSelectionChangeHandlerOld(reopenCommentView)(tr, pluginState);

// Create the handler with cache once at module level
const handleDocChangedWithSync = createHandleDocChanged();

const getDocChangedHandler = (
	tr: ReadonlyTransaction,
	prevPluginState: InlineCommentPluginState,
): InlineCommentPluginState => {
	// Check feature flag at runtime to support test variants
	if (expValEquals('platform_editor_annotations_sync_on_docchange', 'isEnabled', true)) {
		return handleDocChangedWithSync(tr, prevPluginState);
	}
	return handleDocChanged(tr, prevPluginState);
};

export const { createPluginState, createCommand } = pluginFactory(inlineCommentPluginKey, reducer, {
	onSelectionChanged: getSelectionChangedHandler(true),
	onDocChanged: getDocChangedHandler,

	mapping: (tr, pluginState, editorState) => {
		const { draftDecorationSet, bookmark } = pluginState;
		let mappedDecorationSet: DecorationSet = DecorationSet.empty,
			mappedBookmark;
		let hasMappedDecorations = false;

		if (draftDecorationSet) {
			mappedDecorationSet = draftDecorationSet.map(tr.mapping, tr.doc);
		}

		hasMappedDecorations =
			mappedDecorationSet.find(undefined, undefined, (spec) =>
				Object.values(decorationKey).includes(spec.key),
			).length > 0;

		// When changes to decoration target make decoration invalid (e.g. delete text, add mark to node),
		// we need to reset bookmark to hide create component and to avoid invalid draft being published
		// We only perform this change when document selection has changed.
		if (!hasMappedDecorations && shouldClearBookMarkCheck(tr, editorState, bookmark)) {
			return {
				...pluginState,
				draftDecorationSet: mappedDecorationSet,
				bookmark: undefined,
			};
		}

		if (bookmark) {
			mappedBookmark = bookmark.map(tr.mapping);
		}

		// return same pluginState if mappings did not change
		if (mappedBookmark === bookmark && mappedDecorationSet === draftDecorationSet) {
			return pluginState;
		}

		return {
			...pluginState,
			draftDecorationSet: mappedDecorationSet,
			bookmark: mappedBookmark,
		};
	},
});
