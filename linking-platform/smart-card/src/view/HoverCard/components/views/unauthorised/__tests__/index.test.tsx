import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

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
});
