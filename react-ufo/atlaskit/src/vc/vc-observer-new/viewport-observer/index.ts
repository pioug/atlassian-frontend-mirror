import { isContainedWithinMediaWrapper } from '../../vc-observer/media-wrapper/vc-utils';
import isNonVisualStyleMutation from '../../vc-observer/observers/non-visual-styles/is-non-visual-style-mutation';
import { RLLPlaceholderHandlers } from '../../vc-observer/observers/rll-placeholders';
import { type VCObserverEntryType } from '../types';

import { createIntersectionObserver, type VCIntersectionObserver } from './intersection-observer';
import createMutationObserver from './mutation-observer';
import createPerformanceObserver from './performance-observer';
import { type MutationData } from './types';
import {
	checkThirdPartySegmentWithIgnoreReason,
	createMutationTypeWithIgnoredReason,
} from './utils/get-component-name-and-child-props';

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
		const isRLLPlaceholder = RLLPlaceholderHandlers.getInstance().isRLLPlaceholderHydration(rect);
		if (isRLLPlaceholder) {
			return 'mutation:rll-placeholder';
		}

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
	private onChange: ViewPortObserverConstructorArgs['onChange'];
	private isStarted: boolean;

	constructor({ onChange }: ViewPortObserverConstructorArgs) {
		this.mapVisibleNodeRects = new WeakMap();
		this.onChange = onChange;
		this.isStarted = false;
		this.intersectionObserver = null;
		this.mutationObserver = null;
		this.performanceObserver = null;
	}

	private handleIntersectionEntry = ({
		target,
		rect,
		time,
		type,
		mutationData,
	}: {
		target: HTMLElement | null;
		rect: DOMRectReadOnly;
		time: DOMHighResTimeStamp;
		type: VCObserverEntryType;
		mutationData?: MutationData | null;
	}) => {
		if (!target) {
			return;
		}

		const visible = isElementVisible(target);
		const lastElementRect = this.mapVisibleNodeRects.get(target);
		this.mapVisibleNodeRects.set(target, rect);

		this.onChange({
			time,
			type,
			elementRef: new WeakRef(target),
			visible,
			rect,
			previousRect: lastElementRect,
			mutationData,
		});
	};

	private handleChildListMutation = ({
		addedNodes,
		removedNodes,
	}: {
		addedNodes: readonly WeakRef<HTMLElement>[];
		removedNodes: readonly WeakRef<HTMLElement>[];
	}) => {
		const removedNodeRects = removedNodes.map((ref) => {
			const n = ref.deref();

			if (!n) {
				return;
			}

			return this.mapVisibleNodeRects.get(n);
		});

		addedNodes.forEach((addedNodeRef) => {
			const addedNode = addedNodeRef.deref();
			if (!addedNode) {
				return;
			}

			const sameDeletedNode = removedNodes.find((ref) => {
				const n = ref.deref();

				if (!n || !addedNode) {
					return false;
				}

				return n.isEqualNode(addedNode);
			});

			if (sameDeletedNode) {
				this.intersectionObserver?.watchAndTag(addedNode, 'mutation:remount');
				return;
			}

			if (isContainedWithinMediaWrapper(addedNode)) {
				this.intersectionObserver?.watchAndTag(addedNode, 'mutation:media');
				return;
			}

			const { isWithinThirdPartySegment, ignoredReason } =
				checkThirdPartySegmentWithIgnoreReason(addedNode);
			if (isWithinThirdPartySegment) {
				const assignedReason = createMutationTypeWithIgnoredReason(
					ignoredReason || 'third-party-element',
				);
				this.intersectionObserver?.watchAndTag(addedNode, assignedReason);
				return;
			}

			this.intersectionObserver?.watchAndTag(
				addedNode,
				createElementMutationsWatcher(removedNodeRects),
			);
		});
	};

	private handleAttributeMutation = ({
		target,
		attributeName,
		oldValue,
		newValue,
	}: {
		target: HTMLElement;
		attributeName: string;
		oldValue?: string | undefined | null;
		newValue?: string | undefined | null;
	}) => {
		this.intersectionObserver?.watchAndTag(target, ({ target, rect }) => {
			if (isContainedWithinMediaWrapper(target)) {
				return {
					type: 'mutation:media',
					mutationData: {
						attributeName,
						oldValue,
						newValue,
					},
				};
			}

			if (isNonVisualStyleMutation({ target, attributeName, type: 'attributes' })) {
				return {
					type: 'mutation:attribute:non-visual-style',
					mutationData: {
						attributeName,
						oldValue,
						newValue,
					},
				};
			}

			const isRLLPlaceholder = RLLPlaceholderHandlers.getInstance().isRLLPlaceholderHydration(rect);
			if (isRLLPlaceholder) {
				return {
					type: 'mutation:rll-placeholder',
					mutationData: {
						attributeName,
						oldValue,
						newValue,
					},
				};
			}

			const { isWithinThirdPartySegment, ignoredReason } =
				checkThirdPartySegmentWithIgnoreReason(target);
			if (isWithinThirdPartySegment) {
				const assignedReason = createMutationTypeWithIgnoredReason(
					ignoredReason || 'third-party-element',
				);
				return {
					type: assignedReason,
					mutationData: {
						attributeName,
						oldValue,
						newValue,
					},
				};
			}

			const lastElementRect = this.mapVisibleNodeRects.get(target);
			if (lastElementRect && sameRectSize(rect, lastElementRect)) {
				return {
					type: 'mutation:attribute:no-layout-shift',
					mutationData: {
						attributeName,
						oldValue,
						newValue,
					},
				};
			}

			return {
				type: 'mutation:attribute',
				mutationData: {
					attributeName,
					oldValue,
					newValue,
				},
			};
		});
	};

	private handleLayoutShift = ({
		time,
		changedRects,
	}: {
		time: DOMHighResTimeStamp;
		changedRects: Array<{
			node: HTMLElement;
			rect: DOMRectReadOnly;
			previousRect: DOMRectReadOnly;
		}>;
	}) => {
		for (const changedRect of changedRects) {
			const target = changedRect.node;

			if (target) {
				this.onChange({
					time,
					elementRef: new WeakRef(target),
					visible: true,
					rect: changedRect.rect,
					previousRect: changedRect.previousRect,
					type: 'layout-shift',
				});
			}
		}
	};

	private initializeObservers() {
		if (this.isStarted) {
			return;
		}

		this.intersectionObserver = createIntersectionObserver({
			onEntry: this.handleIntersectionEntry,
		});

		this.mutationObserver = createMutationObserver({
			onChildListMutation: this.handleChildListMutation,
			onAttributeMutation: this.handleAttributeMutation,
		});

		this.performanceObserver = createPerformanceObserver({
			onLayoutShift: this.handleLayoutShift,
		});
	}

	start() {
		if (this.isStarted) {
			return;
		}

		this.initializeObservers();

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

		this.isStarted = true;
	}

	stop() {
		if (!this.isStarted) {
			return;
		}

		this.mutationObserver?.disconnect();
		this.intersectionObserver?.disconnect();
		this.performanceObserver?.disconnect();
		this.isStarted = false;
	}
}
