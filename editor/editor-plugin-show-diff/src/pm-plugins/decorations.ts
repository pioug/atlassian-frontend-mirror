import type { Change } from 'prosemirror-changeset';
import type { IntlShape } from 'react-intl-next';

import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import {
	getStandardNodeStyle,
	deletedContentStyle,
	deletedContentStyleActive,
	deletedContentStyleNew,
	deletedContentStyleNewActive,
	editingStyle,
	editingStyleActive,
	deletedContentStyleUnbounded,
} from './colorSchemes/standard';
import {
	getTraditionalNodeStyle,
	deletedTraditionalContentStyle,
	deletedTraditionalContentStyleUnbounded,
	traditionalInsertStyle,
	traditionalInsertStyleActive,
} from './colorSchemes/traditional';
import {
	createDeletedStyleWrapperWithoutOpacity,
	handleBlockNodeView,
} from './deletedBlocksHandler';
import { handleDeletedRows } from './deletedRowsHandler';
import { findSafeInsertPos } from './findSafeInsertPos';
import type { NodeViewSerializer } from './NodeViewSerializer';

/**
 * Inline decoration used for insertions as the content already exists in the document
 *
 * @param change Changeset "change" containing information about the change content + range
 * @returns Prosemirror inline decoration
 */
export const createInlineChangedDecoration = (
	change: { fromB: number; toB: number },
	colorScheme?: 'standard' | 'traditional',
	isActive: boolean = false,
) => {
	let style: string;
	if (colorScheme === 'traditional') {
		style = isActive ? traditionalInsertStyleActive : traditionalInsertStyle;
	} else {
		style = isActive ? editingStyleActive : editingStyle;
	}
	return Decoration.inline(
		change.fromB,
		change.toB,
		{
			style,
			'data-testid': 'show-diff-changed-decoration',
		},
		{ key: 'diff-inline' },
	);
};

export const getDeletedContentStyleUnbounded = (
	colorScheme?: 'standard' | 'traditional',
): string =>
	colorScheme === 'traditional'
		? deletedTraditionalContentStyleUnbounded
		: deletedContentStyleUnbounded;

export const getDeletedContentStyle = (
	colorScheme?: 'standard' | 'traditional',
	isActive: boolean = false,
): string => {
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

const getNodeClass = (name: string) => {
	switch (name) {
		case 'extension':
			return 'show-diff-changed-decoration-node';
		default:
			return undefined;
	}
};

const getBlockNodeStyle = (name: string, colorScheme?: 'standard' | 'traditional') => {
	return colorScheme === 'traditional' ? getTraditionalNodeStyle(name) : getStandardNodeStyle(name);
};

/**
 * Inline decoration used for insertions as the content already exists in the document
 *
 * @param change Changeset "change" containing information about the change content + range
 * @returns Prosemirror inline decoration
 */
export const createBlockChangedDecoration = (
	change: { from: number; name: string; to: number },
	colorScheme?: 'standard' | 'traditional',
) => {
	if (fg('platform_editor_show_diff_scroll_navigation')) {
		const style = getBlockNodeStyle(change.name, colorScheme);
		const className = getNodeClass(change.name);
		if (style || className) {
			return Decoration.node(
				change.from,
				change.to,
				{
					style: style,
					'data-testid': 'show-diff-changed-decoration-node',
					class: className,
				},
				{ key: 'diff-block' },
			);
		}
		return undefined;
	} else {
		return Decoration.node(
			change.from,
			change.to,
			{
				style: getBlockNodeStyle(change.name, colorScheme),
				'data-testid': 'show-diff-changed-decoration-node',
				class: getNodeClass(change.name),
			},
			{ key: 'diff-block' },
		);
	}
};

const createContentWrapper = (
	colorScheme?: 'standard' | 'traditional',
	isActive: boolean = false,
) => {
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

interface DeletedContentDecorationProps {
	change: Pick<Change, 'fromA' | 'toA' | 'fromB' | 'deleted'>;
	colorScheme?: 'standard' | 'traditional';
	doc: PMNode;
	intl: IntlShape;
	isActive?: boolean;
	newDoc: PMNode;
	nodeViewSerializer: NodeViewSerializer;
}

export const createDeletedContentDecoration = ({
	change,
	doc,
	nodeViewSerializer,
	colorScheme,
	newDoc,
	intl,
	isActive = false,
}: DeletedContentDecorationProps) => {
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
		if (!fg('platform_editor_ai_aifc_patch_ga')) {
			return;
		}

		const { decorations } = handleDeletedRows(
			[change],
			doc,
			newDoc,
			nodeViewSerializer,
			colorScheme,
		);
		return decorations;
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
				handleBlockNodeView(dom, nodeView, node, colorScheme, intl);
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
