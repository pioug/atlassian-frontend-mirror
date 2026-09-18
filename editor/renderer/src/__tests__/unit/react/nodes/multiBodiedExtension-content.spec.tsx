/* eslint-disable @atlaskit/editor/no-as-casting, react/jsx-props-no-spreading */

import React from 'react';

import { render } from '@testing-library/react';

import MultiBodiedExtension from '../../../../react/nodes/multiBodiedExtension';
import { useMultiBodiedExtensionActions } from '../../../../react/nodes/multiBodiedExtension/actions';
import { useMultiBodiedExtensionContext } from '../../../../react/nodes/multiBodiedExtension/context';

jest.mock('@atlaskit/editor-common/ui', () => ({
	...jest.requireActual('@atlaskit/editor-common/ui'),
	WidthConsumer: ({ children }: any) => children({ width: 800 }),
}));

jest.mock('../../../../react/nodes/multiBodiedExtension/context', () => ({
	...jest.requireActual('../../../../react/nodes/multiBodiedExtension/context'),
	useMultiBodiedExtensionContext: jest.fn(),
}));

jest.mock('../../../../react/nodes/multiBodiedExtension/actions', () => ({
	...jest.requireActual('../../../../react/nodes/multiBodiedExtension/actions'),
	useMultiBodiedExtensionActions: jest.fn(),
}));

const body = [{ type: 'paragraph', content: [{ type: 'text', text: 'macro body' }] }];

let received: unknown[] = [];

beforeEach(() => {
	received = [];
	(useMultiBodiedExtensionActions as jest.Mock).mockReturnValue({
		updateActiveChild: jest.fn(),
	});
	(useMultiBodiedExtensionContext as jest.Mock).mockReturnValue({
		loading: false,
		extensionContext: {
			NodeRenderer: ({ node }: any) => {
				received.push(node.content);
				return <div>handled</div>;
			},
			privateProps: { __allowBodiedOverride: false },
		},
	});
});

const defaultProps: any = {
	serializer: jest.fn(),
	rendererContext: {},
	providers: {},
	extensionType: 'extension-type',
	extensionKey: 'extension-key',
	parameters: {},
	marks: [],
	localId: 'local-id',
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer - React/Nodes/MultiBodiedExtension - handler content', () => {
	it('passes getContent() through to the extension handler node', () => {
		render(<MultiBodiedExtension {...defaultProps} getContent={() => body} />);

		expect(received[0]).toEqual(body);
	});

	it('only serializes when the handler node is actually rendered', () => {
		const getContent = jest.fn(() => body);
		render(<MultiBodiedExtension {...defaultProps} getContent={getContent} />);

		// One call for the render that reached the handler, not one per ancestor.
		expect(getContent).toHaveBeenCalledTimes(1);
	});
});
