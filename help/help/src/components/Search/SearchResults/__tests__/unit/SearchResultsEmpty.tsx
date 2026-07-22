import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent } from '@testing-library/react';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { createIntl, createIntlCache, IntlProvider } from 'react-intl';

import { SearchResultsEmpty } from '../../SearchResultsEmpty';

// Messages
const cache = createIntlCache();
const intl = createIntl(
	{
		locale: 'en',
		messages: {},
	},
	cache,
);
const messageNoResultLink = 'search all online help articles';

const mockOnSearchExternalUrlClick = jest.fn();
const mockSearchExternalUrl = 'https://www.atlassian.com/';
const analyticsSpy = jest.fn();

describe('SearchResultsEmpty', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<SearchResultsEmpty
					intl={intl}
					onSearchExternalUrlClick={mockOnSearchExternalUrlClick}
					searchExternalUrl={mockSearchExternalUrl}
				/>
			</IntlProvider>,
		);

		await expect(container).toBeAccessible();
	});

	it('Hide part of the alert message and the link to open a new page using the value of SearchExternalUrl if "SearchExternalUrl" is not defined', () => {
		const { queryByText } = render(
			<IntlProvider locale="en">
				<SearchResultsEmpty intl={intl} onSearchExternalUrlClick={mockOnSearchExternalUrlClick} />
			</IntlProvider>,
		);

		const LinkLabel = queryByText(messageNoResultLink);
		expect(LinkLabel).toBeNull();
	});

	it('display full alert message and the link to open a new page using the value of SearchExternalUrl if "SearchExternalUrl" is defined', () => {
		const { queryByText } = render(
			<IntlProvider locale="en">
				<SearchResultsEmpty
					intl={intl}
					onSearchExternalUrlClick={mockOnSearchExternalUrlClick}
					searchExternalUrl={mockSearchExternalUrl}
				/>
			</IntlProvider>,
		);

		const LinkLabel = queryByText(messageNoResultLink);
		expect(LinkLabel).not.toBeNull();
	});

	it('Execute the function prop "onSearchExternalUrlClick" when the user clicks the link to open the external url', () => {
		const { queryByText } = render(
			<IntlProvider locale="en">
				<AnalyticsListener channel="help" onEvent={analyticsSpy}>
					<SearchResultsEmpty
						intl={intl}
						onSearchExternalUrlClick={mockOnSearchExternalUrlClick}
						searchExternalUrl={mockSearchExternalUrl}
					/>
				</AnalyticsListener>
			</IntlProvider>,
		);

		const LinkLabel = queryByText(messageNoResultLink);
		expect(LinkLabel).not.toBeNull();

		if (LinkLabel) {
			const link = LinkLabel.closest('a');

			expect(link).not.toBeNull();

			if (link) {
				expect(mockOnSearchExternalUrlClick).toHaveBeenCalledTimes(0);
				fireEvent.click(link);
				expect(mockOnSearchExternalUrlClick).toHaveBeenCalledTimes(1);
			}
		}
	});
});
