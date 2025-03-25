import React from 'react';
import { render, screen } from '@testing-library/react';

import MultiBodiedExtension from '../../../../react/nodes/multiBodiedExtension';
import { useMultiBodiedExtensionContext } from '../../../../react/nodes/multiBodiedExtension/context';
import { useMultiBodiedExtensionActions } from '../../../../react/nodes/multiBodiedExtension/actions';

jest.mock('@atlaskit/editor-common/ui', () => ({
	...jest.requireActual('@atlaskit/editor-common/ui'),
	WidthConsumer: ({ children }: any) => children({ width: 800 }),
}));

jest.mock('@atlaskit/editor-common/utils', () => ({
	...jest.requireActual('@atlaskit/editor-common/utils'),
	calcBreakoutWidth: jest.fn(),
}));

jest.mock('../../../../react/nodes/multiBodiedExtension/context', () => ({
	...jest.requireActual('../../../../react/nodes/multiBodiedExtension/context'),
	useMultiBodiedExtensionContext: jest.fn(),
}));

jest.mock('../../../../react/nodes/multiBodiedExtension/actions', () => ({
	...jest.requireActual('../../../../react/nodes/multiBodiedExtension/actions'),
	useMultiBodiedExtensionActions: jest.fn(),
}));

beforeEach(() => {
	(useMultiBodiedExtensionActions as jest.Mock).mockReturnValue({
		updateActiveChild: jest.fn(),
	});
});

describe('MultiBodiedExtension node', () => {
	const defaultProps: any = {
		serializer: jest.fn(),
		rendererContext: {},
		providers: {},
		extensionType: 'extension-type',
		extensionKey: 'extension-key',
		parameters: {},
		content: {},
		marks: [],
		localId: 'local-id',
	};

	it('should not render the content if loading', () => {
		(useMultiBodiedExtensionContext as jest.Mock).mockReturnValue({
			loading: true,
			extensionContext: null,
		});

		render(<MultiBodiedExtension {...defaultProps}>Test Content</MultiBodiedExtension>);
		expect(screen.getByTestId('multiBodiedExtension--container')).toBeVisible();

		const wrapper = screen.getByTestId('multiBodiedExtension--wrapper');
		expect(wrapper).toBeVisible();

		const wrapperOverflow = wrapper.querySelector('.ak-renderer-extension-overflow-container');
		expect(wrapperOverflow).toBeVisible();
		expect(wrapperOverflow).toBeEmptyDOMElement();
	});

	describe('when __allowBodiedOverride is false', () => {
		beforeEach(() => {
			(useMultiBodiedExtensionContext as jest.Mock).mockReturnValue({
				loading: false,
				extensionContext: {
					NodeRenderer: ({ node }: any) => (
						<div>Extension node with the key={node.extensionKey}</div>
					),
					privateProps: {
						__allowBodiedOverride: false,
					},
				},
			});
		});

		it('should render the wrapper', () => {
			render(<MultiBodiedExtension {...defaultProps}>Test Content</MultiBodiedExtension>);

			expect(screen.getByTestId('multiBodiedExtension--container')).toBeVisible();
			expect(screen.getByTestId('multiBodiedExtension--wrapper')).toBeVisible();
		});

		it('should render the navigation', () => {
			render(<MultiBodiedExtension {...defaultProps}>Test Content</MultiBodiedExtension>);

			expect(screen.getByTestId('multiBodiedExtension-navigation')).toBeVisible();
		});

		it('should render extension node', () => {
			render(<MultiBodiedExtension {...defaultProps}>Test Content</MultiBodiedExtension>);

			expect(screen.getByText('Extension node with the key=extension-key')).toBeVisible();
		});

		it('should render children', () => {
			render(<MultiBodiedExtension {...defaultProps}>Test Content</MultiBodiedExtension>);

			expect(screen.getByTestId('multiBodiedExtension--frames')).toBeVisible();
			expect(screen.getByText('Test Content')).toBeVisible();
		});
	});

	describe('when __allowBodiedOverride is true', () => {
		beforeEach(() => {
			(useMultiBodiedExtensionContext as jest.Mock).mockReturnValue({
				loading: false,
				extensionContext: {
					NodeRenderer: ({ node }: any) => (
						<div>Extension node with the key={node.extensionKey}</div>
					),
					privateProps: {
						__allowBodiedOverride: true,
					},
				},
			});
		});

		it('should render the wrapper', () => {
			render(<MultiBodiedExtension {...defaultProps}>Test Content</MultiBodiedExtension>);

			expect(screen.getByTestId('multiBodiedExtension--container')).toBeVisible();
			expect(screen.getByTestId('multiBodiedExtension--wrapper')).toBeVisible();
		});

		it('should not render the navigation and children container', () => {
			render(<MultiBodiedExtension {...defaultProps}>Test Content</MultiBodiedExtension>);

			expect(screen.queryByTestId('multiBodiedExtension-navigation')).not.toBeInTheDocument();
			expect(screen.queryByTestId('multiBodiedExtension--frames')).not.toBeInTheDocument();
		});

		it('should render extension node', () => {
			render(<MultiBodiedExtension {...defaultProps}>Test Content</MultiBodiedExtension>);

			expect(screen.getByText('Extension node with the key=extension-key')).toBeVisible();
		});
	});
});
