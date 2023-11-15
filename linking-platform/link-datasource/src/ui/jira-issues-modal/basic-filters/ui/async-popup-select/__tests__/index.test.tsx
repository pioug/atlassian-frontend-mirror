import React from 'react';

import { fireEvent, render, waitFor, within } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import invariant from 'tiny-invariant';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import {
  fieldValuesResponseForAssigneesMapped,
  fieldValuesResponseForProjectsMapped,
  fieldValuesResponseForStatusesMapped,
} from '@atlaskit/link-test-helpers/datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { token } from '@atlaskit/tokens';

import { EVENT_CHANNEL } from '../../../../../../analytics/constants';
import {
  FilterOptionsState,
  useFilterOptions,
} from '../../../hooks/useFilterOptions';
import { BasicFilterFieldType, SelectOption } from '../../../types';
import AsyncPopupSelect, { AsyncPopupSelectProps } from '../index';

jest.mock('../../../hooks/useFilterOptions');
jest.useFakeTimers();

const setup = ({
  filterType = 'project',
  cloudId,
  selection,
  onSelectionChange,
  filterOptions,
  openPicker,
  totalCount,
  status,
  isDisabled,
  fetchFilterOptions,
  pageCursor,
  errors,
}: Partial<
  AsyncPopupSelectProps & FilterOptionsState & { openPicker?: boolean }
> = {}) => {
  asMock(useFilterOptions).mockReturnValue({
    filterOptions: filterOptions || [],
    status: status || 'empty',
    totalCount: totalCount || 0,
    fetchFilterOptions: fetchFilterOptions || jest.fn(),
    pageCursor: pageCursor || undefined,
    errors: errors || undefined,
  });

  const mockOnSelectionChange = jest.fn();
  const onAnalyticFireEvent = jest.fn();

  const renderResult = render(
    <AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
      <IntlProvider locale="en">
        <AsyncPopupSelect
          filterType={filterType}
          cloudId={cloudId as string}
          selection={selection || []}
          onSelectionChange={onSelectionChange || mockOnSelectionChange}
          isDisabled={isDisabled}
        />
      </IntlProvider>
    </AnalyticsListener>,
  );

  if (openPicker) {
    const triggerButton = renderResult.queryByTestId(
      `jlol-basic-filter-${filterType}-trigger`,
    );

    invariant(triggerButton);
    fireEvent.click(triggerButton);
  }

  return { ...renderResult, onAnalyticFireEvent };
};

describe('Testing AsyncPopupSelect', () => {
  describe('popup trigger button', () => {
    it.each<[BasicFilterFieldType, string]>([
      ['project', 'Project'],
      ['assignee', 'Assignee'],
      ['issuetype', 'Type'],
      ['status', 'Status'],
    ])(
      'should render the correct label for %s filter button',
      (filterType, label) => {
        const { queryByTestId } = setup({ filterType });
        const button = queryByTestId(`jlol-basic-filter-${filterType}-trigger`);

        invariant(button);

        expect(button.textContent).toEqual(label);
        expect(
          queryByTestId('jlol-basic-filter-popup-select--menu'),
        ).not.toBeInTheDocument();
      },
    );

    it.each<BasicFilterFieldType>([
      'project',
      'assignee',
      'issuetype',
      'status',
    ])(
      'should disable %s filter trigger button when isDisabled is true',
      filterType => {
        const { queryByTestId } = setup({ filterType, isDisabled: true });

        const button = queryByTestId(`jlol-basic-filter-${filterType}-trigger`);

        expect(button).toBeDisabled();
      },
    );

    it('should render the popup menu when the trigger button is clicked', () => {
      const { queryByTestId } = setup({
        openPicker: true,
      });

      expect(
        queryByTestId('jlol-basic-filter-popup-select--menu'),
      ).toBeInTheDocument();
    });

    describe('when options have been selected', () => {
      it.each<[BasicFilterFieldType, string]>([
        ['project', 'Project: Authorize'],
        ['assignee', 'Assignee: Authorize'],
        ['issuetype', 'Type: Authorize'],
        ['status', 'Status: Authorize'],
      ])(
        'should render the correct label for %s filter button when a single option has been selected',
        (filterType, label) => {
          const selectedOptions: SelectOption[] = [
            {
              appearance: 'inprogress',
              label: 'Authorize',
              optionType: 'lozengeLabel',
              value: 'Authorize',
            },
          ];

          const { queryByTestId } = setup({
            filterType,
            selection: selectedOptions,
          });

          const button = queryByTestId(
            `jlol-basic-filter-${filterType}-trigger`,
          );

          expect(button).toBeInTheDocument();
          expect(button?.textContent).toEqual(label);
        },
      );

      it.each<[BasicFilterFieldType, string]>([
        ['project', 'Project: Authorize+1'],
        ['assignee', 'Assignee: Authorize+1'],
        ['issuetype', 'Type: Authorize+1'],
        ['status', 'Status: Authorize+1'],
      ])(
        'should render the correct label for %s filter button when multiple options have been selected',
        (filterType, label) => {
          const selectedOptions: SelectOption[] = [
            {
              appearance: 'inprogress',
              label: 'Authorize',
              optionType: 'lozengeLabel',
              value: 'Authorize',
            },
            {
              appearance: 'inprogress',
              label: 'Awaiting approval',
              optionType: 'lozengeLabel',
              value: '"Awaiting approval"',
            },
          ];

          const { queryByTestId } = setup({
            filterType,
            selection: selectedOptions,
          });

          const button = queryByTestId(
            `jlol-basic-filter-${filterType}-trigger`,
          );

          expect(button).toBeInTheDocument();
          expect(button?.textContent).toEqual(label);
        },
      );
    });
  });
  describe('popup footer', () => {
    it('should render the popup footer when the popup is opened', () => {
      const { queryByTestId } = setup({
        openPicker: true,
        totalCount: 10,
        filterOptions: fieldValuesResponseForProjectsMapped as SelectOption[],
        status: 'resolved',
      });

      const footer = queryByTestId('jlol-basic-filter-popup-select--footer');
      expect(footer).toBeInTheDocument();
    });

    it('should not render the popup footer when the status is rejected', () => {
      const { queryByTestId } = setup({
        openPicker: true,
        filterOptions: fieldValuesResponseForProjectsMapped as SelectOption[],
        status: 'rejected',
      });

      const footer = queryByTestId('jlol-basic-filter-popup-select--footer');
      expect(footer).not.toBeInTheDocument();
    });

    it('should render the popup footer with correct pagination info', () => {
      const { queryByTestId } = setup({
        openPicker: true,
        totalCount: 10,
        filterOptions: fieldValuesResponseForProjectsMapped as SelectOption[],
        status: 'resolved',
      });

      const footer = queryByTestId('jlol-basic-filter-popup-select--footer');

      expect(footer).toHaveTextContent('10 of 10');
    });
  });

  it('should call fetchFilterOptions when opening the modal and status is empty', () => {
    const mockFetchFilterOptions = jest.fn();

    const { container } = setup({
      filterType: 'status',
      openPicker: true,
      fetchFilterOptions: mockFetchFilterOptions,
      status: 'empty',
    });

    const input = container.parentElement?.querySelector(
      '#jlol-basic-filter-popup-select--input',
    );
    invariant(input);

    expect(mockFetchFilterOptions).toBeCalledTimes(1);
    expect(mockFetchFilterOptions).toHaveBeenNthCalledWith(1, {
      searchString: '',
    });
  });

  it('should call fetchFilterOptions when opening the modal and status is rejected', () => {
    const mockFetchFilterOptions = jest.fn();

    const { container } = setup({
      filterType: 'status',
      openPicker: true,
      fetchFilterOptions: mockFetchFilterOptions,
      status: 'rejected',
    });

    const input = container.parentElement?.querySelector(
      '#jlol-basic-filter-popup-select--input',
    );
    invariant(input);

    expect(mockFetchFilterOptions).toBeCalledTimes(1);
    expect(mockFetchFilterOptions).toHaveBeenNthCalledWith(1, {
      searchString: '',
    });
  });

  it('should show the loading UI when the status is loading', () => {
    const { getByText, queryByTestId } = setup({
      filterType: 'status',
      filterOptions: fieldValuesResponseForStatusesMapped as SelectOption[],
      openPicker: true,
      status: 'loading',
    });

    expect(
      queryByTestId('jlol-basic-filter-popup-select--loading-message'),
    ).toBeInTheDocument();
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('should show the empty state UI when the status is resolved but no options are available', () => {
    const { getByText, queryByTestId } = setup({
      filterType: 'status',
      filterOptions: [],
      openPicker: true,
      status: 'resolved',
    });

    expect(
      queryByTestId('jlol-basic-filter-popup-select--no-options-message'),
    ).toBeInTheDocument();
    expect(getByText('No matches found')).toBeInTheDocument();
  });

  it('should show the error state UI when the status is rejected', () => {
    const { getByText, queryByTestId } = setup({
      filterType: 'status',
      filterOptions: [],
      openPicker: true,
      status: 'rejected',
    });

    expect(
      queryByTestId('jlol-basic-filter-popup-select--error-message'),
    ).toBeInTheDocument();

    expect(getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should show the show more button when the status is resolved, pageCursor exists and totalCount is not equal to filterOptions length', () => {
    const mockFetchFilterOptions = jest.fn();

    const { getByTestId, getByText } = setup({
      filterType: 'assignee',
      filterOptions: fieldValuesResponseForAssigneesMapped as SelectOption[],
      openPicker: true,
      status: 'resolved',
      pageCursor: 'YXJyYXljb25uZWN0aW9uOjk=',
      fetchFilterOptions: mockFetchFilterOptions,
      totalCount: 21,
    });

    expect(getByText('10 of 21')).toBeInTheDocument();

    const showMoreButton = getByTestId(
      'jlol-basic-filter-popup-select--show-more-button',
    );
    fireEvent.click(showMoreButton);

    expect(mockFetchFilterOptions).toBeCalledTimes(1);
    expect(mockFetchFilterOptions).toHaveBeenNthCalledWith(1, {
      pageCursor: 'YXJyYXljb25uZWN0aW9uOjk=',
      searchString: '',
    });
  });

  it('should call fetchFilterOptions with searchString if showMore button pressed with search term inputted', () => {
    const mockFetchFilterOptions = jest.fn();

    const { getByTestId, container } = setup({
      filterType: 'assignee',
      filterOptions: fieldValuesResponseForAssigneesMapped as SelectOption[],
      openPicker: true,
      status: 'resolved',
      pageCursor: 'YXJyYXljb25uZWN0aW9uOjk=',
      fetchFilterOptions: mockFetchFilterOptions,
      totalCount: 21,
    });

    const input = container.parentElement?.querySelector(
      '#jlol-basic-filter-popup-select--input',
    );
    invariant(input);

    fireEvent.change(input, { target: { value: 'a' } });

    const showMoreButton = getByTestId(
      'jlol-basic-filter-popup-select--show-more-button',
    );
    fireEvent.click(showMoreButton);

    expect(mockFetchFilterOptions).toBeCalledTimes(1);
    expect(mockFetchFilterOptions).toHaveBeenNthCalledWith(1, {
      pageCursor: 'YXJyYXljb25uZWN0aW9uOjk=',
      searchString: 'a',
    });
  });

  it('should call fetchFilterOptions with searchString when user inputs a search term', () => {
    const mockFetchFilterOptions = jest.fn();

    const { container } = setup({
      filterType: 'status',
      openPicker: true,
      fetchFilterOptions: mockFetchFilterOptions,
      status: 'empty',
    });

    const input = container.parentElement?.querySelector(
      '#jlol-basic-filter-popup-select--input',
    );
    invariant(input);

    fireEvent.change(input, { target: { value: 'projects' } });

    jest.advanceTimersByTime(350);

    expect(mockFetchFilterOptions).toBeCalledTimes(2);
    expect(mockFetchFilterOptions).toHaveBeenNthCalledWith(2, {
      searchString: 'projects',
    });
  });

  it('should render the correct options', () => {
    const { getByText } = setup({
      filterType: 'status',
      filterOptions: fieldValuesResponseForStatusesMapped as SelectOption[],
      openPicker: true,
      status: 'resolved',
    });

    expect(getByText('Authorize')).toBeInTheDocument();
    expect(getByText('Canceled')).toBeInTheDocument();
    expect(getByText('Closed')).toBeInTheDocument();
  });

  it('should render options with those selected ordered first for initial render', async () => {
    const selectedOption: SelectOption[] = [
      {
        appearance: 'success',
        label: 'Canceled',
        optionType: 'lozengeLabel',
        value: 'Canceled',
      },
    ];

    const { findByTestId } = setup({
      filterType: 'status',
      filterOptions: fieldValuesResponseForStatusesMapped as SelectOption[],
      selection: selectedOption,
      openPicker: true,
      status: 'resolved',
    });

    const selectMenu = await findByTestId(
      'jlol-basic-filter-popup-select--menu',
    );
    const optionLozenges = within(selectMenu).queryAllByTestId(
      'jlol-basic-filter-popup-select-option--lozenge',
    );

    // Check that the ordering of optionLozenges is correct
    const expectedTextContents = [
      'Canceled',
      'Authorize',
      'Awaiting approval',
      'Awaiting implementation',
      'Closed',
    ];

    expectedTextContents.forEach((expectedTextContent, index) => {
      expect(optionLozenges[index]).toHaveTextContent(expectedTextContent);
    });
  });

  it('should render the search box with placeholder correctly when menu is opened', () => {
    const { container } = setup({
      openPicker: true,
      filterType: 'status',
      filterOptions: fieldValuesResponseForStatusesMapped as SelectOption[],
    });

    const input = container.parentElement?.querySelector(
      '#jlol-basic-filter-popup-select--input',
    );

    expect(input).toBeVisible();
    expect(input).toHaveAttribute('aria-label', 'Search');
  });

  it('should focus the search input after opening the picker', async () => {
    const { container } = setup({
      openPicker: true,
      filterType: 'status',
      filterOptions: fieldValuesResponseForStatusesMapped as SelectOption[],
    });

    const input = container.parentElement?.querySelector(
      '#jlol-basic-filter-popup-select--input',
    );

    await waitFor(() => {
      expect(input).toBeVisible();
      expect(input).toHaveFocus();
    });
  });

  it('should select the correct option when selectedOptions is passed', () => {
    const { queryAllByTestId } = setup({
      selection: [fieldValuesResponseForStatusesMapped[0] as SelectOption],
      filterType: 'status',
      filterOptions: fieldValuesResponseForStatusesMapped as SelectOption[],
      openPicker: true,
      status: 'resolved',
    });

    const [firstOption] = queryAllByTestId(
      'jlol-basic-filter-popup-select-option--lozenge',
    );

    expect(
      firstOption?.parentElement?.parentElement?.querySelector('div span'),
    ).toHaveStyle(
      `--icon-secondary-color: ${token('elevation.surface', '#FFFFFF')}`,
    );
  });

  it('should call on selection callback when selecting items', () => {
    const mockOnSelection = jest.fn();
    const expectedFirstSelection = [
      {
        appearance: 'inprogress',
        label: 'Authorize',
        optionType: 'lozengeLabel',
        value: 'Authorize',
      },
    ] as SelectOption[];

    const { queryByTestId, queryAllByTestId, rerender } = setup({
      filterType: 'status',
      filterOptions: fieldValuesResponseForStatusesMapped as SelectOption[],
      openPicker: true,
      onSelectionChange: mockOnSelection,
      status: 'resolved',
    });

    const [firstOption] = queryAllByTestId(
      'jlol-basic-filter-popup-select-option--lozenge',
    );

    fireEvent.click(firstOption);

    expect(mockOnSelection).toHaveBeenNthCalledWith(1, expectedFirstSelection);

    // since the parent is handling selection, we need the rerender with the first selection object
    rerender(
      <IntlProvider locale="en">
        <AsyncPopupSelect
          filterType={'status'}
          cloudId={''}
          onSelectionChange={mockOnSelection}
          selection={expectedFirstSelection}
        />
      </IntlProvider>,
    );

    // after rerender, open the popup again
    const triggerButton = queryByTestId(`jlol-basic-filter-status-trigger`);

    invariant(triggerButton);
    fireEvent.click(triggerButton);

    const [_, secondOption] = queryAllByTestId(
      'jlol-basic-filter-popup-select-option--lozenge',
    );

    fireEvent.click(secondOption);

    expect(mockOnSelection).toHaveBeenNthCalledWith(2, [
      {
        appearance: 'inprogress',
        label: 'Authorize',
        optionType: 'lozengeLabel',
        value: 'Authorize',
      },
      {
        appearance: 'inprogress',
        label: 'Awaiting approval',
        optionType: 'lozengeLabel',
        value: '"Awaiting approval"',
      },
    ]);
  });
});

describe('Analytics: AsyncPopupSelect', () => {
  it('should fire "ui.emptyResult.shown.basicSearchDropdown" when the empty UI is shown', () => {
    const { onAnalyticFireEvent } = setup({
      filterType: 'status',
      filterOptions: [],
      openPicker: true,
      status: 'resolved',
    });

    jest.advanceTimersByTime(350);

    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          eventType: 'ui',
          action: 'shown',
          actionSubject: 'emptyResult',
          actionSubjectId: 'basicSearchDropdown',
          attributes: {
            filterType: 'status',
          },
        },
      },
      EVENT_CHANNEL,
    );
  });

  it('should fire "ui.error.shown.basicSearchDropdown" with reason as unknown when the error UI is shown', () => {
    const { onAnalyticFireEvent } = setup({
      filterType: 'status',
      filterOptions: [],
      openPicker: true,
      status: 'rejected',
    });

    jest.advanceTimersByTime(350);

    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          eventType: 'ui',
          action: 'shown',
          actionSubject: 'error',
          actionSubjectId: 'basicSearchDropdown',
          attributes: {
            filterType: 'status',
            reason: 'unknown',
          },
        },
      },
      EVENT_CHANNEL,
    );
  });

  it('should fire "ui.error.shown.basicSearchDropdown" with reason as agg when the error UI is shown', () => {
    const { onAnalyticFireEvent } = setup({
      filterType: 'status',
      filterOptions: [],
      openPicker: true,
      status: 'rejected',
      errors: [{}],
    });

    jest.advanceTimersByTime(350);

    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          eventType: 'ui',
          action: 'shown',
          actionSubject: 'error',
          actionSubjectId: 'basicSearchDropdown',
          attributes: {
            filterType: 'status',
            reason: 'agg',
          },
        },
      },
      EVENT_CHANNEL,
    );
  });

  it('should fire "ui.error.shown.basicSearchDropdown" with reason as networn when the error UI is shown', () => {
    const error = new Error('bla');

    const { onAnalyticFireEvent } = setup({
      filterType: 'status',
      filterOptions: [],
      openPicker: true,
      status: 'rejected',
      errors: [error],
    });

    jest.advanceTimersByTime(350);

    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          eventType: 'ui',
          action: 'shown',
          actionSubject: 'error',
          actionSubjectId: 'basicSearchDropdown',
          attributes: {
            filterType: 'status',
            reason: 'network',
          },
        },
      },
      EVENT_CHANNEL,
    );
  });
});
