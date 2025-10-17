import { isContainedWithinMediaWrapper } from '../../vc-observer/media-wrapper/vc-utils';
import isDnDStyleMutation from '../../vc-observer/observers/non-visual-styles/is-dnd-style-mutation';
import isNonVisualStyleMutation from '../../vc-observer/observers/non-visual-styles/is-non-visual-style-mutation';
import { RLLPlaceholderHandlers } from '../../vc-observer/observers/rll-placeholders';
import { type VCObserverEntryType } from '../types';

import { createIntersectionObserver, type VCIntersectionObserver } from './intersection-observer';
import createMutationObserver from './mutation-observer';
import createPerformanceObserver from './performance-observer';
import { type MutationData } from './types';
import checkWithinComponent, { cleanupCaches } from './utils/check-within-component';
import { getMutatedElements } from './utils/get-mutated-elements';
import { isElementVisible } from './utils/is-element-visible';
import isInVCIgnoreIfNoLayoutShiftMarker from './utils/is-in-vc-ignore-if-no-layout-shift-marker';
import { isSameRectDimensions } from './utils/is-same-rect-dimensions';
import { isSameRectSize } from './utils/is-same-rect-size';

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
	getSSRState?: () => any;
	getSSRPlaceholderHandler?: () => any;
};

const createElementMutationsWatcher =
	(removedNodeRects: (DOMRect | undefined)[]) =>
	({ target, rect }: { rect: DOMRectReadOnly; target: HTMLElement }) => {
		const isInIgnoreLsMarker = isInVCIgnoreIfNoLayoutShiftMarker(target);

		if (!isInIgnoreLsMarker) {
			return 'mutation:element';
		}

		const isRLLPlaceholder = RLLPlaceholderHandlers.getInstance().isRLLPlaceholderHydration(rect);
		if (isRLLPlaceholder && isInIgnoreLsMarker) {
			return 'mutation:rll-placeholder';
		}

		const wasDeleted = removedNodeRects.some((nr) => isSameRectDimensions(nr, rect));

		if (wasDeleted && isInIgnoreLsMarker) {
			return 'mutation:element-replacement';
		}

		return 'mutation:element';
	};

export default class ViewportObserver {
	private intersectionObserver: VCIntersectionObserver | null;
	private mutationObserver: MutationObserver | null;
	private performanceObserver: PerformanceObserver | null;
	private mapVisibleNodeRects: WeakMap<Element, DOMRect>;
	private mapIs3pResult: WeakMap<HTMLElement, boolean>;
	private onChange: ViewPortObserverConstructorArgs['onChange'];
	private isStarted: boolean;

	// SSR context functions
	private getSSRState?: () => any;
	private getSSRPlaceholderHandler?: () => any;

	constructor({
		onChange,
		getSSRState,
		getSSRPlaceholderHandler,
	}: ViewPortObserverConstructorArgs) {
		this.mapVisibleNodeRects = new WeakMap();
		this.mapIs3pResult = new WeakMap();
		this.onChange = onChange;
		this.isStarted = false;
		this.intersectionObserver = null;
		this.mutationObserver = null;
		this.performanceObserver = null;

		// Initialize SSR context functions
		this.getSSRState = getSSRState;
		this.getSSRPlaceholderHandler = getSSRPlaceholderHandler;
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

	private handleChildListMutation = async ({
		target,
		addedNodes,
		removedNodes,
		timestamp,
	}: {
		target: WeakRef<HTMLElement>;
		addedNodes: readonly WeakRef<HTMLElement>[];
		removedNodes: readonly WeakRef<HTMLElement>[];
		timestamp: DOMHighResTimeStamp;
	}) => {
		const removedNodeRects = removedNodes.map((ref) => {
			const n = ref.deref();

			if (!n) {
				return;
			}

			return this.mapVisibleNodeRects.get(n);
		});

		const targetNode = target.deref();

		for (const addedNodeRef of addedNodes) {
			const addedNode = addedNodeRef.deref();
			if (!addedNode) {
				continue;
			}

			// SSR hydration logic
			if (this.getSSRState) {
				const ssrState = this.getSSRState();
				const SSRStateEnum = { normal: 1, waitingForFirstRender: 2, ignoring: 3 };

				if (
					ssrState.state === SSRStateEnum.waitingForFirstRender &&
					timestamp > ssrState.renderStart &&
					targetNode === ssrState.reactRootElement
				) {
					ssrState.state = SSRStateEnum.ignoring;
					if (ssrState.renderStop === -1) {
						// arbitrary 500ms DOM update window
						ssrState.renderStop = timestamp + 500;
					}
					this.intersectionObserver?.watchAndTag(addedNode, 'ssr-hydration');
					continue;
				}

				if (
					ssrState.state === SSRStateEnum.ignoring &&
					timestamp > ssrState.renderStart &&
					targetNode === ssrState.reactRootElement
				) {
					if (timestamp <= ssrState.renderStop) {
						this.intersectionObserver?.watchAndTag(addedNode, 'ssr-hydration');
						continue;
					} else {
						ssrState.state = SSRStateEnum.normal;
					}
				}
			}

			// SSR placeholder logic - check and handle with await
			if (this.getSSRPlaceholderHandler) {
				const ssrPlaceholderHandler = this.getSSRPlaceholderHandler();
				if (ssrPlaceholderHandler) {
					if (
						ssrPlaceholderHandler.isPlaceholder(addedNode) ||
						ssrPlaceholderHandler.isPlaceholderIgnored(addedNode)
					) {
						if (ssrPlaceholderHandler.checkIfExistedAndSizeMatchingV3(addedNode)) {
							this.intersectionObserver?.watchAndTag(addedNode, 'mutation:ssr-placeholder');
							continue;
						}
						// If result is false, continue to normal mutation logic below
					}

					if (
						ssrPlaceholderHandler.isPlaceholderReplacement(addedNode) ||
						ssrPlaceholderHandler.isPlaceholderIgnored(addedNode)
					) {
						const result =
							await ssrPlaceholderHandler.validateReactComponentMatchToPlaceholder(addedNode);
						if (result !== false) {
							this.intersectionObserver?.watchAndTag(addedNode, 'mutation:ssr-placeholder');
							continue;
						}
						// If result is false, continue to normal mutation logic below
					}
				}
			}

			const sameDeletedNode = removedNodes.find((ref) => {
				const n = ref.deref();
				if (!n || !addedNode) {
					return false;
				}
				return n.isEqualNode(addedNode);
			});

			const isInIgnoreLsMarker = isInVCIgnoreIfNoLayoutShiftMarker(addedNode);

			if (sameDeletedNode && isInIgnoreLsMarker) {
				this.intersectionObserver?.watchAndTag(addedNode, 'mutation:remount');
				continue;
			}

			if (isContainedWithinMediaWrapper(addedNode)) {
				this.intersectionObserver?.watchAndTag(addedNode, 'mutation:media');
				continue;
			}

			const { isWithin: isWithinThirdPartySegment } = checkWithinComponent(
				addedNode,
				'UFOThirdPartySegment',
				this.mapIs3pResult,
			);
			if (isWithinThirdPartySegment) {
				this.intersectionObserver?.watchAndTag(addedNode, 'mutation:third-party-element');
				continue;
			}

			for (const { isDisplayContentsElementChildren, element } of getMutatedElements(addedNode)) {
				if (isDisplayContentsElementChildren) {
					this.intersectionObserver?.watchAndTag(
						element,
						'mutation:display-contents-children-element',
					);
				} else {
					this.intersectionObserver?.watchAndTag(
						element,
						createElementMutationsWatcher(removedNodeRects),
					);
				}
			}
		}
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

			if (isDnDStyleMutation({ target, attributeName, oldValue, newValue })) {
				return {
					type: 'mutation:attribute:non-visual-style',
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

			const lastElementRect = this.mapVisibleNodeRects.get(target);
			if (lastElementRect && isSameRectSize(rect, lastElementRect)) {
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
				const isSameCurrentAndPreviousRects = isSameRectDimensions(
					changedRect.rect,
					changedRect.previousRect,
				);
				this.onChange({
					time,
					elementRef: new WeakRef(target),
					visible: true,
					rect: changedRect.rect,
					previousRect: changedRect.previousRect,
					type: isSameCurrentAndPreviousRects ? 'layout-shift:same-rect' : 'layout-shift',
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
			// @ts-ignore -error
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
		// Clean up caches when stopping
		cleanupCaches(this.mapIs3pResult);
	}
}
