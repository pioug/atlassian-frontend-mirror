import React from 'react';

import { fireEvent, waitFor } from '@testing-library/dom';
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
) => {
  const columnPickerRender = render(
    <IntlProvider locale="en">
      <ColumnPicker
        columns={columns}
        onSelectedColumnKeysChange={mockOnChange}
        selectedColumnKeys={selectedColumnKeys}
      />
    </IntlProvider>,
  );

  const openPopUpMenu = () =>
    fireEvent.click(
      columnPickerRender.getByTestId('column-picker-trigger-button'),
    );

  return { ...columnPickerRender, openPopUpMenu };
};

describe('Column picker', () => {
  it('should have specific html element id', async () => {
    const { openPopUpMenu } = renderColumnPicker([], []);

    await waitFor(() => {
      openPopUpMenu();

      expect(document.getElementById('column-picker-popup')).not.toBeNull();
    });
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

    const { openPopUpMenu, getByText } = renderColumnPicker(
      columns,
      selectedColumnKeys,
    );

    await waitFor(() => {
      openPopUpMenu();

      expect(getByText('Type').closest(OPTION_SELECTED_CLASS)).not.toBeNull();
      expect(getByText('Blah').closest(OPTION_SELECTED_CLASS)).toBeNull();
    });
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

    const { openPopUpMenu, getByText } = renderColumnPicker(
      columns,
      selectedColumnKeys,
    );

    await waitFor(() => {
      openPopUpMenu();

      const checkbox = getByText('Blah').closest(OPTION_CLASS);
      invariant(checkbox);
      fireEvent.click(checkbox);

      expect(mockOnChange).toBeCalledTimes(1);
      expect(mockOnChange).toBeCalledWith(['type', 'blah']);
    });
  });

  it('should disable the checkbox if only 1 is passed in and is selected', async () => {
    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'type',
        type: 'icon',
        title: 'Type',
      },
    ];

    const selectedColumnKeys: string[] = ['type'];

    const { openPopUpMenu, getByText } = renderColumnPicker(
      columns,
      selectedColumnKeys,
    );

    await waitFor(() => {
      openPopUpMenu();

      const checkbox = getByText('Type').closest(OPTION_CLASS);
      expect(checkbox).toHaveClass('column-picker-popup__option--is-disabled');
    });
  });

  it('should disable last checked checkbox when there are multiple options and they are all deselected', async () => {
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
      {
        key: 'cool',
        type: 'string',
        title: 'Cool',
      },
    ];

    const selectedColumnKeys: string[] = ['type'];

    const { openPopUpMenu, getByText } = renderColumnPicker(
      columns,
      selectedColumnKeys,
    );

    await waitFor(() => {
      openPopUpMenu();

      const typeCheckbox = getByText('Type').closest(OPTION_CLASS);
      expect(typeCheckbox).toHaveClass(
        'column-picker-popup__option--is-disabled',
      );
    });
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

    const { openPopUpMenu, getByText } = renderColumnPicker(
      columns,
      selectedColumnKeys,
    );

    await waitFor(() => {
      openPopUpMenu();

      const popupList = getByText('Matt').closest(OPTION_LIST_CLASS);
      expect(popupList).toHaveTextContent('TomJohnMattBob');
    });
  });

  it('should show loading text when no columns are passed', async () => {
    const { openPopUpMenu, getByText } = renderColumnPicker([], []);

    await waitFor(() => {
      openPopUpMenu();

      expect(getByText('Loading...')).not.toBeNull();
    });
  });

  it('should focus the search input when opened and options are passed in', async () => {
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
    const { openPopUpMenu, getByRole } = renderColumnPicker(
      columns,
      selectedColumnKeys,
    );

    await waitFor(() => {
      openPopUpMenu();

      expect(getByRole('combobox')).toHaveFocus();
    });
  });
});
