import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';

import UnauthorisedViewContent from '../UnauthorisedViewContent';

const mockFireEvent = jest.fn();
jest.mock('../../../common/analytics/generated/use-analytics-events', () => ({
	useAnalyticsEvents: () => ({
		fireEvent: mockFireEvent,
	}),
}));

const mockFg = fg as jest.MockedFunction<typeof fg>;
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

describe('UnauthorisedViewContent', () => {
	const TestComponent = ({
		providerName,
		isProductIntegrationSupported,
	}: {
		isProductIntegrationSupported?: boolean;
		providerName?: string;
	}): JSX.Element => {
		return (
			<IntlProvider locale="en">
				<UnauthorisedViewContent
					providerName={providerName}
					isProductIntegrationSupported={isProductIntegrationSupported}
				/>
			</IntlProvider>
		);
	};

	beforeEach(() => {
		mockFg.mockReturnValue(false);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<TestComponent providerName="Google" />,
		);
		await expect(container).toBeAccessible();
	});

	it('renders Unauthorised hover card content', () => {
		render(<TestComponent providerName="Google" />);

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
				render(<TestComponent providerName="Google" />);

				expect(
					screen.getByText(
						'Connect your Google account to collaborate on work across Atlassian products.',
					),
				).toBeInTheDocument();
			});

			it('shows "apps" terminology when feature flag is ON', () => {
				mockFg.mockReturnValue(true);
				render(<TestComponent providerName="Google" />);

				expect(
					screen.getByText(
						'Connect your Google account to collaborate on work across Atlassian apps.',
					),
				).toBeInTheDocument();
			});
		});

		describe('without provider name', () => {
			it('shows "products" terminology when feature flag is OFF', () => {
				mockFg.mockReturnValue(false);
				render(<TestComponent />);

				expect(
					screen.getByText(
						'Connect your account to collaborate on work across Atlassian products.',
					),
				).toBeInTheDocument();
			});

			it('shows "apps" terminology when feature flag is ON', () => {
				mockFg.mockReturnValue(true);
				render(<TestComponent />);

				expect(
					screen.getByText('Connect your account to collaborate on work across Atlassian apps.'),
				).toBeInTheDocument();
			});
		});
	});

	describe('without provider name', () => {
		it('renders fallback message when no provider is specified', () => {
			render(<TestComponent />);

			expect(
				screen.getByText('Connect your account to collaborate on work across Atlassian products.'),
			).toBeInTheDocument();
		});
	});

	describe('learn more text content', () => {
		describe('when isProductIntegrationSupported is true', () => {
			it('shows standard learn more text when feature flag is OFF', () => {
				mockFg.mockReturnValue(false);
				render(
					<TestComponent
						providerName="Google"
						isProductIntegrationSupported={true}
					/>,
				);

				const learnMoreLink = screen.getByTestId('unauthorised-view-content-learn-more');
				expect(learnMoreLink).toHaveTextContent(
					'Learn more about connecting your account to Atlassian products.',
				);
			});

			it('shows appify learn more text when feature flag is ON', () => {
				mockFg.mockReturnValue(true);
				render(
					<TestComponent
						providerName="Google"
						isProductIntegrationSupported={true}
					/>,
				);

				const learnMoreLink = screen.getByTestId('unauthorised-view-content-learn-more');
				expect(learnMoreLink).toHaveTextContent(
					'Learn more about connecting your account to Atlassian apps.',
				);
			});
		});

		describe('when isProductIntegrationSupported is false', () => {
			it('shows standard learn more text regardless of feature flag state', () => {
				mockFg.mockReturnValue(false);
				render(
					<TestComponent
						providerName="Google"
						isProductIntegrationSupported={false}
					/>,
				);

				const learnMoreLink = screen.getByTestId('unauthorised-view-content-learn-more');
				expect(learnMoreLink).toHaveTextContent('Learn more about Smart Links.');
			});
		});
	});
});
