import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { type CardState } from '@atlaskit/linking-common';

import { ANALYTICS_CHANNEL } from '../../../../../utils/analytics';
import { mockAnalytics, mocks } from '../../../../../utils/mocks';
import FlexibleForbiddenView from '../FlexibleForbiddenView';
import '@atlaskit/link-test-helpers/jest';

describe('FlexibleForbiddenView', () => {
	const url = 'https://some.url';
	const baseCardState = {
		status: 'forbidden',
		details: {
			...mocks.forbidden,
			data: {
				...mocks.forbidden.data,
			},
			meta: {
				...mocks.forbidden.meta,
				requestAccess: {
					accessType: 'REQUEST_ACCESS',
				},
			},
		},
	} as CardState;

	const setup = (props?: Partial<React.ComponentProps<typeof FlexibleForbiddenView>>) => {
		window.open = jest.fn();

		const onEventMock = jest.fn();

		const renderResult = render(
			<AnalyticsListener onEvent={onEventMock} channel={ANALYTICS_CHANNEL}>
				<IntlProvider locale="en">
					<SmartCardProvider>
						<FlexibleForbiddenView
							analytics={mockAnalytics}
							cardState={props?.cardState ?? baseCardState}
							url={url}
							{...props}
						/>
					</SmartCardProvider>
				</IntlProvider>
			</AnalyticsListener>,
		);

		return {
			...renderResult,
			onEventMock,
		};
	};

	it('fires analytics event when button is clicked and access type is REQUEST_ACCESS', async () => {
		const { findByTestId, onEventMock } = setup();

		userEvent.setup();
		const button = await findByTestId('smart-action-connect-other-account');
		await userEvent.click(button);

		expect(onEventMock).toBeFiredWithAnalyticEventOnce({
			payload: {
				action: 'clicked',
				actionSubject: 'button',
				actionSubjectId: 'requestAccess',
				eventType: 'ui',
			},
		});
	});

	it('fires analytics event when button is clicked and access type is DIRECT_ACCESS', async () => {
		const { findByTestId, onEventMock } = setup({
			cardState: {
				...baseCardState,
				details: {
					...mocks.forbidden,
					meta: {
						...mocks.forbidden.meta,
						requestAccess: {
							accessType: 'DIRECT_ACCESS',
						},
					},
				},
			},
		});

		userEvent.setup();
		const button = await findByTestId('smart-action-connect-other-account');
		await userEvent.click(button);

		expect(onEventMock).toBeFiredWithAnalyticEventOnce({
			payload: {
				action: 'clicked',
				actionSubject: 'button',
				actionSubjectId: 'crossJoin',
				eventType: 'ui',
			},
		});
	});
});
