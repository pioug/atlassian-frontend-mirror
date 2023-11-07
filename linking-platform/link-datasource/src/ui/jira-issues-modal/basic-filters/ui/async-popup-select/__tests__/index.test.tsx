import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import invariant from 'tiny-invariant';

import {
  fieldValuesResponseForProjectsMapped,
  fieldValuesResponseForStatusesMapped,
} from '@atlaskit/link-test-helpers/datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { token } from '@atlaskit/tokens';

import {
  FilterOptionsState,
  useFilterOptions,
} from '../../../hooks/useFilterOptions';
import { BasicFilterFieldType, SelectOption } from '../../../types';
import AsyncPopupSelect, { AsyncPopupSelectProps } from '../index';

jest.mock('../../../hooks/useFilterOptions');

describe('Testing AsyncPopupSelect', () => {
  const setup = ({
    filterType,
    cloudId,
    selection,
    onSelectionChange,
    filterOptions,
    openPicker,
    totalCount,
    status,
    isDisabled,
    fetchFilterOptions,
  }: Partial<
    AsyncPopupSelectProps & FilterOptionsState & { openPicker?: boolean }
  > = {}) => {
    asMock(useFilterOptions).mockReturnValue({
      filterOptions: filterOptions || [],
      status: status || 'empty',
      totalCount: totalCount || 0,
      fetchFilterOptions: fetchFilterOptions || jest.fn(),
    });

    const mockOnSelectionChange = jest.fn();

    const renderResult = render(
      <IntlProvider locale="en">
        <AsyncPopupSelect
          filterType={filterType || 'project'}
          cloudId={cloudId as string}
          selection={selection || []}
          onSelectionChange={onSelectionChange || mockOnSelectionChange}
          isDisabled={isDisabled}
        />
      </IntlProvider>,
    );

    if (openPicker) {
      const triggerButton = renderResult.queryByTestId(
        `jlol-basic-filter-${filterType || 'project'}-trigger`,
      );

      invariant(triggerButton);
      fireEvent.click(triggerButton);
    }

    return { ...renderResult };
  };

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

        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(label);
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

      expect(footer).toHaveTextContent('4 of 10');
    });
  });

  it('should show the loading text when the status is loading', () => {
    const { getByText } = setup({
      filterType: 'status',
      filterOptions: fieldValuesResponseForStatusesMapped as SelectOption[],
      openPicker: true,
      status: 'loading',
    });

    expect(getByText('Loading...')).toBeInTheDocument();
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

    const { queryAllByTestId } = setup({
      filterType: 'status',
      filterOptions: fieldValuesResponseForStatusesMapped as SelectOption[],
      openPicker: true,
      onSelectionChange: mockOnSelection,
      status: 'resolved',
    });

    const [firstOption, secondOption] = queryAllByTestId(
      'jlol-basic-filter-popup-select-option--lozenge',
    );

    fireEvent.click(firstOption);

    expect(mockOnSelection).toHaveBeenNthCalledWith(1, [
      {
        appearance: 'inprogress',
        label: 'Authorize',
        optionType: 'lozengeLabel',
        value: 'Authorize',
      },
    ]);

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
