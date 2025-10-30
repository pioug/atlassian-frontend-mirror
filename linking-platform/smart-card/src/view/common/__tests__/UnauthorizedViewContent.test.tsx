import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import { fg } from '@atlaskit/platform-feature-flags';

import { type CardInnerAppearance } from '../../Card/types';
import UnauthorisedViewContent from '../UnauthorisedViewContent';

const mockFireEvent = jest.fn();
jest.mock('../../../common/analytics/generated/use-analytics-events', () => ({
	useAnalyticsEvents: () => ({
		fireEvent: mockFireEvent,
	}),
}));

const useExperimentGateMock = jest.spyOn(FeatureGates, 'getExperimentValue');
jest.mock('@atlaskit/feature-gate-js-client', () => ({
	getExperimentValue: jest.fn(),
}));

const mockFg = fg as jest.MockedFunction<typeof fg>;
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

describe('UnauthorisedViewContent', () => {
	const TestComponent = ({
		providerName,
		isProductIntegrationSupported,
		appearance,
	}: {
		appearance?: CardInnerAppearance;
		isProductIntegrationSupported?: boolean;
		providerName?: string;
	}): JSX.Element => {
		return (
			<IntlProvider locale="en">
				<UnauthorisedViewContent
					providerName={providerName}
					isProductIntegrationSupported={isProductIntegrationSupported}
					appearance={appearance}
				/>
			</IntlProvider>
		);
	};

	beforeEach(() => {
		mockFg.mockReturnValue(false);
		useExperimentGateMock.mockReturnValue('control');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders Unauthorised hover card content', () => {
		render(<TestComponent providerName="Google" appearance={'hoverCardPreview'} />);

		expect(
			screen.getByText(
				'Connect your Google account to collaborate on work across Atlassian products.',
			),
		).toBeInTheDocument();
	});

	describe('product-terminology-refresh feature flag logic', () => {
		describe('with provider name', () => {
			it('shows "products" terminology when feature flag is OFF', () => {
				mockFg.mockReturnValue(false);
				useExperimentGateMock.mockReturnValue('control');
				render(<TestComponent providerName="Google" appearance={'hoverCardPreview'} />);

				expect(
					screen.getByText(
						'Connect your Google account to collaborate on work across Atlassian products.',
					),
				).toBeInTheDocument();
			});

			it('shows "apps" terminology when feature flag is ON and experiment cohort is control', () => {
				mockFg.mockReturnValue(true);
				useExperimentGateMock.mockReturnValue('control');
				render(<TestComponent providerName="Google" appearance={'hoverCardPreview'} />);

				expect(
					screen.getByText(
						'Connect your Google account to collaborate on work across Atlassian apps.',
					),
				).toBeInTheDocument();
			});

			it('shows experiment message when feature flag is ON and experiment cohort is not control', () => {
				mockFg.mockReturnValue(true);
				useExperimentGateMock.mockReturnValue('test1');
				render(<TestComponent providerName="Google" appearance={'hoverCardPreview'} />);

				expect(
					screen.getByText(
						'Connect your Google account to turn simple URLs into rich, interactive previews, making it easier to collaborate and stay in context.',
					),
				).toBeInTheDocument();
			});
		});

		describe('without provider name', () => {
			it('shows "products" terminology when feature flag is OFF', () => {
				mockFg.mockReturnValue(false);
				render(<TestComponent appearance={'hoverCardPreview'} />);

				expect(
					screen.getByText(
						'Connect your account to collaborate on work across Atlassian products.',
					),
				).toBeInTheDocument();
			});

			it('shows "apps" terminology when feature flag is ON', () => {
				mockFg.mockReturnValue(true);
				render(<TestComponent appearance={'hoverCardPreview'} />);

				expect(
					screen.getByText('Connect your account to collaborate on work across Atlassian apps.'),
				).toBeInTheDocument();
			});
		});
	});

	describe('experiment cohort logic for Google provider', () => {
		it('shows control message when cohort is control', () => {
			useExperimentGateMock.mockReturnValue('control');
			render(<TestComponent providerName="Google" appearance={'hoverCardPreview'} />);

			expect(
				screen.getByText(
					'Connect your Google account to collaborate on work across Atlassian products.',
				),
			).toBeInTheDocument();
		});

		it('shows test1 message when cohort is test1', () => {
			useExperimentGateMock.mockReturnValue('test1');
			render(<TestComponent providerName="Google" appearance={'hoverCardPreview'} />);

			expect(
				screen.getByText(
					'Connect your Google account to turn simple URLs into rich, interactive previews, making it easier to collaborate and stay in context.',
				),
			).toBeInTheDocument();
		});

		it('shows test2 message when cohort is test2', () => {
			useExperimentGateMock.mockReturnValue('test2');
			render(<TestComponent providerName="Google" appearance={'hoverCardPreview'} />);

			expect(
				screen.getByText(
					'Connect your Google account to turn simple URLs into rich, interactive previews and unlock more AI experiences, making it easier to collaborate and stay in context.',
				),
			).toBeInTheDocument();
		});

		it('shows test3 message when cohort is test3', () => {
			useExperimentGateMock.mockReturnValue('test3');
			render(<TestComponent providerName="Google" appearance={'hoverCardPreview'} />);

			expect(
				screen.getByText(
					'Transform ordinary URLs into rich, interactive previews of your Google content, and unlock enhanced AI-powered features within your Atlassian apps.',
				),
			).toBeInTheDocument();
		});

		it('falls back to control message when cohort is test4', () => {
			useExperimentGateMock.mockReturnValue('test4');
			useExperimentGateMock.mockReturnValue('control');
			render(<TestComponent providerName="Google" appearance={'hoverCardPreview'} />);

			expect(
				screen.getByText(
					'Connect your Google account to collaborate on work across Atlassian products.',
				),
			).toBeInTheDocument();
		});

		it('does not affect other card types when not specified to be hoverCardPreview', () => {
			useExperimentGateMock.mockReturnValue('test1');
			render(<TestComponent providerName="Google" />);

			expect(
				screen.getByText(
					'Connect your Google account to collaborate on work across Atlassian products.',
				),
			).toBeInTheDocument();
		});
	});

	describe('without provider name', () => {
		it('renders fallback message when no provider is specified', () => {
			render(<TestComponent appearance={'hoverCardPreview'} />);

			expect(
				screen.getByText('Connect your account to collaborate on work across Atlassian products.'),
			).toBeInTheDocument();
		});

		it('shows control message when experiment is enabled', () => {
			useExperimentGateMock.mockReturnValue('test1');
			render(<TestComponent appearance={'hoverCardPreview'} />);

			expect(
				screen.getByText('Connect your account to collaborate on work across Atlassian products.'),
			).toBeInTheDocument();
		});
	});

	describe('learn more text content', () => {
		describe('when isProductIntegrationSupported is true', () => {
			it('shows standard learn more text when feature flag is OFF and experiment is control', () => {
				mockFg.mockReturnValue(false);
				useExperimentGateMock.mockReturnValue('control');
				render(
					<TestComponent
						providerName="Google"
						isProductIntegrationSupported={true}
						appearance={'hoverCardPreview'}
					/>,
				);

				const learnMoreLink = screen.getByTestId('unauthorised-view-content-learn-more');
				expect(learnMoreLink).toHaveTextContent(
					'Learn more about connecting your account to Atlassian products.',
				);
			});

			it('shows appify learn more text when feature flag is ON and experiment is control', () => {
				mockFg.mockReturnValue(true);
				useExperimentGateMock.mockReturnValue('control');
				render(
					<TestComponent
						providerName="Google"
						isProductIntegrationSupported={true}
						appearance={'hoverCardPreview'}
					/>,
				);

				const learnMoreLink = screen.getByTestId('unauthorised-view-content-learn-more');
				expect(learnMoreLink).toHaveTextContent(
					'Learn more about connecting your account to Atlassian apps.',
				);
			});

			it('shows experiment learn more text when feature flag is ON and experiment is not control', () => {
				mockFg.mockReturnValue(true);
				useExperimentGateMock.mockReturnValue('test1');
				render(
					<TestComponent
						providerName="Google"
						isProductIntegrationSupported={true}
						appearance={'hoverCardPreview'}
					/>,
				);

				const learnMoreLink = screen.getByTestId('unauthorised-view-content-learn-more');
				expect(learnMoreLink).toHaveTextContent(
					'Learn more about smart link security and permissions.',
				);
			});
		});

		describe('when isProductIntegrationSupported is false', () => {
			it('shows standard learn more text regardless of feature flag state', () => {
				mockFg.mockReturnValue(false);
				useExperimentGateMock.mockReturnValue('control');
				render(
					<TestComponent
						providerName="Google"
						isProductIntegrationSupported={false}
						appearance={'hoverCardPreview'}
					/>,
				);

				const learnMoreLink = screen.getByTestId('unauthorised-view-content-learn-more');
				expect(learnMoreLink).toHaveTextContent('Learn more about Smart Links.');
			});
		});
	});
});
