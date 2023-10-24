import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import invariant from 'tiny-invariant';

import { mockBasicFilterData } from '@atlaskit/link-test-helpers/datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { token } from '@atlaskit/tokens';

import {
  FieldValuesState,
  useFieldValues,
} from '../../../hooks/useFieldValues';
import AsyncPopupSelect, { AsyncPopupSelectProps } from '../index';
import { BasicFilterFieldType } from '../types';

jest.mock('../../../hooks/useFieldValues');

describe('Testing AsyncPopupSelect', () => {
  const setup = ({
    filterType,
    selection,
    onSelectionChange,
    filterOptions,
    openPicker,
    totalCount,
    status,
  }: Partial<
    AsyncPopupSelectProps & FieldValuesState & { openPicker?: boolean }
  > = {}) => {
    asMock(useFieldValues).mockReturnValue({
      filterOptions: filterOptions || [],
      status: status || 'empty',
      totalCount: totalCount || 0,
      fetchFilterOptions: jest.fn(),
    });

    const mockOnSelectionChange = jest.fn();

    const renderResult = render(
      <IntlProvider locale="en">
        <AsyncPopupSelect
          filterType={filterType || 'project'}
          selection={selection || []}
          onSelectionChange={onSelectionChange || mockOnSelectionChange}
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
      });

      const footer = queryByTestId('jlol-basic-filter-popup-select--footer');
      expect(footer).toBeInTheDocument();
    });

    it('should render the popup footer with correct pagination info', () => {
      const { queryByTestId } = setup({
        openPicker: true,
        totalCount: 10,
        filterOptions: mockBasicFilterData['project'],
      });

      const footer = queryByTestId('jlol-basic-filter-popup-select--footer');

      expect(footer).toHaveTextContent('3 of 10');
    });
  });

  it('should render the correct options', () => {
    const { getByText } = setup({
      filterType: 'status',
      filterOptions: mockBasicFilterData['status'],
      openPicker: true,
    });

    expect(getByText('Progress')).toBeInTheDocument();
    expect(getByText('Done')).toBeInTheDocument();
    expect(getByText('New')).toBeInTheDocument();
  });

  it('should render the search box with placeholder correctly when menu is opened', () => {
    const { container } = setup({
      openPicker: true,
      filterType: 'status',
      filterOptions: mockBasicFilterData['status'],
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
      filterOptions: mockBasicFilterData['status'],
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
      selection: mockBasicFilterData['status'][0],
      filterType: 'status',
      filterOptions: mockBasicFilterData['status'],
      openPicker: true,
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
      filterOptions: mockBasicFilterData['status'],
      openPicker: true,
      onSelectionChange: mockOnSelection,
    });

    const [firstOption, secondOption] = queryAllByTestId(
      'jlol-basic-filter-popup-select-option--lozenge',
    );

    fireEvent.click(firstOption);

    expect(mockOnSelection).toHaveBeenNthCalledWith(1, [
      {
        appearance: 'inprogress',
        label: 'Progress',
        optionType: 'lozengeLabel',
        value: 'Progress',
      },
    ]);

    fireEvent.click(secondOption);

    expect(mockOnSelection).toHaveBeenNthCalledWith(2, [
      {
        appearance: 'inprogress',
        label: 'Progress',
        optionType: 'lozengeLabel',
        value: 'Progress',
      },
      {
        appearance: 'success',
        label: 'Done',
        optionType: 'lozengeLabel',
        value: 'Done',
      },
    ]);
  });
});
