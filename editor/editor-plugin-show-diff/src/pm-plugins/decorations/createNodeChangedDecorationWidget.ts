import type { Change } from 'prosemirror-changeset';
import type { IntlShape } from 'react-intl';

import type { Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import type { DiffType, RevealOptions } from '../../showDiffPluginType';
import { isExtendedEnabled } from '../isExtendedEnabled';
import type { NodeViewSerializer } from '../NodeViewSerializer';
import { isEmptyParagraphSlice } from '../utils/isEmptyParagraphSlice';

import { createLeftAnchorWidget } from './createAnchorDecorationWidgets';
import { createChangedRowDecorationWidgets } from './createChangedRowDecorationWidgets';
import {
	type ContributorTagMount,
	type ContributorTagMountContext,
	createContributorTagHost,
	unmountContributorTag,
} from './createContributorTagWidget';
import type { ColorScheme } from './colorSchemes/types';
import { buildDiffDecorationSpec, buildAnchorDecorationKey } from './decorationKeys';
import { findSafeInsertPos } from './utils/findSafeInsertPos';
import {
	wrapBlockNodeView,
	injectInnerWrapper,
	createContentWrapper,
} from './utils/wrapBlockNodeView';

const isHeadingLevel = (level: unknown): level is 1 | 2 | 3 | 4 | 5 | 6 =>
	typeof level === 'number' && level >= 1 && level <= 6;

/**
 * Render one content widget per table cell, positioned inside the matching cell in
 * `newDoc`, so a whole-cell replacement shows its added content in-place instead of
 * being dropped (EDITOR-8442).
 */
const createTableCellContentWidgets = ({
	slice,
	newDoc,
	change,
	nodeViewSerializer,
	colorScheme,
	isInserted,
	diffType,
}: {
	change: Pick<Change, 'fromB' | 'toB'>;
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	isInserted: boolean;
	newDoc: PMNode;
	nodeViewSerializer: NodeViewSerializer;
	slice: Slice;
}): Decoration[] => {
	// Collect the inner content position of each cell in the new document within
	// the change range. Whole-cell replacement preserves cell count/order, so the
	// nth new-doc cell corresponds to the nth cell in the slice.
	const newCellInnerPositions: number[] = [];
	newDoc.nodesBetween(change.fromB, change.toB, (node, pos) => {
		if (node.type.name === 'tableHeader' || node.type.name === 'tableCell') {
			// Skip malformed cells with no block child: `pos + 2` would be out of bounds.
			if (node.childCount === 0) {
				return false;
			}
			// +1 into the cell, +1 into its first child (the paragraph) = inner content.
			newCellInnerPositions.push(pos + 2);
			return false;
		}
		return true;
	});

	const decorations: Decoration[] = [];
	slice.content.forEach((cellNode, _offset, index) => {
		const targetPos = newCellInnerPositions[index];
		if (targetPos === undefined || cellNode.content.size === 0) {
			return;
		}

		const dom = document.createElement('span');
		// A cell contains block content (paragraphs); serialize the cell's content
		// so every block inside the cell is rendered.
		cellNode.content.forEach((blockNode) => {
			const nodeView = nodeViewSerializer.tryCreateNodeView(blockNode);
			const wrapper = createContentWrapper(colorScheme, false, isInserted, diffType);
			if (nodeView) {
				wrapper.append(nodeView);
			} else {
				const serialized = blockNode.type.inlineContent
					? nodeViewSerializer.serializeFragment(blockNode.content)
					: nodeViewSerializer.serializeNode(blockNode);
				if (serialized) {
					wrapper.append(serialized);
				}
			}
			dom.append(wrapper);
		});

		if (dom.childNodes.length === 0) {
			return;
		}

		// This helper only runs for added content, so use the "changed" testid — not
		// "deleted", which page models match as removed content.
		dom.setAttribute('data-testid', 'show-diff-changed-decoration');

		// Skip findSafeInsertPos: it walks forward to a schema-valid cell-insert point
		// and pushes the widget into the next cell. `targetPos` is the correct spot.
		decorations.push(
			Decoration.widget(targetPos, dom, {
				...buildDiffDecorationSpec({
					colorScheme,
					decorationType: 'widget',
					diffId: crypto.randomUUID(),
					isInserted,
					diffType,
					...(isExtendedEnabled(diffType) && { side: -1 }),
				}),
			}),
		);
	});

	return decorations;
};

/**
 * This function is used to create a decoration widget to show content
 * that is not in the current document.
 */
export const createNodeChangedDecorationWidget = ({
	attributionKey,
	change,
	doc,
	nodeViewSerializer,
	colorScheme,
	newDoc,
	intl,
	activeIndexPos,
	// This is false by default as this is generally used to show deleted content
	isInserted = false,
	showContributorTags = false,
	showIndicators = false,
	// When true, render the deleted content *after* (below) the new content instead of
	// before it. Used for `smart` node-level changes so the deleted node appears beneath
	// its replacement (gray + strikethrough).
	placeBelow = false,
	diffType,
	hideAddedDiffsUnderline = false,
	reveal,
	tagMountContext,
}: {
	activeIndexPos?: { from: number; to: number };
	attributionKey?: string;
	change: Pick<Change, 'fromA' | 'toA' | 'fromB' | 'deleted' | 'toB'>;
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	doc: PMNode;
	hideAddedDiffsUnderline?: boolean;
	intl: IntlShape;
	isInserted?: boolean;
	newDoc: PMNode;
	nodeViewSerializer: NodeViewSerializer;
	placeBelow?: boolean;
	reveal?: RevealOptions;
	showContributorTags?: boolean;
	showIndicators?: boolean;
	tagMountContext?: ContributorTagMountContext;
}): Decoration[] => {
	const slice = doc.slice(change.fromA, change.toA);
	const shouldSkipDeletedEmptyParagraphDecoration = !isInserted && isEmptyParagraphSlice(slice);
	// Widget decoration used for deletions as the content is not in the document
	// and we want to display the deleted content with a style.
	// For `placeBelow`, anchor at the END of the new content (change.toB) so the deleted
	// node renders beneath its replacement; otherwise anchor at the start (change.fromB).
	const anchorPos = placeBelow ? change.toB : change.fromB;
	const safeInsertPos = findSafeInsertPos(newDoc, anchorPos, slice);
	const isActive =
		activeIndexPos &&
		(fg('confluence_ncs_step_diffing_version_history')
			? safeInsertPos >= activeIndexPos.from && safeInsertPos <= activeIndexPos.to
			: safeInsertPos === activeIndexPos.from && safeInsertPos === activeIndexPos.to);

	if (slice.content.content.length === 0 || shouldSkipDeletedEmptyParagraphDecoration) {
		return [];
	}

	const isTableCellContent = slice.content.content.some(() =>
		slice.content.content.some((siblingNode) =>
			['tableHeader', 'tableCell'].includes(siblingNode.type.name),
		),
	);
	const isTableRowContent = slice.content.content.some(() =>
		slice.content.content.some((siblingNode) => ['tableRow'].includes(siblingNode.type.name)),
	);

	// Added whole cells (e.g. "Add table headers"): render per-cell content widgets.
	// Deleted whole cells (delete row/col) fall through — they don't exist in `newDoc`,
	// so there's nowhere to anchor content and we keep the original "render nothing".
	if (isTableCellContent && isInserted) {
		return createTableCellContentWidgets({
			slice,
			newDoc,
			change,
			nodeViewSerializer,
			colorScheme,
			isInserted,
			diffType,
		});
	}
	if (isTableCellContent) {
		// Deleted whole cells: nothing to render (see note above).
		return [];
	}
	if (isTableRowContent) {
		return createChangedRowDecorationWidgets({
			changes: [change],
			originalDoc: doc,
			newDoc,
			nodeViewSerializer,
			colorScheme,
			isInserted,
			diffType,
			// Needed for the row's own indicator anchor; this path returns before the
			// `anchor-name` assignment further down.
			showIndicators,
		});
	}

	const serializer = nodeViewSerializer;

	// For non-table content, use the existing span wrapper approach
	const dom = document.createElement('span');
	const $safeInsertPos = newDoc.resolve(safeInsertPos);
	const isTopLevelInsert = $safeInsertPos.depth === 0;
	const hasPreviousBlock = $safeInsertPos.nodeBefore?.isBlock === true;
	const isFirstDocHeadingReplacement =
		isExtendedEnabled(diffType) &&
		!placeBelow &&
		change.fromB === 0 &&
		slice.content.firstChild?.type.name === 'heading' &&
		newDoc.firstChild?.type.name === 'heading';
	if (
		isExtendedEnabled(diffType) &&
		isTopLevelInsert &&
		hasPreviousBlock &&
		!isFirstDocHeadingReplacement
	) {
		// Editor CSS removes the top margin from a block when it is its parent's first child.
		// Keep the serialized block as a subsequent child so each block type retains its own margin.
		dom.append(dom.ownerDocument.createElement('div'));
	}
	if (isFirstDocHeadingReplacement) {
		// The replacement widget is the visual first block, while the real first document node has
		// its top margin reset. Add a compact gap after the widget so the two diff blocks do not overlap.
		dom.style.display = 'block';
		dom.style.marginBottom = token('space.200');
	}
	// When mediaSingle nodes are rendered inside a widget decoration (e.g. as part of
	// a replaced panel), the centering CSS (margin-left: 50%; transform: translateX(-50%))
	// incorrectly applies because isNestedNode resolves to false (getPos returns 0).
	// Observe DOM mutations and override the transform on .rich-media-item elements
	// after React mounts to prevent the image from shifting outside its parent container.
	let constrainMediaObserver: MutationObserver | undefined;
	if (isExtendedEnabled(diffType)) {
		constrainMediaObserver = new MutationObserver(() => {
			const richMediaItems = dom.querySelectorAll('.rich-media-item');
			richMediaItems.forEach((el) => {
				if (el instanceof HTMLElement) {
					el.style.transform = 'none';
					el.style.marginLeft = '0';
					el.style.maxWidth = '100%';
				}
			});
			if (richMediaItems.length > 0) {
				constrainMediaObserver?.disconnect();
			}
		});
		constrainMediaObserver.observe(dom, { childList: true, subtree: true });
	}
	// Derived from the deleted range so it survives a recalculation — see the same reasoning in
	// `createInlineChangedDecoration`.
	const diffId = showContributorTags ? `widget-${change.fromA}-${change.toA}` : crypto.randomUUID();
	// Match the rendering predicate above: an empty paragraph has no widget to tag, while whitespace
	// text in a rendered widget remains eligible.
	const canTagWidget = showContributorTags && !shouldSkipDeletedEmptyParagraphDecoration;
	const decorations: Decoration[] = [];
	const replacementNode = newDoc.nodeAt(change.fromB);
	const firstReplacedNode = slice.content.firstChild;
	const lastReplacedNode = slice.content.lastChild;
	const showDiffPatch1 = fg('platform_editor_ai_show_diff_patch_1');
	const isCompleteSameTypeReplacement =
		slice.content.childCount === 1 &&
		firstReplacedNode !== null &&
		replacementNode !== null &&
		firstReplacedNode.type === replacementNode.type &&
		replacementNode.nodeSize === change.toB - change.fromB;

	/*
	 * The thinking is we separate out the fragment we got from doc.slice
	 * and if it's the first or last content, we go in however many the sliced Open
	 * or sliced End depth is and match only the entire node.
	 */
	slice.content.forEach((node) => {
		const isFirst = firstReplacedNode === node;
		const isLast = lastReplacedNode === node;
		const isOpenAtSliceBoundary = (isFirst && slice.openStart > 0) || (isLast && slice.openEnd > 0);
		const shouldPreserveCompleteMultiInlineBlock =
			showDiffPatch1 &&
			node.isBlock &&
			node.type.inlineContent &&
			node.content.childCount > 1 &&
			!isOpenAtSliceBoundary &&
			isCompleteSameTypeReplacement;

		// Helper function to handle multiple child nodes
		const handleMultipleChildNodes = (node: PMNode): boolean => {
			if (
				!shouldPreserveCompleteMultiInlineBlock &&
				node.content.childCount > 1 &&
				node.type.inlineContent
			) {
				node.content.forEach((childNode) => {
					const childNodeView = serializer.tryCreateNodeView(childNode);
					if (childNodeView) {
						const lineBreak = document.createElement('br');
						dom.append(lineBreak);
						const wrapper = createContentWrapper(colorScheme, isActive, isInserted, diffType);
						wrapper.append(childNodeView);
						dom.append(wrapper);
					} else {
						// Fallback to serializing the individual child node
						const serializedChild = serializer.serializeNode(childNode);
						if (serializedChild) {
							const wrapper = createContentWrapper(colorScheme, isActive, isInserted, diffType);
							wrapper.append(serializedChild);
							dom.append(wrapper);
						}
					}
				});
				return true; // Indicates we handled multiple children
			}
			return false; // Indicates single child, continue with normal logic
		};

		// Determine which node to use and how to serialize
		const hasInlineContent = node.content.childCount > 0 && node.type.inlineContent === true;

		let fallbackSerialization: () => Node | null;

		if (handleMultipleChildNodes(node)) {
			return;
		}

		if (shouldPreserveCompleteMultiInlineBlock) {
			fallbackSerialization = () => serializer.serializeNode(node);
		} else if ((isFirst || (isLast && slice.content.childCount > 2)) && hasInlineContent) {
			fallbackSerialization = () => serializer.serializeFragment(node.content);
		} else if (isLast && slice.content.childCount === 2) {
			fallbackSerialization = () => {
				if (node.type.name === 'text') {
					return document.createTextNode(node.text || '');
				}

				if (node.type.name === 'paragraph') {
					const lineBreak = document.createElement('br');
					dom.append(lineBreak);
					return serializer.serializeFragment(node.content);
				}

				return serializer.serializeFragment(node.content);
			};
		} else {
			fallbackSerialization = () => serializer.serializeNode(node);
		}

		// Try to create node view, fallback to serialization
		const nodeView = serializer.tryCreateNodeView(node);
		if (nodeView) {
			if (node.isInline) {
				const wrapper = createContentWrapper(colorScheme, isActive, isInserted, diffType, reveal);
				wrapper.append(nodeView);
				dom.append(wrapper);
			} else {
				// Handle all block nodes with unified function
				wrapBlockNodeView({
					dom,
					nodeView,
					targetNode: node,
					colorScheme,
					intl,
					isActive,
					isInserted,
					diffType,
					hideAddedDiffsUnderline,
					highlightInlineLeafNodes: shouldPreserveCompleteMultiInlineBlock,
				});
			}
		} else if (
			nodeViewSerializer.getFilteredNodeViewBlocklist(['paragraph', 'tableRow']).has(node.type.name)
		) {
			// Skip the case where the node is a paragraph or table row that way it can still be rendered and delete the entire table
			return;
		} else {
			const fallbackNode = fallbackSerialization();
			if (fallbackNode) {
				if (fallbackNode instanceof HTMLElement) {
					const injectedNode = injectInnerWrapper({
						node: fallbackNode,
						colorScheme,
						isActive,
						isInserted,
						diffType,
						reveal,
					});
					dom.append(injectedNode);
				} else {
					const wrapper = createContentWrapper(colorScheme, isActive, isInserted, diffType, reveal);
					wrapper.append(fallbackNode);
					dom.append(wrapper);
				}
			}
		}
	});

	dom.setAttribute('data-testid', 'show-diff-deleted-decoration');

	// Needed even when the indicator bar is off, because a contributor tag also anchors against the
	// widget.
	if ((showIndicators || showContributorTags) && isExtendedEnabled(diffType)) {
		dom.style.setProperty('anchor-name', `--${buildAnchorDecorationKey({ diffId })}`);
	}

	// Taken down in the widget's `destroy` below: `dom` is rebuilt on every recalculation, so the tag
	// mounted into it must not outlive the copy ProseMirror is drawing.
	let tagMount: ContributorTagMount | undefined;

	if (canTagWidget) {
		// Lets the contributor tag find the deleted content on hover.
		dom.setAttribute('data-diff-id', diffId);

		// Hosted at the start of the deleted run rather than on `dom` itself: `dom` is inline, so once
		// the deleted content wraps its box is the union of its line fragments.
		const tagHost = createContributorTagHost(diffId, tagMountContext);
		if (tagHost) {
			dom.prepend(tagHost.host);
			tagMount = tagHost.mount;
		}
	}

	if (showIndicators && isExtendedEnabled(diffType)) {
		const leftAnchor = createLeftAnchorWidget({
			doc: newDoc,
			from: safeInsertPos,
			diffId,
		});

		if (leftAnchor) {
			decorations.push(leftAnchor);
		}
	}

	decorations.push(
		Decoration.widget(safeInsertPos, dom, {
			...buildDiffDecorationSpec({
				attributionKey: canTagWidget ? attributionKey : undefined,
				colorScheme,
				decorationType: 'widget',
				diffId,
				isActive,
				isInserted,
				diffType,
				...(isExtendedEnabled(diffType) && {
					// placeBelow anchors at the end of the new content, so render on the
					// trailing side (1); otherwise render before the new content (-1).
					side: placeBelow ? 1 : -1,
				}),
			}),
			// Without an explicit mark set, prosemirror-view wraps the widget in the marks of the
			// adjacent text in the NEW document. `dom` already carries the original marks, so a
			// formatting change would render the deleted side wrapped in the very mark the edit
			// introduced — unbolded text shown struck through but still bold.
			...(fg('platform_editor_diff_inline_mark_changes') && { marks: [] }),
			destroy: () => {
				constrainMediaObserver?.disconnect();
				unmountContributorTag(tagMount);
				tagMount = undefined;
			},
		}),
	);

	// The first document node keeps its margin-top reset even when an inverted diff renders a visible
	// block before it. Add an empty widget matching the following heading so the editor's own heading
	// styles supply the appropriate spacing. For other node types, retain the existing generic spacer.
	const isPureDeletion = change.fromB === change.toB;
	const isSingleBlock = slice.content.childCount === 1 && slice.content.firstChild?.isBlock;
	const isDiffWidgetAtStartOfDoc = $safeInsertPos.depth === 0 && $safeInsertPos.index(0) === 0;

	if (isDiffWidgetAtStartOfDoc && isSingleBlock && isPureDeletion && isExtendedEnabled(diffType)) {
		const followingNode = $safeInsertPos.nodeAfter;
		const headingLevel =
			followingNode?.type.name === 'heading' ? followingNode.attrs.level : undefined;

		if (isHeadingLevel(headingLevel)) {
			const nodeLikeSpacer = dom.ownerDocument.createElement(`h${headingLevel}`);
			nodeLikeSpacer.dataset.testid = 'show-diff-node-like-margin-spacer';
			nodeLikeSpacer.setAttribute('aria-hidden', 'true');
			nodeLikeSpacer.contentEditable = 'false';

			decorations.push(
				Decoration.widget(safeInsertPos, nodeLikeSpacer, {
					side: 0,
				}),
			);
		} else if (followingNode) {
			const defaultSpacer = dom.ownerDocument.createElement('span');
			defaultSpacer.dataset.testid = 'show-diff-default-margin-spacer';
			defaultSpacer.style.display = 'block';
			defaultSpacer.style.marginTop = token('space.100');

			decorations.push(
				Decoration.widget(safeInsertPos, defaultSpacer, {
					...buildDiffDecorationSpec({
						colorScheme,
						decorationType: 'widget',
						diffId: crypto.randomUUID(),
						isInserted,
						diffType,
					}),
				}),
			);
		}
	}

	return decorations;
};
