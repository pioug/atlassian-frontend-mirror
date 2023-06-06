import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { Validator } from '../../common/types';
import { FormContextProvider } from '../../controllers/form-context';

import { AsyncSelect } from './async-select';
import { CreateForm, CreateFormProps } from './main';
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
    return render(
      <IntlProvider locale="en">
        <FormContextProvider>
          <CreateForm
            onSubmit={handleSubmitMock}
            onCancel={handleCancelMock}
            testId={testId}
            {...createFormProps}
          >
            {children}
          </CreateForm>
        </FormContextProvider>
      </IntlProvider>,
    );
  };

  it('should render the form', async () => {
    const { getByTestId } = setUpCreateForm();
    expect(getByTestId(testId)).toBeTruthy();
  });

  it('should submit the form the form when Create button is clicked', async () => {
    const { getByTestId } = setUpCreateForm();

    await userEvent.click(getByTestId('create-button'));
    expect(handleSubmitMock).toBeCalled();
  });

  it('should cancel the form the form when Create button is clicked', async () => {
    const { getByTestId } = setUpCreateForm();

    await userEvent.click(getByTestId('close-button'));
    expect(handleCancelMock).toBeCalled();
  });

  it('should hide the footer buttons when the prop is passed', async () => {
    const { queryByTestId } = setUpCreateForm(undefined, { hideFooter: true });
    expect(queryByTestId('cancel-button')).toBeNull();
    expect(queryByTestId('create-button')).toBeNull();
  });

  it('should display a form loader when isLoading props is provided', async () => {
    const { getByTestId, queryByTestId } = setUpCreateForm(undefined, {
      isLoading: true,
    });
    expect(getByTestId('link-create-form-loader')).toBeTruthy();
    expect(queryByTestId('link-create-form')).toBeNull();
  });

  describe('TextField', () => {
    it('should render TextField inside the form', async () => {
      const textFieldTestId = 'link-create-text-field';

      const { getByTestId } = setUpCreateForm(
        <TextField name="title" label="Title" testId={textFieldTestId} />,
      );

      expect(getByTestId(textFieldTestId)).toBeTruthy();
    });

    it('should render error message when TextField validator fails', async () => {
      const textFieldTestId = 'link-create-text-field';

      const validator: Validator = {
        isValid: () => false,
        errorMessage: 'Something goes wrong',
      };

      const { getByTestId, getByText } = setUpCreateForm(
        <TextField
          name="title"
          label="Title"
          testId={textFieldTestId}
          validators={[validator]}
        />,
      );

      await userEvent.click(getByTestId('create-button'));
      expect(getByText('Something goes wrong')).toBeTruthy();
    });

    it('should hide error message when after user makes changes', async () => {
      const textFieldTestId = 'link-create-text-field';

      const validator: Validator = {
        isValid: (val: unknown) => !!val,
        errorMessage: 'Something goes wrong',
      };

      const { getByTestId, queryByTestId } = setUpCreateForm(
        <TextField
          name="title"
          label="Title"
          testId={textFieldTestId}
          validators={[validator]}
        />,
      );

      await userEvent.click(getByTestId('create-button'));
      expect(
        queryByTestId(`${textFieldTestId}-error-message`),
      ).toBeInTheDocument();

      await userEvent.type(getByTestId(textFieldTestId), 'test');

      expect(
        queryByTestId(`${textFieldTestId}-error-message`),
      ).not.toBeInTheDocument();
    });
  });

  describe('AsyncSelect', () => {
    it('should render AsyncSelect inside the form', async () => {
      const asyncSelectTestId = 'link-create-async-select';

      const { getByTestId } = setUpCreateForm(
        <AsyncSelect name="title" label="Title" testId={asyncSelectTestId} />,
      );

      expect(getByTestId(asyncSelectTestId)).toBeTruthy();
    });

    it('should render error message when AsyncSelect validator fails', async () => {
      const asyncSelectTestId = 'link-create-async-select';

      const validator: Validator = {
        isValid: () => false,
        errorMessage: 'Something goes wrong',
      };

      const { getByTestId, getByText } = setUpCreateForm(
        <AsyncSelect
          name="title"
          label="Title"
          testId={asyncSelectTestId}
          validators={[validator]}
        />,
      );

      await userEvent.click(getByTestId('create-button'));
      expect(getByText('Something goes wrong')).toBeTruthy();
    });
  });
});
