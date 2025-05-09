import { isContainedWithinMediaWrapper } from '../../vc-observer/media-wrapper/vc-utils';
import isNonVisualStyleMutation from '../../vc-observer/observers/non-visual-styles/is-non-visual-style-mutation';
import { type VCObserverEntryType } from '../types';

import { createIntersectionObserver, type VCIntersectionObserver } from './intersection-observer';
import createMutationObserver from './mutation-observer';
import createPerformanceObserver from './performance-observer';
import { type MutationData } from './types';

function isElementVisible(element: Element) {
	if (!(element instanceof HTMLElement)) {
		return true;
	}

	try {
		const visible = element.checkVisibility({
			// @ts-expect-error
			visibilityProperty: true,
			contentVisibilityAuto: true,
			opacityProperty: true,
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

export type ViewPortObserverConstructorArgs = {
	onChange(onChangeArgs: {
		readonly time: DOMHighResTimeStamp;
		readonly type: VCObserverEntryType;
		readonly elementRef: WeakRef<HTMLElement>;
		readonly visible: boolean;
		readonly rect: DOMRectReadOnly;
		readonly previousRect: DOMRectReadOnly | undefined;
		readonly mutationData?: MutationData | undefined | null;
	}): void;
};

const createElementMutationsWatcher =
	(removedNodeRects: (DOMRect | undefined)[]) =>
	({ rect }: { rect: DOMRectReadOnly }) => {
		const wasDeleted = removedNodeRects.some((nr) => sameRectDimensions(nr, rect));
		if (wasDeleted) {
			return 'mutation:element-replacement';
		}

		return 'mutation:element';
	};

export default class ViewportObserver {
	private intersectionObserver: VCIntersectionObserver | null;
	private mutationObserver: MutationObserver | null;
	private performanceObserver: PerformanceObserver | null;
	private mapVisibleNodeRects: WeakMap<Element, DOMRect>;

	constructor({ onChange: onChange }: ViewPortObserverConstructorArgs) {
		this.mapVisibleNodeRects = new WeakMap();
		this.intersectionObserver = createIntersectionObserver({
			onEntry: ({ target, rect, time, type, mutationData }) => {
				if (!target) {
					return;
				}

				const visible = isElementVisible(target);

				const lastElementRect = this.mapVisibleNodeRects.get(target);

				this.mapVisibleNodeRects.set(target, rect);

				onChange({
					time,
					type,
					elementRef: new WeakRef(target),
					visible,
					rect,
					previousRect: lastElementRect,
					mutationData,
				});
			},
		});

		this.mutationObserver = createMutationObserver({
			onChildListMutation: ({ addedNodes, removedNodes }) => {
				const removedNodeRects = removedNodes?.map((n) => this.mapVisibleNodeRects.get(n)) ?? [];

				addedNodes.forEach((addedNode) => {
					// for (const elem of addedNode.querySelectorAll('*')) {
					// 	this.intersectionObserver?.watchAndTag(elem, 'mutation:child-element');
					// }

					const sameDeletedNode = removedNodes.find((n) => n.isEqualNode(addedNode));

					if (sameDeletedNode) {
						this.intersectionObserver?.watchAndTag(addedNode, 'mutation:remount');
						return;
					}

					if (isContainedWithinMediaWrapper(addedNode)) {
						this.intersectionObserver?.watchAndTag(addedNode, 'mutation:media');
						return;
					}

					this.intersectionObserver?.watchAndTag(
						addedNode,
						createElementMutationsWatcher(removedNodeRects),
					);
				});
			},
			onAttributeMutation: ({ target, attributeName }) => {
				this.intersectionObserver?.watchAndTag(target, ({ target, rect }) => {
					if (isContainedWithinMediaWrapper(target)) {
						return {
							type: 'mutation:media',
							mutationData: {
								attributeName,
							},
						};
					}

					if (isNonVisualStyleMutation({ target, attributeName, type: 'attributes' })) {
						return {
							type: 'mutation:attribute:non-visual-style',
							mutationData: {
								attributeName,
							},
						};
					}

					const lastElementRect = this.mapVisibleNodeRects.get(target);
					if (lastElementRect && sameRectSize(rect, lastElementRect)) {
						return {
							type: 'mutation:attribute:no-layout-shift',
							mutationData: {
								attributeName,
							},
						};
					}

					return {
						type: 'mutation:attribute',
						mutationData: {
							attributeName,
						},
					};
				});
			},
		});

		this.performanceObserver = createPerformanceObserver({
			onLayoutShift: ({ time, changedRects }) => {
				for (const changedRect of changedRects) {
					const target = changedRect.node;

					if (target) {
						onChange({
							time,
							elementRef: new WeakRef(target),
							visible: true,
							rect: changedRect.rect,
							previousRect: changedRect.previousRect,
							type: 'layout-shift',
						});
					}
				}
			},
		});
	}

	start() {
		this.mutationObserver?.observe(document.body, {
			attributeOldValue: true,
			attributes: true,
			childList: true,
			subtree: true,
		});
		this.performanceObserver?.observe({
			type: 'layout-shift',
			buffered: true,
			// @ts-ignore-error
			durationThreshold: 30,
		});
	}

	stop() {
		this.mutationObserver?.disconnect();
		this.intersectionObserver?.disconnect();
		this.performanceObserver?.disconnect();
	}
}
