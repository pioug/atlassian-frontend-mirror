import React from 'react';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { flushPromises } from '@atlaskit/link-test-helpers';

import { type Validator } from '../../common/types';
import { LinkCreateCallbackProvider } from '../../controllers/callback-context';
import { FormContextProvider } from '../../controllers/form-context';

import { AsyncSelect } from './async-select';
import { CreateForm, type CreateFormProps } from './main';
import { TextField } from './textfield';

describe('<CreateForm />', () => {
  let handleSubmitMock: jest.Mock;
  let handleCancelMock: jest.Mock;

  const testId = 'link-create-form';

  beforeEach(() => {
    handleSubmitMock = jest.fn();
    handleCancelMock = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setUpCreateForm = (
    children?: React.ReactNode,
    createFormProps?: Partial<
      Omit<CreateFormProps<{}>, 'testId' | 'onSubmit' | 'onCancel'>
    >,
  ) => {
    const onCreate = jest.fn();
    const onFailure = jest.fn();

    render(
      <IntlProvider locale="en">
        <FormContextProvider>
          <LinkCreateCallbackProvider onCreate={onCreate} onFailure={onFailure}>
            <CreateForm
              onSubmit={handleSubmitMock}
              onCancel={handleCancelMock}
              testId={testId}
              {...createFormProps}
            >
              {children}
            </CreateForm>
          </LinkCreateCallbackProvider>
        </FormContextProvider>
      </IntlProvider>,
    );

    return {
      onCreate,
      onFailure,
    };
  };

  it('should render the form', async () => {
    setUpCreateForm();
    expect(screen.getByTestId(testId)).toBeTruthy();
  });

  it('should submit the form the form when Create button is clicked', async () => {
    setUpCreateForm();

    await userEvent.click(screen.getByTestId('link-create-form-button-submit'));
    expect(handleSubmitMock).toBeCalled();
  });

  it('should cancel the form the form when cancel button is clicked', async () => {
    setUpCreateForm();

    await userEvent.click(screen.getByTestId('link-create-form-button-cancel'));
    expect(handleCancelMock).toBeCalled();
  });

  it('should hide the footer buttons when the prop is passed', async () => {
    setUpCreateForm(undefined, { hideFooter: true });
    expect(screen.queryByTestId('link-create-form-button-cancel')).toBeNull();
    expect(screen.queryByTestId('link-create-form-button-submit')).toBeNull();
  });

  it('should display a form loader when isLoading props is provided', async () => {
    setUpCreateForm(undefined, {
      isLoading: true,
    });
    expect(screen.getByTestId('link-create-form-loader')).toBeTruthy();
    expect(screen.queryByTestId('link-create-form')).toBeNull();
  });

  describe('TextField', () => {
    it('should render TextField inside the form', async () => {
      const textFieldTestId = 'link-create-text-field';

      setUpCreateForm(
        <TextField name="title" label="Title" testId={textFieldTestId} />,
      );

      expect(screen.getByTestId(textFieldTestId)).toBeTruthy();
    });

    it('should render error message when TextField validator fails', async () => {
      const textFieldTestId = 'link-create-text-field';

      const validator: Validator = {
        isValid: () => false,
        errorMessage: 'Something goes wrong',
      };

      setUpCreateForm(
        <TextField
          name="title"
          label="Title"
          testId={textFieldTestId}
          validators={[validator]}
        />,
      );

      await userEvent.click(
        screen.getByTestId('link-create-form-button-submit'),
      );
      expect(screen.getByText('Something goes wrong')).toBeTruthy();
    });

    it('should hide error message after user makes changes', async () => {
      const textFieldTestId = 'link-create-text-field';

      const validator: Validator = {
        isValid: (val: unknown) => !!val,
        errorMessage: 'Something goes wrong',
      };

      setUpCreateForm(
        <TextField
          name="title"
          label="Title"
          testId={textFieldTestId}
          validators={[validator]}
        />,
      );

      await userEvent.click(
        screen.getByTestId('link-create-form-button-submit'),
      );
      expect(
        screen.queryByTestId(`${textFieldTestId}-error-message`),
      ).toBeInTheDocument();

      await userEvent.type(screen.getByLabelText(/title/i), 'test');

      expect(
        screen.queryByTestId(`${textFieldTestId}-error-message`),
      ).not.toBeInTheDocument();
    });
  });

  describe('AsyncSelect', () => {
    it('should render AsyncSelect inside the form', async () => {
      const asyncSelectTestId = 'link-create-async-select';

      setUpCreateForm(
        <AsyncSelect name="title" label="Title" testId={asyncSelectTestId} />,
      );

      expect(screen.getByTestId(asyncSelectTestId)).toBeTruthy();
    });

    it('should render error message when AsyncSelect validator fails', async () => {
      const asyncSelectTestId = 'link-create-async-select';

      const validator: Validator = {
        isValid: () => false,
        errorMessage: 'Something goes wrong',
      };

      setUpCreateForm(
        <AsyncSelect
          name="title"
          label="Title"
          testId={asyncSelectTestId}
          validators={[validator]}
        />,
      );

      await userEvent.click(
        screen.getByTestId('link-create-form-button-submit'),
      );
      expect(screen.getByText('Something goes wrong')).toBeTruthy();
    });

    it('should render an error message in the form footer if async select loadOptions function rejects', async () => {
      const loadOptions = jest.fn(async () => {
        throw new Response(null, { status: 500 });
      });

      const { onFailure } = setUpCreateForm(
        <AsyncSelect name="title" label="Title" loadOptions={loadOptions} />,
      );

      await act(async () => {
        await flushPromises();
      });

      const errorMessage = screen.getByTestId('link-create-form-error');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Something went wrong');
      expect(onFailure).toHaveBeenCalledWith(expect.any(Response));
    });
  });
});
