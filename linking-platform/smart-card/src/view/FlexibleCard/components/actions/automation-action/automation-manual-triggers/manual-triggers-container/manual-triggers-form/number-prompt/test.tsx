import React from 'react';

import { injectable } from 'react-magnetic-di';

import { Field } from '@atlaskit/form';

import {
  createGenericComponent,
  renderWithDi
} from '../../common/test-utils';
import {
  type UserInputNumberPrompt,
  UserInputType,
} from '../../common/types';

import NumberInputPrompt, { Errors, numberValidate } from './main';

describe('Text field input prompt', () => {
  test('should render correct props', () => {
    const userInputPrompts: UserInputNumberPrompt = {
      defaultValue: '10.5',
      displayName: 'Test user input',
      inputType: UserInputType.NUMBER,
      required: true,
      variableName: 'testUserInput',
    };

    const numberInputPrompt = renderWithDi(
      <NumberInputPrompt userInputPrompt={userInputPrompts} />,
    );


    expect(numberInputPrompt.getByRole('textbox')).toHaveAttribute("name", userInputPrompts.variableName);
    expect(numberInputPrompt.getByText(userInputPrompts.displayName)).toBeInTheDocument();
    expect(numberInputPrompt.getByText(userInputPrompts.displayName)).toHaveAttribute("id", "testUserInput-uid1-label");
    expect(numberInputPrompt.getByTitle("required")).toBeInTheDocument();
  });

  test('should render error message with empty values when field is required', () => {
    const userInputPrompts: UserInputNumberPrompt = {
      defaultValue: '',
      displayName: 'Test user input',
      inputType: UserInputType.NUMBER,
      required: true,
      variableName: 'testUserInput',
    };

    const mockField = createGenericComponent('Field', true, { error: 'EMPTY' });
    const errorNumberInputPrompt = renderWithDi(
      <NumberInputPrompt userInputPrompt={userInputPrompts} />,
      [injectable(Field, mockField)],
    );

    expect(errorNumberInputPrompt.getByLabelText("error")).toBeInTheDocument();
  });

  type numberTestType = {
    isRequired: boolean;
    value: string;
    error?: Errors;
  };

  const numberTests: numberTestType[] = [
    {
      isRequired: false,
      value: '15',
      error: undefined,
    },
    {
      isRequired: false,
      value: '3.6',
      error: undefined,
    },
    {
      isRequired: false,
      value: '-2',
      error: undefined,
    },
    {
      isRequired: false,
      value: '0',
      error: undefined,
    },
    {
      isRequired: false,
      value: '',
      error: undefined,
    },
    {
      isRequired: true,
      value: '',
      error: Errors.EMPTY,
    },
    {
      isRequired: false,
      value: '7.a',
      error: Errors.INVALID_NUMBER,
    },
    {
      isRequired: false,
      value: 'b',
      error: Errors.INVALID_NUMBER,
    },
    {
      isRequired: false,
      value: 'f.3',
      error: Errors.INVALID_NUMBER,
    },
    {
      isRequired: false,
      value: '-y',
      error: Errors.INVALID_NUMBER,
    },
  ];

  test.each(numberTests)(
    'should generate proper validation error',
    (test: numberTestType) => {
      const validationResult = numberValidate(test.isRequired, test.value);

      expect(validationResult).toEqual(test.error);
    },
  );
});
