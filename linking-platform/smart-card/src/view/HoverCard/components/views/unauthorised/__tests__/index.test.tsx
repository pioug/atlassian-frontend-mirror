import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';

import { getCardState } from '../../../../../../../examples/utils/flexible-ui';
import {
	CONTENT_URL_3P_ACCOUNT_AUTH,
	CONTENT_URL_SECURITY_AND_PERMISSIONS,
} from '../../../../../../constants';
import { mockGetContext } from '../../../../../../state/actions/__tests__/index.test.mock';
import { mocks } from '../../../../../../utils/mocks';
import { mockUnauthorisedResponse } from '../../../../__tests__/__mocks__/mocks';
import HoverCardUnauthorisedView from '../index';
import { type HoverCardUnauthorisedProps } from '../types';

mockSimpleIntersectionObserver();

jest.mock('@atlaskit/link-provider', () => ({
	...jest.requireActual('@atlaskit/link-provider'),
	useSmartLinkContext: () => ({
		...mockGetContext(),
		store: {
			getState: () => ({ 'test-url': mocks.analytics }),
			dispatch: jest.fn(),
		},
		connections: {
			client: {
				fetchData: jest.fn(() => Promise.resolve(mockUnauthorisedResponse)),
			},
		},
		config: {
			authFlow: 'disabled',
		},
	}),
}));

const useExperimentGateMock = jest.spyOn(FeatureGates, 'getExperimentValue');
jest.mock('@atlaskit/feature-gate-js-client', () => ({
	getExperimentValue: jest.fn(),
}));

describe('Unauthorised Hover Card', () => {
	let mockUrl: string = 'https://some-url.com';

	const id = 'unauthorized-test-id';

	const TestComponent = ({
		propOverrides,
	}: {
		propOverrides?: Partial<HoverCardUnauthorisedProps>;
	}): JSX.Element => {
		return (
			<IntlProvider locale="en">
				<HoverCardUnauthorisedView
					url={mockUrl}
					extensionKey={'google-object-provider'}
					id={id}
					flexibleCardProps={{
						cardState: getCardState({
							data: { ...mockUnauthorisedResponse.data, url: mockUrl },
							meta: mockUnauthorisedResponse.meta,
							status: 'unauthorized',
						}),
						children: null,
						url: mockUrl,
					}}
					{...propOverrides}
				/>
			</IntlProvider>
		);
	};

	beforeEach(() => {
		useExperimentGateMock.mockReturnValue('control');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const setUpHoverCard = (propOverrides?: Partial<HoverCardUnauthorisedProps>) => {
		return render(<TestComponent propOverrides={propOverrides} />);
	};

	it('renders Unauthorised hover card content', () => {
		setUpHoverCard();
		const iconElement = screen.getByTestId('smart-element-icon');
		const titleElement = screen.getByTestId('hover-card-unauthorised-view-title');
		const mainContentElement = screen.getByTestId('hover-card-unauthorised-view-content');
		const buttonElement = screen.getByTestId('hover-card-unauthorised-view-button');

		expect(iconElement).toBeTruthy();
		expect(titleElement).toHaveTextContent('Connect your Google account');
		expect(mainContentElement).toHaveTextContent(
			'Connect your Google account to collaborate on work across Atlassian products. Learn more about Smart Links.',
		);
		expect(buttonElement).toHaveTextContent('Connect to Google');
	});

	it('"learn more" link should have a correct url', () => {
		setUpHoverCard();

		const learnMoreLink = screen.getByRole('link', { name: /learn more/i });
		expect(learnMoreLink.getAttribute('href')).toBe(CONTENT_URL_SECURITY_AND_PERMISSIONS);
	});

	it('renders alternative message when `hasScopeOverrides` flag is present in the meta', () => {
		setUpHoverCard({
			flexibleCardProps: {
				cardState: getCardState({
					data: { ...mockUnauthorisedResponse.data, url: mockUrl },
					meta: { hasScopeOverrides: true, ...mockUnauthorisedResponse.meta },
					status: 'unauthorized',
				}),
				children: null,
				url: mockUrl,
			},
		});
		const iconElement = screen.getByTestId('smart-element-icon');
		const titleElement = screen.getByTestId('hover-card-unauthorised-view-title');
		const mainContentElement = screen.getByTestId('hover-card-unauthorised-view-content');
		const buttonElement = screen.getByTestId('hover-card-unauthorised-view-button');

		expect(iconElement).toBeTruthy();
		expect(titleElement).toHaveTextContent('Connect your Google account');
		expect(mainContentElement).toHaveTextContent(
			'Connect your Google account to collaborate on work across Atlassian products. Learn more about connecting your account to Atlassian products.',
		);
		expect(buttonElement).toHaveTextContent('Connect to Google');
	});

	it('uses alternative "learn more" url when `hasScopeOverrides` flag is present in the meta', () => {
		setUpHoverCard({
			flexibleCardProps: {
				cardState: getCardState({
					data: { ...mockUnauthorisedResponse.data, url: mockUrl },
					meta: { hasScopeOverrides: true, ...mockUnauthorisedResponse.meta },
					status: 'unauthorized',
				}),
				children: null,
				url: mockUrl,
			},
		});

		const learnMoreLink = screen.getByRole('link', { name: /learn more/i });
		expect(learnMoreLink.getAttribute('href')).toBe(CONTENT_URL_3P_ACCOUNT_AUTH);
	});

	it('should capture and report a11y violations', async () => {
		const { container } = setUpHoverCard({
			flexibleCardProps: {
				cardState: getCardState({
					data: { ...mockUnauthorisedResponse.data, url: mockUrl },
					meta: { hasScopeOverrides: true, ...mockUnauthorisedResponse.meta },
					status: 'unauthorized',
				}),
				children: null,
				url: mockUrl,
			},
		});
		await expect(container).toBeAccessible();
	});

	it('does not show popup and returns null when experiment cohort is test4', () => {
		useExperimentGateMock.mockReturnValue('test4');
		const { container } = setUpHoverCard();

		expect(container.firstChild).toBeNull();
	});

	it('does show popup for all other experiment cohorts', () => {
		useExperimentGateMock.mockReturnValue('control');
		const { container } = setUpHoverCard();
		expect(container.firstChild).toBeTruthy();

		useExperimentGateMock.mockReturnValue('test1');
		expect(container.firstChild).toBeTruthy();

		useExperimentGateMock.mockReturnValue('test2');
		expect(container.firstChild).toBeTruthy();

		useExperimentGateMock.mockReturnValue('test3');
		expect(container.firstChild).toBeTruthy();
	});

	describe('Action button message based on experiment cohort', () => {
		it('shows "Connect to {context}" button text for control cohort', () => {
			useExperimentGateMock.mockReturnValue('control');
			setUpHoverCard();

			const buttonElement = screen.getByTestId('hover-card-unauthorised-view-button');
			expect(buttonElement).toHaveTextContent('Connect to Google');
		});

		it('shows "Connect {context}" button text for test cohorts when provider is Google', () => {
			useExperimentGateMock.mockReturnValue('test1');
			setUpHoverCard();

			const buttonElement = screen.getByTestId('hover-card-unauthorised-view-button');
			expect(buttonElement).toHaveTextContent('Connect Google');

			useExperimentGateMock.mockReturnValue('test2');
			expect(buttonElement).toHaveTextContent('Connect Google');

			useExperimentGateMock.mockReturnValue('test3');
			expect(buttonElement).toHaveTextContent('Connect Google');
		});
	});
});
