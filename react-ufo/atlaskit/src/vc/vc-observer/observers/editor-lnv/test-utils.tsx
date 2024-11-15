import type { EditorLnvHandler } from './index';

type MockIntersectionObserverEntry = {
	target: HTMLElement;
	boundingClientRect: { x: number; y: number; width: number; height: number };
};

export type MockIntersectionObserverCallback = (entries: MockIntersectionObserverEntry[]) => void;

export type MockIntersectionObserverCallbackRef = {
	current: MockIntersectionObserverCallback | null;
};

export function createPlaceholderElement(id: string) {
	const el = document.createElement('div');
	el.dataset.editorLnvPlaceholder = id;
	return el;
}

export function createReplaceElement(id: string) {
	const el = document.createElement('div');
	el.dataset.editorLnvPlaceholderReplace = id;
	return el;
}

export function handleElements(
	elements: {
		element: HTMLElement;
		rect: { x: number; y: number; width: number; height: number };
	}[],
	handler: EditorLnvHandler,
	observerCallback: MockIntersectionObserverCallback,
	callback: (result: { shouldIgnore: boolean }) => void,
) {
	const [first, ...rest] = elements;

	handler.handleAddedNode(first.element).then((result) => {
		if (!rest.length) {
			// Recursion terminating condition
			callback(result);
		} else {
			// Recursively handle the rest of the elements
			handleElements(rest, handler, observerCallback, callback);
		}
	});

	observerCallback([{ target: first.element, boundingClientRect: first.rect }]);
}

export function createMockIntersectionObserver(cbRef: MockIntersectionObserverCallbackRef) {
	return class {
		constructor(fn: MockIntersectionObserverCallback) {
			cbRef.current = (entries) =>
				fn(
					entries.map((entry) => {
						return {
							...entry,
							intersectionRatio: 1,
						};
					}),
				);
		}

		observe() {}
		unobserve() {}
		disconnect() {}
	};
}
