import React from 'react';

import { IntlProvider } from 'react-intl';

import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { render, screen, userEvent } from '@atlassian/testing-library';

import { getCardState } from '../../../../../../../examples/utils/flexible-ui';
import { CardDisplay } from '../../../../../../constants';
import { mockGetContext } from '../../../../../../state/actions/__tests__/index.test.mock';
import { mockUnauthorisedResponse } from '../../../../__tests__/__mocks__/mocks';
import RovoUnauthorisedView from '../RovoUnauthorisedView';
import { type HoverCardUnauthorisedProps } from '../types';

mockSimpleIntersectionObserver();

jest.mock('@atlaskit/link-provider', () => ({
	...jest.requireActual('@atlaskit/link-provider'),
	useSmartLinkContext: () => ({
		...mockGetContext(),
		store: {
			getState: () => ({}),
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

const mockAuthorize = jest.fn();

jest.mock('../../../../../../state/actions', () => ({
	...jest.requireActual('../../../../../../state/actions'),
	useSmartCardActions: () => ({
		authorize: mockAuthorize,
	}),
}));

const mockFireEvent = jest.fn();
jest.mock('../../../../../../common/analytics/generated/use-analytics-events', () => ({
	useAnalyticsEvents: () => ({
		fireEvent: mockFireEvent,
	}),
}));

describe('RovoUnauthorisedView', () => {
	const mockUrl = 'https://some-url.com';

	const TestComponent = ({
		propOverrides,
	}: {
		propOverrides?: Partial<HoverCardUnauthorisedProps>;
	}): JSX.Element => (
		<IntlProvider locale="en">
			<RovoUnauthorisedView
				url={mockUrl}
				extensionKey="google-object-provider"
				id="test-id"
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

	beforeEach(() => {
		mockAuthorize.mockClear();
		mockFireEvent.mockClear();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(<TestComponent />);
		await expect(container).toBeAccessible();
	});

	it('renders feature rows and connect / maybe later actions', () => {
		render(<TestComponent />);

		expect(screen.getByTestId('hover-card-rovo-unauthorised-view')).toBeInTheDocument();
		expect(
			screen.getByText('Get smarter workflows by connecting your Google account'),
		).toBeInTheDocument();
		expect(
			screen.getByTestId('hover-card-rovo-unauthorised-view-feature-clear-link-names'),
		).toBeInTheDocument();
		expect(
			screen.getByTestId('hover-card-rovo-unauthorised-view-feature-understand-linked-docs'),
		).toBeInTheDocument();
		expect(
			screen.getByTestId('hover-card-rovo-unauthorised-view-feature-go-deeper-smart-suggestions'),
		).toBeInTheDocument();
		expect(screen.getByText('Turn long URL into clear link names')).toBeInTheDocument();
		expect(screen.getByText('Understand linked docs in seconds')).toBeInTheDocument();
		expect(screen.getByText('Go deeper with smart suggestions')).toBeInTheDocument();
		expect(
			screen.getByTestId('hover-card-rovo-unauthorised-view-connect-account'),
		).toBeInTheDocument();
		expect(
			screen.getByTestId('hover-card-rovo-unauthorised-view-connect-account'),
		).toBeInTheDocument();
		expect(screen.getByTestId('hover-card-rovo-unauthorised-view-not-now')).toBeInTheDocument();
	});

	it('renders the fallback title when provider name is unavailable', () => {
		render(
			<TestComponent
				propOverrides={{
					flexibleCardProps: {
						cardState: getCardState({
							data: { ...mockUnauthorisedResponse.data, url: mockUrl, generator: undefined },
							meta: mockUnauthorisedResponse.meta,
							status: 'unauthorized',
						}),
						children: null,
						url: mockUrl,
					},
				}}
			/>,
		);

		expect(
			screen.getByText('Get smarter workflows by connecting your account'),
		).toBeInTheDocument();
	});

	it('invokes authorize and fires authStarted analytics when Connect is clicked', async () => {
		const user = userEvent.setup();
		render(<TestComponent />);

		await user.click(screen.getByTestId('hover-card-rovo-unauthorised-view-connect-account'));

		expect(mockFireEvent).toHaveBeenCalledWith('track.applicationAccount.authStarted', {});
		expect(mockAuthorize).toHaveBeenCalledWith(CardDisplay.HoverCardPreview);
	});

	it('calls onDismiss and fires dismiss analytics when Maybe later is clicked', async () => {
		const user = userEvent.setup();
		const onDismiss = jest.fn();
		render(<TestComponent propOverrides={{ onDismiss }} />);

		await user.click(screen.getByTestId('hover-card-rovo-unauthorised-view-not-now'));

		expect(mockFireEvent).toHaveBeenCalledWith('ui.button.clicked.dismiss', {});
		expect(onDismiss).toHaveBeenCalled();
	});
});
