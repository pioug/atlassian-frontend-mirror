import { pluginFactory } from '@atlaskit/editor-common/utils';
import {
	type EditorState,
	NodeSelection,
	type ReadonlyTransaction,
	type SelectionBookmark,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import {
	decorationKey,
	findAnnotationsInSelection,
	inlineCommentPluginKey,
	isBlockNodeAnnotationsSelected,
	isSelectedAnnotationsChanged,
} from '../utils';

import reducer from './reducer';
import type { InlineCommentPluginState } from './types';

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
 * We clear bookmark on the following conditions:
 * 1. if current selection is an empty selection, or
 * 2. if the current selection and bookmark selection are different
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

const getSelectionChangedHandler =
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
			pluginState.featureFlagsPluginState?.commentsOnMedia &&
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

export const { createPluginState, createCommand } = pluginFactory(inlineCommentPluginKey, reducer, {
	onSelectionChanged: getSelectionChangedHandler(true),
	onDocChanged: handleDocChanged,

	mapping: (tr, pluginState, editorState) => {
		let { draftDecorationSet, bookmark, featureFlagsPluginState } = pluginState;
		let mappedDecorationSet: DecorationSet = DecorationSet.empty,
			mappedBookmark;
		let hasMappedDecorations = false;

		if (draftDecorationSet) {
			mappedDecorationSet = draftDecorationSet.map(tr.mapping, tr.doc);
		}

		if (featureFlagsPluginState?.commentsOnMedia) {
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
