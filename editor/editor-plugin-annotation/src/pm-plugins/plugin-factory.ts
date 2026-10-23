import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { Command } from '@atlaskit/editor-common/types/command';
import { pluginFactory } from '@atlaskit/editor-common/utils/plugin-state-factory';
import type { Mark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	type EditorState,
	NodeSelection,
	type ReadonlyTransaction,
	type SafeStateField,
	type SelectionBookmark,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import reducer from './reducer';
import type { InlineCommentPluginState, InlineCommentMap, InlineCommentAction } from './types';
import {
	decorationKey,
	getAnnotationDiscovery,
	findAnnotationsInSelection,
	inlineCommentPluginKey,
	isBlockNodeAnnotationsSelected,
	isSelectedAnnotationsChanged,
} from './utils';

/**
 * Creates a document-sync handler with a deleted annotations cache in its closure.
 */
const createHandleDocChanged = () => {
	// Cache for preserving deleted annotation resolved states through delete/undo cycles
	// This stays outside plugin state so the undo cache is not serialized.
	const deletedAnnotationsCache: InlineCommentMap = {};

	return (
		tr: ReadonlyTransaction,
		prevPluginState: InlineCommentPluginState,
	): InlineCommentPluginState => {
		if (tr.getMeta('replaceDocument')) {
			return { ...prevPluginState, dirtyAnnotations: true };
		}

		const updatedState = getSelectionChangedHandler(false)(tr, prevPluginState);
		const legacyContentExperimentEnabled = isExperimentEnabled(
			'platform_editor_fix_lcm_editor_annotations',
		);
		const currentDiscovery = legacyContentExperimentEnabled
			? getAnnotationDiscovery(tr.doc)
			: undefined;
		const previousAnnotationIds = currentDiscovery
			? new Set(getAnnotationDiscovery(tr.before).annotationIds)
			: undefined;
		const newNestedAnnotationIds = currentDiscovery
			? currentDiscovery.nestedAnnotationIds.filter(
					(id) =>
						!previousAnnotationIds?.has(id) &&
						prevPluginState.annotations[id] === undefined &&
						deletedAnnotationsCache[id] === undefined,
				)
			: [];

		// Collect annotation IDs currently in the document
		const annotationIdsInDocument = currentDiscovery
			? new Set([...currentDiscovery.rootAnnotationIds, ...currentDiscovery.nestedAnnotationIds])
			: new Set<string>();
		if (!currentDiscovery) {
			tr.doc.descendants((node: PMNode) => {
				node.marks.forEach((mark: Mark) => {
					if (mark.type.name === 'annotation') {
						annotationIdsInDocument.add(mark.attrs.id);
					}
				});
			});
		}

		const annotationIdsInState = Object.keys(prevPluginState.annotations);

		// Early return if annotations haven't changed
		const annotationsHaveChanged =
			annotationIdsInDocument.size !== annotationIdsInState.length ||
			annotationIdsInState.some((id) => !annotationIdsInDocument.has(id));

		if (!annotationsHaveChanged) {
			return newNestedAnnotationIds.length > 0
				? { ...updatedState, dirtyAnnotations: true }
				: updatedState;
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

		return {
			...updatedState,
			annotations: updatedAnnotations,
			...(newNestedAnnotationIds.length > 0 && { dirtyAnnotations: true }),
		};
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

const createAnnotationPluginFactory = (
	onDocChanged: (
		tr: ReadonlyTransaction,
		pluginState: InlineCommentPluginState,
	) => InlineCommentPluginState,
) =>
	pluginFactory(inlineCommentPluginKey, reducer, {
		onSelectionChanged: getSelectionChangedHandler(true),
		onDocChanged,

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

const handleDocChangedWithSync = createHandleDocChanged();
// Keep the control cohort's existing module-level cache lifetime unchanged.
const legacyDest = createAnnotationPluginFactory(handleDocChangedWithSync);
const commandFactory = pluginFactory(inlineCommentPluginKey, reducer);
export const createPluginState: (
	dispatch: Dispatch,
	initialState: InlineCommentPluginState | ((state: EditorState) => InlineCommentPluginState),
) => SafeStateField<InlineCommentPluginState> = (dispatch, initialState) =>
	(isExperimentEnabled('platform_editor_fix_lcm_editor_annotations')
		? createAnnotationPluginFactory(createHandleDocChanged())
		: legacyDest
	).createPluginState(dispatch, initialState);
export const createCommand: <A = InlineCommentAction>(
	action: A | ((state: Readonly<EditorState>) => false | A),
	transform?: (tr: Transaction, state: EditorState) => Transaction,
) => Command = commandFactory.createCommand;
