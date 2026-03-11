import type { Change } from 'prosemirror-changeset';
import type { IntlShape } from 'react-intl-next';

import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { ColorScheme } from '../../showDiffPluginType';
import type { NodeViewSerializer } from '../NodeViewSerializer';

import {
	deletedContentStyle,
	deletedContentStyleActive,
	deletedContentStyleNew,
	deletedContentStyleNewActive,
	deletedContentStyleUnbounded,
} from './colorSchemes/standard';
import {
	deletedTraditionalContentStyle,
	deletedTraditionalContentStyleUnbounded,
} from './colorSchemes/traditional';
import { createChangedRowDecorationWidgets } from './createChangedRowDecorationWidgets';
import { findSafeInsertPos } from './utils/findSafeInsertPos';
import { wrapBlockNodeView } from './utils/wrapBlockNodeView';

const getDeletedContentStyleUnbounded = (colorScheme?: ColorScheme): string =>
	colorScheme === 'traditional'
		? deletedTraditionalContentStyleUnbounded
		: deletedContentStyleUnbounded;

const getDeletedContentStyle = (colorScheme?: ColorScheme, isActive: boolean = false): string => {
	if (colorScheme === 'traditional') {
		return deletedTraditionalContentStyle;
	}
	if (isActive) {
		return expValEquals('platform_editor_enghealth_a11y_jan_fixes', 'isEnabled', true)
			? deletedContentStyleNewActive
			: deletedContentStyleActive;
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

const createContentWrapper = (colorScheme?: ColorScheme, isActive: boolean = false) => {
	const wrapper = document.createElement('span');
	const baseStyle = convertToInlineCss({
		position: 'relative',
		width: 'fit-content',
	});
	wrapper.setAttribute('style', `${baseStyle}${getDeletedContentStyle(colorScheme, isActive)}`);

	const strikethrough = document.createElement('span');
	strikethrough.setAttribute('style', getDeletedContentStyleUnbounded(colorScheme));
	wrapper.append(strikethrough);

	return wrapper;
};

export const createNodeChangedDecorationWidget = ({
	change,
	doc,
	nodeViewSerializer,
	colorScheme,
	newDoc,
	intl,
	isActive = false,
}: {
	change: Pick<Change, 'fromA' | 'toA' | 'fromB' | 'deleted'>;
	colorScheme?: ColorScheme;
	doc: PMNode;
	intl: IntlShape;
	isActive?: boolean;
	newDoc: PMNode;
	nodeViewSerializer: NodeViewSerializer;
}) => {
	const slice = doc.slice(change.fromA, change.toA);

	if (slice.content.content.length === 0) {
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
						const wrapper = createContentWrapper(colorScheme, isActive);
						wrapper.append(childNodeView);
						dom.append(wrapper);
					} else {
						// Fallback to serializing the individual child node
						const serializedChild = serializer.serializeNode(childNode);
						if (serializedChild) {
							const wrapper = createContentWrapper(colorScheme, isActive);
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
				const wrapper = createContentWrapper(colorScheme, isActive);
				wrapper.append(nodeView);
				dom.append(wrapper);
			} else {
				// Handle all block nodes with unified function
				wrapBlockNodeView({ dom, nodeView, targetNode: node, colorScheme, intl });
			}
		} else if (
			nodeViewSerializer.getFilteredNodeViewBlocklist(['paragraph', 'tableRow']).has(node.type.name)
		) {
			// Skip the case where the node is a paragraph or table row that way it can still be rendered and delete the entire table
			return;
		} else {
			const fallbackNode = fallbackSerialization();
			if (fallbackNode) {
				const wrapper = createDeletedStyleWrapperWithoutOpacity(colorScheme, isActive);
				wrapper.append(fallbackNode);
				dom.append(wrapper);
			}
		}
	});

	dom.setAttribute('data-testid', 'show-diff-deleted-decoration');

	// Widget decoration used for deletions as the content is not in the document
	// and we want to display the deleted content with a style.
	const safeInsertPos = findSafeInsertPos(newDoc, change.fromB, slice);
	return [Decoration.widget(safeInsertPos, dom, { key: 'diff-widget' })];
};
