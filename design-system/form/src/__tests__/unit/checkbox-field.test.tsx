import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Button from '@atlaskit/button/custom-theme-button';
import { Checkbox } from '@atlaskit/checkbox';

import Form, { CheckboxField } from '../../index';

describe('CheckboxField', () => {
  const user = userEvent.setup();

  it('should default to false value', async () => {
    const spy = jest.fn();
    render(
      <Form onSubmit={(data) => spy(data)}>
        {({ formProps }) => (
          <>
            <CheckboxField name="remember">
              {({ fieldProps }) => <Checkbox {...fieldProps} />}
            </CheckboxField>
            <Button onClick={formProps.onSubmit}>Submit</Button>
          </>
        )}
      </Form>,
    );

    await user.click(screen.getByRole('button'));

    expect(spy).toHaveBeenCalledWith({ remember: false });
  });

  it('checkbox should be checked when clicked', async () => {
    const spy = jest.fn();
    render(
      <Form onSubmit={(data) => spy(data)}>
        {({ formProps }) => (
          <>
            <fieldset>
              <CheckboxField name="remember">
                {({ fieldProps }) => (
                  <Checkbox {...fieldProps} testId="Checkbox" />
                )}
              </CheckboxField>
            </fieldset>
            <Button testId="SubmitButton" onClick={formProps.onSubmit}>
              Submit
            </Button>
          </>
        )}
      </Form>,
    );

    await user.click(screen.getByTestId('Checkbox--hidden-checkbox'));
    await user.click(screen.getByTestId('SubmitButton'));

    expect(spy).toHaveBeenCalledWith({ remember: true });
  });

  it('should use value prop when set', async () => {
    const spy = jest.fn();
    render(
      <Form onSubmit={(data) => spy(data)}>
        {({ formProps }) => (
          <>
            <CheckboxField name="remember" value="always" defaultIsChecked>
              {({ fieldProps }) => <Checkbox {...fieldProps} />}
            </CheckboxField>
            <Button onClick={formProps.onSubmit}>Submit</Button>
          </>
        )}
      </Form>,
    );

    await user.click(screen.getByRole('button'));

    expect(spy).toHaveBeenCalledWith({ remember: ['always'] });
  });

  it('should be undefined when value prop set and not checked', async () => {
    const spy = jest.fn();
    render(
      <Form onSubmit={(data) => spy(data)}>
        {({ formProps }) => (
          <>
            <CheckboxField name="remember" value="always">
              {({ fieldProps }) => <Checkbox {...fieldProps} />}
            </CheckboxField>
            <Button onClick={formProps.onSubmit}>Submit</Button>
          </>
        )}
      </Form>,
    );

    await user.click(screen.getByRole('button'));

    // toHaveBeenCalled doesn't check undefined object properties
    expect(spy.mock.calls[0][0]).toMatchObject({ remember: [] });
  });

  it('should create an array of values when multiple fields of the same name are checked by default', async () => {
    const spy = jest.fn();
    render(
      <Form onSubmit={(data) => spy(data)}>
        {({ formProps }) => (
          <>
            <fieldset>
              <CheckboxField name="product" value="jira" defaultIsChecked>
                {({ fieldProps }) => <Checkbox {...fieldProps} />}
              </CheckboxField>
              <CheckboxField name="product" value="confluence" defaultIsChecked>
                {({ fieldProps }) => <Checkbox {...fieldProps} />}
              </CheckboxField>
              <CheckboxField name="product" value="bitbucket">
                {({ fieldProps }) => <Checkbox {...fieldProps} />}
              </CheckboxField>
            </fieldset>
            <Button onClick={formProps.onSubmit}>Submit</Button>
          </>
        )}
      </Form>,
    );

    await user.click(screen.getByRole('button'));

    expect(spy).toHaveBeenCalledWith({
      product: ['jira', 'confluence'],
    });
  });

  it('should append value to field data when the user checks a checkbox', async () => {
    const spy = jest.fn();
    render(
      <Form onSubmit={(data) => spy(data)}>
        {({ formProps }) => (
          <>
            <fieldset>
              <CheckboxField name="product" value="jira">
                {({ fieldProps }) => <Checkbox {...fieldProps} />}
              </CheckboxField>
              <CheckboxField name="product" value="bitbucket">
                {({ fieldProps }) => (
                  <Checkbox {...fieldProps} testId="Bitbucket" />
                )}
              </CheckboxField>
            </fieldset>
            <Button testId="SubmitButton" onClick={formProps.onSubmit}>
              Submit
            </Button>
          </>
        )}
      </Form>,
    );

    await user.click(screen.getByTestId('Bitbucket--hidden-checkbox'));
    await user.click(screen.getByRole('button'));

    expect(spy).toHaveBeenCalledWith({
      product: ['bitbucket'],
    });
  });
});
