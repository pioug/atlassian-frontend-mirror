import React, { useState } from 'react';

import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { EVENT_CHANNEL } from '../../../../analytics';
import ConfluenceSearchContainer from '../index';

import '@atlaskit/link-test-helpers/jest';

type MockConfluenceSearchContainerProps = Partial<
  React.ComponentProps<typeof ConfluenceSearchContainer>
> & { onSearch: jest.Mock };

const onAnalyticFireEvent = jest.fn();

const TestConfluenceSearchContainer = ({
  onSearch,
  ...propsOverride
}: MockConfluenceSearchContainerProps) => {
  const [cloudId, setCloudId] = useState(propsOverride.cloudId ?? undefined);
  const setNewCloudId = () => setCloudId(() => Math.random().toString());

  return (
    // TODO: further refactoring in EDM-9573
    // https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/82725/overview?commentId=6828131
    <AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
      <button data-testid="mock-set-new-cloudid" onClick={setNewCloudId}>
        New cloudid
      </button>
      <IntlProvider locale="en">
        <ConfluenceSearchContainer
          initialSearchValue=""
          isSearching={false}
          onSearch={onSearch}
          {...propsOverride}
          cloudId={cloudId}
        />
      </IntlProvider>
    </AnalyticsListener>
  );
};

const setup = (
  propsOverride?: Partial<
    React.ComponentProps<typeof ConfluenceSearchContainer>
  >,
) => {
  const onSearch = jest.fn();
  const container = render(
    <TestConfluenceSearchContainer {...propsOverride} onSearch={onSearch} />,
  );

  return {
    container,
    onSearch,
  };
};

const testIds = {
  mockSetNewCloudId: 'mock-set-new-cloudid',
  searchInput: 'confluence-search-datasource-modal--basic-search-input',
  searchButton: 'confluence-search-datasource-modal--basic-search-button',
};

describe('ConfluenceSearchContainer', () => {
  it('should set a loading indicator if isSearching is true', () => {
    const { container } = setup({ isSearching: true });

    const searchButton = container.getByTestId(testIds.searchButton);
    expect(searchButton.getAttribute('aria-disabled')).toBe('true');
  });

  it('should set the initial search value based on initialSearch prop', () => {
    const { container } = setup({ initialSearchValue: 'blah' });

    const searchInput = container.getByTestId(testIds.searchInput);
    expect(searchInput.getAttribute('value')).toEqual('blah');
  });

  it('should allow user to enter a value into text field, submit it, which triggers onSearch()', () => {
    const { container, onSearch } = setup({
      initialSearchValue: 'blah',
    });

    const searchInput = container.getByTestId(testIds.searchInput);
    const searchButton = container.getByTestId(testIds.searchButton);

    // TODO: further refactoring in EDM-9573
    // https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/82725/overview?commentId=6828134
    fireEvent.change(searchInput, { target: { value: 'newvalue' } });

    expect(searchInput.getAttribute('value')).toEqual('newvalue');

    fireEvent.click(searchButton);
    expect(onSearch).toHaveBeenCalledWith('newvalue');
  });

  it('should reset search string to "" when cloudId is changed', () => {
    const { container } = setup({ initialSearchValue: 'blah' });

    const searchInput = container.getByTestId(testIds.searchInput);
    expect(searchInput.getAttribute('value')).toEqual('blah');
    fireEvent.click(container.getByTestId(testIds.mockSetNewCloudId));

    expect(searchInput.getAttribute('value')).toEqual('');
  });
});

describe('Analytics: ConfluenceSearchContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ui.form.submitted.basicSearch', () => {
    it('should fire event on search button click', async () => {
      const {
        container: { getByTestId },
      } = setup();

      const basicTextInput = getByTestId(testIds.searchInput);

      fireEvent.change(basicTextInput, {
        target: { value: 'testing' },
      });

      fireEvent.click(getByTestId(testIds.searchButton));

      expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
        {
          payload: {
            action: 'submitted',
            actionSubject: 'form',
            actionSubjectId: 'basicSearch',
            attributes: {},
            eventType: 'ui',
          },
        },
        EVENT_CHANNEL,
      );
    });

    it('should fire event on enter key press', async () => {
      const {
        container: { getByTestId },
      } = setup();

      const basicTextInput = getByTestId(testIds.searchInput);

      await userEvent.type(basicTextInput, 'testing{enter}');

      expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
        {
          payload: {
            action: 'submitted',
            actionSubject: 'form',
            actionSubjectId: 'basicSearch',
            attributes: {},
            eventType: 'ui',
          },
        },
        EVENT_CHANNEL,
      );
    });
  });
});

ffTest.on(
  'platform.linking-platform.datasource.show-clol-basic-filters',
  'view basic filters',
  () => {
    it('should show basic filter container', () => {
      const {
        container: { queryByTestId },
      } = setup();

      expect(queryByTestId('clol-basic-filter-container')).toBeInTheDocument();
    });
  },
);

ffTest.off(
  'platform.linking-platform.datasource.show-clol-basic-filters',
  'view basic filters',
  () => {
    it('should not show basic filter container', () => {
      const {
        container: { queryByTestId },
      } = setup();

      expect(
        queryByTestId('clol-basic-filter-container'),
      ).not.toBeInTheDocument();
    });
  },
);
