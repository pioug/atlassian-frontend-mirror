import memoize from 'lodash/memoize';

import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Decoration, EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type { LazyNodeViewToDOMConfiguration } from './types';

const getEditorLineWidth = memoize((view: EditorView): number => {
	return view.dom?.clientWidth;
});

// Copied from ProseMirror NodeView
// https://github.com/ProseMirror/prosemirror-view/blob/cfa73eb969777f63bcb39972594fd4a9110f5a93/src/viewdesc.ts#L1095-L1099
function sameOuterDeco(a: readonly Decoration[], b: readonly Decoration[]) {
	if (a.length !== b.length) {
		return false;
	}

	for (let i = 0; i < a.length; i++) {
		// @ts-expect-error type actually exist on decoration at runtime
		if (!a[i].type) {
			return false;
		}

		// @ts-expect-error type actually exist on decoration at runtime
		if (!a[i].type.eq(b[i].type)) {
			return false;
		}
	}
	return true;
}

export function makeNodePlaceholderId(nodeType: string, pos: number): string {
	return `${nodeType}:${pos}`;
}

/**
 * 🧱 Internal: Editor FE Platform
 *
 * A NodeView that serves as a placeholder until the actual NodeView is loaded.
 */
export class LazyNodeView implements NodeView {
	dom: Node;
	contentDOM?: HTMLElement;
	private node: PMNode;
	private outerDeco: readonly Decoration[];

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
	constructor(
		node: PMNode,
		view: EditorView,
		_getPos: () => number | undefined,
		outerDeco: readonly Decoration[],
	) {
		this.node = node;
		this.outerDeco = outerDeco;

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

			// This is used by the UFO to identify the node
			this.dom.setAttribute('data-vc', `editor-lnv-fallback--${node.type.name}`);

			if (fg('platform_editor_ed-25557_lnv_add_ssr_placeholder')) {
				const pos = _getPos();
				if (pos !== undefined) {
					// Used for UFO to identify this as a placeholder
					this.dom.setAttribute(
						'data-editor-lnv-placeholder',
						makeNodePlaceholderId(node.type.name, pos),
					);
				}
			}
		}
	}

	update = (node: PMNode, outerDeco: readonly Decoration[]): boolean => {
		const prevNode = this.node;
		this.node = node;

		if (!sameOuterDeco(outerDeco, this.outerDeco)) {
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
