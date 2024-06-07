import React from 'react';

import { injectable } from 'react-magnetic-di';

import { Field } from '@atlaskit/form';

import { createGenericComponent, renderWithDi } from '../../common/test-utils';
import { type UserInputTextPrompt, UserInputType } from '../../common/types';

import TextInputPrompt from './main';

const userInputPrompts: UserInputTextPrompt = {
	defaultValue: '',
	displayName: 'Test user input',
	inputType: UserInputType.TEXT,
	required: true,
	variableName: 'testUserInput',
};

describe('Text field input prompt', () => {
	test('should render correct props', () => {
		const textInputPrompt = renderWithDi(<TextInputPrompt userInputPrompt={userInputPrompts} />);

		expect(textInputPrompt.getByRole('textbox')).toHaveAttribute(
			'name',
			userInputPrompts.variableName,
		);
		expect(textInputPrompt.getByText(userInputPrompts.displayName)).toBeInTheDocument();
		expect(textInputPrompt.getByText(userInputPrompts.displayName)).toHaveAttribute(
			'id',
			'testUserInput-uid1-label',
		);
		expect(textInputPrompt.getByTitle('required')).toBeInTheDocument();
	});

	test('should render error message with empty values when field is required', () => {
		const mockField = createGenericComponent('Field', true, { error: 'EMPTY' });
		const errorTextInputPrompt = renderWithDi(
			<TextInputPrompt userInputPrompt={userInputPrompts} />,
			[injectable(Field, mockField)],
		);

		expect(errorTextInputPrompt.getByLabelText('error')).toBeInTheDocument();
	});
});
