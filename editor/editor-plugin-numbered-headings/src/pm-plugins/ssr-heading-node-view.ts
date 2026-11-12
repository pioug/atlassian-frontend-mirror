import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';

/**
 * Returns the attributes the plugin's decorations give to the heading at `pos`, so SSR renders the
 * same attributes the client draws.
 */
type GetHeadingAttrsAt = (
	state: EditorState,
	pos: number,
) => Readonly<Record<string, string>> | undefined;

// SSR DOM implementations don't always expose `Element`, so check the node type instead.
const isElement = (node: Node): node is Element => node.nodeType === 1;

/**
 * SSR-only heading node view. `EditorSSRRenderer` serialises the document with `DOMSerializer`
 * and ignores decorations, so the numbering decorations never reach SSR HTML. This node view
 * renders the heading from its schema `toDOM` (the same DOM the client renders) and adds the
 * decoration attributes itself.
 *
 * Only register this during SSR. On the client, the decorations add the attributes.
 */
export const createSSRHeadingNodeView =
	(getHeadingAttrsAt: GetHeadingAttrsAt) =>
	(node: PMNode, view: EditorView, getPos: () => number | undefined): NodeView => {
		const toDOM = node.type.spec.toDOM;
		// Use the document the SSR editor view renders into. `getDocument()` from
		// `@atlaskit/browser-apis` is compiled to `null` in server bundles, which build out its
		// `typeof document` check, even though the SSR runtime provides a document.
		const doc = view.dom?.ownerDocument;
		if (!toDOM || !doc) {
			// Throwing makes EditorSSRRenderer fall back to the schema toDOM for this heading.
			throw new Error('Cannot render the numbered heading during SSR');
		}

		const { dom, contentDOM } = DOMSerializer.renderSpec(doc, toDOM(node));
		const pos = getPos();
		// The SSR renderer falls back to position 0 for nodes it can't place; check the node matches.
		if (pos !== undefined && isElement(dom) && view.state.doc.nodeAt(pos) === node) {
			const attrs = getHeadingAttrsAt(view.state, pos);
			for (const [name, value] of Object.entries(attrs ?? {})) {
				dom.setAttribute(name, value);
			}
		}

		return { dom, contentDOM };
	};
