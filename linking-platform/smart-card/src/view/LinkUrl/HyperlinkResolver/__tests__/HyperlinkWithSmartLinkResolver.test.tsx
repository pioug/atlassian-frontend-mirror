import React from 'react';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { render, screen, userEvent as user } from '@atlassian/testing-library';

import { HyperlinkWithSmartLinkResolver } from '../index';

// Mock the useResolveHyperlink hook
jest.mock('../../../../state/hooks/use-resolve-hyperlink', () => ({
	__esModule: true,
	default: jest.fn(),
}));

// Mock the getServices helper
jest.mock('../../../../state/helpers', () => ({
	...jest.requireActual('../../../../state/helpers'),
	getServices: jest.fn(),
}));

// Mock the useResolveHyperlinkValidator to always return true
jest.mock('../../../../state/hooks/use-resolve-hyperlink/useResolveHyperlinkValidator', () => ({
	__esModule: true,
	default: jest.fn(() => true),
	isGoogleDomain: jest.fn(),
	isSharePointDomain: jest.fn(),
}));

// Mock the expValEquals function
jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn().mockReturnValue(false),
}));

describe('HyperlinkWithSmartLinkResolver', () => {
	const useResolveHyperlink = jest.requireMock(
		'../../../../state/hooks/use-resolve-hyperlink',
	).default;

	const defaultProps: any = {
		href: 'https://company.sharepoint.com/document.docx',
		children: ['https://company.sharepoint.com/document.docx'],
	};

	const mockActions = {
		authorize: jest.fn(),
		register: jest.fn(),
		invoke: jest.fn(),
		reload: jest.fn(),
		loadMetadata: jest.fn(),
	};

	const mockState: any = {
		status: 'unauthorized',
		details: {
			meta: {
				visibility: 'restricted',
				access: 'forbidden',
				auth: [],
				definitionId: 'test-definition-id',
				key: 'test-key',
			},
			data: {
				'@context': {
					'@vocab': 'https://www.w3.org/ns/activitystreams#',
					atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
					schema: 'http://schema.org/',
				},
				'@type': 'Object',
				url: 'https://company.sharepoint.com/document.docx',
			},
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
		useResolveHyperlink.mockReturnValue({
			actions: mockActions,
			state: mockState,
		});
	});

	it('should render regular Hyperlink for unauthorized state', async () => {
		useResolveHyperlink.mockReturnValue({
			actions: mockActions,
			state: { ...mockState, status: 'unauthorized' },
		});

		render(
			<SmartCardProvider client={new CardClient()}>
				<HyperlinkWithSmartLinkResolver {...defaultProps} />
			</SmartCardProvider>,
		);

		expect(screen.getByRole('link')).toBeInTheDocument();
		expect(screen.queryByTestId('button-connect-account')).not.toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should render regular Hyperlink for resolved state', () => {
		useResolveHyperlink.mockReturnValue({
			actions: mockActions,
			state: { ...mockState, status: 'resolved' },
		});

		render(
			<SmartCardProvider client={new CardClient()}>
				<HyperlinkWithSmartLinkResolver {...defaultProps} />
			</SmartCardProvider>,
		);

		expect(screen.getByRole('link')).toBeInTheDocument();
		expect(screen.queryByTestId('button-connect-account')).not.toBeInTheDocument();
	});

	it('should render regular Hyperlink for pending state', () => {
		useResolveHyperlink.mockReturnValue({
			actions: mockActions,
			state: { ...mockState, status: 'pending' },
		});

		render(
			<SmartCardProvider client={new CardClient()}>
				<HyperlinkWithSmartLinkResolver {...defaultProps} />
			</SmartCardProvider>,
		);

		expect(screen.getByRole('link')).toBeInTheDocument();
	});

	it('should render regular Hyperlink for errored state', () => {
		useResolveHyperlink.mockReturnValue({
			actions: mockActions,
			state: { ...mockState, status: 'errored' },
		});

		render(
			<SmartCardProvider client={new CardClient()}>
				<HyperlinkWithSmartLinkResolver {...defaultProps} />
			</SmartCardProvider>,
		);

		expect(screen.getByRole('link')).toBeInTheDocument();
	});

	describe('onClick callback behavior', () => {
		it('should call provided onClick callback when hyperlink is clicked', async () => {
			const userEvent = user.setup();
			const mockOnClick = jest.fn();
			useResolveHyperlink.mockReturnValue({
				actions: mockActions,
				state: { ...mockState, status: 'resolved' },
			});

			render(
				<SmartCardProvider client={new CardClient()}>
					<HyperlinkWithSmartLinkResolver {...defaultProps} onClick={mockOnClick} />
				</SmartCardProvider>,
			);

			const hyperlink = screen.getByRole('link');
			await userEvent.click(hyperlink);

			expect(mockOnClick).toHaveBeenCalled();
		});

		it('should work without onClick callback', async () => {
			const userEvent = user.setup();
			useResolveHyperlink.mockReturnValue({
				actions: mockActions,
				state: { ...mockState, status: 'resolved' },
			});

			expect(() => {
				render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver {...defaultProps} />
					</SmartCardProvider>,
				);
			}).not.toThrow();

			const hyperlink = screen.getByRole('link');
			expect(async () => await userEvent.click(hyperlink)).not.toThrow();
		});
	});
});
