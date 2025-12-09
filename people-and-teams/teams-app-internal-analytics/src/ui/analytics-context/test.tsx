import React from 'react';

import { render } from '@testing-library/react';

import { PEOPLE_TEAMS_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import { AnalyticsContext } from '@atlaskit/analytics-next';

import { defaultAnalyticsContextData, TeamsAppAnalyticsContext } from './index';

jest.mock('@atlaskit/analytics-next', () => ({
	AnalyticsContext: jest.fn().mockImplementation((props) => <div>{props.children}</div>),
}));

describe('PeopleTeamsAnalyticsContext', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('calls AnalyticsContext with empty data when no data is provided', () => {
		render(
			<TeamsAppAnalyticsContext>
				<div>Test Child</div>
			</TeamsAppAnalyticsContext>,
		);

		expect(AnalyticsContext).toHaveBeenCalledWith(
			expect.objectContaining({
				data: {
					[PEOPLE_TEAMS_CONTEXT]: {
						...defaultAnalyticsContextData,
					},
				},
			}),
			expect.anything(),
		);
	});

	it('calls AnalyticsContext with data when provided', () => {
		const customData = {
			source: 'userProfileScreen',
			attributes: {
				testAttribute: 'testValue',
				component: 'test-component',
			},
		} as const;

		render(
			<TeamsAppAnalyticsContext data={customData}>
				<div>Test Child</div>
			</TeamsAppAnalyticsContext>,
		);

		expect(AnalyticsContext).toHaveBeenCalledWith(
			expect.objectContaining({
				data: {
					[PEOPLE_TEAMS_CONTEXT]: {
						source: 'userProfileScreen',
						...defaultAnalyticsContextData,
						attributes: {
							testAttribute: 'testValue',
							component: 'test-component',
						},
					},
				},
			}),
			expect.anything(),
		);
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<TeamsAppAnalyticsContext>
				<div>Test Child</div>
			</TeamsAppAnalyticsContext>,
		);
		await expect(container).toBeAccessible();
	});
});
