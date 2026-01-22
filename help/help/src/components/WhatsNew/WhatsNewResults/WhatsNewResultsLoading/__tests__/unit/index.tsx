import React from 'react';
import { render } from '@testing-library/react';
import { createIntl, createIntlCache } from 'react-intl-next';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';

import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import { WhatsNewResultsLoading } from '../../index';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

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
			// eslint-disable-next-line @atlassian/a11y/no-violation-count
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
