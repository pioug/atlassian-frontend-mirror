import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { LazyNodeView } from './node-view';

jest.mock('@atlaskit/editor-prosemirror/model', () => {
	return {
		__esModule: true,
		DOMSerializer: {
			renderSpec: jest.fn(),
		},
	};
});

describe('LazyNodeView', () => {
	const fakeNode = {
		type: {
			name: 'mockNode',
			spec: {
				toDOM: jest.fn(),
			},
		},
	} as unknown as PMNode;

	it('should set default attributes', () => {
		(DOMSerializer.renderSpec as unknown as jest.Mock).mockReturnValue({
			dom: document.createElement('div'),
			contentDOM: document.createElement('div'),
		});

		const nodeView = new LazyNodeView(
			fakeNode,
			jest.fn() as unknown as EditorView,
			jest.fn(),
			new Promise(() => {}),
		);

		expect(nodeView.dom).toBeInstanceOf(HTMLElement);
		// @ts-expect-error Type already checked above
		expect(nodeView.dom.getAttribute('data-lazy-node-view')).toEqual('mockNode');
		// @ts-expect-error Type already checked above
		expect(nodeView.dom.getAttribute('data-lazy-node-view-fallback')).toEqual('true');
	});
});
