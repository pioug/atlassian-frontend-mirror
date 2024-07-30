import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { debouncedReplaceNodeviews } from './replace-node-views'; // Update this with the actual path
import type { NodeViewConstructor } from './types'; // Update this with the actual path

jest.mock('lodash/debounce', () => {
	return jest.fn((fn) => fn); // Bypass debounce by returning the original function
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
		requestAnimationFrameMock = jest
			.spyOn(window, 'requestAnimationFrame')
			.mockImplementation((cb: (time: DOMHighResTimeStamp) => void) => {
				cb(1);
				return 1;
			});
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
	});

	it('should not do anything if no loaded node views are found', () => {
		debouncedReplaceNodeviews(cache, fakeEditorView);

		expect(fakeEditorView.setProps).not.toHaveBeenCalled();
	});

	it('should replace node views with loaded node views', () => {
		const mockNodeViewConstructor: NodeViewConstructor = jest.fn();
		cache.set(fakeEditorView, {
			mockNode: mockNodeViewConstructor,
		});

		debouncedReplaceNodeviews(cache, fakeEditorView);

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

		expect(cache.get(fakeEditorView)).toEqual({});
		expect(cache.get(secondFakeView)).toEqual(secondResult);
	});
});
