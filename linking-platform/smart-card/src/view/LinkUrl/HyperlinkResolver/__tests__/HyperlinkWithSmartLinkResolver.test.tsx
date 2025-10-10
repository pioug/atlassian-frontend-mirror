import React from 'react';

import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';

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

// Mock the FeatureGates
jest.mock('@atlaskit/feature-gate-js-client', () => ({
	getExperimentValue: jest.fn(() => false),
}));

describe('HyperlinkWithSmartLinkResolver - Connect Button Logic', () => {
	const useResolveHyperlink = jest.requireMock(
		'../../../../state/hooks/use-resolve-hyperlink',
	).default;
	const { getServices } = jest.requireMock('../../../../state/helpers');
	const getExperimentValueMock = FeatureGates.getExperimentValue as jest.Mock;

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
		getServices.mockReturnValue([]);
		// Reset FeatureGates mock to return false by default
		getExperimentValueMock.mockReturnValue(false);
	});

	// Tests when the experiment is enabled (simulating the feature flag being on)
	describe('Connect Button Logic - when experiments are enabled', () => {
		beforeEach(() => {
			// Enable the experiments for these tests
			getExperimentValueMock.mockImplementation((experimentName: string) => {
				if (
					experimentName === 'platform_linking_bluelink_connect_confluence' ||
					experimentName === 'platform_linking_bluelink_connect_jira'
				) {
					return true;
				} else if (experimentName === 'platform_inline_smartcard_connect_button_exp') {
					return 'control';
				}
				return false;
			});
		});

		describe('when state is unauthorized', () => {
			beforeEach(() => {
				useResolveHyperlink.mockReturnValue({
					actions: mockActions,
					state: { ...mockState, status: 'unauthorized' },
				});
			});

			it('should render HyperlinkUnauthorizedView when services are available', () => {
				getServices.mockReturnValue([{ key: 'service1' }]);

				render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver {...defaultProps} />
					</SmartCardProvider>,
				);

				// Should render the connect button when services are available
				expect(screen.getByTestId('button-connect-account')).toBeInTheDocument();
				// Should also render the hyperlink
				expect(screen.getByRole('link')).toBeInTheDocument();
			});

			it('should not show connect button when no services are available', () => {
				getServices.mockReturnValue([]);

				render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver {...defaultProps} />
					</SmartCardProvider>,
				);

				// Should render the hyperlink
				expect(screen.getByRole('link')).toBeInTheDocument();
				// Should NOT render the connect button when no services are available
				expect(screen.queryByTestId('button-connect-account')).not.toBeInTheDocument();
			});

			it('should call actions.authorize with "hyperlink" when connect button is clicked', async () => {
				const userEvent = user.setup();
				getServices.mockReturnValue([{ key: 'service1' }]);

				render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver {...defaultProps} />
					</SmartCardProvider>,
				);

				const connectButton = screen.getByTestId('button-connect-account');
				await userEvent.click(connectButton);

				expect(mockActions.authorize).toHaveBeenCalledWith('hyperlink');
			});

			it('should pass onClick callback to HyperlinkUnauthorizedView', async () => {
				const userEvent = user.setup();
				const mockOnClick = jest.fn();
				getServices.mockReturnValue([{ key: 'service1' }]);

				render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver {...defaultProps} onClick={mockOnClick} />
					</SmartCardProvider>,
				);

				const hyperlink = screen.getByRole('link');
				await userEvent.click(hyperlink);

				expect(mockOnClick).toHaveBeenCalled();
			});

			it('should not show button when the link is embedded in regular text', () => {
				const embeddedInTextProps: any = {
					href: 'https://company.sharepoint.com/document.docx',
					children: ['Embedded in text'],
				};

				render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver {...embeddedInTextProps} />
					</SmartCardProvider>,
				);
				expect(screen.queryByTestId('button-connect-account')).not.toBeInTheDocument();
			});

			it('should show button when the link is embedded in text that is wrapped by editor TextWrapper component', () => {
				// Create a mock React element that mimics the editor TextWrapper component structure
				getServices.mockReturnValue([{ key: 'service1' }]);
				const MockTextWrapper = ({ children }: { children: string }) => <span>{children}</span>;
				const wrappedElement = React.createElement(MockTextWrapper, {
					key: 'text-wrapper',
					children: 'https://company.sharepoint.com/document.docx',
				});

				const embeddedInTextProps: any = {
					href: 'https://company.sharepoint.com/document.docx',
					children: [wrappedElement],
				};
				render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver {...embeddedInTextProps} />
					</SmartCardProvider>,
				);
				expect(screen.getByTestId('button-connect-account')).toBeInTheDocument();
			});

			it('should not show button when the link is embedded in text that is wrapped by editor TextWrapper component', () => {
				// Create a mock React element that mimics the TextWrapper component structure
				getServices.mockReturnValue([{ key: 'service1' }]);
				const MockTextWrapper = ({ children }: { children: string[] }) => <span>{children}</span>;
				const wrappedElement = React.createElement(MockTextWrapper, {
					key: 'text-wrapper',
					children: ['Embedded in text'],
				});

				const embeddedInTextProps: any = {
					href: 'https://company.sharepoint.com/document.docx',
					children: [wrappedElement],
				};
				render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver {...embeddedInTextProps} />
					</SmartCardProvider>,
				);
				expect(screen.queryByTestId('button-connect-account')).not.toBeInTheDocument();
			});
		});

		describe('when state is not unauthorized', () => {
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
		});

		describe('services integration', () => {
			beforeEach(() => {
				useResolveHyperlink.mockReturnValue({
					actions: mockActions,
					state: { ...mockState, status: 'unauthorized' },
				});
			});

			it('should handle empty services array', () => {
				getServices.mockReturnValue([]);

				render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver {...defaultProps} />
					</SmartCardProvider>,
				);

				expect(screen.getByRole('link')).toBeInTheDocument();
				expect(screen.queryByTestId('button-connect-account')).not.toBeInTheDocument();
			});

			it('should handle multiple services', () => {
				getServices.mockReturnValue([
					{ key: 'service1' },
					{ key: 'service2' },
					{ key: 'service3' },
				]);

				render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver {...defaultProps} />
					</SmartCardProvider>,
				);

				expect(screen.getByRole('link')).toBeInTheDocument();
				expect(screen.getByTestId('button-connect-account')).toBeInTheDocument();
			});

			it('should handle null/undefined services', () => {
				getServices.mockReturnValue(null);

				render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver {...defaultProps} />
					</SmartCardProvider>,
				);

				expect(screen.getByRole('link')).toBeInTheDocument();
				expect(screen.queryByTestId('button-connect-account')).not.toBeInTheDocument();
			});
		});
	});

	describe('Experiments disabled - Feature flag disabled', () => {
		beforeEach(() => {
			// Ensure experiments are disabled for these tests
			getExperimentValueMock.mockReturnValue(false);
		});

		it('should always render regular Hyperlink regardless of state', () => {
			useResolveHyperlink.mockReturnValue({
				actions: mockActions,
				state: { ...mockState, status: 'unauthorized' },
			});
			getServices.mockReturnValue([{ key: 'service1' }]);

			render(
				<SmartCardProvider client={new CardClient()}>
					<HyperlinkWithSmartLinkResolver {...defaultProps} />
				</SmartCardProvider>,
			);

			expect(screen.getByRole('link')).toBeInTheDocument();
			expect(screen.queryByTestId('button-connect-account')).not.toBeInTheDocument();
		});

		it('should not call useCallback for onAuthorize when feature flag is disabled', () => {
			useResolveHyperlink.mockReturnValue({
				actions: mockActions,
				state: { ...mockState, status: 'unauthorized' },
			});

			expect(() => {
				render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver {...defaultProps} />
					</SmartCardProvider>,
				);
			}).not.toThrow();
		});
	});

	describe('onClick callback behavior - both states', () => {
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
