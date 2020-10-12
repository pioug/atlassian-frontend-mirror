import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent } from '@testing-library/react';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { IntlProvider } from 'react-intl';

import { messages } from '../../../../../messages';
import { SearchResultsEmpty } from '../../SearchResultsEmpty';

const intlProvider = new IntlProvider({ locale: 'en' });
const { intl } = intlProvider.getChildContext();
const messageNoResultLink = intl.formatMessage(
  messages.help_search_results_external_site_link,
);

const mockOnSearchExternalUrlClick = jest.fn();
const mockSearchExternalUrl = 'https://www.atlassian.com/';
const analyticsSpy = jest.fn();

describe('SearchResultsError', () => {
  it('Should match snapshot', () => {
    const { container } = render(
      <SearchResultsEmpty
        intl={intl}
        onSearchExternalUrlClick={mockOnSearchExternalUrlClick}
        searchExternalUrl={mockSearchExternalUrl}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('Hide part of the alert message and the link to open a new page using the value of SearchExternalUrl if "SearchExternalUrl" is not defined', () => {
    const { queryByText } = render(
      <SearchResultsEmpty
        intl={intl}
        onSearchExternalUrlClick={mockOnSearchExternalUrlClick}
      />,
    );

    const LinkLabel = queryByText(messageNoResultLink);
    expect(LinkLabel).toBeNull();
  });

  it('display full alert message and the link to open a new page using the value of SearchExternalUrl if "SearchExternalUrl" is defined', () => {
    const { queryByText } = render(
      <SearchResultsEmpty
        intl={intl}
        onSearchExternalUrlClick={mockOnSearchExternalUrlClick}
        searchExternalUrl={mockSearchExternalUrl}
      />,
    );

    const LinkLabel = queryByText(messageNoResultLink);
    expect(LinkLabel).not.toBeNull();
  });

  it('Execute the function prop "onSearchExternalUrlClick" the the user clicks the link to open the external url', () => {
    const { queryByText } = render(
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <SearchResultsEmpty
          intl={intl}
          onSearchExternalUrlClick={mockOnSearchExternalUrlClick}
          searchExternalUrl={mockSearchExternalUrl}
        />
      </AnalyticsListener>,
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
