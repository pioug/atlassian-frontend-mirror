import type { Change } from 'prosemirror-changeset';

import {
	type NodeViewConstructor,
	convertToInlineCss,
} from '@atlaskit/editor-common/lazy-node-view';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

import { NodeViewSerializer } from './NodeViewSerializer';

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
	tr: Transaction;
	nodeViews: Record<string, NodeViewConstructor>;
	editorView?: EditorView;
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
	tr,
	editorView,
	nodeViews,
}: DeletedContentDecorationProps) => {
	const dom = document.createElement('span');
	dom.setAttribute('style', deletedContentStyle);

	/*
	 * The thinking is we separate out the fragment we got from doc.slice
	 * and if it's the first or last content, we go in however many the sliced Open
	 * or sliced End depth is and match only the content and not with the entire node.
	 */
	const slice = doc.slice(change.fromA, change.toA);

	const nodeViewSerializer = new NodeViewSerializer({
		schema: tr.doc.type.schema,
		editorView,
		nodeViews,
	});

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
			if (node.content.childCount > 1 && node.type.inlineContent) {
				node.content.forEach((childNode) => {
					const childNodeView = nodeViewSerializer.tryCreateNodeView(childNode);
					if (childNodeView) {
						const lineBreak = document.createElement('br');
						targetNode = node;
						dom.append(lineBreak);
						const wrapper = createWrapperWithStrikethrough();
						wrapper.append(childNodeView.dom);
						dom.append(wrapper);
					} else {
						// Fallback to serializing the individual child node
						const serializedChild = nodeViewSerializer.serializeNode(childNode);
						dom.append(serializedChild);
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

		let targetNode: PMNode;
		let fallbackSerialization: () => Node;

		if ((isFirst || (isLast && slice.content.childCount > 2)) && hasInlineContent) {
			if (handleMultipleChildNodes(node)) {
				return;
			}
			targetNode = node.content.content[0];
			fallbackSerialization = () => nodeViewSerializer.serializeFragment(node.content);
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
					return nodeViewSerializer.serializeFragment(node.content);
				}

				return nodeViewSerializer.serializeFragment(node.content);
			};
		} else {
			if (handleMultipleChildNodes(node)) {
				return;
			}
			targetNode = node.content.content[0] || node;
			fallbackSerialization = () => nodeViewSerializer.serializeNode(node);
		}

		// Try to create node view, fallback to serialization
		const nodeView = nodeViewSerializer.tryCreateNodeView(targetNode);

		if (nodeView) {
			const wrapper = createWrapperWithStrikethrough();
			wrapper.append(nodeView.dom);
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
