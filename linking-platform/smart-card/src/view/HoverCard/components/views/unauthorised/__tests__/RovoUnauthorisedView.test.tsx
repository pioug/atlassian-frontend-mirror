import React from 'react';

import { IntlProvider } from 'react-intl-next';

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
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(<TestComponent />);
		await expect(container).toBeAccessible();
	});

	it('renders feature rows and connect / maybe later actions', () => {
		render(<TestComponent />);

		expect(screen.getByTestId('hover-card-rovo-unauthorised-view')).toBeInTheDocument();
		expect(
			screen.getByTestId('hover-card-rovo-unauthorised-view-feature-document-summaries'),
		).toBeInTheDocument();
		expect(
			screen.getByTestId('hover-card-rovo-unauthorised-view-connect-account'),
		).toBeInTheDocument();
		expect(screen.getByTestId('hover-card-rovo-unauthorised-view-not-now')).toBeInTheDocument();
	});

	it('invokes authorize when Connect is clicked', async () => {
		const user = userEvent.setup();
		render(<TestComponent />);

		await user.click(screen.getByTestId('hover-card-rovo-unauthorised-view-connect-account'));

		expect(mockAuthorize).toHaveBeenCalledWith(CardDisplay.HoverCardPreview);
	});

	it('calls onDismiss when Maybe later is clicked', async () => {
		const user = userEvent.setup();
		const onDismiss = jest.fn();
		render(<TestComponent propOverrides={{ onDismiss }} />);

		await user.click(screen.getByTestId('hover-card-rovo-unauthorised-view-not-now'));

		expect(onDismiss).toHaveBeenCalled();
	});
});
