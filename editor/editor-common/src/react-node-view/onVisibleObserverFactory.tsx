import memoize from 'lodash/memoize';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

type RemoveObserver = () => unknown;
type OnVisibleCallback = () => unknown;
type OnVisibleObserver = {
	observe: (el: HTMLElement, callback: OnVisibleCallback) => RemoveObserver;
};

// Use this selector to set the intersection observer boundary for editor's inline node views
// If this does not exist, it will use the IntersectionObserver's default root
const INTERSECTION_OBSERVER_ROOT_SELECTOR = '[data-editor-scroll-container="true"]';
const INTERSECTION_OBSERVER_OPTIONS: IntersectionObserverInit = {
	rootMargin: '0px 0px 100px 0px',
	threshold: 0,
};

// Parameterized singleton
export const getOrCreateOnVisibleObserver = memoize((view: EditorView): OnVisibleObserver => {
	const intersectionObserverOptions: IntersectionObserverInit = {
		root: view.dom.closest(INTERSECTION_OBSERVER_ROOT_SELECTOR),
		...INTERSECTION_OBSERVER_OPTIONS,
	};

	const callbackMap = new WeakMap<Element, OnVisibleCallback>();

	const observer = new IntersectionObserver((entries) => {
		entries
			.filter((entry) => entry.isIntersecting) // Only process visible entries
			.map((entry) => callbackMap.get(entry.target))
			// Invoke callbacks together to group browser rendering
			// Avoiding requestAnimationFrame to reduce visual flickering
			.forEach((cb) => cb?.());
	}, intersectionObserverOptions);

	return {
		observe: (el: HTMLElement, callback: OnVisibleCallback) => {
			callbackMap.set(el, callback);
			observer.observe(el);

			return () => observer.unobserve(el);
		},
	};
});
