import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { AnnotationInfo, InlineCommentAnnotationProvider } from '../types';
import type { AnnotationDecorationDeps } from './decorations';
import {
	getAnnotationDecorationsForDocument,
	rebuildRangesForIds,
	updateAnnotationDecorations,
} from './decorations';
import type { InlineCommentMap, InlineCommentPluginState } from './types';
import { getPluginState } from './utils';

export const annotationDecorationsPluginKey: PluginKey<DecorationSet> =
	new PluginKey<DecorationSet>('annotationDecorationsPlugin');

const pluginPropsToDeps = (
	pluginState: InlineCommentPluginState | undefined,
	provider: InlineCommentAnnotationProvider,
): AnnotationDecorationDeps => ({
	annotations: pluginState?.annotations,
	selectedAnnotations: pluginState?.selectedAnnotations,
	hoveredAnnotations: pluginState?.hoveredAnnotations,
	isVisible: pluginState?.isVisible,
	isInlineCommentViewClosed: pluginState?.isInlineCommentViewClosed,
	supportedBlockNodes: provider.supportedBlockNodes,
	isBlockNodeSupported: provider.isBlockNodeSupported,
});

const toIdSet = (annotations: AnnotationInfo[] | undefined): Set<string> =>
	new Set(annotations?.map(({ id }) => id));

const union = (sets: Set<string>[]): Set<string> => new Set(sets.flatMap((set) => [...set]));

/** Resolving flips the value without changing the key set, so the comparison is by value. */
const getResolvedStateChanges = (
	previous: InlineCommentMap | undefined,
	next: InlineCommentMap | undefined,
): Set<string> => {
	if (previous === next) {
		return new Set();
	}

	const ids = new Set<string>([...Object.keys(previous ?? {}), ...Object.keys(next ?? {})]);

	return new Set([...ids].filter((id) => (previous?.[id] === false) !== (next?.[id] === false)));
};

const getSelectionChanges = (
	previous: AnnotationInfo[] | undefined,
	next: AnnotationInfo[] | undefined,
): Set<string> => {
	if (previous === next) {
		return new Set();
	}

	const previousIds = toIdSet(previous);
	const nextIds = toIdSet(next);

	return new Set(
		[...previousIds, ...nextIds].filter((id) => !previousIds.has(id) || !nextIds.has(id)),
	);
};

const getChangedAnnotationIds = (
	previous: AnnotationDecorationDeps,
	next: AnnotationDecorationDeps,
): Set<string> => {
	const changes = [
		getResolvedStateChanges(previous.annotations, next.annotations),
		getSelectionChanges(previous.selectedAnnotations, next.selectedAnnotations),
		getSelectionChanges(previous.hoveredAnnotations, next.hoveredAnnotations),
	];

	// This flag suppresses selected and hovered styling, so a flip changes every affected id
	const suppressionChanges =
		previous.isInlineCommentViewClosed !== next.isInlineCommentViewClosed
			? [
					toIdSet(previous.selectedAnnotations),
					toIdSet(next.selectedAnnotations),
					toIdSet(previous.hoveredAnnotations),
					toIdSet(next.hoveredAnnotations),
				]
			: [];

	return union([...changes, ...suppressionChanges]);
};

/**
 * Must be registered directly after the annotation plugin: plugin state is assigned in plugin
 * order, so this reads an annotation state already settled for the transaction.
 */
export const annotationDecorationsPlugin = (
	provider: InlineCommentAnnotationProvider,
): SafePlugin<DecorationSet> =>
	new SafePlugin<DecorationSet>({
		key: annotationDecorationsPluginKey,

		state: {
			init: (_, state: EditorState) =>
				getAnnotationDecorationsForDocument(
					state.doc,
					pluginPropsToDeps(getPluginState(state), provider),
				),

			apply: (
				tr: ReadonlyTransaction,
				previousDecorationSet: DecorationSet,
				oldEditorState: EditorState,
				newEditorState: EditorState,
			) => {
				const previousDeps = pluginPropsToDeps(getPluginState(oldEditorState), provider);
				const deps = pluginPropsToDeps(getPluginState(newEditorState), provider);

				// Hiding comments empties the set, leaving nothing to map forward
				if (previousDeps.isVisible !== deps.isVisible) {
					return getAnnotationDecorationsForDocument(tr.doc, deps);
				}

				let decorationSet = tr.docChanged
					? updateAnnotationDecorations(previousDecorationSet, tr, tr.doc, deps)
					: previousDecorationSet;

				decorationSet = rebuildRangesForIds(
					decorationSet,
					getChangedAnnotationIds(previousDeps, deps),
					tr.doc,
					deps,
				);

				return decorationSet;
			},
		},

		props: {
			decorations(state: EditorState) {
				return annotationDecorationsPluginKey.getState(state);
			},
		},
	});
