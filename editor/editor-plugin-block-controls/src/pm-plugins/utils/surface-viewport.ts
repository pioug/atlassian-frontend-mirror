import type { EditorView } from '@atlaskit/editor-prosemirror/view';

const NODE_NAME_ATTRIBUTE = 'data-prosemirror-node-name';

export type SurfaceViewportPositions = readonly number[];

/**
 * Tracks block DOM nodes that intersect the browser viewport. The browser owns clipping and
 * visibility decisions; this helper only translates observer targets back to PM positions.
 */
export const observeSurfaceViewport = (
	view: EditorView,
	onChange: (positions: SurfaceViewportPositions) => void,
): { destroy: () => void; update: () => void } => {
	const win = view.dom.ownerDocument.defaultView;
	if (!win || typeof win.IntersectionObserver === 'undefined') {
		return { update: () => {}, destroy: () => {} };
	}

	type TargetState = { isIntersecting: boolean; position?: number };
	const targets = new Map<Element, TargetState>();
	const visibleTargets = new Set<Element>();
	let previousPositions: SurfaceViewportPositions = [];
	let previousDoc = view.state.doc;
	let destroyed = false;

	const resolvePosition = (element: Element): number | undefined => {
		try {
			const domPosition = view.posAtDOM(element, 0);
			const nodeName = element.getAttribute(NODE_NAME_ATTRIBUTE);
			const directNode = view.state.doc.nodeAt(domPosition);
			if (
				directNode?.isBlock &&
				directNode.type.name === nodeName &&
				view.nodeDOM(domPosition) === element
			) {
				return domPosition;
			}
			const $position = view.state.doc.resolve(domPosition);
			for (let depth = $position.depth; depth > 0; depth--) {
				const node = $position.node(depth);
				if (!node.isBlock || node.type.name !== nodeName) {
					continue;
				}
				const position = $position.before(depth);
				const nodeDOM = view.nodeDOM(position);
				if (
					nodeDOM === element ||
					(nodeDOM instanceof Node && (nodeDOM.contains(element) || element.contains(nodeDOM)))
				) {
					return position;
				}
			}
			return undefined;
		} catch {
			return undefined;
		}
	};
	const getVisiblePositions = (): SurfaceViewportPositions => {
		const positions = new Set<number>();
		visibleTargets.forEach((element) => {
			const position = targets.get(element)?.position;
			if (position !== undefined) {
				positions.add(position);
			}
		});
		return Array.from(positions).sort((first, second) => first - second);
	};
	const emit = () => {
		if (destroyed) {
			return;
		}
		const positions = getVisiblePositions();
		if (
			positions.length !== previousPositions.length ||
			positions.some((position, index) => position !== previousPositions[index])
		) {
			previousPositions = positions;
			onChange(positions);
		}
	};

	const intersectionObserver = new win.IntersectionObserver(
		(entries) => {
			let changed = false;
			for (const entry of entries) {
				const element = entry.target;
				const target = targets.get(element);
				if (!target || !view.dom.contains(element)) {
					continue;
				}
				const isIntersecting = entry.isIntersecting;
				if (target.isIntersecting !== isIntersecting) {
					target.isIntersecting = isIntersecting;
					if (isIntersecting) {
						target.position = resolvePosition(element);
						if (target.position !== undefined) {
							visibleTargets.add(element);
						} else {
							target.isIntersecting = false;
						}
					} else {
						visibleTargets.delete(element);
					}
					changed = true;
				}
			}
			if (changed) {
				emit();
			}
		},
		{ root: null, threshold: 0 },
	);

	const removeTarget = (element: Element) => {
		const target = targets.get(element);
		if (!target) {
			return;
		}
		targets.delete(element);
		visibleTargets.delete(element);
		intersectionObserver.unobserve(element);
	};

	const observeElement = (element: Element) => {
		const nodeName = element.getAttribute(NODE_NAME_ATTRIBUTE);
		if (
			element === view.dom ||
			!nodeName ||
			!view.state.schema.nodes[nodeName]?.isBlock ||
			!view.dom.contains(element)
		) {
			return;
		}
		if (targets.has(element)) {
			return;
		}
		targets.set(element, { isIntersecting: false });
		intersectionObserver.observe(element);
	};

	const observeSubtree = (node: Node) => {
		if (node.nodeType !== Node.ELEMENT_NODE) {
			return;
		}
		const element = node as Element;
		observeElement(element);
		const descendants = element.querySelectorAll(`[${NODE_NAME_ATTRIBUTE}]`);
		for (let index = 0; index < descendants.length; index++) {
			observeElement(descendants[index]);
		}
	};

	const unobserveSubtree = (node: Node) => {
		if (node.nodeType !== Node.ELEMENT_NODE) {
			return;
		}
		const element = node as Element;
		removeTarget(element);
		const descendants = element.querySelectorAll(`[${NODE_NAME_ATTRIBUTE}]`);
		for (let index = 0; index < descendants.length; index++) {
			removeTarget(descendants[index]);
		}
	};

	const mutationObserver = new win.MutationObserver((records) => {
		let removedVisibleTarget = false;
		for (const record of records) {
			for (let index = 0; index < record.removedNodes.length; index++) {
				const node = record.removedNodes[index];
				if (node.nodeType === Node.ELEMENT_NODE) {
					if (view.dom.contains(node as Element)) {
						continue;
					}
					const before = visibleTargets.size;
					unobserveSubtree(node);
					removedVisibleTarget ||= before !== visibleTargets.size;
				}
			}
			for (let index = 0; index < record.addedNodes.length; index++) {
				observeSubtree(record.addedNodes[index]);
			}
		}
		if (removedVisibleTarget) {
			emit();
		}
	});

	const initialTargets = view.dom.querySelectorAll(`[${NODE_NAME_ATTRIBUTE}]`);
	for (let index = 0; index < initialTargets.length; index++) {
		observeElement(initialTargets[index]);
	}
	mutationObserver.observe(view.dom, { childList: true, subtree: true });

	return {
		update() {
			if (previousDoc !== view.state.doc) {
				previousDoc = view.state.doc;
				visibleTargets.forEach((element) => {
					const target = targets.get(element);
					if (target) {
						target.position = resolvePosition(element);
					}
				});
				emit();
			}
		},
		destroy() {
			destroyed = true;
			mutationObserver.disconnect();
			intersectionObserver.disconnect();
			targets.clear();
			visibleTargets.clear();
		},
	};
};
