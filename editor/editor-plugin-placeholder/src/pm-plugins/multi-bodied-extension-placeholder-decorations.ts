import type { IntlShape } from 'react-intl';

import { placeholderTextMessages as messages } from '@atlaskit/editor-common/messages';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { Mapping, StepMap } from '@atlaskit/editor-prosemirror/transform';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { nodeTypesWithMultiBodiedExtensionPlaceholderText, placeholderTestId } from './constants';

const isMultiBodiedExtensionPlaceholderEnabled = () =>
	expValEquals('confluence_native_tabs_experiment', 'isEnabled', true);

// Empty MBE bodies are represented as extensionFrame -> empty paragraph.
// The paragraph gives the cursor a valid textblock, but there is no authored content yet.
const isEmptyExtensionFrame = (node: PMNode): boolean =>
	nodeTypesWithMultiBodiedExtensionPlaceholderText.includes(node.type.name) &&
	node.childCount === 1 &&
	node.firstChild?.content.size === 0 &&
	node.firstChild?.type.name === 'paragraph';

// Keep this generic for any MBE extension by checking the node shape rather
// than a product-specific extensionKey.
const isExtensionFrameInMultiBodiedExtension = (
	node: PMNode,
	parent: PMNode | null | undefined,
): boolean =>
	nodeTypesWithMultiBodiedExtensionPlaceholderText.includes(node.type.name) &&
	parent?.type.name === 'multiBodiedExtension';

const isEmptyExtensionFrameInMultiBodiedExtension = (
	node: PMNode,
	parent: PMNode | null | undefined,
): boolean => isExtensionFrameInMultiBodiedExtension(node, parent) && isEmptyExtensionFrame(node);

// Widget decorations render UI without adding real content to the document.
const createMultiBodiedExtensionPlaceholderElement = (intl: IntlShape): HTMLElement => {
	const placeholderDecoration = document.createElement('span');
	placeholderDecoration.setAttribute('data-testid', placeholderTestId);
	placeholderDecoration.className = 'placeholder-decoration';
	placeholderDecoration.setAttribute('aria-hidden', 'true');
	placeholderDecoration.textContent = intl.formatMessage(
		messages.multiBodiedExtensionPlaceholderText,
	);

	return placeholderDecoration;
};

// `pos` is before extensionFrame; `pos + 2` is inside its paragraph, where
// typing starts and where the placeholder should render.
const createMultiBodiedExtensionPlaceholderDecoration = (pos: number, intl: IntlShape) =>
	Decoration.widget(pos + 2, () => createMultiBodiedExtensionPlaceholderElement(intl), {
		side: 0,
		key: `multi-bodied-extension-placeholder-${pos}`,
	});

type Range = { from: number; to: number };
type MultiBodiedExtensionPlaceholderTransaction = { docChanged: boolean; mapping: Mapping };

// Convert changed step ranges into final-document positions. A transaction can
// contain multiple steps, and each step can shift positions for later steps.
const getChangedRanges = (tr: MultiBodiedExtensionPlaceholderTransaction): Range[] => {
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

// Walk from a changed position up to its containing MBE frame. The frame may no
// longer be empty after the change, but we still need its range to remove stale decorations.
const getMultiBodiedExtensionFrameRange = (doc: PMNode, pos: number): Range | undefined => {
	const resolvedPos = doc.resolve(Math.max(0, Math.min(pos, doc.content.size)));

	for (let depth = resolvedPos.depth; depth > 0; depth--) {
		const node = resolvedPos.node(depth);
		const parent = depth > 0 ? resolvedPos.node(depth - 1) : undefined;

		if (isExtensionFrameInMultiBodiedExtension(node, parent)) {
			return {
				from: resolvedPos.before(depth),
				to: resolvedPos.after(depth),
			};
		}
	}

	return;
};

// Resolve just inside a frame to recover its parent; `doc.nodeAt(framePos)` only
// gives the frame node itself.
const getMultiBodiedExtensionFrameParent = (doc: PMNode, framePos: number): PMNode | undefined => {
	const resolvedPos = doc.resolve(Math.max(0, Math.min(framePos + 1, doc.content.size)));

	for (let depth = resolvedPos.depth; depth > 0; depth--) {
		if (resolvedPos.before(depth) === framePos) {
			return resolvedPos.node(depth - 1);
		}
	}

	return;
};

// Only update MBE frames touched by this transaction: either the change happened
// inside a frame, or the transaction inserted/replaced an empty frame.
const getAffectedMultiBodiedExtensionFrameRanges = (doc: PMNode, ranges: Range[]): Range[] => {
	const affectedRanges = new Map<string, Range>();

	ranges.forEach(({ from, to }) => {
		[from, to].forEach((pos) => {
			const multiBodiedExtensionFrameRange = getMultiBodiedExtensionFrameRange(doc, pos);
			if (multiBodiedExtensionFrameRange) {
				affectedRanges.set(
					`${multiBodiedExtensionFrameRange.from}-${multiBodiedExtensionFrameRange.to}`,
					multiBodiedExtensionFrameRange,
				);
			}
		});

		doc.nodesBetween(from, to, (node, pos, parent) => {
			if (isEmptyExtensionFrameInMultiBodiedExtension(node, parent)) {
				const multiBodiedExtensionFrameRange = { from: pos, to: pos + node.nodeSize };
				affectedRanges.set(
					`${multiBodiedExtensionFrameRange.from}-${multiBodiedExtensionFrameRange.to}`,
					multiBodiedExtensionFrameRange,
				);
				return false;
			}

			return true;
		});
	});

	return Array.from(affectedRanges.values());
};

// Initial creation scans the full document once. Later updates use affected
// ranges, and inactive tab frames stay hidden by the MBE renderer.
export function createMultiBodiedExtensionPlaceholderDecorations(
	editorState: EditorState,
	intl: IntlShape,
): DecorationSet | undefined {
	if (!isMultiBodiedExtensionPlaceholderEnabled()) {
		return;
	}

	const decorations: Decoration[] = [];

	editorState.doc.descendants((node, pos, parent) => {
		if (isEmptyExtensionFrameInMultiBodiedExtension(node, parent)) {
			decorations.push(createMultiBodiedExtensionPlaceholderDecoration(pos, intl));
			return false;
		}

		return true;
	});

	return decorations.length > 0
		? DecorationSet.create(editorState.doc, decorations)
		: DecorationSet.empty;
}

export function updateMultiBodiedExtensionPlaceholderDecorations({
	currentDecorationSet,
	intl,
	newEditorState,
	tr,
}: {
	currentDecorationSet?: DecorationSet;
	intl: IntlShape;
	newEditorState: EditorState;
	tr: MultiBodiedExtensionPlaceholderTransaction;
}): DecorationSet | undefined {
	if (!isMultiBodiedExtensionPlaceholderEnabled()) {
		return;
	}

	if (!currentDecorationSet) {
		return createMultiBodiedExtensionPlaceholderDecorations(newEditorState, intl);
	}

	// No document change means no empty/non-empty frame state change; remap
	// existing decorations only if ProseMirror reports positional mapping.
	if (!tr.docChanged) {
		return tr.mapping.maps.length > 0
			? currentDecorationSet.map(tr.mapping, newEditorState.doc)
			: currentDecorationSet;
	}

	const mappedDecorationSet = currentDecorationSet.map(tr.mapping, newEditorState.doc);
	const affectedRanges = getAffectedMultiBodiedExtensionFrameRanges(
		newEditorState.doc,
		getChangedRanges(tr),
	);

	if (affectedRanges.length === 0) {
		return mappedDecorationSet;
	}

	// Remove placeholders in affected frames, then re-add only for frames that
	// still have the empty extensionFrame -> paragraph shape.
	const decorationsToRemove = affectedRanges.flatMap(({ from, to }) =>
		mappedDecorationSet.find(from, to),
	);
	const decorationsToAdd = affectedRanges.flatMap(({ from }) => {
		const node = newEditorState.doc.nodeAt(from);
		const parent = getMultiBodiedExtensionFrameParent(newEditorState.doc, from);

		return node && isEmptyExtensionFrameInMultiBodiedExtension(node, parent)
			? [createMultiBodiedExtensionPlaceholderDecoration(from, intl)]
			: [];
	});

	return mappedDecorationSet.remove(decorationsToRemove).add(newEditorState.doc, decorationsToAdd);
}
