import type { Change } from 'prosemirror-changeset';
import type { IntlShape } from 'react-intl-next';

import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { ColorScheme } from '../../showDiffPluginType';
import type { NodeViewSerializer } from '../NodeViewSerializer';

import {
	editingStyle,
	editingStyleActive,
	deletedContentStyle,
	deletedContentStyleActive,
	deletedContentStyleNew,
	deletedContentStyleUnbounded,
} from './colorSchemes/standard';
import {
	traditionalInsertStyle,
	traditionalInsertStyleActive,
	getDeletedTraditionalInlineStyle,
	deletedTraditionalContentStyleUnbounded,
	deletedTraditionalContentStyleUnboundedActive,
} from './colorSchemes/traditional';
import { createChangedRowDecorationWidgets } from './createChangedRowDecorationWidgets';
import { findSafeInsertPos } from './utils/findSafeInsertPos';
import { wrapBlockNodeView } from './utils/wrapBlockNodeView';

const getDeletedContentStyleUnbounded = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
): string => {
	if (colorScheme === 'traditional' && isActive) {
		return deletedTraditionalContentStyleUnboundedActive;
	}
	return colorScheme === 'traditional'
		? deletedTraditionalContentStyleUnbounded
		: deletedContentStyleUnbounded;
};

const getInsertedContentStyle = (colorScheme?: ColorScheme, isActive: boolean = false): string => {
	if (colorScheme === 'traditional') {
		if (isActive) {
			return traditionalInsertStyleActive;
		}
		return traditionalInsertStyle;
	}
	if (isActive) {
		return editingStyleActive;
	}
	return editingStyle;
};
const getDeletedContentStyle = (colorScheme?: ColorScheme, isActive: boolean = false): string => {
	if (colorScheme === 'traditional') {
		return getDeletedTraditionalInlineStyle(isActive);
	}
	if (isActive) {
		return deletedContentStyleActive;
	}
	return expValEquals('platform_editor_enghealth_a11y_jan_fixes', 'isEnabled', true)
		? deletedContentStyleNew
		: deletedContentStyle;
};

/**
 * Wraps content with deleted styling without opacity (for use when content is a direct child of dom)
 */
const createDeletedStyleWrapperWithoutOpacity = (colorScheme?: ColorScheme, isActive?: boolean) => {
	const wrapper = document.createElement('span');
	wrapper.setAttribute('style', getDeletedContentStyle(colorScheme, isActive));
	return wrapper;
};

/**
 * CSS backgrounds don't work when applied to a wrapper around a paragraph, so
 * the wrapper needs to be injected inside the node around the child content
 */
const injectInnerWrapper = ({
	node,
	colorScheme,
	isActive,
	isInserted,
}: {
	colorScheme?: 'standard' | 'traditional';
	isActive?: boolean;
	isInserted?: boolean;
	node: Node;
}) => {
	const wrapper = document.createElement('span');
	wrapper.setAttribute(
		'style',
		isInserted
			? getInsertedContentStyle(colorScheme, isActive)
			: getDeletedContentStyle(colorScheme, isActive),
	);

	[...node.childNodes].forEach((child) => {
		const removedChild = node.removeChild(child);
		wrapper.append(removedChild);
	});

	node.appendChild(wrapper);
	return node;
};

const createContentWrapper = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
	isInserted: boolean = false,
) => {
	const wrapper = document.createElement('span');
	const baseStyle = convertToInlineCss({
		position: 'relative',
		width: 'fit-content',
	});
	if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
		if (isInserted) {
			wrapper.setAttribute(
				'style',
				`${baseStyle}${getInsertedContentStyle(colorScheme, isActive)}`,
			);
		} else {
			wrapper.setAttribute('style', `${baseStyle}${getDeletedContentStyle(colorScheme, isActive)}`);
			const strikethrough = document.createElement('span');
			strikethrough.setAttribute('style', getDeletedContentStyleUnbounded(colorScheme, isActive));
			wrapper.append(strikethrough);
		}
	} else {
		wrapper.setAttribute('style', `${baseStyle}${getDeletedContentStyle(colorScheme, isActive)}`);
		const strikethrough = document.createElement('span');
		strikethrough.setAttribute('style', getDeletedContentStyleUnbounded(colorScheme, isActive));
		wrapper.append(strikethrough);
	}

	return wrapper;
};

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
}: {
	activeIndexPos?: { from: number; to: number };
	change: Pick<Change, 'fromA' | 'toA' | 'fromB' | 'deleted' | 'toB'>;
	colorScheme?: ColorScheme;
	doc: PMNode;
	intl: IntlShape;
	isInserted?: boolean;
	newDoc: PMNode;
	nodeViewSerializer: NodeViewSerializer;
}): Decoration[] | undefined => {
	const slice = doc.slice(change.fromA, change.toA);
	const shouldSkipDeletedEmptyParagraphDecoration =
		!isInserted &&
		slice?.content?.childCount === 1 &&
		slice?.content?.firstChild?.type.name === 'paragraph' &&
		slice?.content?.firstChild?.content.size === 0 &&
		fg('platform_editor_show_diff_scroll_navigation');
	// Widget decoration used for deletions as the content is not in the document
	// and we want to display the deleted content with a style.
	const safeInsertPos = findSafeInsertPos(newDoc, change.fromB, slice);
	const isActive =
		activeIndexPos && safeInsertPos === activeIndexPos.from && safeInsertPos === activeIndexPos.to;

	if (slice.content.content.length === 0 || shouldSkipDeletedEmptyParagraphDecoration) {
		return;
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
		return;
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
				if (
					expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true) ||
					fg('platform_editor_show_diff_scroll_navigation')
				) {
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
				} else {
					const wrapper = createDeletedStyleWrapperWithoutOpacity(colorScheme, isActive);
					wrapper.append(fallbackNode);
					dom.append(wrapper);
				}
			}
		}
	});

	dom.setAttribute('data-testid', 'show-diff-deleted-decoration');

	const decorations: Decoration[] = [];
	decorations.push(
		Decoration.widget(safeInsertPos, dom, {
			key: `diff-widget-${isActive ? 'active' : 'inactive'}`,
			...(expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true) && {
				side: -1,
			}),
		}),
	);
	return decorations;
};
