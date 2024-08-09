import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { debouncedReplaceNodeviews } from './replace-node-views'; // Update this with the actual path
import type { NodeViewConstructor } from './types'; // Update this with the actual path

jest.mock('lodash/debounce', () => {
	// We neeed to import the real debounce
	// To make sure we are covering the race conditions
	const originalModule = jest.requireActual('lodash/debounce');
	return originalModule; // Bypass debounce by returning the original function
});

jest.mock('@atlaskit/editor-prosemirror/view', () => {
	return {
		EditorView: jest.fn().mockImplementation(() => {
			return;
		}),
	};
});

jest.mock('@atlaskit/editor-prosemirror/model', () => {
	return {
		__esModule: true,
		DOMSerializer: {
			renderSpec: jest.fn(),
		},
	};
});

describe('debouncedReplaceNodeviews', () => {
	let requestAnimationFrameMock: jest.SpyInstance;
	let fakeEditorView: EditorView;
	let cache: WeakMap<EditorView, Record<string, NodeViewConstructor>>;

	beforeEach(() => {
		jest.useFakeTimers({
			// We can not mock the Date
			// To make sure the debounce is working properly
			doNotFake: ['Date'],
		});

		requestAnimationFrameMock = jest.spyOn(window, 'requestAnimationFrame');

		fakeEditorView = {
			props: {
				nodeViews: {},
			},
			setProps: jest.fn(),
		} as unknown as EditorView;
		cache = new WeakMap();
	});

	afterEach(() => {
		jest.restoreAllMocks();
		jest.useRealTimers();
	});

	it('should not do anything if no loaded node views are found', () => {
		debouncedReplaceNodeviews(cache, fakeEditorView);
		jest.runAllTimers();

		expect(fakeEditorView.setProps).not.toHaveBeenCalled();
	});

	it('should replace node views with loaded node views', () => {
		const mockNodeViewConstructor: NodeViewConstructor = jest.fn();
		cache.set(fakeEditorView, {
			mockNode: mockNodeViewConstructor,
		});

		debouncedReplaceNodeviews(cache, fakeEditorView);
		jest.runAllTimers();

		expect(requestAnimationFrameMock).toHaveBeenCalled();
		expect(fakeEditorView.setProps).toHaveBeenCalledWith({
			nodeViews: {
				mockNode: mockNodeViewConstructor,
			},
		});
	});

	it('should clean the cache', () => {
		const mockNodeViewConstructor: NodeViewConstructor = jest.fn();
		cache.set(fakeEditorView, {
			mockNode: mockNodeViewConstructor,
		});

		debouncedReplaceNodeviews(cache, fakeEditorView);
		jest.runAllTimers();

		expect(cache.get(fakeEditorView)).toEqual({});
	});

	it('should not clean the cache any other EditorView instance', () => {
		const mockNodeViewConstructor: NodeViewConstructor = jest.fn();
		cache.set(fakeEditorView, {
			mockNode: mockNodeViewConstructor,
		});

		const secondFakeView = {
			props: {
				nodeViews: {},
			},
			setProps: jest.fn(),
		} as unknown as EditorView;
		const secondResult = {
			mockNode: mockNodeViewConstructor,
		};
		cache.set(secondFakeView, secondResult);

		debouncedReplaceNodeviews(cache, fakeEditorView);
		jest.runAllTimers();

		expect(cache.get(fakeEditorView)).toEqual({});
		expect(cache.get(secondFakeView)).toEqual(secondResult);
	});

	describe('when calleddebouncedReplaceNodeviews is called multiple times with the same EditorView', () => {
		beforeEach(() => {
			cache.set(fakeEditorView, {
				mockNode: jest.fn(),
			});
		});

		it('should call the animation frame only once', () => {
			debouncedReplaceNodeviews(cache, fakeEditorView);
			debouncedReplaceNodeviews(cache, fakeEditorView);
			debouncedReplaceNodeviews(cache, fakeEditorView);
			jest.runAllTimers();

			expect(requestAnimationFrameMock).toHaveBeenCalledTimes(1);
		});

		it('should call the view.setProps only once', () => {
			debouncedReplaceNodeviews(cache, fakeEditorView);
			debouncedReplaceNodeviews(cache, fakeEditorView);
			debouncedReplaceNodeviews(cache, fakeEditorView);
			jest.runAllTimers();

			expect(fakeEditorView.setProps).toHaveBeenCalledTimes(1);
		});
	});

	describe('when debouncedReplaceNodeviews is called multiple times with distinct EditorViews', () => {
		let fakeEditorView2: EditorView;
		let mockNodeViewConstructor: NodeViewConstructor;
		let mockNodeViewConstructor2: NodeViewConstructor;

		beforeEach(() => {
			mockNodeViewConstructor = jest.fn();
			mockNodeViewConstructor2 = jest.fn();

			fakeEditorView2 = {
				props: {
					nodeViews: {},
				},
				setProps: jest.fn(),
			} as unknown as EditorView;

			cache.set(fakeEditorView, {
				mockNode: mockNodeViewConstructor,
			});

			cache.set(fakeEditorView2, {
				mockNode: mockNodeViewConstructor2,
			});
		});

		it('should call the animation frame twice', () => {
			debouncedReplaceNodeviews(cache, fakeEditorView);
			debouncedReplaceNodeviews(cache, fakeEditorView);
			debouncedReplaceNodeviews(cache, fakeEditorView);

			debouncedReplaceNodeviews(cache, fakeEditorView2);
			jest.runAllTimers();

			expect(requestAnimationFrameMock).toHaveBeenCalledTimes(2);
		});

		it('should call view.setProps for both EditorViews', () => {
			debouncedReplaceNodeviews(cache, fakeEditorView);
			debouncedReplaceNodeviews(cache, fakeEditorView);
			debouncedReplaceNodeviews(cache, fakeEditorView);

			debouncedReplaceNodeviews(cache, fakeEditorView2);

			jest.runAllTimers();

			expect(fakeEditorView.setProps).toHaveBeenCalledTimes(1);
			expect(fakeEditorView.setProps).toHaveBeenCalledWith({
				nodeViews: {
					mockNode: mockNodeViewConstructor,
				},
			});
			expect(fakeEditorView2.setProps).toHaveBeenCalledTimes(1);
			expect(fakeEditorView2.setProps).toHaveBeenCalledWith({
				nodeViews: {
					mockNode: mockNodeViewConstructor2,
				},
			});
		});
	});
});
