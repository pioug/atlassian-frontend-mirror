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
	it('Should match snapshot', () => {
		const { container } = render(
			<AnalyticsListener channel="help" onEvent={analyticsSpy}>
				<WhatsNewResultsLoading intl={intl} />
			</AnalyticsListener>,
		);

		expect(container.firstChild).toMatchSnapshot();
	});
});
