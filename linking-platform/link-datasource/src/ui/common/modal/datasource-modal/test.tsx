import React from 'react';

import { render } from '@testing-library/react';

import '@atlaskit/link-test-helpers/jest';

import { AnalyticsListener } from '@atlaskit/analytics-next';

import { DatasourceModal } from './index';

describe('DatasourceModal', () => {
	it('should fire datasourceModalDialog viewed screen event on mount', () => {
		const spy = jest.fn();

		render(
			<AnalyticsListener channel="media" onEvent={spy}>
				<DatasourceModal testId="datasource-modal" onClose={jest.fn()} />
			</AnalyticsListener>,
		);

		expect(spy).toBeFiredWithAnalyticEventOnce(
			{
				payload: {
					eventType: 'screen',
					name: 'datasourceModalDialog',
					action: 'viewed',
					attributes: {},
				},
			},
			'media',
		);
	});
});
