import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { isSSR } from '../core-utils/is-ssr';
import { isSSRStreaming } from '../core-utils/is-ssr-streaming';

import ReactNodeView from './index';

jest.mock('../core-utils/is-ssr', () => ({
	isSSR: jest.fn().mockReturnValue(true),
}));

jest.mock('../core-utils/is-ssr-streaming', () => ({
	isSSRStreaming: jest.fn().mockReturnValue(true),
}));

describe('ReactNodeView SSR content-dom-ref marker', () => {
	let mockView: EditorView;
	// Renders a NodeViewContentHole-like placeholder carrying the SSR marker,
	// mirroring what the portal writes into `domRef` during SSR.
	const portalProviderAPI = {
		render: jest.fn((_component, container: HTMLElement) => {
			const hole = document.createElement('div');
			hole.setAttribute('data-ssr-content-dom-ref', '');
			container.appendChild(hole);
		}),
		remove: jest.fn(),
		destroy: jest.fn(),
	};
	const eventDispatcher = { emit: jest.fn() };

	beforeEach(() => {
		jest.clearAllMocks();
		(isSSR as jest.Mock).mockReturnValue(true);
		(isSSRStreaming as jest.Mock).mockReturnValue(true);
		// @ts-expect-error minimal view stub
		mockView = { state: {}, dispatch: jest.fn() };
	});

	const createNodeView = () => {
		const node = defaultSchema.nodes.paragraph.createAndFill()!;
		return new ReactNodeView(
			node,
			mockView,
			() => 1,
			portalProviderAPI,
			// @ts-expect-error minimal dispatcher stub
			eventDispatcher,
		);
	};

	it('removes the marker attribute after re-attaching during SSR streaming', () => {
		const nodeView = createNodeView().init();

		expect(nodeView.dom.querySelector('[data-ssr-content-dom-ref]')).toBeNull();
	});

	it('keeps the marker when SSR streaming is not active', () => {
		(isSSRStreaming as jest.Mock).mockReturnValue(false);

		const nodeView = createNodeView().init();

		expect(nodeView.dom.querySelector('[data-ssr-content-dom-ref]')).not.toBeNull();
	});
});
