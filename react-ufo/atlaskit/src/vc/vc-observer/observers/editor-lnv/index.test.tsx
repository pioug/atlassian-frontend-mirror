import {
	createMockIntersectionObserver,
	createPlaceholderElement,
	createReplaceElement,
	handleElements,
	type MockIntersectionObserverCallback,
	type MockIntersectionObserverCallbackRef,
} from './test-utils';

import { EditorLnvHandler } from './index';

describe('EditorLnvHandler', () => {
	let handler: EditorLnvHandler;
	let observerCallback: MockIntersectionObserverCallback;
	let originalIntersectionObserver: typeof IntersectionObserver;

	beforeEach(() => {
		const cbRef: MockIntersectionObserverCallbackRef = { current: null };
		// Mocking a subset of IntersectionObserver API
		originalIntersectionObserver = window.IntersectionObserver;
		window.IntersectionObserver = createMockIntersectionObserver(cbRef) as any;

		handler = new EditorLnvHandler();

		if (!cbRef.current) {
			throw new Error('Callback not registered');
		}
		observerCallback = cbRef.current;
	});

	afterEach(() => {
		window.IntersectionObserver = originalIntersectionObserver;
	});

	describe('when going through happy path', () => {
		const boundingClientRect = { x: 0, y: 0, width: 1, height: 1 };
		const placeholderId = 'placeholder1';

		test('should not ignore new placeholder', (done) => {
			handleElements(
				[{ element: createPlaceholderElement(placeholderId), rect: boundingClientRect }],
				handler,
				observerCallback,
				(result) => {
					expect(result.shouldIgnore).toBe(false);
					done();
				},
			);
		});

		test('should ignore placeholder -> replace with same size', (done) => {
			handleElements(
				[
					{ element: createPlaceholderElement(placeholderId), rect: boundingClientRect },
					{ element: createReplaceElement(placeholderId), rect: boundingClientRect },
				],
				handler,
				observerCallback,
				(result) => {
					expect(result.shouldIgnore).toBe(true);
					done();
				},
			);
		});

		test('should ignore placeholder -> placeholder with same size', (done) => {
			handleElements(
				[
					{ element: createPlaceholderElement(placeholderId), rect: boundingClientRect },
					{ element: createPlaceholderElement(placeholderId), rect: boundingClientRect },
				],
				handler,
				observerCallback,
				(result) => {
					expect(result.shouldIgnore).toBe(true);
					done();
				},
			);
		});
	});

	describe('when handling mismatches', () => {
		test('should not ignore new replace', (done) => {
			handleElements(
				[
					{
						element: createReplaceElement('p1'),
						rect: { x: 0, y: 0, width: 1, height: 1 },
					},
				],
				handler,
				observerCallback,
				(result) => {
					expect(result.shouldIgnore).toBe(false);
					done();
				},
			);
		});

		test('should not ignore placeholder -> placeholder with different sizes', (done) => {
			const placeholderId = 'placeholder1';

			const placeholderRect = { x: 0, y: 0, width: 1, height: 1 };
			const secondPlaceholderRect = { x: 0, y: 0, width: 1, height: 3 };

			handleElements(
				[
					{ element: createPlaceholderElement(placeholderId), rect: placeholderRect },
					{ element: createPlaceholderElement(placeholderId), rect: secondPlaceholderRect },
				],
				handler,
				observerCallback,
				(result) => {
					expect(result.shouldIgnore).toBe(false);
					done();
				},
			);
		});

		test('should not ignore placeholder -> replace with different sizes', (done) => {
			const placeholderId = 'placeholder1';

			const placeholderRect = { x: 0, y: 0, width: 1, height: 1 };
			const replaceRect = { x: 0, y: 0, width: 1, height: 3 };

			handleElements(
				[
					{ element: createPlaceholderElement(placeholderId), rect: placeholderRect },
					{ element: createReplaceElement(placeholderId), rect: replaceRect },
				],
				handler,
				observerCallback,
				(result) => {
					expect(result.shouldIgnore).toBe(false);
					done();
				},
			);
		});

		test('should not ignore placeholder -> replace with different ids', (done) => {
			const boundingClientRect = { x: 0, y: 0, width: 1, height: 1 };

			handleElements(
				[
					{ element: createPlaceholderElement('p1'), rect: boundingClientRect },
					{ element: createReplaceElement('p2'), rect: boundingClientRect },
				],
				handler,
				observerCallback,
				(result) => {
					expect(result.shouldIgnore).toBe(false);
					done();
				},
			);
		});
	});
});
