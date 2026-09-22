import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { findParentNodeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { DiffType } from '../../showDiffPluginType';
import { isExtendedEnabled } from '../isExtendedEnabled';
import { isTaggableBlockNode } from '../utils/taggableBlockNodes';
import {
	buildAddedCellOverlayRoundedStyle,
	buildAddedCellOverlayStyle,
	buildDeletedBlockNodeStyle,
	buildDeletedCellOverlayRoundedStyle,
	buildDeletedCellOverlayStyle,
	buildInsertedBlockNodeStyle,
	type DeletedBlockNodeCategory,
	type InsertedBlockNodeShape,
} from './colorSchemes/factory';
import { colorSchemeRegistry, getLegacyColorScheme } from './colorSchemes/schemes';
import type { ColorScheme } from './colorSchemes/types';
import { createBlockIndicatorAnchorWidgets } from './createAnchorDecorationWidgets';
import {
	getBlockNodeStyleLegacy,
	resolveCellOverlayStyleLegacy,
} from './createBlockChangedDecoration.styles.legacy';
import {
	type ContributorTagMountContext,
	createContributorTagWidget,
	isContributorTagWidgetEnabled,
} from './createContributorTagWidget';
import {
	AnchorTypeKey,
	buildDiffDecorationSpec,
	buildAnchorDecorationKey,
	scrollMarginTopStyle,
} from './decorationKeys';

const displayNoneStyle = convertToInlineCss({
	display: 'none',
});

const DEFAULT_COLOR_SCHEME: ColorScheme = 'standard';

/** Nodes that carry no decoration styling of their own — layout, lists, text blocks, media groups. */
const UNSTYLED_NODES = [
	'mediaSingle',
	'mediaGroup',
	'table', // Handle table separately to avoid border issues
	'tableRow',
	'paragraph', // Paragraph and heading nodes do not need special styling
	'heading',
	'hardBreak',
	'decisionList',
	'taskList',
	'bulletList',
	'orderedList',
	'layoutSection',
];

const CELL_NODES = ['tableCell', 'tableHeader'];

/** Panels, rules and media can also sit in a table cell, which is out of scope for block tags. */
const isInsideTable = (doc: PMNode, pos: number): boolean =>
	findParentNodeClosestToPos(doc.resolve(pos), (node) => node.type.name === 'table') !== undefined;

/**
 * Whether this block can host a contributor tag of its own.
 *
 * The node type is resolved from the document rather than matched on `change.name`, so a schema
 * variant is recognised as the type it varies — see `isTaggableBlockNode`. `from` is the node's own
 * position, so `nodeAt` returns exactly the node being decorated.
 */
const canTagBlock = ({
	diffType,
	doc,
	from,
}: {
	diffType: DiffType | undefined;
	doc: PMNode | undefined;
	from: number;
}): boolean => {
	if (doc === undefined || !isExtendedEnabled(diffType)) {
		return false;
	}

	const nodeType = doc.nodeAt(from)?.type;

	return nodeType !== undefined && isTaggableBlockNode(nodeType) && !isInsideTable(doc, from);
};

/** Positioning context for the cell overlay widget decorations. */
const cellPositionStyle = convertToInlineCss({
	position: 'relative',
});

const getInsertedBlockNodeShape = (nodeName: string): InsertedBlockNodeShape => {
	switch (nodeName) {
		case 'blockquote':
			return 'quote';
		case 'rule':
			return 'rule';
		case 'blockCard':
			return 'cardBlock';
		case 'extension':
		case 'embedCard':
		case 'listItem':
			return 'marker';
		default:
			return 'node';
	}
};

const getDeletedBlockNodeCategory = (nodeName: string): DeletedBlockNodeCategory => {
	switch (nodeName) {
		case 'blockquote':
			return 'quote';
		// Media nodes inside mediaSingle should not get position:relative
		// as it shifts the image outside its parent container (e.g. panel)
		case 'media':
		case 'panel':
			return 'container';
		case 'listItem':
			return 'listItem';
		case 'extension':
		case 'embedCard':
			return 'marker';
		default:
			return 'generic';
	}
};

const getNodeClass = (name: string) => {
	switch (name) {
		case 'extension':
			return 'show-diff-changed-decoration-node';
		default:
			return undefined;
	}
};

const getBlockNodeStyleNext = ({
	nodeName,
	colorScheme,
	isInserted = true,
	isActive = false,
	diffType,
}: {
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	isActive?: boolean;
	isInserted?: boolean;
	nodeName: string;
}): string | undefined => {
	if (UNSTYLED_NODES.includes(nodeName)) {
		return undefined;
	}

	if (CELL_NODES.includes(nodeName)) {
		// When the gate is off, cells get no styling — as with UNSTYLED_NODES above.
		return isExtendedEnabled(diffType) ? cellPositionStyle : undefined;
	}

	const colors = colorSchemeRegistry[colorScheme ?? DEFAULT_COLOR_SCHEME];

	// Deleted nodes only differ under the extended experience; otherwise all are insertions.
	if (!isInserted && isExtendedEnabled(diffType)) {
		return buildDeletedBlockNodeStyle(colors, getDeletedBlockNodeCategory(nodeName), isActive);
	}

	return buildInsertedBlockNodeStyle(colors, getInsertedBlockNodeShape(nodeName), isActive);
};

/**
 * Dispatches to the registry-driven implementation, or to the verbatim pre-refactor one for the
 * OFF cohort of `platform_editor_show_diff_color_scheme_refactor`. Both are built to emit the
 * same style strings for both shipped schemes; see EDITOR-8281.
 */
const getBlockNodeStyle = (props: {
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	isActive?: boolean;
	isInserted?: boolean;
	nodeName: string;
}): string | undefined => {
	return isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor')
		? getBlockNodeStyleNext(props)
		: getBlockNodeStyleLegacy({
				...props,
				colorScheme: getLegacyColorScheme(props.colorScheme),
			});
};

/**
 * A table cell is "empty" only when it has no content at all — no text AND no
 * non-text leaf/inline nodes (media, emoji, mention, inlineCard, status, date…).
 * `textContent` alone misses those non-text nodes, so we also reject any leaf or
 * inline descendant. An empty ADF cell (`tableCell > empty paragraph`) returns
 * true; a cell containing only media/emoji returns false.
 */
const isCellEmpty = (cellNode: PMNode): boolean => {
	if (cellNode.textContent.length > 0) {
		return false;
	}
	let hasNonTextContent = false;
	cellNode.descendants((node) => {
		if (hasNonTextContent) {
			return false;
		}
		// A non-text leaf or inline node (media, emoji, mention, etc.) = real content.
		if (!node.isText && (node.isLeaf || node.isInline)) {
			hasNonTextContent = true;
			return false;
		}
		return true;
	});
	return !hasNonTextContent;
};

/**
 * Node decoration used for block-level insertions. When isActive, uses emphasised (pressed) styling.
 *
 * @param change Node range and name
 * @param colorScheme Optional color scheme
 * @param isActive Whether this node is part of the currently active/focused change
 * @returns Prosemirror node decoration or undefined
 */
export const createBlockChangedDecoration = ({
	attributionKey,
	change,
	colorScheme,
	isInserted = true,
	isActive = false,
	leftAnchorId,
	shouldHideDeleted = false,
	showContributorTags = false,
	showIndicators = false,
	doc,
	diffType,
	tagMountContext,
}: {
	attributionKey?: string;
	change: { from: number; name: string; to: number };
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	doc?: PMNode;
	isActive?: boolean;
	isInserted?: boolean;
	leftAnchorId?: string;
	shouldHideDeleted?: boolean;
	showContributorTags?: boolean;
	showIndicators?: boolean;
	tagMountContext?: ContributorTagMountContext;
}): Decoration[] => {
	const decorations: Decoration[] = [];
	// Derived from the node range so it survives a recalculation, as in
	// `createInlineChangedDecoration`. Changes are disjoint, so no two of them decorate one node.
	const diffId = showContributorTags ? `block-${change.from}-${change.to}` : crypto.randomUUID();
	const shouldTagBlock = showContributorTags && canTagBlock({ diffType, doc, from: change.from });
	// Named so this block's own tag can position against it; see `createContributorTagWidget`.
	const tagAnchorName =
		shouldTagBlock && isContributorTagWidgetEnabled()
			? buildAnchorDecorationKey({ diffId, anchorType: AnchorTypeKey.tag })
			: undefined;

	if (shouldHideDeleted) {
		return [
			Decoration.node(
				change.from,
				change.to,
				{ style: displayNoneStyle },
				buildDiffDecorationSpec({
					colorScheme,
					decorationType: 'block',
					diffId,
					leftAnchorId,
					isActive,
					isInserted,
					nodeName: change.name,
					diffType,
				}),
			),
		];
	}

	if (isExtendedEnabled(diffType) && CELL_NODES.includes(change.name)) {
		const cellOverlay = document.createElement('div');
		const colors = colorSchemeRegistry[colorScheme ?? DEFAULT_COLOR_SCHEME];
		const isRoundedTable = isExperimentEnabled('platform_editor_table_diff_rounded_corners');

		// On an inverted diff, an empty cell being filled is an addition, so give it the
		// added (purple) overlay instead of the deleted (grey) one (EDITOR-8442).
		const cellNode = doc?.nodeAt(change.from);
		const isEmptyCellBeingFilled = !isInserted && !!cellNode && isCellEmpty(cellNode);
		const useAddedStyle = isInserted || isEmptyCellBeingFilled;

		const cellOverlayStyle = isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor')
			? useAddedStyle
				? isRoundedTable
					? buildAddedCellOverlayRoundedStyle(colors)
					: buildAddedCellOverlayStyle(colors)
				: isRoundedTable
					? buildDeletedCellOverlayRoundedStyle(colors)
					: buildDeletedCellOverlayStyle(colors)
			: resolveCellOverlayStyleLegacy({
					colorScheme: getLegacyColorScheme(colorScheme),
					isRoundedTable,
					useAddedStyle,
				});

		cellOverlay.setAttribute('style', cellOverlayStyle);
		decorations.push(
			// change.to - 1 to position the overlay inside the end of the cell
			// this key doesn't use the spec / key builder since this is just for
			// decorating the cells, this is part of a bigger table diff
			Decoration.widget(change.to - 1, cellOverlay, {
				key: 'cell-overlay-decoration',
			}),
		);
	}
	// isInserted is only read under the extended experience, so pass it unconditionally. `change.name`
	// verbatim: base-name resolution stays in `canTagBlock`, which needs tags on, so a schema
	// variant's legacy style is untouched — see `resolveBaseNodeName`.
	const nodeStyle = getBlockNodeStyle({
		nodeName: change.name,
		colorScheme,
		isInserted,
		isActive,
		diffType,
	});
	const style = tagAnchorName
		? [
				nodeStyle,
				convertToInlineCss({ anchorName: `--${tagAnchorName}` }),
				fg('platform_editor_ai_show_diff_patch_1') ? scrollMarginTopStyle : undefined,
			]
				.filter(Boolean)
				.join(' ')
		: nodeStyle;

	const className = getNodeClass(change.name);
	if (style || className) {
		decorations.push(
			Decoration.node(
				change.from,
				change.to,
				{
					style,
					'data-testid': 'show-diff-changed-decoration-node',
					class: className,
					// Lets navigation select this exact diff, and contributor tags find it on hover.
					...((shouldTagBlock || fg('platform_editor_ai_show_diff_patch_2')) && {
						'data-diff-id': diffId,
					}),
				},
				buildDiffDecorationSpec({
					attributionKey: shouldTagBlock ? attributionKey : undefined,
					colorScheme,
					decorationType: 'block',
					diffId,
					leftAnchorId,
					isActive,
					isInserted,
					nodeName: change.name,
					diffType,
				}),
			),
		);
	}

	if (decorations.length === 0) {
		// An unstyled node type (paragraph, heading, list, layout, …) emits no decoration at all, so
		// there is nothing for a tag to hang off even when the node type would otherwise be taggable.
		return decorations;
	}

	if (showIndicators && doc && isExtendedEnabled(diffType)) {
		decorations.push(
			...createBlockIndicatorAnchorWidgets({
				doc,
				from: change.from,
				to: change.to,
				diffId,
				leftAnchorId,
			}),
		);
	}

	// `change.from` is just before the node, so the host sits outside it and the tag renders on the
	// block's own top-left corner. Resolving inline content instead would put the host inside a
	// container block's content DOM (panel, expand, blockquote).
	if (shouldTagBlock && doc) {
		const tagWidget = createContributorTagWidget({
			anchorAtRangeStart: true,
			anchorName: tagAnchorName,
			doc,
			from: change.from,
			to: change.to,
			diffId,
			mountContext: tagMountContext,
		});

		if (tagWidget) {
			decorations.push(...tagWidget);
		}
	}

	return decorations;
};
