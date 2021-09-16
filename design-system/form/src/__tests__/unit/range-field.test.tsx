import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import Button from '@atlaskit/button/custom-theme-button';
import Range from '@atlaskit/range';

import Form, { RangeField } from '../../index';

describe('RangeField', () => {
  test('renders without errors', () => {
    const error = jest.spyOn(console, 'error');
    const warn = jest.spyOn(console, 'warn');

    render(
      <Form onSubmit={() => {}}>
        {({ formProps }) => (
          <form {...formProps} data-testid="form">
            <RangeField name="light" defaultValue={30}>
              {({ fieldProps }) => (
                <Range {...fieldProps} testId="form--range" min={0} max={100} />
              )}
            </RangeField>
            <RangeField
              name="loaded"
              defaultValue={30}
              isDisabled
              id="test"
              label="Label"
            >
              {({ fieldProps }) => (
                <Range {...fieldProps} testId="form--range" min={0} max={100} />
              )}
            </RangeField>
          </form>
        )}
      </Form>,
    );

    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();

    warn.mockRestore();
    error.mockRestore();
  });

  test('passes through defaultValue correctly', () => {
    const spy = jest.fn();
    const { getByTestId } = render(
      <Form onSubmit={(data) => spy(data)}>
        {({ formProps }) => (
          <form {...formProps} data-testid="form">
            <RangeField name="volume" defaultValue={30}>
              {({ fieldProps }) => (
                <Range {...fieldProps} testId="form--range" min={0} max={100} />
              )}
            </RangeField>
            <Button type="submit" testId="form--submit">
              Submit
            </Button>
          </form>
        )}
      </Form>,
    );

    const range = getByTestId('form--range');
    expect(range).toHaveAttribute('value', '30');

    const submit = getByTestId('form--submit');
    fireEvent.click(submit);
    expect(spy).toHaveBeenCalledWith({ volume: 30 });
  });

  test('updates value when range changes', () => {
    const spy = jest.fn();
    const { getByTestId } = render(
      <Form onSubmit={(data) => spy(data)}>
        {({ formProps }) => (
          <form {...formProps} data-testid="form">
            <RangeField name="volume" defaultValue={30}>
              {({ fieldProps }) => (
                <Range {...fieldProps} testId="form--range" min={0} max={100} />
              )}
            </RangeField>
            <Button type="submit" testId="form--submit">
              Submit
            </Button>
          </form>
        )}
      </Form>,
    );

    const range = getByTestId('form--range');
    fireEvent.change(range, { target: { value: 70 } });
    expect(range).toHaveAttribute('value', '70');

    const submit = getByTestId('form--submit');
    fireEvent.click(submit);
    expect(spy).toHaveBeenCalledWith({ volume: 70 });
  });
});
