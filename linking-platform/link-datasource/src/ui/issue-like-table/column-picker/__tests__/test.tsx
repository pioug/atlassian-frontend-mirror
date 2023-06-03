import React from 'react';

import { fireEvent } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import invariant from 'tiny-invariant';

import { DatasourceResponseSchemaProperty } from '@atlaskit/linking-types';

import { ColumnPicker } from '../index';

const CSS_PREFIX = 'column-picker-popup';
const OPTION_CLASS = `.${CSS_PREFIX}__option`;
const OPTION_LIST_CLASS = `.${CSS_PREFIX}__menu-list`;
const OPTION_SELECTED_CLASS = `${OPTION_CLASS}--is-selected`;
const mockOnChange = jest.fn();
const renderColumnPicker = (
  columns: DatasourceResponseSchemaProperty[],
  selectedColumnKeys: string[],
  isDatasourceLoading: boolean,
) => {
  return render(
    <IntlProvider locale="en">
      <ColumnPicker
        columns={columns}
        onSelectedColumnKeysChange={mockOnChange}
        selectedColumnKeys={selectedColumnKeys}
        isDatasourceLoading={isDatasourceLoading}
      />
    </IntlProvider>,
  );
};

describe('Column picker', () => {
  it('popup button should be disabled if table is loading', async () => {
    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'type',
        type: 'icon',
        title: 'Type',
      },
      {
        key: 'blah',
        type: 'string',
        title: 'Blah',
      },
    ];

    const selectedColumnKeys: string[] = ['type'];

    const { getByTestId } = renderColumnPicker(
      columns,
      selectedColumnKeys,
      true,
    );

    // open popup
    const triggerButton = getByTestId('column-picker-trigger-button');
    expect(triggerButton).toBeDisabled();
  });

  it('should have correct default checked and unchecked checkboxes based on the columns info passed in', async () => {
    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'type',
        type: 'icon',
        title: 'Type',
      },
      {
        key: 'blah',
        type: 'string',
        title: 'Blah',
      },
    ];

    const selectedColumnKeys: string[] = ['type'];

    const { getByText, getByTestId } = renderColumnPicker(
      columns,
      selectedColumnKeys,
      false,
    );

    // open popup
    const triggerButton = getByTestId('column-picker-trigger-button');
    fireEvent.click(triggerButton);

    expect(getByText('Type').closest(OPTION_SELECTED_CLASS)).not.toBeNull();
    expect(getByText('Blah').closest(OPTION_SELECTED_CLASS)).toBeNull();
  });

  it('should call onChange with correct parameters if a checkbox is clicked', async () => {
    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'type',
        type: 'icon',
        title: 'Type',
      },
      {
        key: 'blah',
        type: 'string',
        title: 'Blah',
      },
    ];

    const selectedColumnKeys: string[] = ['type'];

    const { getByText, getByTestId } = renderColumnPicker(
      columns,
      selectedColumnKeys,
      false,
    );

    // open popup
    const triggerButton = getByTestId('column-picker-trigger-button');
    fireEvent.click(triggerButton);

    const checkbox = getByText('Blah').closest(OPTION_CLASS);
    invariant(checkbox);
    fireEvent.click(checkbox);

    expect(mockOnChange).toBeCalledTimes(1);

    expect(mockOnChange).toBeCalledWith(['type', 'blah']);
  });

  it('should bring all selected options to the top when opening the popup', async () => {
    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'matt',
        type: 'icon',
        title: 'Matt',
      },
      {
        key: 'tom',
        type: 'string',
        title: 'Tom',
      },
      {
        key: 'bob',
        type: 'string',
        title: 'Bob',
      },
      {
        key: 'john',
        type: 'string',
        title: 'John',
      },
    ];

    const selectedColumnKeys: string[] = ['tom', 'john'];

    const { getByText, getByTestId } = renderColumnPicker(
      columns,
      selectedColumnKeys,
      false,
    );

    // open popup
    const triggerButton = getByTestId('column-picker-trigger-button');
    fireEvent.click(triggerButton);

    const popupList = getByText('Matt').closest(OPTION_LIST_CLASS);
    expect(popupList).toHaveTextContent('TomJohnMattBob');
  });
});
