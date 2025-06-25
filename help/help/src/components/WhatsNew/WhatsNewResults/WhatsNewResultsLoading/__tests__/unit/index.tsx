import React from 'react';
import { render } from '@testing-library/react';
import { createIntl, createIntlCache } from 'react-intl-next';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';

import { WhatsNewResultsLoading } from '../../index';

// Messages
const cache = createIntlCache();
const intl = createIntl(
	{
		locale: 'en',
		messages: {},
	},
	cache,
);

const analyticsSpy = jest.fn();

describe('WhatsNewResultsLoading', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<AnalyticsListener channel="help" onEvent={analyticsSpy}>
				<WhatsNewResultsLoading intl={intl} />
			</AnalyticsListener>,
		);

		await expect(container).toBeAccessible({
			violationCount: 2,
		});
	});

	it('Should match snapshot', () => {
		const { asFragment } = render(
			<AnalyticsListener channel="help" onEvent={analyticsSpy}>
				<WhatsNewResultsLoading intl={intl} />
			</AnalyticsListener>,
		);

		expect(asFragment()).toMatchSnapshot();
	});
});
