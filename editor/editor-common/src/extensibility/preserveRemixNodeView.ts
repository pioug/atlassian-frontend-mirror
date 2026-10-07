import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type {
	Decoration,
	DecorationSource,
	EditorView,
	NodeView,
} from '@atlaskit/editor-prosemirror/view';

import { NATIVE_EMBED_MAUI_EXTENSION_KEY } from '../extensions/native-embed-maui-extension-key';
import type { getPosHandler } from '../react-node-view';

type ExtensionView = {
	destroy: () => void;
	dom: HTMLElement;
	getPos: getPosHandler;
	ignoreMutation: (mutation: MutationRecord | { target: Node; type: 'selection' }) => boolean;
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
type Entry = { inner: ExtensionView; owner: Owner; parking?: HTMLElement; rendererKind: object };
const editors = new WeakMap<EditorView, Set<Entry>>();

type PreservationOptions = {
	createExtensionNode: (node: PMNode) => ExtensionView;
	getPos: getPosHandler;
	node: PMNode;
	rendererKind: object;
	renderProps: unknown;
	view: EditorView;
};

/** Only block Remix embeds with a stable identity can participate in the handoff. */
const isRemixNodeForPreservation = (node: PMNode): boolean =>
	node.type.name === 'extension' &&
	node.attrs.extensionKey === NATIVE_EMBED_MAUI_EXTENSION_KEY &&
	typeof node.attrs.localId === 'string' &&
	node.attrs.localId.length > 0;

const sameChart = (left: PMNode, right: PMNode): boolean =>
	left
		.mark(left.marks.filter((mark) => mark.type.name !== 'annotation'))
		.eq(right.mark(right.marks.filter((mark) => mark.type.name !== 'annotation')));

/**
 * A disposable ProseMirror slot around a retained React portal. destroy() parks the
 * portal before ProseMirror disconnects its mark wrapper. After reconciliation, the
 * replacement claims the parked portal without taking one from a still-live node.
 */
export function preserveRemixNodeView({
	node,
	view,
	getPos,
	renderProps,
	rendererKind,
	createExtensionNode,
}: PreservationOptions): NodeView {
	if (!isRemixNodeForPreservation(node)) {
		return createExtensionNode(node).init();
	}
	const ownerDocument = view.dom.ownerDocument;
	const slot: MoveTarget = ownerDocument.createElement('div');
	if (
		!view.dom.isConnected ||
		typeof getPos !== 'function' ||
		typeof slot.moveBefore !== 'function'
	) {
		return createExtensionNode(node).init();
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
		entry = Array.from(registry).find(
			(existing) =>
				existing.owner.destroyed &&
				existing.rendererKind === rendererKind &&
				sameChart(existing.inner.node, latestNode),
		);
		if (entry) {
			entry.owner = owner;
			entry.inner.reactComponentProps = renderProps;
			slot.moveBefore?.(entry.inner.dom, null);
			entry.parking?.remove();
			entry.parking = undefined;
			if (!entry.inner.update(latestNode, latestDecorations, latestInnerDecorations)) {
				// A matching chart is normally accepted, but honour the NodeView contract
				// if a renderer rejects it. Remove the old portal before creating a replacement.
				registry.delete(entry);
				const dom = entry.inner.dom;
				entry.inner.destroy();
				dom.remove();
				entry = undefined;
			}
		}
		if (!entry) {
			// Construct only after the old slot has had a chance to park its portal.
			const inner = createExtensionNode(latestNode);
			const retained: Entry = { inner, owner, rendererKind };
			entry = retained;
			inner.getPos = () => (retained.owner.destroyed ? undefined : retained.owner.getPos());
			inner.init();
			slot.appendChild(inner.dom);
			registry.add(retained);
		}
	});

	return {
		dom: slot,
		// The retained extension is an atom: ProseMirror must not manage the portal's children.
		update(next, decorations, innerDecorations) {
			if (
				next.type !== node.type ||
				next.attrs.localId !== node.attrs.localId ||
				next.attrs.extensionKey !== node.attrs.extensionKey
			) {
				return false;
			}
			latestNode = next;
			latestDecorations = decorations;
			latestInnerDecorations = innerDecorations;
			return entry ? entry.inner.update(next, decorations, innerDecorations) : true;
		},
		stopEvent: (event) => entry?.inner.stopEvent(event) ?? false,
		ignoreMutation: (mutation) =>
			entry?.inner.ignoreMutation(mutation) ?? mutation.type !== 'selection',
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
