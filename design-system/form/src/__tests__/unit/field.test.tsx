import React, { ReactNode } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Button from '@atlaskit/button/custom-theme-button';
import __noop from '@atlaskit/ds-lib/noop';
import Select, { ValueType } from '@atlaskit/select';
import TextField from '@atlaskit/textfield';

import Form, {
  ErrorMessage,
  Field,
  HelperMessage,
  ValidMessage,
} from '../../index';

type FieldStateProps<T> = {
  defaultState: T;
  children: (value: T, setValue: (value: T) => void) => ReactNode;
};

type State<T> = {
  currentState: T;
};

export class WithState<T> extends React.Component<
  FieldStateProps<T>,
  State<T>
> {
  state = {
    currentState: this.props.defaultState,
  };

  render() {
    return this.props.children(this.state.currentState, (state) =>
      this.setState({ currentState: state }),
    );
  }
}

describe('Field', () => {
  const user = userEvent.setup();

  it('should not be dirty after mount', () => {
    render(
      <Form onSubmit={jest.fn()}>
        {() => (
          <Field name="username" defaultValue="Joe Bloggs">
            {({ fieldProps, meta: { dirty } }) => (
              <>
                <TextField {...fieldProps} />
                <HelperMessage>
                  Field is {dirty === true ? 'dirty' : 'pristine'}
                </HelperMessage>
              </>
            )}
          </Field>
        )}
      </Form>,
    );

    expect(screen.getByText('Field is pristine')).toBeInTheDocument();
  });

  it('should use defaultValue when set', async () => {
    const spy = jest.fn();
    render(
      <Form onSubmit={spy}>
        {({ formProps }) => (
          <form {...formProps}>
            <Field name="username" defaultValue="Joe Bloggs">
              {({ fieldProps }) => <TextField {...fieldProps} />}
            </Field>
            <Button type="submit">Submit</Button>
          </form>
        )}
      </Form>,
    );

    await user.click(screen.getByRole('button'));

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'Joe Bloggs' }),
      expect.any(Object),
      expect.any(Function),
    );
  });

  it('should not show validation error when field is untouched', () => {
    render(
      <Form onSubmit={jest.fn()}>
        {() => (
          <Field
            name="username"
            defaultValue="Joe Bloggs"
            validate={() => 'ERROR'}
          >
            {({ fieldProps, error }) => (
              <>
                <TextField {...fieldProps} testId="text-field" />
                {error && (
                  <ErrorMessage>
                    There is a problem with this field
                  </ErrorMessage>
                )}
              </>
            )}
          </Field>
        )}
      </Form>,
    );

    expect(
      screen.queryByText('There is a problem with this field'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('text-field-container')).not.toHaveAttribute(
      'data-invalid',
    );
  });

  it('should show validation error when field is touched', async () => {
    render(
      <Form onSubmit={jest.fn()}>
        {() => (
          <Field
            name="username"
            defaultValue="Joe Bloggs"
            validate={() => 'ERROR'}
          >
            {({ fieldProps, error }) => (
              <>
                <TextField {...fieldProps} testId="text-field" />
                {error && (
                  <ErrorMessage>
                    There is a problem with this field
                  </ErrorMessage>
                )}
              </>
            )}
          </Field>
        )}
      </Form>,
    );

    await user.keyboard('{Tab}{Tab}');

    expect(
      screen.getByText('There is a problem with this field'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('text-field-container')).toHaveAttribute(
      'data-invalid',
      'true',
    );
  });

  it('should show errors after submission', async () => {
    render(
      <Form onSubmit={() => Promise.resolve({ username: 'TAKEN_USERNAME' })}>
        {({ formProps }) => (
          <form {...formProps}>
            <Field name="username" defaultValue="Joe Bloggs">
              {({ fieldProps, error }) => (
                <>
                  <TextField {...fieldProps} testId="text-field" />
                  {error === 'TAKEN_USERNAME' && (
                    <ErrorMessage>
                      There is a problem with this field
                    </ErrorMessage>
                  )}
                </>
              )}
            </Field>
            <Button type="submit">Submit</Button>
          </form>
        )}
      </Form>,
    );

    expect(
      screen.queryByText('There is a problem with this field'),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button'));

    expect(
      screen.queryByText('There is a problem with this field'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('text-field-container')).toHaveAttribute(
      'data-invalid',
      'true',
    );
  });

  it('should reset the form when defaultValue is changed', async () => {
    render(
      <WithState defaultState="">
        {(defaultValue, setDefaultValue) => (
          <>
            <Form onSubmit={jest.fn()}>
              {() => (
                <Field
                  name="username"
                  defaultValue={defaultValue}
                  validate={(value = '') =>
                    value.length < 1 ? 'too short' : undefined
                  }
                >
                  {({ fieldProps, error }) => (
                    <>
                      <TextField {...fieldProps} />
                      {error && (
                        <ErrorMessage>
                          There is a problem with this field
                        </ErrorMessage>
                      )}
                    </>
                  )}
                </Field>
              )}
            </Form>
            <Button onClick={() => setDefaultValue('jill')}>Submit</Button>
          </>
        )}
      </WithState>,
    );

    await user.click(screen.getByRole('button'));

    expect(
      screen.queryByText('There is a problem with this field'),
    ).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('jill')).toBeInTheDocument();
  });

  it('should not reset form field when defaultValue object identity changes', async () => {
    render(
      <WithState defaultState={{ value: { deep: 'value' } }}>
        {(defaultValue, setDefaultValue) => (
          <>
            <Form onSubmit={jest.fn()}>
              {() => (
                <Field<{ value: { deep: string } }>
                  name="username"
                  defaultValue={defaultValue}
                >
                  {({
                    fieldProps: { value, onChange, ...otherFieldProps },
                    error,
                  }) => (
                    <>
                      <TextField
                        value={value.value.deep}
                        onChange={(event) => {
                          onChange({
                            value: { deep: event.currentTarget.value },
                          });
                        }}
                        {...otherFieldProps}
                      />
                      {error && (
                        <ErrorMessage>
                          There is a problem with this field
                        </ErrorMessage>
                      )}
                    </>
                  )}
                </Field>
              )}
            </Form>
            <Button
              onClick={() => setDefaultValue({ value: { deep: 'value' } })}
            >
              Submit
            </Button>
          </>
        )}
      </WithState>,
    );

    // Start with the defaultValue
    expect(screen.getByDisplayValue('value')).toBeInTheDocument();

    // Update the value to something else
    await user.keyboard('{Tab}newValue');

    expect(screen.getByDisplayValue('newValue')).toBeInTheDocument();

    // Reset the default value to the same value (but with a different object identity)
    await user.click(screen.getByRole('button'));

    // Ensure the value did not reset to the default value
    expect(screen.getByDisplayValue('newValue')).toBeInTheDocument();
  });

  it('should not reset form when array element identity changes', async () => {
    render(
      <WithState defaultState={[{ val: '1' }, { val: '2' }]}>
        {(defaultValue, setDefaultValue) => (
          <>
            <Form onSubmit={jest.fn()}>
              {() => (
                <Field<{ val: string }[]>
                  name="username"
                  defaultValue={defaultValue}
                >
                  {({
                    fieldProps: { value, onChange, ...otherFieldProps },
                    error,
                  }) => (
                    <>
                      <TextField
                        value={JSON.stringify(value)}
                        onChange={(event) => {
                          onChange([
                            ...value,
                            { val: event.currentTarget.value },
                          ]);
                        }}
                        {...otherFieldProps}
                      />
                      {error && (
                        <ErrorMessage>
                          There is a problem with this field
                        </ErrorMessage>
                      )}
                    </>
                  )}
                </Field>
              )}
            </Form>
            <Button
              onClick={() => setDefaultValue([{ val: '1' }, { val: '2' }])}
            >
              Submit
            </Button>
          </>
        )}
      </WithState>,
    );

    // Start with the defaultValue
    expect(
      screen.getByDisplayValue(JSON.stringify([{ val: '1' }, { val: '2' }])),
    ).toBeInTheDocument();

    // Update the value to something else
    await user.keyboard('{Tab}3');

    expect(
      screen.getByDisplayValue(
        JSON.stringify([{ val: '1' }, { val: '2' }, { val: '3' }]),
      ),
    ).toBeInTheDocument();

    // Reset the default value to the same value (but with different element identities)
    await user.click(screen.getByRole('button'));

    // Ensure the value did not reset to the default value
    expect(
      screen.getByDisplayValue(
        JSON.stringify([{ val: '1' }, { val: '2' }, { val: '3' }]),
      ),
    ).toBeInTheDocument();
  });

  it('should reset the form field when the name is changed', async () => {
    const submitFn = jest.fn();
    render(
      <WithState defaultState="name">
        {(name, setName) => (
          <Form onSubmit={submitFn}>
            {({ formProps }) => (
              <form {...formProps}>
                <Field name={name} defaultValue="unchanged">
                  {({ fieldProps }) => (
                    <TextField {...fieldProps} testId="TextField" />
                  )}
                </Field>
                <Button
                  testId="UpdateTrigger"
                  onClick={() => setName('username')}
                >
                  Change
                </Button>
                <Button testId="Submit" type="submit">
                  Submit
                </Button>
              </form>
            )}
          </Form>
        )}
      </WithState>,
    );

    const input = screen.getByTestId('TextField');

    if (input instanceof HTMLInputElement) {
      input.value = 'changed_input';
    } else {
      fail('expected TextField to be HTMLInputElement');
    }

    await user.click(screen.getByTestId('UpdateTrigger'));
    await user.click(screen.getByTestId('Submit'));

    expect(submitFn).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'unchanged' }),
      expect.any(Object),
      expect.any(Function),
    );
  });

  it('select reset should work', async () => {
    type Option = { label: string; value: string };
    const submitFn = jest.fn();
    render(
      <Form onSubmit={submitFn}>
        {({ formProps }) => (
          <form {...formProps}>
            <Field<ValueType<Option>>
              name="select"
              defaultValue={{ label: 'a default value', value: '1' }}
            >
              {({ fieldProps }) => (
                <Select
                  {...fieldProps}
                  placeholder="select a value"
                  isClearable
                  testId="selecto"
                />
              )}
            </Field>
          </form>
        )}
      </Form>,
    );

    // starts with default value (and not placeholder text)
    expect(screen.queryAllByText('a default value')).toHaveLength(1);
    expect(screen.queryAllByText('select a value')).toHaveLength(0);

    // clear the default value
    await user.click(screen.getByLabelText('clear'));

    // placeholder text appears after default value has been cleared
    expect(screen.getByText('select a value')).toBeInTheDocument();
    expect(screen.queryAllByText('a default value')).toHaveLength(0);
  });

  it('should add `aria-describedby` pointing to different message components', async () => {
    const errorValue = 'Bob';
    const validValue = 'Bob Ross';

    render(
      <Form
        onSubmit={({ username }: { username: string }) => {
          return {
            username: username === errorValue ? 'TAKEN_USERNAME' : undefined,
          };
        }}
      >
        {({ formProps: { onSubmit } }) => (
          <>
            <Field
              name="username"
              validate={(value: string = '') => {
                if (value.length === 0) {
                  return 'TOO_SHORT';
                }
              }}
            >
              {({ fieldProps, error, valid }) => (
                <>
                  <TextField {...fieldProps} testId="username" />
                  {!error && !valid && (
                    <HelperMessage testId="helper">Helper</HelperMessage>
                  )}
                  {valid && <ValidMessage testId="valid">Valid</ValidMessage>}
                  {error && <ErrorMessage testId="error">Error</ErrorMessage>}
                </>
              )}
            </Field>
            <Button onClick={onSubmit}>Submit</Button>
          </>
        )}
      </Form>,
    );

    const input = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button');

    expect(input).toHaveValue('');
    expect(input).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining(screen.getByTestId('helper').id),
    );

    await user.click(submitButton);

    expect(input).toHaveValue('');
    expect(input).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining(screen.getByTestId('error').id),
    );

    await user.click(input);
    await user.keyboard(`${validValue}`);
    await user.click(submitButton);

    expect(input).toHaveValue(validValue);
    expect(input).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining(screen.getByTestId('valid').id),
    );

    await user.dblClick(input);
    await user.keyboard(`{Backspace}{Backspace}`);
    await user.click(submitButton);

    expect(input).toHaveValue(errorValue);
    expect(input).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining(screen.getByTestId('error').id),
    );
  });

  it('should associate label with field', () => {
    render(
      <Form onSubmit={jest.fn()}>
        {() => (
          <Field
            testId="field-id"
            name="username"
            id="username"
            label="User name"
            defaultValue=""
          >
            {({ fieldProps }) => (
              <TextField {...fieldProps} testId="text-field" />
            )}
          </Field>
        )}
      </Form>,
    );

    const label = screen.getByTestId('field-id--label');
    expect(screen.getByTestId('text-field')).toHaveAttribute(
      'aria-labelledby',
      'username-label',
    );
    expect(label).toHaveAttribute('for', 'username');
    expect(label).toHaveAttribute('id', 'username-label');
  });

  // TODO: Fix flaky test, example: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/%7B840045bf-9955-4d65-8f42-d40d498b9811%7D/steps/%7B20298ecd-cd6b-4355-8491-b5c20777c58b%7D/test-report
  it.skip('should indicate whether form is submitting', async () => {
    const promise = new Promise<void>((resolve) => setTimeout(resolve, 100));
    render(
      <Form onSubmit={() => promise}>
        {({ formProps, submitting }) => (
          <form {...formProps}>
            <Button type="submit">
              {submitting ? 'submitting' : 'submit'}
            </Button>
          </form>
        )}
      </Form>,
    );

    const button = screen.getByRole('button');

    expect(button).toHaveTextContent('submit');

    await user.click(button);
    await expect(button).toHaveTextContent('submitting');
    await expect(button).toHaveTextContent('submit');
  });

  it('should disable all fields in form when iDisabled is set to true', () => {
    const spy = jest.fn();
    render(
      <Form onSubmit={spy} isDisabled>
        {({ formProps, disabled }) => (
          <form {...formProps}>
            <Field name="name" defaultValue="">
              {({ fieldProps }) => (
                <TextField {...fieldProps} testId="text-field" />
              )}
            </Field>
            <Button type="submit" isDisabled={disabled}>
              Submit
            </Button>
          </form>
        )}
      </Form>,
    );

    expect(screen.getByTestId('text-field')).toBeDisabled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should never render with undefined fieldProp value', async () => {
    const spy = jest.fn(() => 'Hello');
    render(
      <Form onSubmit={__noop}>
        {() => (
          <Field name="username" defaultValue="Joe Bloggs">
            {spy}
          </Field>
        )}
      </Form>,
    );

    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          fieldProps: expect.objectContaining({ value: 'Joe Bloggs' }),
        }),
      ),
    );
  });

  it('should not show submit error if field validation used and value has changed since it was submitted', async () => {
    render(
      <Form onSubmit={() => ({ username: 'TAKEN_USERNAME' })}>
        {({ formProps: { onSubmit } }) => (
          <>
            <Field
              name="username"
              defaultValue="Jane Chan"
              validate={(value = '') =>
                value === 'foo' ? 'TAKEN_USERNAME' : undefined
              }
            >
              {({ fieldProps, error }) => (
                <>
                  <TextField {...fieldProps} testId="TextField" />
                  {error === 'TAKEN_USERNAME' ? (
                    <ErrorMessage>Username taken</ErrorMessage>
                  ) : null}
                </>
              )}
            </Field>
            <Button onClick={onSubmit} testId="SubmitButton">
              Submit
            </Button>
          </>
        )}
      </Form>,
    );

    const errorMessage = 'Username taken';
    const input = screen.getByTestId('TextField');
    const button = screen.getByTestId('SubmitButton');

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();

    await user.click(button);

    expect(screen.queryByText(errorMessage)).toBeInTheDocument();

    await user.dblClick(input);
    await user.keyboard(`Doe`);

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  });

  it('should persist submit error if field validation not used and field value has changed since it was submitted', async () => {
    const errorMessage = 'There is a problem with this field';
    render(
      <Form onSubmit={() => Promise.resolve({ username: 'TAKEN_USERNAME' })}>
        {({ formProps: { onSubmit } }) => (
          <>
            <Field name="username" defaultValue="Jane Chan">
              {({ fieldProps, error }) => (
                <>
                  <TextField {...fieldProps} testId="text-field" />
                  {error === 'TAKEN_USERNAME' && (
                    <ErrorMessage>{errorMessage}</ErrorMessage>
                  )}
                </>
              )}
            </Field>
            <Button onClick={onSubmit}>Submit</Button>
          </>
        )}
      </Form>,
    );

    const container = screen.getByTestId('text-field-container');

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
    expect(container).not.toHaveAttribute('data-invalid');

    await user.click(screen.getByRole('button'));

    expect(screen.queryByText(errorMessage)).toBeInTheDocument();
    expect(container).toHaveAttribute('data-invalid', 'true');

    await user.click(screen.getByTestId('text-field'));
    await user.keyboard(`{Backspace}`);

    expect(screen.queryByText(errorMessage)).toBeInTheDocument();
    expect(container).toHaveAttribute('data-invalid', 'true');
  });

  it('should continue to show field validation even after submit has failed', async () => {
    render(
      <Form onSubmit={() => Promise.resolve({ username: 'TAKEN_USERNAME' })}>
        {({ formProps: { onSubmit } }) => (
          <>
            <Field
              name="username"
              defaultValue=""
              validate={(value = '') => {
                if (value.length < 5) {
                  return 'TOO_SHORT';
                }
                if (value === 'Jane Chan') {
                  return 'TAKEN_USERNAME';
                }

                return undefined;
              }}
            >
              {({ fieldProps, error }) => (
                <>
                  <TextField testId="TextField" {...fieldProps} />
                  {error === 'TAKEN_USERNAME' ? (
                    <ErrorMessage>Username taken</ErrorMessage>
                  ) : null}
                  {error === 'TOO_SHORT' && (
                    <ErrorMessage>Too short</ErrorMessage>
                  )}
                </>
              )}
            </Field>
            <Button type="submit" testId="SubmitButton" onClick={onSubmit}>
              Submit
            </Button>
          </>
        )}
      </Form>,
    );

    const input = screen.getByTestId('TextField');
    const button = screen.getByTestId('SubmitButton');
    const usernameTakenMessage = 'Username taken';
    const usernameTooShortMessage = 'Too short';

    await user.click(button);
    await user.click(input);
    await user.keyboard(`Jane Chan`);

    expect(screen.queryByText(usernameTakenMessage)).toBeInTheDocument();
    expect(screen.queryByText(usernameTooShortMessage)).not.toBeInTheDocument();

    await user.dblClick(input);
    await user.keyboard(`{Backspace}{Backspace}`);

    expect(screen.queryByText(usernameTakenMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(usernameTooShortMessage)).toBeInTheDocument();

    await user.clear(input);
    await user.keyboard(`John Doe`);

    expect(screen.queryByText(usernameTakenMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(usernameTooShortMessage)).not.toBeInTheDocument();
  });

  it('should correctly update form state with a new value', async () => {
    const onSubmitMock = jest.fn();

    render(
      <Form onSubmit={onSubmitMock}>
        {({ formProps: { onSubmit } }) => (
          <>
            <Field name="username" defaultValue="">
              {({ fieldProps: { onChange, ...rest } }) => (
                <TextField
                  {...rest}
                  testId="TextField"
                  onChange={(event) => onChange(event.currentTarget.value)}
                />
              )}
            </Field>
            <Button testId="Submit" onClick={onSubmit}>
              Submit
            </Button>
          </>
        )}
      </Form>,
    );

    await user.click(screen.getByTestId('TextField'));
    await user.keyboard(`joebloggs123`);
    await user.click(screen.getByTestId('Submit'));

    expect(onSubmitMock).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'joebloggs123' }),
      expect.any(Object),
      expect.any(Function),
    );
  });

  it('should submit default form state with array of usernames', async () => {
    const onSubmitMock = jest.fn();

    render(
      <Form onSubmit={onSubmitMock}>
        {({ formProps: { onSubmit } }) => (
          <>
            <Field name="username[0]" defaultValue="Foo">
              {({ fieldProps: { onChange, ...rest } }) => (
                <TextField
                  {...rest}
                  testId="TextField"
                  onChange={(event) => onChange(event.currentTarget.value)}
                />
              )}
            </Field>
            <Field name="username[1]" defaultValue="Bar">
              {({ fieldProps: { onChange, ...rest } }) => (
                <TextField
                  {...rest}
                  onChange={(event) => onChange(event.currentTarget.value)}
                />
              )}
            </Field>
            <Button testId="Submit" onClick={onSubmit}>
              Submit
            </Button>
          </>
        )}
      </Form>,
    );

    await user.click(screen.getByTestId('Submit'));

    expect(onSubmitMock).toHaveBeenCalledWith(
      expect.objectContaining({ username: ['Foo', 'Bar'] }),
      expect.any(Object),
      expect.any(Function),
    );
  });

  it('should correctly update form state with array of usernames', async () => {
    const onSubmitMock = jest.fn();

    render(
      <Form onSubmit={onSubmitMock}>
        {({ formProps: { onSubmit } }) => (
          <>
            <Field name="username.name" defaultValue="johndoe">
              {({ fieldProps: { onChange, ...rest } }) => (
                <TextField
                  {...rest}
                  testId="name"
                  onChange={(event) => onChange(event.currentTarget.value)}
                />
              )}
            </Field>
            <Field name="username.email" defaultValue="johndoe@atlassian.com">
              {({ fieldProps: { onChange, ...rest } }) => (
                <TextField
                  {...rest}
                  testId="email"
                  onChange={(event) => onChange(event.currentTarget.value)}
                />
              )}
            </Field>
            <Button testId="Submit" onClick={onSubmit}>
              Submit
            </Button>
          </>
        )}
      </Form>,
    );

    await user.click(screen.getByTestId('Submit'));

    expect(onSubmitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        username: {
          name: 'johndoe',
          email: 'johndoe@atlassian.com',
        },
      }),
      expect.any(Object),
      expect.any(Function),
    );
  });

  describe('isRequired', () => {
    const labelText = 'Password';
    const jsx = (addedProps?: { [key: string]: string }) => (
      <Form onSubmit={__noop}>
        {({ formProps }) => (
          <form {...formProps}>
            <Field name="password" label={labelText} isRequired {...addedProps}>
              {({ fieldProps, error, valid, meta }) => (
                <TextField type="password" {...fieldProps} />
              )}
            </Field>
          </form>
        )}
      </Form>
    );

    it('should hide required asterisk from assistive technologies', async () => {
      render(jsx());

      const asterisks = screen.getByText('*');

      expect(asterisks).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have title for required asterisk', async () => {
      render(jsx());

      const asterisks = screen.getByText('*');

      expect(asterisks).toHaveAttribute('title', 'required');
    });

    it('should set elementAfterLabel with field when field is required', () => {
      const afterLabelText = 'After label';
      render(
        jsx({
          elementAfterLabel: afterLabelText,
        }),
      );

      const label = screen.getByLabelText(`${labelText}*${afterLabelText}`);

      expect(label).toBeInTheDocument();
    });
  });

  it('should indicate validating status for async validation', async () => {
    const onSubmitMock = __noop;

    const promise = new Promise((resolve) => setTimeout(resolve, 100));
    const validate = async (value: any) => {
      if (value && value.length >= 8) {
        return undefined;
      }

      return promise.then(() => 'too short password');
    };

    render(
      <Form onSubmit={onSubmitMock}>
        {({ formProps: { onSubmit } }) => (
          <>
            <Field
              name="password"
              label="Password"
              defaultValue=""
              isRequired
              validate={validate}
            >
              {({ fieldProps, error, valid, meta }) => {
                return (
                  <>
                    <TextField
                      type="password"
                      {...fieldProps}
                      testId="password"
                    />
                    {error && (
                      <ErrorMessage>
                        Password needs to be more than 8 characters.
                      </ErrorMessage>
                    )}
                    {meta.validating && meta.dirty ? (
                      <HelperMessage>Checking......</HelperMessage>
                    ) : null}
                    {!meta.validating && valid && meta.dirty ? (
                      <ValidMessage>Awesome password!</ValidMessage>
                    ) : null}
                  </>
                );
              }}
            </Field>
            <Button testId="Submit" onClick={onSubmit}>
              Submit
            </Button>
          </>
        )}
      </Form>,
    );

    const password = screen.getByTestId('password');

    await user.keyboard(`{Tab}short`);

    // checking...
    await waitFor(() =>
      expect(screen.queryByText('Checking......')).not.toBeInTheDocument(),
    );

    // too short password
    expect(
      await screen.findByText('Password needs to be more than 8 characters.'),
    ).toBeInTheDocument();

    await user.clear(password);
    await user.keyboard(`long enough`);

    // eventually a good password
    expect(await screen.findByText('Awesome password!')).toBeInTheDocument();
  });

  it('should correctly update form state with a nested object of usernames', async () => {
    const onSubmitMock = jest.fn();

    render(
      <Form onSubmit={onSubmitMock}>
        {({ formProps: { onSubmit } }) => (
          <>
            <Field name="username.name" defaultValue="">
              {({ fieldProps: { onChange, ...rest } }) => (
                <TextField
                  {...rest}
                  testId="name"
                  onChange={(event) => onChange(event.currentTarget.value)}
                />
              )}
            </Field>
            <Field name="username.email" defaultValue="">
              {({ fieldProps: { onChange, ...rest } }) => (
                <TextField
                  {...rest}
                  testId="email"
                  onChange={(event) => onChange(event.currentTarget.value)}
                />
              )}
            </Field>
            <Button testId="Submit" onClick={onSubmit}>
              Submit
            </Button>
          </>
        )}
      </Form>,
    );

    await user.keyboard(`{Tab}johndoe`);
    await user.keyboard(`{Tab}johndoe@atlassian.com`);
    await user.click(screen.getByTestId('Submit'));

    expect(onSubmitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        username: {
          name: 'johndoe',
          email: 'johndoe@atlassian.com',
        },
      }),
      expect.any(Object),
      expect.any(Function),
    );
  });

  it('should always show most recent validation result', async (done) => {
    render(
      <Form onSubmit={jest.fn()}>
        {() => (
          <Field
            name="username"
            defaultValue=""
            validate={(value = '') => {
              if (value.length < 3) {
                return 'TOO_SHORT';
              }
              if (value === 'Joe Bloggs') {
                return new Promise((res) => {
                  res('TAKEN_USERNAME');
                });
              }
              return undefined;
            }}
          >
            {({ fieldProps, error }) => (
              <>
                <TextField testId="TextField" {...fieldProps} />
                {error === 'TOO_SHORT' && (
                  <ErrorMessage>Too short</ErrorMessage>
                )}
                {error === 'TAKEN_USERNAME' && (
                  <ErrorMessage>Username is in use</ErrorMessage>
                )}
              </>
            )}
          </Field>
        )}
      </Form>,
    );

    const input = screen.getByTestId('TextField');

    // kick off an async validation that will fail
    await user.keyboard(`{Tab}Joe Bloggs`);
    await user.dblClick(input);
    // causes a sync validation failure
    await user.keyboard(`{Backspace}{Backspace}{Backspace}`);

    // check that the most recent error message is visible - should be the sync validation error
    setTimeout(() => {
      expect(screen.queryByText('Username is in use')).not.toBeInTheDocument();
      expect(screen.queryByText('Too short')).toBeInTheDocument();
      done();
    });
  });

  it('should re-validate the form if key was changed', async () => {
    const validate = jest.fn();
    render(
      <WithState defaultState="1">
        {(isRequired, setIsRequired) => (
          <>
            <Form onSubmit={jest.fn()}>
              {({ formProps }) => (
                <form {...formProps}>
                  <Field
                    name="test123"
                    key={isRequired === 'required' ? 1 : 0}
                    isRequired={isRequired === 'required'}
                    validate={validate}
                  >
                    {({ fieldProps, error }) => (
                      <>
                        <TextField {...fieldProps} />
                        {error && (
                          <ErrorMessage>
                            There is a problem with this field
                          </ErrorMessage>
                        )}
                      </>
                    )}
                  </Field>
                  <Button type="submit">Submit</Button>
                </form>
              )}
            </Form>
            <Button
              testId="SetRequiredButton"
              onClick={() =>
                setIsRequired(isRequired === 'required' ? '' : 'required')
              }
            >
              Change key
            </Button>
          </>
        )}
      </WithState>,
    );
    const setRequiredButton = screen.getByTestId('SetRequiredButton');

    expect(validate).toBeCalledTimes(1);

    // Change if the field is required
    await user.click(setRequiredButton);

    expect(validate).toBeCalledTimes(2);
  });

  it('should not reset form field after re-mounting caused by changed key', async () => {
    render(
      <WithState defaultState="1">
        {(key, setKey) => (
          <>
            <Form onSubmit={jest.fn()}>
              {({ formProps }) => (
                <form {...formProps}>
                  <Field
                    name="test123"
                    defaultValue="default value"
                    key={key}
                    validate={(value = '') =>
                      value.length < 1 ? 'too short' : undefined
                    }
                  >
                    {({ fieldProps, error }) => (
                      <>
                        <TextField {...fieldProps} testId="TextField" />
                        {error && (
                          <ErrorMessage>
                            There is a problem with this field
                          </ErrorMessage>
                        )}
                      </>
                    )}
                  </Field>
                  <Button type="submit">Submit</Button>
                </form>
              )}
            </Form>
            <Button
              testId="ChangeKeyButton"
              onClick={() => setKey('' + (+key + 1))}
            >
              Change key
            </Button>
          </>
        )}
      </WithState>,
    );
    const textField = screen.getByTestId('TextField');
    const button = screen.getByTestId('ChangeKeyButton');

    // Start with the defaultValue
    expect(textField).toHaveValue('default value');

    // Change the field's value
    await user.clear(textField);
    await user.keyboard(`changed value`);

    expect(textField).toHaveValue('changed value');

    // Change the key prop
    await user.click(button);

    expect(textField).toHaveValue('changed value');

    // Change key prop again (to exclude case when value was removed with second click)
    await user.click(button);

    expect(textField).toHaveValue('changed value');
  });
});
