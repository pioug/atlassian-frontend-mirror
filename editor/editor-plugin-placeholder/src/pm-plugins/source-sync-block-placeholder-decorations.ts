import type { IntlShape } from 'react-intl';

import { placeholderTextMessages as messages } from '@atlaskit/editor-common/messages';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { Mapping, StepMap } from '@atlaskit/editor-prosemirror/transform';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { nodeTypesWithSyncBlockPlaceholderText, placeholderTestId } from './constants';

const isEmptySourceSyncBlock = (node: PMNode): boolean =>
	nodeTypesWithSyncBlockPlaceholderText.includes(node.type.name) &&
	node.childCount === 1 &&
	node.firstChild?.content.size === 0 &&
	node.firstChild?.type.name === 'paragraph';

const createSourceSyncBlockPlaceholderElement = (intl: IntlShape): HTMLElement => {
	const placeholderDecoration = document.createElement('span');
	placeholderDecoration.setAttribute('data-testid', placeholderTestId);
	placeholderDecoration.className = 'placeholder-decoration';
	placeholderDecoration.setAttribute('aria-hidden', 'true');
	placeholderDecoration.textContent = intl.formatMessage(messages.sourceSyncBlockPlaceholderText);

	return placeholderDecoration;
};

const createSourceSyncBlockPlaceholderDecoration = (pos: number, intl: IntlShape) =>
	Decoration.widget(pos + 2, () => createSourceSyncBlockPlaceholderElement(intl), {
		side: 0,
		key: `source-sync-block-placeholder-${pos}`,
	});

const isSourceSyncBlockPlaceholderEnabled = () =>
	expValEquals('platform_editor_sync_block_activation', 'isEnabled', true) &&
	editorExperiment('platform_synced_block', true);

type Range = { from: number; to: number };
type SourceSyncBlockPlaceholderTransaction = { mapping: Mapping; docChanged: boolean };

const getChangedRanges = (tr: SourceSyncBlockPlaceholderTransaction): Range[] => {
	const ranges: Range[] = [];

	tr.mapping.maps.forEach((stepMap: StepMap, index) => {
		stepMap.forEach((_oldStart, _oldEnd, newStart, newEnd) => {
			const mappingAfterStep = tr.mapping.slice(index + 1);
			ranges.push({
				from: mappingAfterStep.map(newStart, -1),
				to: mappingAfterStep.map(newEnd, 1),
			});
		});
	});

	return ranges;
};

const getSourceSyncBlockRange = (doc: PMNode, pos: number): Range | undefined => {
	const resolvedPos = doc.resolve(Math.max(0, Math.min(pos, doc.content.size)));

	for (let depth = resolvedPos.depth; depth > 0; depth--) {
		const node = resolvedPos.node(depth);
		if (nodeTypesWithSyncBlockPlaceholderText.includes(node.type.name)) {
			return {
				from: resolvedPos.before(depth),
				to: resolvedPos.after(depth),
			};
		}
	}

	return;
};

const getAffectedSourceSyncBlockRanges = (doc: PMNode, ranges: Range[]): Range[] => {
	const affectedRanges = new Map<string, Range>();

	ranges.forEach(({ from, to }) => {
		[from, to].forEach((pos) => {
			const sourceSyncBlockRange = getSourceSyncBlockRange(doc, pos);
			if (sourceSyncBlockRange) {
				affectedRanges.set(
					`${sourceSyncBlockRange.from}-${sourceSyncBlockRange.to}`,
					sourceSyncBlockRange,
				);
			}
		});

		doc.nodesBetween(from, to, (node, pos) => {
			if (nodeTypesWithSyncBlockPlaceholderText.includes(node.type.name)) {
				const sourceSyncBlockRange = { from: pos, to: pos + node.nodeSize };
				affectedRanges.set(
					`${sourceSyncBlockRange.from}-${sourceSyncBlockRange.to}`,
					sourceSyncBlockRange,
				);
				return false;
			}

			return true;
		});
	});

	return Array.from(affectedRanges.values());
};

export function createSourceSyncBlockPlaceholderDecorations(
	editorState: EditorState,
	intl: IntlShape,
): DecorationSet | undefined {
	if (!isSourceSyncBlockPlaceholderEnabled()) {
		return;
	}

	const decorations: Decoration[] = [];

	editorState.doc.descendants((node, pos) => {
		if (isEmptySourceSyncBlock(node)) {
			decorations.push(createSourceSyncBlockPlaceholderDecoration(pos, intl));
			return false;
		}

		return true;
	});

	return decorations.length > 0
		? DecorationSet.create(editorState.doc, decorations)
		: DecorationSet.empty;
}

export function updateSourceSyncBlockPlaceholderDecorations({
	currentDecorationSet,
	intl,
	newEditorState,
	oldEditorState,
	tr,
}: {
	currentDecorationSet?: DecorationSet;
	intl: IntlShape;
	newEditorState: EditorState;
	oldEditorState: EditorState;
	tr: SourceSyncBlockPlaceholderTransaction;
}): DecorationSet | undefined {
	if (!isSourceSyncBlockPlaceholderEnabled()) {
		return;
	}

	if (!currentDecorationSet) {
		return createSourceSyncBlockPlaceholderDecorations(newEditorState, intl);
	}

	if (!tr.docChanged) {
		return tr.mapping.maps.length > 0
			? currentDecorationSet.map(tr.mapping, newEditorState.doc)
			: currentDecorationSet;
	}

	const mappedDecorationSet = currentDecorationSet.map(tr.mapping, newEditorState.doc);
	const affectedRanges = getAffectedSourceSyncBlockRanges(newEditorState.doc, getChangedRanges(tr));

	if (affectedRanges.length === 0) {
		return mappedDecorationSet;
	}

	const decorationsToRemove = affectedRanges.flatMap(({ from, to }) =>
		mappedDecorationSet.find(from, to),
	);
	const decorationsToAdd = affectedRanges.flatMap(({ from }) => {
		const node = newEditorState.doc.nodeAt(from);
		return node && isEmptySourceSyncBlock(node)
			? [createSourceSyncBlockPlaceholderDecoration(from, intl)]
			: [];
	});

	return mappedDecorationSet.remove(decorationsToRemove).add(newEditorState.doc, decorationsToAdd);
}
