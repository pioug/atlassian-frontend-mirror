import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type {
	Decoration,
	DecorationSource,
	EditorView,
	NodeView,
} from '@atlaskit/editor-prosemirror/view';

import type { getPosHandler } from './react-node-view/types';

export type PreservedNodeView = {
	destroy: () => void;
	dom: HTMLElement;
	getPos: getPosHandler;
	ignoreMutation?: (mutation: MutationRecord | { target: Node; type: 'selection' }) => boolean;
	init: () => NodeView;
	node: PMNode;
	reactComponentProps: unknown;
	stopEvent: (event: Event) => boolean;
	update: (
		node: PMNode,
		decorations: readonly Decoration[],
		innerDecorations?: DecorationSource,
	) => boolean;
	view: EditorView;
};

// Do not polyfill with insertBefore: it disconnects an iframe and resets its browsing context.
type MoveTarget = HTMLElement & { moveBefore?: (node: Node, reference: Node | null) => void };
type Owner = { destroyed: boolean; getPos: () => number | undefined };
type Entry = {
	inner: PreservedNodeView;
	owner: Owner;
	parking?: HTMLElement;
	rendererKind: object;
};
const editors = new WeakMap<EditorView, Set<Entry>>();

type PreservationOptions = {
	canReuse?: (inner: PreservedNodeView) => boolean;
	canUpdateNode: (previous: PMNode, next: PMNode) => boolean;
	createNodeView: (node: PMNode) => PreservedNodeView;
	getPos: getPosHandler;
	isSameNode: (previous: PMNode, next: PMNode) => boolean;
	node: PMNode;
	onAttach?: (
		inner: PreservedNodeView,
		slot: HTMLElement,
		getPos: () => number | undefined,
	) => void;
	rendererKind: object;
	renderProps: unknown;
	requireUniqueMatch?: boolean;
	view: EditorView;
};

/**
 * Preserves an atomic React node view across ProseMirror redraws when native
 * state-preserving DOM moves are available. A disposable slot parks the
 * portal before ProseMirror disconnects its mark wrapper. After reconciliation, the
 * replacement claims the parked portal without taking one from a still-live node.
 */
export function preserveNodeView({
	node,
	view,
	getPos,
	renderProps,
	rendererKind,
	createNodeView,
	isSameNode,
	canUpdateNode,
	canReuse,
	onAttach,
	requireUniqueMatch = false,
}: PreservationOptions): NodeView {
	const ownerDocument = view.dom.ownerDocument;
	const slot: MoveTarget = ownerDocument.createElement('div');
	if (
		!node.isAtom ||
		!view.dom.isConnected ||
		typeof getPos !== 'function' ||
		typeof slot.moveBefore !== 'function'
	) {
		return createNodeView(node).init();
	}
	const owner: Owner = { getPos, destroyed: false };
	let entries = editors.get(view);
	if (!entries) {
		entries = new Set();
		editors.set(view, entries);
	}
	const registry = entries;
	let entry: Entry | undefined;
	let latestNode = node;
	let latestDecorations: readonly Decoration[] = [];
	let latestInnerDecorations: DecorationSource | undefined;

	// Construction can precede the old slot's destroy(). Defer portal adoption until
	// both hooks have run; no rendering opportunity occurs between these microtasks.
	queueMicrotask(() => {
		if (owner.destroyed || view.isDestroyed || !slot.isConnected) {
			return;
		}
		const matches = (existing: Entry) =>
			existing.rendererKind === rendererKind &&
			isSameNode(existing.inner.node, latestNode) &&
			(!canReuse || canReuse(existing.inner));
		if (requireUniqueMatch) {
			// Duplicate nodes can share a ProseMirror object while owning different iframe state.
			const candidates = Array.from(registry).filter(matches);
			entry = candidates.length === 1 && candidates[0].owner.destroyed ? candidates[0] : undefined;
		} else {
			entry = Array.from(registry).find(
				(existing) => existing.owner.destroyed && matches(existing),
			);
		}
		if (entry) {
			entry.owner = owner;
			entry.inner.reactComponentProps = renderProps;
			slot.moveBefore?.(entry.inner.dom, null);
			entry.parking?.remove();
			entry.parking = undefined;
			onAttach?.(entry.inner, slot, () => (owner.destroyed ? undefined : owner.getPos()));
			if (!entry.inner.update(latestNode, latestDecorations, latestInnerDecorations)) {
				// A renderer can reject an update even after its identity matches.
				registry.delete(entry);
				const dom = entry.inner.dom;
				entry.inner.destroy();
				dom.remove();
				entry = undefined;
			}
		}
		if (!entry) {
			// Construct only after the old slot has had a chance to park its portal.
			const inner = createNodeView(latestNode);
			const retained: Entry = { inner, owner, rendererKind };
			entry = retained;
			inner.getPos = () => (retained.owner.destroyed ? undefined : retained.owner.getPos());
			inner.init();
			slot.appendChild(inner.dom);
			onAttach?.(inner, slot, () => (owner.destroyed ? undefined : owner.getPos()));
			registry.add(retained);
		}
	});

	return {
		dom: slot,
		// ProseMirror must not manage the retained atom's portal children.
		update(next, decorations, innerDecorations) {
			if (!canUpdateNode(node, next)) {
				return false;
			}
			latestNode = next;
			latestDecorations = decorations;
			latestInnerDecorations = innerDecorations;
			return entry ? entry.inner.update(next, decorations, innerDecorations) : true;
		},
		stopEvent: (event) => entry?.inner.stopEvent(event) ?? false,
		ignoreMutation: (mutation) =>
			entry?.inner.ignoreMutation?.(mutation) ?? mutation.type !== 'selection',
		destroy() {
			owner.destroyed = true;
			if (!entry) {
				return;
			}
			const retained = entry;
			if (retained.inner.dom.isConnected) {
				const parking: MoveTarget = ownerDocument.createElement('div');
				// Transient, outside the editable document and inaccessible while awaiting handoff.
				parking.hidden = true;
				ownerDocument.body.appendChild(parking);
				parking.moveBefore?.(retained.inner.dom, null);
				retained.parking = parking;
			}
			// Give constructors queued after destroy() a chance to claim the portal first.
			queueMicrotask(() =>
				queueMicrotask(() => {
					if (retained.owner === owner && registry.delete(retained)) {
						const dom = retained.inner.dom;
						retained.inner.destroy();
						dom.remove();
						retained.parking?.remove();
					}
				}),
			);
		},
	};
}
