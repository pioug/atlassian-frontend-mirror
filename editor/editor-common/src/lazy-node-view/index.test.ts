import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { DecorationSource, EditorView } from '@atlaskit/editor-prosemirror/view';

import { debouncedReplaceNodeviews, withLazyLoading } from './index'; // Update this with the actual path
import type { NodeViewConstructor } from './index'; // Update this with the actual path

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

		expect(cache.get(fakeEditorView)).toBeUndefined();
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

		expect(cache.get(fakeEditorView)).toBeUndefined();
		expect(cache.get(secondFakeView)).toEqual(secondResult);
	});
});

describe('withLazyLoading', () => {
	let loadMock: jest.Mock;
	let getNodeViewOptionsMock: jest.Mock;
	let dispatchAnalyticsEventMock: jest.Mock | undefined;

	beforeEach(() => {
		loadMock = jest.fn().mockResolvedValue(() => {
			return {
				dom: document.createElement('div'),
			};
		});

		getNodeViewOptionsMock = jest.fn().mockReturnValue({});
		dispatchAnalyticsEventMock = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return a NodeView constructor', () => {
		const nodeViewConstructor = withLazyLoading({
			nodeName: 'mockNode',
			loader: loadMock,
			getNodeViewOptions: getNodeViewOptionsMock,
			dispatchAnalyticsEvent: dispatchAnalyticsEventMock,
		});

		expect(typeof nodeViewConstructor).toBe('function');
	});

	it('should use LazyNodeView initially', () => {
		(DOMSerializer.renderSpec as unknown as jest.Mock).mockReturnValue({
			dom: document.createElement('div'),
			contentDOM: document.createElement('div'),
		});

		const nodeViewConstructor = withLazyLoading({
			nodeName: 'mockNode',
			loader: loadMock,
			getNodeViewOptions: getNodeViewOptionsMock,
			dispatchAnalyticsEvent: dispatchAnalyticsEventMock,
		});

		const node = {
			type: {
				name: 'mockNode',
				spec: {
					toDOM: jest.fn(),
				},
			},
		} as unknown as PMNode;

		const view: EditorView = jest.fn() as unknown as EditorView;
		const getPos = jest.fn();

		const nodeView = nodeViewConstructor(
			node,
			view,
			getPos,
			[],
			jest.fn() as unknown as DecorationSource,
		);

		expect(nodeView).toHaveProperty('dom');
		expect(nodeView.dom).toBeInstanceOf(HTMLElement);
		// @ts-expect-error Type already checked above
		expect(nodeView.dom.getAttribute('data-lazy-node-view')).toEqual('mockNode');
		// @ts-expect-error Type already checked above
		expect(nodeView.dom.getAttribute('data-lazy-node-view-fallback')).toEqual('true');
	});
});
