import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import Button from '@atlaskit/button/custom-theme-button';
import TextField from '@atlaskit/textfield';

import Field from '../../field';
import Form from '../../form';

describe('Form', () => {
  it('should update the onSubmit prop when it was updated', () => {
    const handleSubmit = jest.fn();
    const { getByTestId } = render(
      <Form onSubmit={(values) => handleSubmit(values)}>
        {({ formProps }) => (
          <form {...formProps}>
            <Field name="username" label="Username" defaultValue="">
              {({ fieldProps }) => (
                <TextField {...fieldProps} testId="Username" />
              )}
            </Field>
            <Button type="submit" testId="SubmitButton">
              Submit
            </Button>
          </form>
        )}
      </Form>,
    );

    const userNameInput = getByTestId('Username');
    const submitButton = getByTestId('SubmitButton');

    act(() => {
      fireEvent.change(userNameInput, { target: { value: 'charlie' } });
      fireEvent.click(submitButton);
    });

    expect(handleSubmit).toHaveBeenCalledWith({
      username: 'charlie',
    });
  });

  it('should not blow up when calling onSubmit programatically', () => {
    const onSubmit = jest.fn();

    expect(() => {
      render(
        <Form onSubmit={onSubmit}>
          {({ formProps }) => {
            formProps.onSubmit();
            return null;
          }}
        </Form>,
      );
    }).not.toThrow();
  });

  it('should reset the form when the reset function is triggered', () => {
    const handleSubmit = jest.fn();
    const { getByTestId } = render(
      <Form onSubmit={(values) => handleSubmit(values)}>
        {({ formProps, reset }) => (
          <form {...formProps}>
            <Field name="username" label="Username" defaultValue="">
              {({ fieldProps }) => (
                <TextField {...fieldProps} testId="Username" />
              )}
            </Field>
            <Field name="email" label="Email" defaultValue="foo@atlassian.com">
              {({ fieldProps }) => <TextField {...fieldProps} testId="Email" />}
            </Field>
            <Button
              appearance="subtle"
              onClick={() => reset()}
              testId="ResetButton"
            >
              Reset form
            </Button>
            <Button type="submit" testId="SubmitButton">
              Submit
            </Button>
          </form>
        )}
      </Form>,
    );

    const userNameInput = getByTestId('Username');
    const emailInput = getByTestId('Email');
    const submitButton = getByTestId('SubmitButton');
    const resetButton = getByTestId('ResetButton');

    act(() => {
      fireEvent.change(userNameInput, { target: { value: 'charlie' } });
      fireEvent.change(emailInput, { target: { value: 'bar@atlassian.com' } });
      fireEvent.click(submitButton);
    });

    expect(handleSubmit).toHaveBeenCalledWith({
      username: 'charlie',
      email: 'bar@atlassian.com',
    });

    act(() => {
      fireEvent.click(resetButton);
      fireEvent.click(submitButton);
    });

    expect(handleSubmit).toHaveBeenCalledTimes(2);
    expect(handleSubmit).toHaveBeenCalledWith({
      username: '',
      email: 'foo@atlassian.com',
    });
  });

  it('should be able to update form state imperatively', () => {
    const handleSubmit = jest.fn();
    const { getByTestId } = render(
      <Form onSubmit={(values) => handleSubmit(values)}>
        {({ formProps, setFieldValue }) => (
          <form {...formProps}>
            <Field name="username" label="Username" defaultValue="">
              {({ fieldProps }) => (
                <TextField
                  {...fieldProps}
                  onChange={(e) => {
                    e.currentTarget.value;
                    setFieldValue('slug', `${e.currentTarget.value}-brown`);
                    fieldProps.onChange(e);
                  }}
                  testId="Username"
                />
              )}
            </Field>
            <Field name="slug" label="Slug" defaultValue="">
              {({ fieldProps }) => <TextField {...fieldProps} />}
            </Field>
            <Button type="submit" testId="SubmitButton">
              Submit
            </Button>
          </form>
        )}
      </Form>,
    );

    const userNameInput = getByTestId('Username');
    const submitButton = getByTestId('SubmitButton');

    act(() => {
      fireEvent.change(userNameInput, { target: { value: 'charlie' } });
      fireEvent.click(submitButton);
    });

    expect(handleSubmit).toHaveBeenCalledWith({
      username: 'charlie',
      slug: 'charlie-brown',
    });
  });
});
