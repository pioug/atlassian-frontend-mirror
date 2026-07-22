import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent } from '@testing-library/react';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { createIntl, createIntlCache, IntlProvider } from 'react-intl';

import { WhatsNewResultsEmpty } from '../..';

const cache = createIntlCache();
const intl = createIntl(
	{
		locale: 'en',
		messages: {},
	},
	cache,
);
// The merged string uses rich-text formatting; match only the button text chunk
const messageClearFilterLink = 'Clear the filter';

const mockOnClearFilter = jest.fn();
const analyticsSpy = jest.fn();

describe('WhatsNewResultsEmpty', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<WhatsNewResultsEmpty intl={intl} onClearFilter={mockOnClearFilter} />
			</IntlProvider>,
		);

		await expect(container).toBeAccessible();
	});

	it('Execute the function prop "onClearFilter" when the user clicks the link to open clear the filter', () => {
		const { queryByText } = render(
			<IntlProvider locale="en">
				<AnalyticsListener channel="help" onEvent={analyticsSpy}>
					<WhatsNewResultsEmpty intl={intl} onClearFilter={mockOnClearFilter} />
				</AnalyticsListener>
			</IntlProvider>,
		);

		const button = queryByText(messageClearFilterLink);
		expect(button).not.toBeNull();

		if (button) {
			expect(mockOnClearFilter).toHaveBeenCalledTimes(0);
			fireEvent.click(button);
			expect(mockOnClearFilter).toHaveBeenCalledTimes(1);
		}
	});
});
