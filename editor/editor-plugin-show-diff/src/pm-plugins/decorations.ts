import type { Change } from 'prosemirror-changeset';

import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

import type { NodeViewSerializer } from './NodeViewSerializer';

const style = convertToInlineCss({
	background: token('color.background.accent.purple.subtlest'),
	textDecoration: 'underline',
	textDecorationStyle: 'dotted',
	textDecorationThickness: token('space.025'),
	textDecorationColor: token('color.border.accent.purple'),
});
/**
 * Inline decoration used for insertions as the content already exists in the document
 *
 * @param change Changeset "change" containing information about the change content + range
 * @returns Prosemirror inline decoration
 */
export const createInlineChangedDecoration = (change: { fromB: number; toB: number }) =>
	Decoration.inline(
		change.fromB,
		change.toB,
		{
			style,
			'data-testid': 'show-diff-changed-decoration',
		},
		{},
	);

interface DeletedContentDecorationProps {
	change: Change;
	doc: PMNode;
	nodeViewSerializer: NodeViewSerializer;
}

const deletedContentStyle = convertToInlineCss({
	color: token('color.text.accent.gray'),
	textDecoration: 'line-through',
	position: 'relative',
	opacity: 0.6,
});

const deletedContentStyleUnbounded = convertToInlineCss({
	position: 'absolute',
	top: '50%',
	width: '100%',
	display: 'inline-block',
	borderTop: `1px solid ${token('color.text.accent.gray')}`,
	pointerEvents: 'none',
	zIndex: 1,
});

/**
 * Creates a widget to represent the deleted content in the editor
 *
 * @param props.change Changeset "change" containing information about the change content + range
 * @param props.doc Baseline doc to compare against
 * @param props.tr The relevant transaction this decoration is being created against
 * @returns Prosemirror widget decoration
 */
export const createDeletedContentDecoration = ({
	change,
	doc,
	nodeViewSerializer,
}: DeletedContentDecorationProps) => {
	const dom = document.createElement('span');
	dom.setAttribute('style', deletedContentStyle);

	/*
	 * The thinking is we separate out the fragment we got from doc.slice
	 * and if it's the first or last content, we go in however many the sliced Open
	 * or sliced End depth is and match only the content and not with the entire node.
	 */
	const slice = doc.slice(change.fromA, change.toA);

	// Use the provided nodeViewSerializer or create a fallback (though this shouldn't happen in normal usage)
	const serializer = nodeViewSerializer;

	slice.content.forEach((node) => {
		// Create a wrapper for each node with strikethrough
		const createWrapperWithStrikethrough = () => {
			const wrapper = document.createElement('span');
			wrapper.style.position = 'relative';
			wrapper.style.width = 'fit-content';

			const strikethrough = document.createElement('span');
			strikethrough.setAttribute('style', deletedContentStyleUnbounded);
			wrapper.append(strikethrough);

			return wrapper;
		};

		// Helper function to handle multiple child nodes
		const handleMultipleChildNodes = (node: PMNode): boolean => {
			const processedChildren = serializer.processMultipleChildNodes(node);

			if (!processedChildren) {
				return false; // Not applicable, continue with normal logic
			}

			// Handle the styling and DOM manipulation for each processed child
			processedChildren.forEach(({ dom: nodeViewDom, serializedNode }) => {
				if (nodeViewDom) {
					const lineBreak = document.createElement('br');
					targetNode = node;
					dom.append(lineBreak);
					const wrapper = createWrapperWithStrikethrough();
					wrapper.append(nodeViewDom);
					dom.append(wrapper);
				} else if (serializedNode) {
					dom.append(serializedNode);
				}
			});

			return true; // Indicates we handled multiple children
		};

		// Determine which node to use and how to serialize
		const isFirst = slice.content.firstChild === node;
		const isLast = slice.content.lastChild === node;
		const hasInlineContent = node.content.childCount > 0 && node.type.inlineContent === true;

		let targetNode: PMNode;
		let fallbackSerialization: () => Node;

		if ((isFirst || (isLast && slice.content.childCount > 2)) && hasInlineContent) {
			if (handleMultipleChildNodes(node)) {
				return;
			}
			targetNode = node.content.content[0];
			fallbackSerialization = () => serializer.serializeFragment(node.content);
		} else if (isLast && slice.content.childCount === 2) {
			if (handleMultipleChildNodes(node)) {
				return;
			}
			targetNode = node;

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
			if (handleMultipleChildNodes(node)) {
				return;
			}
			targetNode = node.content.content[0] || node;
			fallbackSerialization = () => serializer.serializeNode(node);
		}

		// Try to create node view, fallback to serialization
		const nodeViewDom = serializer.tryCreateNodeViewDom(targetNode);

		if (nodeViewDom) {
			const wrapper = createWrapperWithStrikethrough();
			wrapper.append(nodeViewDom);
			dom.append(wrapper);
		} else {
			dom.append(fallbackSerialization());
		}
	});
	dom.setAttribute('data-testid', 'show-diff-deleted-decoration');

	// Widget decoration used for deletions as the content is not in the document
	// and we want to display the deleted content with a style.
	return Decoration.widget(change.fromB, dom, {});
};
