import {
	createIntersectionObserver,
	createMutationObserver,
	createPerformanceObserver,
	type TaintedIntersectionObserver,
} from './createBrowserObservers';
import type { TimelineClock } from './timelineInterfaces';
import type { HeatmapEntrySource } from './types';

function isElementVisible(element: Element) {
	if (!(element instanceof HTMLElement)) {
		return true;
	}

	try {
		const visible = element.checkVisibility({
			// @ts-expect-error
			visibilityProperty: true,
		});

		return visible;
	} catch (e) {
		// there is no support for checkVisibility
		return true;
	}
}

function sameRectSize(a: DOMRect | null | undefined, b: DOMRect | null | undefined) {
	if (!a || !b) {
		return false;
	}

	return a.width === b.width && a.height === b.height;
}

function sameRectDimensions(a: DOMRect | null | undefined, b: DOMRect | null | undefined) {
	if (!a || !b) {
		return false;
	}

	return a.width === b.width && a.height === b.height && a.x === b.x && a.y === b.y;
}

export type DOMObserversProps = {
	timeline: TimelineClock;
	onChange: (props: {
		startTime: DOMHighResTimeStamp;
		rect: DOMRectReadOnly;
		previousRect: DOMRectReadOnly | undefined;
		elementRef: WeakRef<HTMLElement>;
		visible: boolean;
		source: HeatmapEntrySource;
	}) => void;
	onDOMContentChange: (props: { targetRef: WeakRef<HTMLElement> }) => void;
};
export class DOMObservers {
	private timeline: Readonly<TimelineClock>;
	private mutations: MutationObserver | null;
	private intersection: TaintedIntersectionObserver | null;
	private performance: PerformanceObserver | null;
	private mapVisibleNodeRects: WeakMap<Element, DOMRect>;

	constructor({ onDOMContentChange, onChange, timeline }: DOMObserversProps) {
		this.mapVisibleNodeRects = new WeakMap();
		this.timeline = timeline;
		this.intersection = createIntersectionObserver({
			onEntry: ({ target, rect, startTime, taintedTag }) => {
				const visible = isElementVisible(target);

				const lastElementRect = this.mapVisibleNodeRects.get(target);

				this.mapVisibleNodeRects.set(target, rect);

				const source = taintedTag;
				onChange({
					startTime,
					elementRef: new WeakRef(target),
					visible,
					rect,
					previousRect: lastElementRect,
					source,
				});
			},
			onObserved: ({ elements, startTime }) => {
				this.timeline.markEvent({
					type: 'IntersectionObserver:VisibleNodes',
					startTime,
					data: {
						visibleElements: elements.length,
					},
				});
			},
		});

		this.mutations = createMutationObserver({
			onAttributeMutation: ({ target }) => {
				this.intersection?.watchAndTag(target, ({ target, rect }) => {
					const lastElementRect = this.mapVisibleNodeRects.get(target);
					if (lastElementRect && sameRectSize(rect, lastElementRect)) {
						return 'mutation:attribute:no-layout-shift';
					}

					return 'mutation:attribute';
				});
			},

			onMutationFinished: ({ targets }) => {
				targets.forEach((target) => {
					onDOMContentChange({
						targetRef: new WeakRef(target),
					});
				});
			},

			onChildListMutation: ({ addedNodes, removedNodes }) => {
				const removedNodeRects = removedNodes.map((n) => this.mapVisibleNodeRects.get(n));

				addedNodes.forEach((addedNode) => {
					for (const elem of addedNode.querySelectorAll('*')) {
						this.intersection?.watchAndTag(elem, 'mutation:children-element');
					}

					const sameDeletedNode = removedNodes.find((n) => n.isEqualNode(addedNode));

					if (sameDeletedNode) {
						this.intersection?.watchAndTag(addedNode, 'mutation:re-mounted');
						return;
					}

					this.intersection?.watchAndTag(addedNode, ({ target, rect }) => {
						const wasDeleted = removedNodeRects.some((nr) => sameRectDimensions(nr, rect));
						if (wasDeleted) {
							return 'mutation:node-replacement';
						}

						return 'mutation:root-element';
					});
				});

				this.timeline.markEvent({
					type: 'DOMMutation:finished',
					startTime: performance.now(),
					data: {
						addedNodes: addedNodes.length,
						removedNodes: removedNodes.length,
					},
				});
			},
		});
		this.performance = createPerformanceObserver({
			onFirstPaint: (startTime: DOMHighResTimeStamp) => {
				this.timeline.markEvent({
					type: 'performance:first-paint',
					startTime,
					data: {},
				});
			},
			onFirstContentfulPaint: (startTime: DOMHighResTimeStamp) => {
				this.timeline.markEvent({
					type: 'performance:first-contentful-paint',
					startTime,
					data: {},
				});
			},

			onLongTask: ({ startTime, duration }) => {
				this.timeline.markEvent({
					type: 'performance:long-task',
					startTime,
					data: {
						duration,
					},
				});
			},

			onLayoutShift: ({ startTime, changedRects }) => {
				this.timeline.markEvent({
					type: 'performance:layout-shift',
					startTime,
					data: {
						changedRectsAmount: changedRects.length,
					},
				});

				changedRects.forEach(({ node, rect }) => {
					if (node instanceof HTMLElement) {
						this.intersection?.watchAndTag(node, ({ target, rect }) => {
							const lastElementRect = this.mapVisibleNodeRects.get(target);

							if (lastElementRect && sameRectSize(rect, lastElementRect)) {
								return 'layout-shift:element-moved';
							}

							return 'layout-shift';
						});
					}
				});
			},
		});
	}

	observe(target: HTMLElement) {
		this.mutations?.observe(target, {
			attributeOldValue: true,
			attributes: true,
			childList: true,
			subtree: true,
		});

		this.performance?.observe({ type: 'paint', buffered: true });
		this.performance?.observe({ type: 'largest-contentful-paint', buffered: true });

		this.performance?.observe({
			type: 'layout-shift',
			buffered: true,
			// @ts-ignore-error
			durationThreshold: 30,
		});

		this.performance?.observe({ type: 'longtask', buffered: true });
	}

	disconnect() {
		this.mutations?.disconnect();
		this.performance?.disconnect();
		this.intersection?.disconnect();
	}
}
