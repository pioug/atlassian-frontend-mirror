import type { Change } from 'prosemirror-changeset';
import type { IntlShape } from 'react-intl';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import type { ColorScheme } from '../../showDiffPluginType';
import type { NodeViewSerializer } from '../NodeViewSerializer';

import { createLeftAnchorWidget } from './createAnchorDecorationWidgets';
import { createChangedRowDecorationWidgets } from './createChangedRowDecorationWidgets';
import { buildDiffDecorationSpec, buildAnchorDecorationKey } from './decorationKeys';
import { findSafeInsertPos } from './utils/findSafeInsertPos';
import {
	wrapBlockNodeView,
	injectInnerWrapper,
	createContentWrapper,
} from './utils/wrapBlockNodeView';

/**
 * This function is used to create a decoration widget to show content
 * that is not in the current document.
 */
export const createNodeChangedDecorationWidget = ({
	change,
	doc,
	nodeViewSerializer,
	colorScheme,
	newDoc,
	intl,
	activeIndexPos,
	// This is false by default as this is generally used to show deleted content
	isInserted = false,
	showIndicators = false,
}: {
	activeIndexPos?: { from: number; to: number };
	change: Pick<Change, 'fromA' | 'toA' | 'fromB' | 'deleted' | 'toB'>;
	colorScheme?: ColorScheme;
	doc: PMNode;
	intl: IntlShape;
	isInserted?: boolean;
	newDoc: PMNode;
	nodeViewSerializer: NodeViewSerializer;
	showIndicators?: boolean;
}): Decoration[] => {
	const slice = doc.slice(change.fromA, change.toA);
	const shouldSkipDeletedEmptyParagraphDecoration =
		!isInserted &&
		slice?.content?.childCount === 1 &&
		slice?.content?.firstChild?.type.name === 'paragraph' &&
		slice?.content?.firstChild?.content.size === 0;
	// Widget decoration used for deletions as the content is not in the document
	// and we want to display the deleted content with a style.
	const safeInsertPos = findSafeInsertPos(newDoc, change.fromB, slice);
	const isActive =
		activeIndexPos && safeInsertPos === activeIndexPos.from && safeInsertPos === activeIndexPos.to;

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

	if (isTableCellContent) {
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
		});
	}

	const serializer = nodeViewSerializer;

	// For non-table content, use the existing span wrapper approach
	const dom = document.createElement('span');
	// When mediaSingle nodes are rendered inside a widget decoration (e.g. as part of
	// a replaced panel), the centering CSS (margin-left: 50%; transform: translateX(-50%))
	// incorrectly applies because isNestedNode resolves to false (getPos returns 0).
	// Observe DOM mutations and override the transform on .rich-media-item elements
	// after React mounts to prevent the image from shifting outside its parent container.
	let constrainMediaObserver: MutationObserver | undefined;
	if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
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
	const diffId = crypto.randomUUID();
	const decorations: Decoration[] = [];

	/*
	 * The thinking is we separate out the fragment we got from doc.slice
	 * and if it's the first or last content, we go in however many the sliced Open
	 * or sliced End depth is and match only the entire node.
	 */
	slice.content.forEach((node) => {
		// Helper function to handle multiple child nodes
		const handleMultipleChildNodes = (node: PMNode): boolean => {
			if (node.content.childCount > 1 && node.type.inlineContent) {
				node.content.forEach((childNode) => {
					const childNodeView = serializer.tryCreateNodeView(childNode);
					if (childNodeView) {
						const lineBreak = document.createElement('br');
						dom.append(lineBreak);
						const wrapper = createContentWrapper(colorScheme, isActive, isInserted);
						wrapper.append(childNodeView);
						dom.append(wrapper);
					} else {
						// Fallback to serializing the individual child node
						const serializedChild = serializer.serializeNode(childNode);
						if (serializedChild) {
							const wrapper = createContentWrapper(colorScheme, isActive, isInserted);
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
		const isFirst = slice.content.firstChild === node;
		const isLast = slice.content.lastChild === node;
		const hasInlineContent = node.content.childCount > 0 && node.type.inlineContent === true;

		let fallbackSerialization: () => Node | null;

		if (handleMultipleChildNodes(node)) {
			return;
		}

		if ((isFirst || (isLast && slice.content.childCount > 2)) && hasInlineContent) {
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
				const wrapper = createContentWrapper(colorScheme, isActive, isInserted);
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
					});
					dom.append(injectedNode);
				} else {
					const wrapper = createContentWrapper(colorScheme, isActive, isInserted);
					wrapper.append(fallbackNode);
					dom.append(wrapper);
				}
			}
		}
	});

	dom.setAttribute('data-testid', 'show-diff-deleted-decoration');

	if (showIndicators && expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
		const leftAnchor = createLeftAnchorWidget({
			doc: newDoc,
			from: safeInsertPos,
			diffId,
		});
		dom.style.setProperty('anchor-name', `--${buildAnchorDecorationKey({ diffId })}`);

		if (leftAnchor) {
			decorations.push(leftAnchor);
		}
	}

	decorations.push(
		Decoration.widget(safeInsertPos, dom, {
			...buildDiffDecorationSpec({
				decorationType: 'widget',
				diffId,
				isActive,
				...(expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true) && {
					side: -1,
				}),
			}),
			destroy: () => constrainMediaObserver?.disconnect(),
		}),
	);

	// When a single block node is purely deleted at the very start of the doc (first child),
	// the deleted widget decoration overlaps with the existing first child's decoration.
	// To fix this, we insert an additional empty widget span before the deleted content
	// to push it down and create visual separation.
	//
	// Conditions for the placeholder:
	// 1. isPureDeletion: change.fromB === change.toB — nothing was inserted at the same position.
	//    Node type changes (e.g. paragraph → heading) have both a deletion and an insertion,
	//    so fromB !== toB — we skip the placeholder in that case.
	// 2. isSingleBlock: exactly one block node was deleted (not inline, not multi-block).
	// 3. safeInsertPos: that it is the first node
	const isPureDeletion = change.fromB === change.toB;
	const isSingleBlock = slice.content.childCount === 1 && slice.content.firstChild?.isBlock;
	const resolvedPos = newDoc.resolve(change.fromB);
	const isFirstDocChild = resolvedPos.depth === 0 && resolvedPos.index(0) === 0;

	if (
		isFirstDocChild &&
		isSingleBlock &&
		isPureDeletion &&
		expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)
	) {
		const emptyWidgetSpan = document.createElement('span');
		emptyWidgetSpan.style.display = 'block';
		// Use a design token for the margin to keep spacing consistent with the design system
		emptyWidgetSpan.style.marginTop = token('space.100');
		const widget = Decoration.widget(safeInsertPos, emptyWidgetSpan, {
			...buildDiffDecorationSpec({
				decorationType: 'widget',
				diffId: crypto.randomUUID(),
			}),
		});

		decorations.push(widget);
	}

	return decorations;
};
