import type React from 'react';

import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

import { type EventDispatcher } from '../event-dispatcher';
import { type PortalProviderAPI } from '../portal';
import ReactNodeView, {
	type getPosHandler,
	type ReactComponentProps,
	type shouldUpdate,
} from '../react-node-view';

/**
 * A ReactNodeView that handles React components sensitive
 * to selection changes.
 *
 * If the selection changes, it will attempt to re-render the
 * React component. Otherwise it does nothing.
 *
 * You can subclass `viewShouldUpdate` to include other
 * props that your component might want to consider before
 * entering the React lifecycle. These are usually props you
 * compare in `shouldComponentUpdate`.
 *
 * An example:
 *
 * ```
 * viewShouldUpdate(nextNode) {
 *   if (nextNode.attrs !== this.node.attrs) {
 *     return true;
 *   }
 *
 *   return super.viewShouldUpdate(nextNode);
 * }```
 */

export class SelectionBasedNodeView<P = ReactComponentProps> extends ReactNodeView<P> {
	protected isSelectedNode: boolean = false;

	pos: number | undefined;
	posEnd: number | undefined;

	constructor(
		node: PMNode,
		view: EditorView,
		getPos: getPosHandler,
		portalProviderAPI: PortalProviderAPI,
		eventDispatcher: EventDispatcher,
		reactComponentProps: P,
		reactComponent?: React.ComponentType<React.PropsWithChildren<any>>,
		viewShouldUpdate?: shouldUpdate,
	) {
		super(
			node,
			view,
			getPos,
			portalProviderAPI,
			eventDispatcher,
			reactComponentProps,
			reactComponent,
			viewShouldUpdate,
		);

		this.updatePos();
	}

	/**
	 * Update current node's start and end positions.
	 *
	 * Prefer `this.pos` rather than getPos(), because calling getPos is
	 * expensive, unless you know you're definitely going to render.
	 */
	private updatePos() {
		if (typeof this.getPos === 'boolean') {
			return;
		}
		const pos = this.getPos();

		if (typeof pos === 'number') {
			this.pos = pos;
			this.posEnd = pos + this.node.nodeSize;
		}
	}

	private getPositionsWithDefault(pos?: number, posEnd?: number) {
		return {
			pos: typeof pos !== 'number' ? this.pos : pos,
			posEnd: typeof posEnd !== 'number' ? this.posEnd : posEnd,
		};
	}

	private isNodeInsideSelection = (from: number, to: number, pos?: number, posEnd?: number) => {
		({ pos, posEnd } = this.getPositionsWithDefault(pos, posEnd));

		if (typeof pos !== 'number' || typeof posEnd !== 'number') {
			return false;
		}

		return from <= pos && to >= posEnd;
	};

	private isSelectionInsideNode = (from: number, to: number, pos?: number, posEnd?: number) => {
		({ pos, posEnd } = this.getPositionsWithDefault(pos, posEnd));

		if (typeof pos !== 'number' || typeof posEnd !== 'number') {
			return false;
		}

		return pos < from && to < posEnd;
	};

	insideSelection = () => {
		const {
			selection: { from, to },
		} = this.view.state;

		return this.isSelectedNode || this.isSelectionInsideNode(from, to);
	};

	nodeInsideSelection = () => {
		const { selection } = this.view.state;
		const { from, to } = selection;

		return this.isSelectedNode || this.isNodeInsideSelection(from, to);
	};

	selectNode() {
		this.isSelectedNode = true;
		this.update(this.node, this.decorations);
	}

	deselectNode() {
		this.isSelectedNode = false;
		this.update(this.node, this.decorations);
	}
}
