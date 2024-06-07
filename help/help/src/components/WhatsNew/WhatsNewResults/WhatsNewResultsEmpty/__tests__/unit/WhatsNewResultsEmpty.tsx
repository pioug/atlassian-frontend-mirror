import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent } from '@testing-library/react';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { createIntl, createIntlCache } from 'react-intl-next';

import { messages } from '../../../../../../messages';
import { WhatsNewResultsEmpty } from '../..';

const cache = createIntlCache();
const intl = createIntl(
	{
		locale: 'en',
		messages: {},
	},
	cache,
);
const messageClearFilterLink = intl.formatMessage(
	messages.help_whats_new_no_results_clear_filter_button_label,
);

const mockOnClearFilter = jest.fn();
const analyticsSpy = jest.fn();

describe('WhatsNewResultsEmpty', () => {
	it('Should match snapshot', () => {
		const { container } = render(
			<WhatsNewResultsEmpty intl={intl} onClearFilter={mockOnClearFilter} />,
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	it('Execute the function prop "onClearFilter" when the user clicks the link to open clear the filter', () => {
		const { queryByText } = render(
			<AnalyticsListener channel="help" onEvent={analyticsSpy}>
				<WhatsNewResultsEmpty intl={intl} onClearFilter={mockOnClearFilter} />
			</AnalyticsListener>,
		);

		const LinkLabel = queryByText(messageClearFilterLink);
		expect(LinkLabel).not.toBeNull();

		if (LinkLabel) {
			const link = LinkLabel.closest('a');

			expect(link).not.toBeNull();

			if (link) {
				expect(mockOnClearFilter).toHaveBeenCalledTimes(0);
				fireEvent.click(link);
				expect(mockOnClearFilter).toHaveBeenCalledTimes(1);
			}
		}
	});
});
