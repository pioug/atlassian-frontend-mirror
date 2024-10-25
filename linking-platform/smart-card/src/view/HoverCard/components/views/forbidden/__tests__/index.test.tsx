import '@atlaskit/link-test-helpers/jest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { SmartCardProvider } from '@atlaskit/link-provider';

import * as analytics from '../../../../../../utils/analytics';
import { getMockForbiddenDirectAccessResponse } from '../../../../__tests__/__mocks__/mocks';
import HoverCardForbiddenView from '../index';

const mockResponse = getMockForbiddenDirectAccessResponse();
const forbiddenViewTestId = 'hover-card-forbidden-view-resolved-view';

describe('Forbidden Hover Card', () => {
	const mockUrl = 'https://mock-url.com';

	afterEach(() => {
		jest.clearAllMocks();
	});

	const setUpHoverCard = async (customResponse: any = mockResponse) => {
		const user = userEvent.setup();

		const analyticsSpy = jest.fn();

		const { findByTestId, queryByTestId } = render(
			<AnalyticsListener channel={analytics.ANALYTICS_CHANNEL} onEvent={analyticsSpy}>
				<IntlProvider locale="en">
					<SmartCardProvider>
						<HoverCardForbiddenView
							flexibleCardProps={{
								cardState: {
									status: 'forbidden',
									details: customResponse,
								},
								children: {},
								url: mockUrl,
							}}
						/>
					</SmartCardProvider>
				</IntlProvider>
			</AnalyticsListener>,
		);

		return { findByTestId, queryByTestId, analyticsSpy, user };
	};

	it('renders forbidden hover card content', async () => {
		await setUpHoverCard();
		await screen.findByTestId(forbiddenViewTestId);
		const titleElement = await screen.findByTestId('hover-card-forbidden-view-title');
		const mainContentElement = await screen.findByTestId('hover-card-forbidden-view-content');
		const buttonElement = await screen.findByTestId('hover-card-forbidden-view-button');

		expect(titleElement.textContent).toBe('Join Jira to view this content');
		expect(mainContentElement.textContent).toBe(
			'Your team uses Jira to collaborate and you can start using it right away!',
		);
		expect(buttonElement.textContent).toBe('Join now');
	});

	it('does not render forbidden hover card when accessContext is undefined', async () => {
		const mockResponse = getMockForbiddenDirectAccessResponse();
		mockResponse.meta.requestAccess = undefined;
		await setUpHoverCard(mockResponse);
		const hoverCard = screen.queryByTestId(forbiddenViewTestId);

		expect(hoverCard).not.toBeInTheDocument();
	});

	it('does not render forbidden hover card when accessContext is malformed', async () => {
		const mockResponse = getMockForbiddenDirectAccessResponse();
		mockResponse.meta.requestAccess = {
			accessType: 'blah',
		};
		await setUpHoverCard(mockResponse);
		const hoverCard = screen.queryByTestId(forbiddenViewTestId);

		expect(hoverCard).not.toBeInTheDocument();
	});

	it('fires buttonClicked event on click of the request access button', async () => {
		const { analyticsSpy, user } = await setUpHoverCard();

		window.open = jest.fn();

		const buttonElement = await screen.findByTestId('hover-card-forbidden-view-button');
		await user.click(buttonElement);

		expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
			{
				payload: {
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'crossJoin',
					eventType: 'ui',
				},
			},
			analytics.ANALYTICS_CHANNEL,
		);
	});
});
