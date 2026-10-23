import type { AnnotationMarkAttributes } from '@atlaskit/adf-schema/annotation';
import { AnnotationTypes } from '@atlaskit/adf-schema/annotation';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics/types/enums';
import type {
	AnalyticsEventPayload,
	AnalyticsEventPayloadCallback,
} from '@atlaskit/editor-common/analytics/types/events';
import type { AnnotationDraftAEPAttributes } from '@atlaskit/editor-common/analytics/types/inline-comment-events';
import { currentMediaNodeWithPos } from '@atlaskit/editor-common/media-single';
import {
	AnnotationSharedClassNames,
	BlockAnnotationSharedClassNames,
} from '@atlaskit/editor-common/styles/annotation';
import {
	canApplyAnnotationOnRange,
	getAnnotationIdsFromRange,
	getRangeInlineNodeNames,
	hasAnnotationMark,
	isEmptyTextSelection,
} from '@atlaskit/editor-common/utils/annotation';
import { isParagraph, isText } from '@atlaskit/editor-common/utils/nodes';
import type { Mark, Node, ResolvedPos, Schema, Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Selection, SelectionBookmark } from '@atlaskit/editor-prosemirror/state';
import {
	AllSelection,
	NodeSelection,
	PluginKey,
	TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type {
	AnnotationInfo,
	DraftBookmark,
	InlineCommentAnnotationProvider,
	InlineCommentInputMethod,
	TargetType,
} from '../types';
import { AnnotationSelectionType } from '../types';
import type { InlineCommentPluginState } from './types';

function sum<T>(arr: Array<T>, f: (val: T) => number) {
	return arr.reduce((val, x) => val + f(x), 0);
}
/**
 * Finds the marks in the nodes to the left and right.
 * @param $pos Position to center search around
 */
export const surroundingMarks = ($pos: ResolvedPos): (readonly Mark[])[] => {
	const { nodeBefore, nodeAfter } = $pos;
	const markNodeBefore =
		nodeBefore && $pos.doc.nodeAt(Math.max(0, $pos.pos - nodeBefore.nodeSize - 1));
	const markNodeAfter = nodeAfter && $pos.doc.nodeAt($pos.pos + nodeAfter.nodeSize);

	return [
		(markNodeBefore && markNodeBefore.marks) || [],
		(markNodeAfter && markNodeAfter.marks) || [],
	];
};

/**
 * Finds annotation marks, and returns their IDs.
 * @param marks Array of marks to search in
 */
const filterAnnotationIds = (marks: readonly Mark[]): Array<string> => {
	if (!marks.length) {
		return [];
	}

	const { annotation } = marks[0].type.schema.marks;
	return marks.filter((mark) => mark.type === annotation).map((mark) => mark.attrs.id);
};

/**
 * Re-orders the annotation array based on the order in the document.
 *
 * This places the marks that do not appear in the surrounding nodes
 * higher in the list. That is, the inner-most one appears first.
 *
 * Undo, for example, can re-order annotation marks in the document.
 * @param annotations annotation metadata
 * @param $from location to look around (usually the selection)
 */
const reorderAnnotations = (annotations: Array<AnnotationInfo>, $from: ResolvedPos) => {
	const idSet = surroundingMarks($from).map(filterAnnotationIds);

	annotations.sort(
		(a, b) => sum(idSet, (ids) => ids.indexOf(a.id)) - sum(idSet, (ids) => ids.indexOf(b.id)),
	);
};

type AnnotationDiscovery = {
	annotationIds: readonly string[];
	nestedAnnotationIds: readonly string[];
	rootAnnotationIds: readonly string[];
};

const legacyContentAnnotationsByDoc = new WeakMap<Node, AnnotationDiscovery>();
const legacyContentAnnotationIdsByExtension = new WeakMap<Node, readonly string[]>();

const readNestedContentNodes = (parameters: unknown): unknown[] | undefined => {
	if (!parameters || typeof parameters !== 'object') {
		return undefined;
	}

	const nestedContent = (parameters as { nestedContent?: unknown }).nestedContent;
	if (!nestedContent || typeof nestedContent !== 'object') {
		return undefined;
	}

	const nestedDocument = nestedContent as { content?: unknown; type?: unknown };
	return nestedDocument.type === 'doc' && Array.isArray(nestedDocument.content)
		? nestedDocument.content
		: undefined;
};

const getNestedContentAnnotationIds = (extension: Node): readonly string[] => {
	const cachedIds = legacyContentAnnotationIdsByExtension.get(extension);
	if (cachedIds) {
		return cachedIds;
	}

	const nestedNodes = readNestedContentNodes(extension.attrs.parameters);
	if (!nestedNodes) {
		const noIds = Object.freeze([] as string[]);
		legacyContentAnnotationIdsByExtension.set(extension, noIds);
		return noIds;
	}

	const annotationIds = new Set<string>();
	const visitedAdfNodes = new WeakSet<object>();
	const pending: unknown[] = [...nestedNodes].reverse();
	while (pending.length > 0) {
		const value = pending.pop();
		if (!value || typeof value !== 'object' || visitedAdfNodes.has(value)) {
			continue;
		}
		visitedAdfNodes.add(value);

		const adfNode = value as {
			attrs?: { extensionKey?: unknown; extensionType?: unknown; parameters?: unknown };
			content?: unknown;
			marks?: unknown;
			type?: unknown;
		};
		if (Array.isArray(adfNode.marks)) {
			adfNode.marks.forEach((rawMark) => {
				if (!rawMark || typeof rawMark !== 'object') {
					return;
				}
				const annotationMark = rawMark as { attrs?: unknown; type?: unknown };
				const attrs = annotationMark.attrs;
				if (annotationMark.type !== 'annotation' || !validateAnnotationAttributes(attrs)) {
					return;
				}
				annotationIds.add(attrs.id);
			});
		}

		if (
			adfNode.type === 'extension' &&
			adfNode.attrs?.extensionType === 'com.atlassian.confluence.migration' &&
			adfNode.attrs.extensionKey === 'legacy-content'
		) {
			const nestedNodes = readNestedContentNodes(adfNode.attrs.parameters);
			if (nestedNodes) {
				for (let i = nestedNodes.length - 1; i >= 0; i--) {
					pending.push(nestedNodes[i]);
				}
			}
		}

		if (Array.isArray(adfNode.content)) {
			for (let i = adfNode.content.length - 1; i >= 0; i--) {
				pending.push(adfNode.content[i]);
			}
		}
	}

	const ids = Object.freeze([...annotationIds]);
	legacyContentAnnotationIdsByExtension.set(extension, ids);
	return ids;
};

/** Discover annotation IDs from immutable legacy-content ADF without repeatedly scanning it. */
export const getAnnotationDiscovery = (doc: Node): AnnotationDiscovery => {
	const cachedDiscovery = legacyContentAnnotationsByDoc.get(doc);
	if (cachedDiscovery) {
		return cachedDiscovery;
	}

	const allAnnotationIds = new Set<string>();
	const rootAnnotationIds = new Set<string>();
	const nestedAnnotationIds = new Set<string>();

	doc.descendants((node) => {
		node.marks
			.filter((mark) => mark.type.name === 'annotation')
			.forEach((mark) => {
				if (validateAnnotationMark(mark)) {
					rootAnnotationIds.add(mark.attrs.id);
					allAnnotationIds.add(mark.attrs.id);
				}
			});

		if (
			node.type.name === 'extension' &&
			node.attrs.extensionType === 'com.atlassian.confluence.migration' &&
			node.attrs.extensionKey === 'legacy-content'
		) {
			getNestedContentAnnotationIds(node).forEach((id) => {
				nestedAnnotationIds.add(id);
				allAnnotationIds.add(id);
			});
		}
		return true;
	});

	const discovery = {
		annotationIds: Object.freeze([...allAnnotationIds]),
		rootAnnotationIds: Object.freeze([...rootAnnotationIds]),
		nestedAnnotationIds: Object.freeze([...nestedAnnotationIds]),
	};
	legacyContentAnnotationsByDoc.set(doc, discovery);
	return discovery;
};

export const getAllAnnotations = (doc: Node): string[] => {
	if (isExperimentEnabled('platform_editor_fix_lcm_editor_annotations')) {
		return [...getAnnotationDiscovery(doc).annotationIds];
	}

	const allAnnotationIds: Set<string> = new Set();

	doc.descendants((node) => {
		node.marks
			.filter((mark) => mark.type.name === 'annotation')
			// filter out annotations with invalid attributes as they cause errors when interacting with them
			.filter(validateAnnotationMark)
			.forEach((m) => allAnnotationIds.add(m.attrs.id));
		return true;
	});

	return Array.from(allAnnotationIds);
};

const validateAnnotationId = (id: unknown): id is string => {
	if (!id || typeof id !== 'string') {
		return false;
	}
	const invalidIds = ['null', 'undefined'];
	return !invalidIds.includes(id.toLowerCase());
};

const validateAnnotationType = (type: unknown): type is AnnotationTypes => {
	if (!type || typeof type !== 'string') {
		return false;
	}
	const allowedTypes = Object.values(AnnotationTypes);
	return allowedTypes.some((allowedType) => allowedType === type);
};

const validateAnnotationAttributes = (attrs: unknown): attrs is AnnotationMarkAttributes => {
	if (!attrs || typeof attrs !== 'object') {
		return false;
	}

	return (
		'id' in attrs &&
		'annotationType' in attrs &&
		validateAnnotationId(attrs.id) &&
		validateAnnotationType(attrs.annotationType)
	);
};

const validateAnnotationMark = (annotationMark: Mark): boolean =>
	validateAnnotationAttributes(annotationMark.attrs);

export const decorationKey = {
	block: 'blockCommentDecoration',
	inline: 'inlineCommentDecoration',
};
/*
 * add decoration for the comment selection in draft state
 * (when creating new comment)
 */
export const addDraftDecoration = (
	start: number,
	end: number,
	targetType: TargetType = 'inline',
): Decoration => {
	if (targetType === 'block') {
		return Decoration.node(
			start,
			end,
			{
				class: `${BlockAnnotationSharedClassNames.draft}`,
			},
			{
				key: decorationKey.block,
			},
		);
	}
	return Decoration.inline(
		start,
		end,
		{
			class: `${AnnotationSharedClassNames.draft}`,
		},
		{ key: decorationKey.inline },
	);
};

export const getAnnotationViewKey = (annotations: AnnotationInfo[]): string => {
	const keys = annotations.map((mark) => mark.id).join('_');
	return `view-annotation-wrapper_${keys}`;
};

const isRemixExtension = (node: Node): boolean =>
	node.type.name === 'extension' && node.attrs.extensionKey === 'native-embed:maui';

// During rollback, hide chart highlights and automatic comment opening, not saved marks.
export const shouldHideRemixAnnotation = (node: Node): boolean =>
	isRemixExtension(node) && !fg('cc_maui_annotations_on_extensions');

export const findAnnotationsInSelection = (selection: Selection, doc: Node): AnnotationInfo[] => {
	const { empty, $anchor, anchor } = selection;
	// Only detect annotations on caret selection
	if (!empty || !doc) {
		if (fg('editor_inline_comments_on_inline_nodes')) {
			if (
				selection instanceof NodeSelection &&
				['inlineCard', 'emoji', 'date', 'mention', 'status'].includes(selection.node.type.name)
			) {
				// Inline comments on these nodes are supported -- so we continue to find annotations
			} else {
				return [];
			}
		} else {
			return [];
		}
	}

	const node = doc.nodeAt(anchor);
	const nodeBefore = $anchor.nodeBefore;

	if (!node && !nodeBefore) {
		return [];
	}

	// Inline comment on mediaInline is not supported as part of comments on media project
	// Hence, we ignore annotations associated with the node when the cursor is right after/before the node
	if ([nodeBefore, node].some((node) => node?.type.name === 'mediaInline')) {
		return [];
	}

	const annotationMark = doc.type.schema.marks.annotation;
	// Opening Remix Edit moves the selection beside the chart. Only explicit comment
	// actions should open its threads; a nearby caret must not select its annotations.
	const anchorAnnotationMarks = node && !isRemixExtension(node) ? node.marks : [];

	let marks: readonly Mark[] = [];
	if (annotationMark.isInSet(anchorAnnotationMarks)) {
		marks = anchorAnnotationMarks;
	}
	if (nodeBefore && !isRemixExtension(nodeBefore) && annotationMark.isInSet(nodeBefore.marks)) {
		const existingMarkIds = marks.map((m) => m.attrs.id);
		marks = marks.concat(...nodeBefore.marks.filter((m) => !existingMarkIds.includes(m.attrs.id)));
	}

	const annotations = marks
		.filter((mark) => mark.type.name === 'annotation')
		.map((mark) => ({
			id: mark.attrs.id,
			type: mark.attrs.annotationType,
		}));

	reorderAnnotations(annotations, $anchor);
	return annotations;
};

export const resolveDraftBookmark = (
	editorState: EditorState,
	bookmark?: SelectionBookmark,
	supportedBlockNodes: string[] = [],
	isBlockNodeSupported?: InlineCommentAnnotationProvider['isBlockNodeSupported'],
): DraftBookmark => {
	const { doc } = editorState;

	const resolvedBookmark = bookmark ? bookmark.resolve(doc) : editorState.selection;

	const { from, to, head } = resolvedBookmark;
	let draftBookmark = { from, to, head, isBlockNode: false };
	if (resolvedBookmark instanceof NodeSelection) {
		// It's possible that annotation is only allowed in child node instead parent (e.g. mediaSingle vs media),
		// thus, we traverse the node to find the first node that supports annotation and return its position
		let nodeFound = false;
		doc.nodesBetween(from, to, (node, pos) => {
			// if we find the node, breakout the traversal to make sure we always record the first supported node
			if (nodeFound) {
				return false;
			}
			const nodeEndsAt = pos + node.nodeSize;

			const isLegacyMediaSingleWrapper =
				node.type.name === 'mediaSingle' &&
				supportedBlockNodes.includes('media') &&
				!supportedBlockNodes.includes('mediaSingle');

			if (
				isSupportedBlockNode(node, supportedBlockNodes, isBlockNodeSupported) &&
				!isLegacyMediaSingleWrapper
			) {
				draftBookmark = {
					from: pos,
					to: nodeEndsAt,
					head: nodeEndsAt,
					isBlockNode: node.isBlock,
				};
				nodeFound = true;
				return false;
			}
		});
	}

	return draftBookmark;
};
/**
 * get selection from position to apply new comment for
 * @returns bookmarked positions if they exists, otherwise current selection positions
 */
export function getSelectionPositions(
	editorState: EditorState,
	bookmark: SelectionBookmark | undefined,
): Selection {
	// get positions via saved bookmark if it is available
	// this is to make comments box positioned relative to temporary highlight rather then current selection
	if (bookmark) {
		return bookmark.resolve(editorState.doc);
	}
	return editorState.selection;
}

export const inlineCommentPluginKey: PluginKey<InlineCommentPluginState> =
	new PluginKey<InlineCommentPluginState>('inlineCommentPluginKey');

export const getPluginState = (state: EditorState): InlineCommentPluginState | undefined => {
	return inlineCommentPluginKey.getState(state);
};

/**
 * get number of unique annotations within current selection
 */
const getAnnotationsInSelectionCount = (state: EditorState): number => {
	const { from, to } = state.selection;
	const annotations = getAnnotationIdsFromRange({ from, to }, state.doc, state.schema);
	return annotations.length;
};

/**
 * get payload for the open/close analytics event
 */
export const getDraftCommandAnalyticsPayload = (
	drafting: boolean,
	inputMethod: InlineCommentInputMethod,
): AnalyticsEventPayloadCallback => {
	const payload: AnalyticsEventPayloadCallback = (state: EditorState): AnalyticsEventPayload => {
		let attributes: Partial<AnnotationDraftAEPAttributes> = {};

		if (drafting) {
			const { selection } = state;
			const targetNode =
				selection instanceof NodeSelection ? selection.node : currentMediaNodeWithPos(state)?.node;
			let commentTargetType: AnnotationDraftAEPAttributes['commentTargetType'] = 'other';
			if (targetNode?.type.name === 'extension') {
				commentTargetType =
					targetNode.attrs.extensionKey === 'native-embed:maui' ? 'remixEmbed' : 'other';
			} else if (
				targetNode &&
				['media', 'mediaSingle', 'mediaInline'].includes(targetNode.type.name)
			) {
				commentTargetType = 'media';
			} else if (selection instanceof TextSelection || selection instanceof AllSelection) {
				commentTargetType = 'text';
			}
			attributes = {
				inputMethod,
				overlap: getAnnotationsInSelectionCount(state),
				commentTargetType,
			} as AnnotationDraftAEPAttributes;
		}

		if (fg('editor_inline_comments_on_inline_nodes')) {
			const { bookmark } = getPluginState(state) || {};
			attributes.inlineNodeNames = getRangeInlineNodeNames({
				doc: state.doc,
				pos: resolveDraftBookmark(state, bookmark),
			});
		}

		return {
			action: drafting ? ACTION.OPENED : ACTION.CLOSED,
			actionSubject: ACTION_SUBJECT.ANNOTATION,
			actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
			eventType: EVENT_TYPE.TRACK,
			attributes,
		};
	};
	return payload;
};

export const isSelectionValid = (
	state: EditorState,
	supportedBlockNodes: string[] = [],
	isBlockNodeSupported?: InlineCommentAnnotationProvider['isBlockNodeSupported'],
): AnnotationSelectionType => {
	const { selection } = state;
	const { disallowOnWhitespace } = getPluginState(state) || {};
	const allowedInlineNodes = ['emoji', 'status', 'date', 'mention', 'inlineCard'];
	const isSelectionEmpty = selection.empty;
	const isTextOrAllSelection =
		selection instanceof TextSelection || selection instanceof AllSelection;
	const isSupportedBlockNodeSelection =
		selection instanceof NodeSelection &&
		isSupportedBlockNode(selection.node, supportedBlockNodes, isBlockNodeSupported);
	const isValidNodeSelection =
		selection instanceof NodeSelection &&
		(allowedInlineNodes.includes(selection.node.type.name) || isSupportedBlockNodeSelection);
	const isValidSelection = isTextOrAllSelection || isValidNodeSelection;

	// Allow media so that it can enter draft mode
	if (currentMediaNodeWithPos(state)?.node) {
		return AnnotationSelectionType.VALID;
	}

	if (isSelectionEmpty || !isValidSelection) {
		return AnnotationSelectionType.INVALID;
	}

	const containsInvalidNodes = !isSupportedBlockNodeSelection && hasInvalidNodes(state);

	// A selection that only covers 1 pos, and is an invalid node
	// e.g. a text selection over a mention
	if (containsInvalidNodes && selection.to - selection.from === 1) {
		return AnnotationSelectionType.INVALID;
	}

	if (containsInvalidNodes) {
		return AnnotationSelectionType.DISABLED;
	}

	// Extension content lives outside the editor document, so an eligible whole-block
	// selection must not be rejected for having no commentable text descendants.
	const isSupportedExtensionSelection =
		fg('cc_maui_annotations_on_extensions') &&
		isSupportedBlockNodeSelection &&
		selection instanceof NodeSelection &&
		selection.node.type.name === 'extension';
	if (
		disallowOnWhitespace &&
		!isSupportedExtensionSelection &&
		hasInvalidWhitespaceNode(selection, state.schema)
	) {
		return AnnotationSelectionType.INVALID;
	}

	if (!(selection instanceof NodeSelection) && isEmptyTextSelection(selection, state.schema)) {
		return AnnotationSelectionType.INVALID;
	}

	return AnnotationSelectionType.VALID;
};

export const hasInvalidNodes = (state: EditorState): boolean => {
	const { selection, doc, schema } = state;
	return !canApplyAnnotationOnRange(
		{
			from: selection.from,
			to: selection.to,
		},
		doc,
		schema,
	);
};

export const isSupportedBlockNode = (
	node: Node,
	supportedBlockNodes: string[] = [],
	isBlockNodeSupported?: InlineCommentAnnotationProvider['isBlockNodeSupported'],
): boolean => {
	return (
		supportedBlockNodes.indexOf(node.type.name) >= 0 ||
		(node.type.name === 'mediaSingle' && supportedBlockNodes.indexOf('media') >= 0) ||
		(fg('cc_maui_annotations_on_extensions') && isBlockNodeSupported?.(node) === true)
	);
};

/**
 * Checks if any of the nodes in a given selection are completely whitespace
 * This is to conform to Confluence annotation specifications
 */
export function hasInvalidWhitespaceNode(
	selection: TextSelection | AllSelection | NodeSelection,
	schema: Schema,
): boolean {
	let foundInvalidWhitespace = false;

	const content = selection.content().content;

	let hasCommentableInlineNodeDescendants = false;
	let hasCommentableTextNodeDescendants = false;
	content.descendants((node) => {
		if (fg('editor_inline_comments_on_inline_nodes')) {
			const isAllowedInlineNode = ['emoji', 'status', 'date', 'mention', 'inlineCard'].includes(
				node.type.name,
			);
			if (isAllowedInlineNode) {
				hasCommentableInlineNodeDescendants = true;
				return false;
			}
		}
		if (node.type === schema.nodes.inlineCard && fg('editor_inline_comments_on_inline_nodes')) {
			return false;
		}
		if (isText(node, schema)) {
			if (fg('editor_inline_comments_on_inline_nodes')) {
				if (node.textContent.trim() !== '') {
					hasCommentableTextNodeDescendants = true;
				}
			}
			return false;
		}

		if (!fg('editor_inline_comments_on_inline_nodes')) {
			if (node.textContent.trim() === '') {
				// Trailing new lines do not result in the annotation spanning into
				// the trailing new line so can be ignored when looking for invalid
				// whitespace nodes.
				const nodeIsTrailingNewLine =
					// it is the final node
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					node.eq(content.lastChild!) &&
					// and there are multiple nodes
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					!node.eq(content.firstChild!) &&
					// and it is a paragraph node
					isParagraph(node, schema);

				if (!nodeIsTrailingNewLine) {
					foundInvalidWhitespace = true;
				}
			}
		}

		return !foundInvalidWhitespace;
	});
	if (fg('editor_inline_comments_on_inline_nodes')) {
		if (hasCommentableInlineNodeDescendants) {
			return false;
		}
		return !hasCommentableTextNodeDescendants;
	}

	return foundInvalidWhitespace;
}

/*
 * verifies that the annotation exists by the given id
 */
export function annotationExists(annotationId: string, state: EditorState): boolean {
	const commentsPluginState = getPluginState(state);
	return (
		!!commentsPluginState?.annotations &&
		Object.keys(commentsPluginState.annotations).includes(annotationId)
	);
}

/*
 * remove annotations that dont exsist in plugin state from slice
 */
export function stripNonExistingAnnotations(slice: Slice, state: EditorState): false | undefined {
	if (!slice.content.size) {
		return false;
	}
	slice.content.forEach((node) => {
		stripNonExistingAnnotationsFromNode(node, state);
		node.content.descendants((node) => {
			stripNonExistingAnnotationsFromNode(node, state);
			return true;
		});
	});
}

/*
 * remove annotations that dont exsist in plugin state
 * from node
 */
function stripNonExistingAnnotationsFromNode(node: Node, state: EditorState) {
	if (hasAnnotationMark(node, state)) {
		(node.marks as Mark[]) = node.marks.filter((mark) => {
			if (mark.type.name === 'annotation') {
				return annotationExists(mark.attrs.id, state);
			}
			return true;
		});
	}
	return node;
}

/**
 * Compares two sets of annotationInfos to see if the annotations have changed
 * This function assumes annotations will have unique id's for simplicity
 */
export function isSelectedAnnotationsChanged(
	oldSelectedAnnotations: AnnotationInfo[],
	newSelectedAnnotations: AnnotationInfo[],
): boolean {
	return (
		newSelectedAnnotations.length !== oldSelectedAnnotations.length ||
		// assuming annotations have unique id's for simplicity
		newSelectedAnnotations.some(
			(annotation) =>
				!oldSelectedAnnotations.find(
					(pluginStateAnnotation) =>
						annotation.id === pluginStateAnnotation.id &&
						annotation.type === pluginStateAnnotation.type,
				),
		)
	);
}

/**
 * Checks if the selectedAnnotations are the same as the annotations on the selected block node
 */
export const isBlockNodeAnnotationsSelected = (
	selection: Selection,
	selectedAnnotations: AnnotationInfo[] = [],
): boolean => {
	if (selectedAnnotations.length && selection instanceof NodeSelection) {
		if (shouldHideRemixAnnotation(selection.node)) {
			return false;
		}
		const node =
			selection.node.type.name === 'mediaSingle' ? selection.node.firstChild : selection.node;
		const annotationMarks: AnnotationInfo[] =
			node?.marks
				.filter((mark) => mark.type.name === 'annotation')
				.map((mark) => ({
					id: mark.attrs.id,
					type: mark.attrs.annotationType,
				})) || [];

		return !selectedAnnotations.some(
			(annotation) =>
				!annotationMarks.find(
					(existingAnnotation) =>
						existingAnnotation.id === annotation.id && existingAnnotation.type === annotation.type,
				),
		);
	}

	return false;
};

export const hasAnyUnResolvedAnnotationInPage = (state: EditorState): boolean => {
	const annotations = getPluginState(state)?.annotations;
	if (annotations) {
		/**
		 * annotations type is { [key: string]: boolean };
		 * Here, key represents mark.attr.id and it is used to find where annotation to be presented in the document.
		 * When value is false, it means it is unresolved annotation.
		 *
		 * But sometimes annotation map has entry with key undefined somehow.
		 * And it is not valid mark attribute id, so it won't be presented anywhere in the document.
		 */
		const unresolvedAnnotationKeys = Object.keys(annotations).filter(
			(key) => key !== 'undefined' && annotations[key] === false,
		);

		return unresolvedAnnotationKeys.length > 0;
	}
	return false;
};
