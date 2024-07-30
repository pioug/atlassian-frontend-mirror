import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { DecorationSource, EditorView } from '@atlaskit/editor-prosemirror/view';

import { type CreateReactNodeViewProps, withLazyLoading } from './index'; // Update this with the actual path

jest.mock('./replace-node-views');

jest.mock('@atlaskit/editor-prosemirror/model', () => {
	return {
		__esModule: true,
		DOMSerializer: {
			renderSpec: jest.fn(),
		},
	};
});

describe('withLazyLoading', () => {
	let getNodeViewOptionsMock: jest.Mock;
	let dispatchAnalyticsEventMock: jest.Mock | undefined;
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

	beforeEach(() => {
		(DOMSerializer.renderSpec as unknown as jest.Mock).mockReturnValue({
			dom: document.createElement('div'),
			contentDOM: document.createElement('div'),
		});
	});

	afterEach(() => {
		getNodeViewOptionsMock = jest.fn().mockReturnValue({});
		dispatchAnalyticsEventMock = jest.fn();
		jest.restoreAllMocks();
	});

	describe('when called multiple times to the same node', () => {
		it('should not call the loader more than once', () => {
			let resolve: (args: CreateReactNodeViewProps<unknown>) => void = () => {};

			const loadMock = jest.fn(
				() =>
					new Promise<CreateReactNodeViewProps<unknown>>((_resolve) => {
						resolve = _resolve;
					}),
			);
			const createMockNodeView = withLazyLoading({
				nodeName: 'mockNode',
				loader: loadMock,
				getNodeViewOptions: getNodeViewOptionsMock,
				dispatchAnalyticsEvent: dispatchAnalyticsEventMock,
			});
			createMockNodeView(node, view, getPos, [], jest.fn() as unknown as DecorationSource);
			createMockNodeView(node, view, getPos, [], jest.fn() as unknown as DecorationSource);
			createMockNodeView(node, view, getPos, [], jest.fn() as unknown as DecorationSource);
			createMockNodeView(node, view, getPos, [], jest.fn() as unknown as DecorationSource);

			resolve(jest.fn() as unknown as CreateReactNodeViewProps<unknown>);

			expect(loadMock).toBeCalledTimes(1);
		});
	});
});
