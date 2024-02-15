import { render } from '@testing-library/react';
import React from 'react';
import { BaseUserPicker } from '../BaseUserPicker';

class TestSelect extends React.Component {
  render() {
    return <div {...this.props} data-testid="test-select"></div>;
  }
}

describe('BaseUserPicker', () => {
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
});
