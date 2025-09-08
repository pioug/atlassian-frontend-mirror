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
			source: 'test-source',
			attributes: {
				testAttribute: 'testValue',
				component: 'test-component',
			},
		};

		render(
			<TeamsAppAnalyticsContext data={customData}>
				<div>Test Child</div>
			</TeamsAppAnalyticsContext>,
		);

		expect(AnalyticsContext).toHaveBeenCalledWith(
			expect.objectContaining({
				data: {
					[PEOPLE_TEAMS_CONTEXT]: {
						source: 'test-source',
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
});
