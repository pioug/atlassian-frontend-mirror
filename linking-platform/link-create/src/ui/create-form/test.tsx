import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Validator } from '../../common/types';

import { AsyncSelect } from './async-select';
import { CreateForm } from './main';
import { TextField } from './textfield';

describe('CreateForm', () => {
  it('should render the form', async () => {
    const testId = 'link-create-form';

    const handleSubmit = jest.fn();
    const handleCancel = jest.fn();

    const { getByTestId } = render(
      <CreateForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        testId={testId}
      ></CreateForm>,
    );

    expect(getByTestId(testId)).toBeTruthy();
  });

  it('should submit the form the form when Create button is clicked', async () => {
    const testId = 'link-create-form';

    const handleSubmit = jest.fn();
    const handleCancel = jest.fn();

    const { getByTestId } = render(
      <CreateForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        testId={testId}
      ></CreateForm>,
    );

    await userEvent.click(getByTestId('create-button'));
    expect(handleSubmit).toBeCalled();
  });

  it('should cancel the form the form when Create button is clicked', async () => {
    const testId = 'link-create-form';

    const handleSubmit = jest.fn();
    const handleCancel = jest.fn();

    const { getByTestId } = render(
      <CreateForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        testId={testId}
      ></CreateForm>,
    );

    await userEvent.click(getByTestId('cancel-button'));
    expect(handleCancel).toBeCalled();
  });

  describe('TextField', () => {
    it('should render TextField inside the form', async () => {
      const formTestId = 'link-create-form';
      const textFieldTestId = 'link-create-text-field';

      const handleSubmit = jest.fn();
      const handleCancel = jest.fn();

      const { getByTestId } = render(
        <CreateForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          testId={formTestId}
        >
          <TextField name="title" label="Title" testId={textFieldTestId} />
        </CreateForm>,
      );

      expect(getByTestId(textFieldTestId)).toBeTruthy();
    });

    it('should render error message when TextField validator fails', async () => {
      const formTestId = 'link-create-form';
      const textFieldTestId = 'link-create-text-field';

      const handleSubmit = jest.fn();
      const handleCancel = jest.fn();

      const validator: Validator = {
        isValid: () => false,
        errorMessage: 'Something goes wrong',
      };

      const { getByTestId, getByText } = render(
        <CreateForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          testId={formTestId}
        >
          <TextField
            name="title"
            label="Title"
            testId={textFieldTestId}
            validators={[validator]}
          />
        </CreateForm>,
      );

      await userEvent.click(getByTestId('create-button'));
      expect(getByText('Something goes wrong')).toBeTruthy();
    });
  });

  describe('AsyncSelect', () => {
    it('should render AsyncSelect inside the form', async () => {
      const formTestId = 'link-create-form';
      const asyncSelectTestId = 'link-create-async-select';

      const handleSubmit = jest.fn();
      const handleCancel = jest.fn();

      const { getByTestId } = render(
        <CreateForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          testId={formTestId}
        >
          <AsyncSelect name="title" label="Title" testId={asyncSelectTestId} />
        </CreateForm>,
      );

      expect(getByTestId(asyncSelectTestId)).toBeTruthy();
    });

    it('should render error message when TextField validator fails', async () => {
      const formTestId = 'link-create-form';
      const textFieldTestId = 'link-create-text-field';

      const handleSubmit = jest.fn();
      const handleCancel = jest.fn();

      const validator: Validator = {
        isValid: () => false,
        errorMessage: 'Something goes wrong',
      };

      const { getByTestId, getByText } = render(
        <CreateForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          testId={formTestId}
        >
          <AsyncSelect
            name="title"
            label="Title"
            testId={textFieldTestId}
            validators={[validator]}
          />
        </CreateForm>,
      );

      await userEvent.click(getByTestId('create-button'));
      expect(getByText('Something goes wrong')).toBeTruthy();
    });
  });
});
