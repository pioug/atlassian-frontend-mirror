import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Decoration, DecorationSource, NodeView } from '@atlaskit/editor-prosemirror/view';

/**
 * DOM spec for the caption node view.
 */
function toDOM(node: PMNode): DOMOutputSpec {
	return [
		'figcaption',
		{
			'data-caption': 'true',
			'data-media-caption': 'true',
			'data-testid': 'media-caption',
			...(node.attrs.localId ? { 'data-local-id': node.attrs.localId } : {}),
		},
		['div', { class: 'captionView-content-wrap' }, 0],
	];
}

function createCaptionDOM(node: PMNode): {
	contentDOM?: HTMLElement;
	dom: Node;
} {
	return DOMSerializer.renderSpec(document, toDOM(node));
}

/**
 * Vanilla (React-free) implementation of CaptionNodeView.
 *
 * Replaces SelectionBasedNodeView + CaptionComponent React render. The node view owns the DOM
 * shape and nothing else: editability is inherited from the ProseMirror root rather than being
 * set here, so disabling the editor cannot be overridden by a stale nested `contenteditable`.
 */
export class CaptionNodeView implements NodeView {
	dom: Node;
	contentDOM?: HTMLElement;

	private node: PMNode;

	constructor(node: PMNode) {
		this.node = node;

		const { dom, contentDOM } = createCaptionDOM(node);
		this.dom = dom;
		this.contentDOM = contentDOM;
	}

	update(
		node: PMNode,
		_decorations: readonly Decoration[],
		_innerDecorations?: DecorationSource,
	): boolean {
		if (node.type !== this.node.type) {
			return false;
		}
		this.node = node;
		return true;
	}

	ignoreMutation(mutation: MutationRecord | { target: Node; type: 'selection' }): boolean {
		if (!this.contentDOM) {
			return true;
		}
		return !this.contentDOM.contains(mutation.target) && mutation.type !== 'selection';
	}
}

/** Factory function for ProseMirror node view registration. */
export function captionNodeView() {
	return (node: PMNode): CaptionNodeView => {
		return new CaptionNodeView(node);
	};
}
