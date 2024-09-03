import memoize from 'lodash/memoize';

import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';

import type { LazyNodeViewToDOMConfiguration } from './types';

const getEditorLineWidth = memoize((view: EditorView): number => {
	return view.dom?.clientWidth;
});

/**
 * 🧱 Internal: Editor FE Platform
 *
 * A NodeView that serves as a placeholder until the actual NodeView is loaded.
 */
export class LazyNodeView implements NodeView {
	dom: Node;
	contentDOM?: HTMLElement;
	private node: PMNode;
	private isNodeViewLoaded: boolean;

	constructor(
		node: PMNode,
		view: EditorView,
		_getPos: () => number | undefined,
		nodeViewLoader: Promise<unknown>,
	) {
		this.node = node;
		this.isNodeViewLoaded = false;

		if (typeof node.type?.spec?.toDOM !== 'function') {
			this.dom = document.createElement('div');
			return;
		}

		const toDOMConfiguration: LazyNodeViewToDOMConfiguration = {
			editorLineWidth: getEditorLineWidth(view),
		};

		const fallback = DOMSerializer.renderSpec(
			document,
			node.type.spec.toDOM(
				node,
				// We are injecting a second parameter to be used by the toDOM lazy node view implementations
				// @ts-expect-error
				toDOMConfiguration,
			),
		);

		this.dom = fallback.dom;
		this.contentDOM = fallback.contentDOM;

		if (this.dom instanceof HTMLElement) {
			// This attribute is mostly used for debugging purposed
			// It will help us to found out when the node was replaced
			this.dom.setAttribute('data-lazy-node-view', node.type.name);
			// This is used on Libra tests
			// We are using this to make sure all lazy noded were replaced
			// before the test started
			this.dom.setAttribute('data-lazy-node-view-fallback', 'true');
		}

		nodeViewLoader.then(() => {
			this.isNodeViewLoaded = true;
		});
	}

	update = (node: PMNode): boolean => {
		const prevNode = this.node;
		this.node = node;

		// Forcing NodeView to be re-created
		// so that ProseMirror can replace LazyNodeView with the real one.
		if (this.isNodeViewLoaded) {
			return false;
		}

		// Copying some of the default NodeView update behaviour
		// https://github.com/ProseMirror/prosemirror-view/blob/cfa73eb969777f63bcb39972594fd4a9110f5a93/src/viewdesc.ts#L803
		return !this.node.sameMarkup(prevNode);
	};

	ignoreMutation() {
		if (this.node.type.isTextblock) {
			return false;
		}

		return true;
	}
}
