import { type EditorView } from '@atlaskit/editor-prosemirror/view';

import { getOrCreateOnVisibleObserver } from './onVisibleObserverFactory';

class MockIntersectionObserver {
	constructor(private callback: (entries: IntersectionObserverEntry[]) => void) {}
	observe = jest.fn();
	unobserve = jest.fn();
	disconnect = jest.fn();
	trigger(entries: IntersectionObserverEntry[]) {
		this.callback(entries);
	}
}

describe('onVisibleObserverFactory', () => {
	let observer: ReturnType<typeof getOrCreateOnVisibleObserver>;
	let mockIntersectionObserver: MockIntersectionObserver;

	beforeEach(() => {
		// This stub is only used to parameterize the singleton
		const view = { dom: document.createElement('div') } as unknown as EditorView;
		mockIntersectionObserver = new MockIntersectionObserver(jest.fn());
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).IntersectionObserver = jest.fn((callback) => {
			mockIntersectionObserver = new MockIntersectionObserver(callback);
			return mockIntersectionObserver;
		});
		observer = getOrCreateOnVisibleObserver(view);
	});

	it('should unobserve an element', () => {
		const element = document.createElement('div');
		const callback = jest.fn();

		const removeObserver = observer.observe(element, callback);
		removeObserver();

		// Ensure the element is unobserved
		expect(mockIntersectionObserver.unobserve).toHaveBeenCalledWith(element);
	});

	it('should trigger multiple callbacks for multiple elements', () => {
		const element1 = document.createElement('div');
		const callback1 = jest.fn();
		const element2 = document.createElement('div');
		const callback2 = jest.fn();
		const element3 = document.createElement('div');
		const callback3 = jest.fn();

		observer.observe(element1, callback1);
		observer.observe(element2, callback2);
		observer.observe(element3, callback3);

		// Simulate intersection observer callback
		const entries = [
			{ target: element1, isIntersecting: true } as unknown as IntersectionObserverEntry,
			{ target: element2, isIntersecting: true } as unknown as IntersectionObserverEntry,
			{ target: element3, isIntersecting: false } as unknown as IntersectionObserverEntry,
		];
		mockIntersectionObserver.trigger(entries);

		expect(callback1).toHaveBeenCalled();
		expect(callback2).toHaveBeenCalled();
		expect(callback3).not.toHaveBeenCalled();
	});
});
