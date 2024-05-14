import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { BaseUserPicker } from '../BaseUserPicker';
import Select from '@atlaskit/select';
import { IntlProvider } from 'react-intl-next';
class TestSelect extends React.Component {
  render() {
    return <div {...this.props} data-testid="test-select"></div>;
  }
}

describe('BaseUserPicker', () => {
  const onMenuOpenMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderUserPickerWithSelect = (props = {}) =>
    render(
      <IntlProvider locale="en">
        <BaseUserPicker
          SelectComponent={Select}
          components={null}
          fieldId={'123'}
          styles={{}}
          width={100}
          isMulti={false}
          onOpen={onMenuOpenMock}
          {...props}
        />
      </IntlProvider>,
    );
  it('should render Select Component', () => {
    const { getByTestId } = render(
      <BaseUserPicker
        SelectComponent={TestSelect}
        components={null}
        fieldId={'123'}
        styles={null}
        width={100}
      />,
    );

    expect(getByTestId('test-select')).toBeTruthy();
  });

  it('should pass required to Select Component', () => {
    const { getByTestId } = render(
      <BaseUserPicker
        SelectComponent={TestSelect}
        components={null}
        fieldId={'123'}
        styles={null}
        width={100}
        required={true}
      />,
    );

    expect(getByTestId('test-select')).toHaveAttribute('required');
    expect(getByTestId('test-select')).toHaveAttribute('aria-required');
  });

  it('should open menu when we focus on the input', () => {
    const { getByRole } = renderUserPickerWithSelect();
    const input = getByRole('combobox');
    input.focus();
    expect(onMenuOpenMock).toBeCalled();
  });

  it('should not open menu when we focus on the input where openMenuOnClick is enabled', () => {
    const { getByRole } = renderUserPickerWithSelect({ openMenuOnClick: true });
    const input = getByRole('combobox');
    input.focus();
    expect(onMenuOpenMock).not.toBeCalled();
  });

  it('should open menu when we arrow down on the input where openMenuOnClick is enabled', () => {
    const { getByRole } = renderUserPickerWithSelect({ openMenuOnClick: true });
    const input = getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(onMenuOpenMock).toBeCalled();
  });
});
