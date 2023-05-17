import React from 'react';

import { fireEvent } from '@testing-library/dom';
import { render } from '@testing-library/react';
import invariant from 'tiny-invariant';

import { DatasourceResponseSchemaProperty } from '@atlaskit/linking-types';

import { ColumnPicker } from '../index';

const CSS_PREFIX = 'column-picker-popup';
const OPTION_CLASS = `.${CSS_PREFIX}__option`;
const OPTION_SELECTED_CLASS = `${OPTION_CLASS}--is-selected`;

describe('Column picker', () => {
  it('should have correct default checked and unchecked checkboxes based on the columns info passed in', async () => {
    const mockOnChange = jest.fn();
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

    const { getByText, getByTestId } = render(
      <ColumnPicker
        columns={columns}
        onSelectedColumnKeysChange={mockOnChange}
        selectedColumnKeys={selectedColumnKeys}
      />,
    );

    // open popup
    const triggerButton = getByTestId('column-picker-trigger-button');
    fireEvent.click(triggerButton);

    expect(getByText('Type').closest(OPTION_SELECTED_CLASS)).not.toBeNull();
    expect(getByText('Blah').closest(OPTION_SELECTED_CLASS)).toBeNull();
  });

  it('should call onChange with correct parameters if a checkbox is clicked', async () => {
    const mockOnChange = jest.fn();
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

    const { getByText, getByTestId } = render(
      <ColumnPicker
        columns={columns}
        onSelectedColumnKeysChange={mockOnChange}
        selectedColumnKeys={selectedColumnKeys}
      />,
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
});
