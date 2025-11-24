import { fg } from '@atlaskit/platform-feature-flags';

import type { VCObserverEntryType } from '../../types';
import type { MutationData } from '../types';
import { isZeroDimensionRectangle } from '../utils/is-zero-dimension-rectangle';

type TagCallback = (props: { target: HTMLElement; rect: DOMRectReadOnly }) =>
	| VCObserverEntryType
	| undefined
	| null
	| {
			type: VCObserverEntryType;
			mutationData: MutationData;
	  };

type ObserveArg_TagOrCallback = VCObserverEntryType | TagCallback;

export interface VCIntersectionObserver {
	disconnect(): void;
	unobserve(target: Element): void;
	watchAndTag: (target: Element, tagOrCallback: ObserveArg_TagOrCallback) => void;
}

function isValidEntry(entry: IntersectionObserverEntry) {
	return (
		entry.isIntersecting && entry.intersectionRect.width > 0 && entry.intersectionRect.height > 0
	);
}

export type IntersectionObserverArgs = {
	onEntry: (entry: {
		time: DOMHighResTimeStamp;
		type: VCObserverEntryType;
		target: HTMLElement;
		rect: DOMRectReadOnly;
		mutationData: MutationData | null | undefined;
	}) => void;
	onObserved?: (props: {
		time: DOMHighResTimeStamp;
		elements: ReadonlyArray<WeakRef<HTMLElement>>;
	}) => void;
};

export function createIntersectionObserver({
	onEntry,
	onObserved,
}: IntersectionObserverArgs): VCIntersectionObserver | null {
	if (!window || typeof window.IntersectionObserver !== 'function') {
		return null;
	}

	const callbacksPerElement = new WeakMap<Element, ObserveArg_TagOrCallback>();

	const intersectionObserverCallback: IntersectionObserverCallback = (entries) => {
		const validEntries: Array<WeakRef<HTMLElement>> = [];
		const startTime = performance.now();

		entries.forEach((entry) => {
			if (!(entry.target instanceof HTMLElement)) {
				return;
			}

			const tagOrCallback = callbacksPerElement.get(entry.target);

			if (fg('platform_ufo_detect_zero_dimension_rectangles')) {
				if (isZeroDimensionRectangle(entry.intersectionRect)) {
					const zeroDimensionRectangleTagCallback: TagCallback = (props: {
						target: HTMLElement;
						rect: DOMRectReadOnly;
					}) => {
						const tagOrCallbackResult =
							typeof tagOrCallback === 'function' ? tagOrCallback(props) : tagOrCallback;

						// override as display-contents mutation
						if (tagOrCallbackResult === 'mutation:element') {
							return 'mutation:display-contents-children-element';
						}

						// override as display-contents mutation
						if (
							tagOrCallbackResult &&
							typeof tagOrCallbackResult !== 'string' &&
							tagOrCallbackResult.type === 'mutation:attribute'
						) {
							return {
								type: 'mutation:display-contents-children-attribute',
								mutationData: tagOrCallbackResult.mutationData,
							};
						}

						return tagOrCallbackResult;
					};

					for (const child of entry.target.children) {
						observer.observe(child);
						callbacksPerElement.set(child, zeroDimensionRectangleTagCallback);
					}

					return;
				}
			}

			if (!isValidEntry(entry)) {
				return;
			}

			let mutationTag: VCObserverEntryType | undefined | null = null;
			let mutationData: MutationData | undefined | null = null;

			if (typeof tagOrCallback === 'function') {
				const tagOrCallbackResult = tagOrCallback({
					target: entry.target,
					rect: entry.intersectionRect,
				});
				if (!tagOrCallbackResult) {
					mutationTag = 'unknown';
				} else if (typeof tagOrCallbackResult === 'string') {
					mutationTag = tagOrCallbackResult;
				} else {
					mutationTag = tagOrCallbackResult.type;
					mutationData = tagOrCallbackResult.mutationData;
				}
			} else if (typeof tagOrCallback === 'string') {
				mutationTag = tagOrCallback;
			}

			onEntry({
				target: entry.target,
				rect: entry.intersectionRect,
				time: entry.time,
				type: mutationTag ?? 'unknown',
				mutationData,
			});
			validEntries.push(new WeakRef(entry.target));

			callbacksPerElement.delete(entry.target);
			observer.unobserve(entry.target);
		});

		onObserved?.({
			time: startTime,
			elements: validEntries,
		});
	};

	const observer = new IntersectionObserver(intersectionObserverCallback);

	return {
		disconnect: () => {
			observer.disconnect();
		},
		unobserve: (target: Element) => {
			observer.unobserve(target);
		},
		watchAndTag: (target: Element, tagOrCallback: ObserveArg_TagOrCallback) => {
			callbacksPerElement.set(target, tagOrCallback);
			observer.observe(target);
		},
	};
}
