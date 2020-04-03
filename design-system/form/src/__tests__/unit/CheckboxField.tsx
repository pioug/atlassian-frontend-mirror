import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import Button from '@atlaskit/button';
import { Checkbox } from '@atlaskit/checkbox';
import Form, { CheckboxField } from '../..';

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

test('should default to false value', () => {
  const spy = jest.fn();
  const wrapper = mount(
    <Form onSubmit={data => spy(data)}>
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
  wrapper.find(Button).simulate('click');
  return wait(200).then(() => {
    expect(spy).toHaveBeenCalledWith({ remember: false });
  });
});

test('checkbox should be checked when clicked', () => {
  const spy = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={data => spy(data)}>
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

  getByTestId('Checkbox--hidden-checkbox').click();
  getByTestId('SubmitButton').click();

  expect(spy).toHaveBeenCalledWith({ remember: true });
});

test('should use value prop when set', () => {
  const spy = jest.fn();
  const wrapper = mount(
    <Form onSubmit={data => spy(data)}>
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
  wrapper.find(Button).simulate('click');
  return wait(200).then(() => {
    expect(spy).toHaveBeenCalledWith({ remember: ['always'] });
  });
});

test('should be undefined when value prop set and not checked', () => {
  const spy = jest.fn();
  const wrapper = mount(
    <Form onSubmit={data => spy(data)}>
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
  wrapper.find(Button).simulate('click');
  // toHaveBeenCalled doesn't check undefined object properties
  return wait(200).then(() => {
    expect(spy.mock.calls[0][0]).toMatchObject({ remember: [] });
  });
});

test('fields with same name and defaultIsChecked should create array of values', () => {
  const spy = jest.fn();
  const wrapper = mount(
    <Form onSubmit={data => spy(data)}>
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
  wrapper.find(Button).simulate('click');
  return wait(200).then(() => {
    expect(spy).toHaveBeenCalledWith({
      product: ['jira', 'confluence'],
    });
  });
});

test('checking checkbox should append value to field value', () => {
  const spy = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={data => spy(data)}>
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

  getByTestId('Bitbucket--hidden-checkbox').click();
  getByTestId('SubmitButton').click();

  expect(spy).toHaveBeenCalledWith({
    product: ['bitbucket'],
  });
});
