import type { Change } from 'prosemirror-changeset';
import type { IntlShape } from 'react-intl';

import type { Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import type { DiffType, RevealOptions } from '../../showDiffPluginType';
import { isExtendedEnabled } from '../isExtendedEnabled';
import type { NodeViewSerializer } from '../NodeViewSerializer';
import { countEmptyTextBlockOnlySlice } from '../utils/emptyTextBlocks';
import { isEmptyParagraphSlice } from '../utils/isEmptyParagraphSlice';
import type { ColorScheme } from './colorSchemes/types';
import { clampAnchorPosIntoCell, createLeftAnchorWidget } from './createAnchorDecorationWidgets';
import { createChangedRowDecorationWidgets } from './createChangedRowDecorationWidgets';
import {
	type ContributorTagMount,
	type ContributorTagMountContext,
	createContributorTagHost,
	resolveHoistedCodeBlockAnchor,
	unmountContributorTag,
} from './createContributorTagWidget';
import {
	AnchorTypeKey,
	buildContributorTagDecorationSpec,
	buildDiffDecorationSpec,
	buildAnchorDecorationKey,
	scrollMarginTopValue,
} from './decorationKeys';
import { absorbFirstChildMarginReset } from './utils/absorbFirstChildMarginReset';
import { createDeletedLineBreakDecoration } from './utils/createDeletedLineBreakWidget';
import { createMarginAbsorber } from './utils/createMarginAbsorber';
import { createNodeShapedMarginSpacer } from './utils/createNodeShapedMarginSpacer';
import { findSafeInsertPos } from './utils/findSafeInsertPos';
import { safeResolve } from './utils/safeResolve';
import { getTableDiffMode } from './utils/tableDiffMode';
import {
	wrapBlockNodeView,
	createRemovedLozenge,
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
	leftAnchorId,
	diffType,
}: {
	change: Pick<Change, 'fromB' | 'toB'>;
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	isInserted: boolean;
	leftAnchorId?: string;
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
		if (fg('platform_editor_ai_show_diff_patch_1')) {
			dom.style.setProperty('scroll-margin-top', scrollMarginTopValue);
		}

		// Skip findSafeInsertPos: it walks forward to a schema-valid cell-insert point
		// and pushes the widget into the next cell. `targetPos` is the correct spot.
		decorations.push(
			Decoration.widget(targetPos, dom, {
				...buildDiffDecorationSpec({
					colorScheme,
					decorationType: 'widget',
					diffId: crypto.randomUUID(),
					leftAnchorId,
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
	leftAnchorId,
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
	deletedColumns,
}: {
	activeIndexPos?: { from: number; to: number };
	attributionKey?: string;
	change: Pick<Change, 'fromA' | 'toA' | 'fromB' | 'deleted' | 'toB'>;
	colorScheme?: ColorScheme;
	deletedColumns?: readonly number[];
	diffType?: DiffType;
	doc: PMNode;
	hideAddedDiffsUnderline?: boolean;
	intl: IntlShape;
	isInserted?: boolean;
	leftAnchorId?: string;
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
	// How many blank lines the deletion took, when it took nothing else. Blank means an empty
	// paragraph or heading — both are a line the author put there deliberately, and neither leaves
	// the widget any content to serialize.
	//
	// Kept separate from `shouldSkipDeletedEmptyParagraphDecoration` and gated, so the ungated early
	// return below still covers only the single-empty-paragraph case it always did. Everything else
	// degrades to what it rendered before the gate: an empty block, serialized invisibly.
	const deletedBlankLineCount =
		!isInserted && fg('platform_editor_ai_show_diff_patch_2')
			? countEmptyTextBlockOnlySlice(slice)
			: 0;
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

	if (deletedBlankLineCount > 0) {
		// The blocks have no content to serialize, so the deletion is shown as one struck-through
		// return glyph per line the author removed. A single widget, not one per line: the lines are
		// gone from `newDoc`, so they all resolve to the same anchor and separate widgets would stack.
		//
		// No attribution: the glyph is not a tag host, matching `canTagWidget` below.
		return [
			createDeletedLineBreakDecoration({
				colorScheme,
				count: deletedBlankLineCount,
				diffType,
				isActive,
				pos: safeInsertPos,
				reveal,
				side: placeBelow ? 1 : -1,
			}),
		];
	}

	if (shouldSkipDeletedEmptyParagraphDecoration) {
		return [];
	}

	if (slice.content.content.length === 0) {
		return [];
	}

	const tableDiffMode = getTableDiffMode({ slice, isInserted });

	if (tableDiffMode.kind === 'cells') {
		return createTableCellContentWidgets({
			slice,
			newDoc,
			change,
			nodeViewSerializer,
			colorScheme,
			isInserted,
			leftAnchorId,
			diffType,
		});
	}
	if (tableDiffMode.kind === 'none') {
		return [];
	}
	if (tableDiffMode.kind === 'rows') {
		return createChangedRowDecorationWidgets({
			attributionKey,
			changes: [change],
			originalDoc: doc,
			newDoc,
			nodeViewSerializer,
			colorScheme,
			isActive,
			isInserted,
			leftAnchorId,
			diffType,
			intl,
			// Needed for the row's own indicator anchor; this path returns before the
			// `anchor-name` assignment further down.
			showIndicators,
			showContributorTags,
			tagMountContext,
		});
	}
	// `wholeTable` and `generic` both continue into the generic block widget below. Splitting the
	// whole-table case into its own renderer is the next step of this refactor.

	const serializer = nodeViewSerializer;

	// For non-table content, use the existing span wrapper approach
	const dom = document.createElement('span');
	const $safeInsertPos = newDoc.resolve(safeInsertPos);

	// Whether the widget renders above the very start of its parent's content — the document, a
	// layout column, a table cell, a panel.
	//
	// `parentOffset === 0` is the whole test on the position side: prosemirror-view paints every
	// widget at a position before the node starting there, so a leading widget at the parent's start
	// always renders above its content.
	const isVisuallyFirstInParent = !placeBelow && $safeInsertPos.parentOffset === 0;

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
	// Whether the slice's outermost textblocks still hold all of their original content.
	//
	// `openStart`/`openEnd` say whether the cut landed inside a block, but not whether it took
	// any text with it — a deletion stopping exactly at a block's content boundary is still
	// reported as open. Resolving the change's own ends separates the two, so a block whose text
	// survived intact can render as a block even though its boundary was open.
	//
	// Both resolves sit behind the gate that consumes them, so this adds no position arithmetic to
	// the ungated path, and an unresolvable position degrades to the `openStart`/`openEnd` test on
	// its own — the block is then treated as partial, which is what it rendered as before the gate.
	const $changeFromA = fg('platform_editor_ai_show_diff_patch_2')
		? safeResolve(doc, change.fromA)
		: null;
	const $changeToA = fg('platform_editor_ai_show_diff_patch_2')
		? safeResolve(doc, change.toA)
		: null;
	const isFirstNodeContentComplete = slice.openStart === 0 || $changeFromA?.parentOffset === 0;
	const isLastNodeContentComplete =
		slice.openEnd === 0 ||
		($changeToA !== null && $changeToA.parentOffset === $changeToA.parent.content.size);
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
		// A textblock is otherwise serialized as its inline content only, with no `<p>`/`<h2>` wrapper.
		// That is right when the diff cuts into an existing block — the deleted text belongs on the same
		// line as the text that replaced it — but when the whole block went away it drops the very
		// element that carries the block's margin, so the deleted block renders flush against its
		// neighbours. Only the first and last children can be partial; middle ones are always complete.
		const shouldRenderAsBlockNode =
			fg('platform_editor_ai_show_diff_patch_2') &&
			node.isTextblock &&
			(!isFirst || isFirstNodeContentComplete) &&
			(!isLast || isLastNodeContentComplete);

		// Helper function to handle multiple child nodes
		const handleMultipleChildNodes = (node: PMNode): boolean => {
			if (
				!shouldPreserveCompleteMultiInlineBlock &&
				!shouldRenderAsBlockNode &&
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

		if (shouldPreserveCompleteMultiInlineBlock || shouldRenderAsBlockNode) {
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

	// A change inside a code block hoists its tag out of the block (EDITOR-9045).
	const hoistedCodeBlockAnchor = canTagWidget
		? resolveHoistedCodeBlockAnchor(newDoc, safeInsertPos, diffId)
		: undefined;
	if (hoistedCodeBlockAnchor) {
		decorations.push(hoistedCodeBlockAnchor.marker);
	}

	let contributorTagAnchorName: string | undefined = hoistedCodeBlockAnchor?.anchorName;
	if (!isInserted && deletedColumns?.length) {
		const table = dom.querySelector('table');
		const firstRow = table?.rows[0];
		if (table && canTagWidget) {
			contributorTagAnchorName = buildAnchorDecorationKey({
				diffId,
				anchorType: AnchorTypeKey.tag,
			});
			// The widget host sits before the table's preserved block margin. Anchor the tag to the
			// table itself so its bottom edge meets the table's top edge with no visual gap.
			table.style.setProperty('anchor-name', `--${contributorTagAnchorName}`);
		}
		deletedColumns.forEach((column) => {
			Array.from(table?.rows ?? []).forEach((row) => {
				const cell = row.cells[column];
				Array.from(cell?.children ?? []).forEach((child) => {
					if (child instanceof HTMLElement) {
						child.style.setProperty('text-decoration-line', 'line-through');
					}
				});
			});

			const headerCell = firstRow?.cells[column];
			if (headerCell) {
				headerCell.style.position = 'relative';
				// Append, never prepend. Editor CSS resets the top margin of a cell's first child, so
				// a prepended label pushes the paragraph out of that reset and the cell grows.
				// The label is absolutely positioned, so DOM order does not move it.
				headerCell.append(createRemovedLozenge(intl, isActive, colorScheme, true));
			}
		});
	}

	dom.setAttribute('data-testid', 'show-diff-deleted-decoration');
	if (fg('platform_editor_ai_show_diff_patch_1')) {
		dom.style.setProperty('scroll-margin-top', scrollMarginTopValue);
	}

	// A block node serialized into the widget is the widget's first child, and the editor's
	// first-child reset is written against the parent element rather than the document position — so
	// it zeroes the margin the block wrapper was kept for in the first place.
	//
	// Only away from the parent's start. There the reset is the correct outcome: the widget is the
	// first thing in the document, column, cell or panel, and a leading gap above it would be wrong.
	// The margin that matters at that position belongs to the node *below* the widget, which the
	// shaped spacer pair supplies instead.
	if (fg('platform_editor_ai_show_diff_patch_2') && !isVisuallyFirstInParent) {
		absorbFirstChildMarginReset({ dom, testId: 'show-diff-widget-margin-absorber' });
	}

	// Needed even when the indicator bar is off, because a contributor tag also anchors against the
	// widget.
	if ((showIndicators || showContributorTags) && isExtendedEnabled(diffType)) {
		dom.style.setProperty('anchor-name', `--${buildAnchorDecorationKey({ diffId })}`);
		// The tag built below only anchors via `anchor()` if `contributorTagAnchorName` is set; without
		// it the tag falls back to a non-anchored position (EDITOR-9045).
		if (fg('confluence_ncs_step_diffing_version_history')) {
			contributorTagAnchorName ??= buildAnchorDecorationKey({ diffId });
		}
	}

	// Taken down in the widget's `destroy` below: `dom` is rebuilt on every recalculation, so the tag
	// mounted into it must not outlive the copy ProseMirror is drawing.
	let tagMount: ContributorTagMount | undefined;

	if (canTagWidget) {
		// Lets the contributor tag find the deleted content on hover.
		dom.setAttribute('data-diff-id', diffId);

		if (hoistedCodeBlockAnchor) {
			// Own widget just before the code block, anchored to the marker above, not `dom` (EDITOR-9045).
			let hoistedTagMount: ContributorTagMount | undefined;
			decorations.push(
				Decoration.widget(
					clampAnchorPosIntoCell(newDoc, hoistedCodeBlockAnchor.codeBlockStart, 1),
					() => {
						const tagHost = createContributorTagHost({
							anchorName: contributorTagAnchorName,
							diffId,
							mountContext: tagMountContext,
						});
						hoistedTagMount = tagHost?.mount;
						return tagHost?.host ?? document.createElement('span');
					},
					{
						...buildContributorTagDecorationSpec(diffId),
						side: 1,
						marks: [],
						ignoreSelection: true,
						stopEvent: () => true,
						destroy: () => {
							unmountContributorTag(hoistedTagMount);
							hoistedTagMount = undefined;
						},
					},
				),
			);
		} else {
			// Hosted at the start of the deleted run rather than on `dom` itself: `dom` is inline, so once
			// the deleted content wraps its box is the union of its line fragments.
			const tagHost = createContributorTagHost({
				anchorName: contributorTagAnchorName,
				diffId,
				mountContext: tagMountContext,
			});
			if (tagHost) {
				dom.prepend(tagHost.host);
				tagMount = tagHost.mount;
			}
		}
	}

	if (showIndicators && isExtendedEnabled(diffType)) {
		const leftAnchor = createLeftAnchorWidget({
			doc: newDoc,
			from: safeInsertPos,
			diffId,
			leftAnchorId,
			measureElement: fg('platform_editor_ai_show_diff_patch_2') ? dom : undefined,
			sliceOverride: fg('platform_editor_ai_show_diff_patch_2') ? slice : undefined,
			underlyingRange: fg('platform_editor_ai_show_diff_patch_2')
				? { from: change.fromB, to: change.toB }
				: undefined,
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
				leftAnchorId,
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
			marks: [],
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

	// A node at the start of its parent has its top margin reset, so a diff widget rendered above
	// it sits flush against it. This applies wherever that parent is — the document, a layout
	// column, a table cell — so it is decided from the anchor rather than from the document root
	// (see `isVisuallyFirstInParent` above).
	//
	// Away from the parent's start the node below keeps its own margin, and it is the block *inside*
	// the widget that loses one — handled by `absorbFirstChildMarginReset` above, not here.
	const nodeAfterWidget = $safeInsertPos.nodeAfter;

	if (
		fg('platform_editor_ai_show_diff_patch_2') &&
		isExtendedEnabled(diffType) &&
		isVisuallyFirstInParent &&
		nodeAfterWidget
	) {
		const shapedSpacer = createNodeShapedMarginSpacer({
			node: nodeAfterWidget,
			serializer,
			testId: 'show-diff-shaped-margin-spacer',
		});

		if (shapedSpacer) {
			// Two elements, because the two families of reset have to be handled differently. The
			// absorber takes the document-level adjacent-sibling reset for a leading widget, whose
			// `!important` would otherwise zero the shaped spacer's margin; the shaped spacer, now one
			// position further along, is out of that rule's reach and keeps the margin it supplies.
			// Inside containers the counting selectors skip both, so only the shaped one has an effect.
			//
			// Sides order the widgets against each other only — both still paint before the real node.
			decorations.push(
				Decoration.widget(
					safeInsertPos,
					createMarginAbsorber({ testId: 'show-diff-margin-absorber' }),
					{ side: 0 },
				),
			);
			decorations.push(Decoration.widget(safeInsertPos, shapedSpacer, { side: 1 }));
		}
	}

	if (
		!fg('platform_editor_ai_show_diff_patch_2') &&
		isDiffWidgetAtStartOfDoc &&
		isSingleBlock &&
		isPureDeletion &&
		isExtendedEnabled(diffType)
	) {
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
			if (fg('platform_editor_ai_show_diff_patch_1')) {
				defaultSpacer.style.setProperty('scroll-margin-top', scrollMarginTopValue);
			}

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
