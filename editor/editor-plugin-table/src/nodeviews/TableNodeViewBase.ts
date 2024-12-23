import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';

export default abstract class TableNodeView<T extends HTMLElement> implements NodeView {
	/**
	 * @constructor
	 */
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
	constructor(
		protected node: PmNode,
		protected readonly view: EditorView,
		protected readonly getPos: () => number | undefined,
		protected readonly eventDispatcher: EventDispatcher,
	) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const { dom, contentDOM } = DOMSerializer.renderSpec(document, node.type.spec.toDOM!(node));

		this.dom = dom as T;
		this.contentDOM = contentDOM as T;
	}

	/**
	 * Variables
	 */
	dom: T;
	contentDOM: T;
}
