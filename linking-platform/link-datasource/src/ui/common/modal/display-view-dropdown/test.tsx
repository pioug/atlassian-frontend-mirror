import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { DisplayViewModes } from '../../../../common/types';

import { DisplayViewDropDown } from './display-view-drop-down';

describe('DisplayViewDropDown', () => {
  type SetupProps = {
    openDropDownByDefault: boolean;
    defaultViewMode: DisplayViewModes;
  };

  const setup = (props: Partial<SetupProps> = {}) => {
    const { openDropDownByDefault = true, defaultViewMode = 'table' } = props;
    const mockOnViewModeChange = jest.fn();
    const component = render(
      <IntlProvider locale="en">
        <DisplayViewDropDown
          onViewModeChange={mockOnViewModeChange}
          viewMode={defaultViewMode}
        />
      </IntlProvider>,
    );

    const openDropdown = () => {
      fireEvent.click(
        component.getByTestId('datasource-modal--view-drop-down--trigger'),
      );
    };

    if (openDropDownByDefault) {
      openDropdown();
    }

    return { ...component, mockOnViewModeChange, openDropdown };
  };

  it('items should only render in the dropdown menu after it is clicked', () => {
    const { queryByTestId, getByTestId, openDropdown } = setup({
      openDropDownByDefault: false,
    });

    expect(queryByTestId('dropdown-item-table')).toBeNull();
    expect(queryByTestId('dropdown-item-inline-link')).toBeNull();

    openDropdown();

    expect(getByTestId('dropdown-item-table')).toBeInTheDocument();
    expect(getByTestId('dropdown-item-inline-link')).toBeInTheDocument();
  });

  it('displays the correct item title in the dropdown menu', () => {
    const { getByTestId } = setup();

    expect(getByTestId('dropdown-item-table')).toHaveTextContent('Table');
    expect(getByTestId('dropdown-item-inline-link')).toHaveTextContent(
      'Inline link',
    );
  });

  it('should display the correct item description in the dropdown menu', () => {
    const { getByTestId } = setup();

    expect(getByTestId('dropdown-item-table')).toHaveTextContent(
      'Display search results as a table',
    );
    expect(getByTestId('dropdown-item-inline-link')).toHaveTextContent(
      'Display the number of search results or as an inline smart link',
    );
  });

  it('should display table item followed by inline item', () => {
    const { getByTestId } = setup();

    const tableItem = getByTestId('dropdown-item-table');
    const inlineLinkItem = getByTestId('dropdown-item-inline-link');

    expect(
      tableItem.compareDocumentPosition(inlineLinkItem) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeGreaterThan(0);
  });

  it('should call onViewModeChange when new view is selected', () => {
    const { getByTestId, openDropdown, mockOnViewModeChange } = setup();

    fireEvent.click(getByTestId('dropdown-item-inline-link'));
    expect(mockOnViewModeChange).toHaveBeenCalledWith('inline');

    openDropdown();

    fireEvent.click(getByTestId('dropdown-item-table'));
    expect(mockOnViewModeChange).toHaveBeenCalledWith('table');
  });
});
