import React from 'react';

import { injectable } from 'react-magnetic-di';

import { Field } from '@atlaskit/form';

import { createGenericComponent, renderWithDi } from '../../common/test-utils';
import { type UserInputTextPrompt, UserInputType } from '../../common/types';

import TextInputPrompt from './main';
import { screen } from '@testing-library/react';

const userInputPrompts: UserInputTextPrompt = {
	defaultValue: '',
	displayName: 'Test user input',
	inputType: UserInputType.TEXT,
	required: true,
	variableName: 'testUserInput',
};

describe('Text field input prompt', () => {
	test('should render correct props', () => {
		renderWithDi(<TextInputPrompt userInputPrompt={userInputPrompts} />);

		expect(screen.getByRole('textbox')).toHaveAttribute('name', userInputPrompts.variableName);
		expect(screen.getByText(userInputPrompts.displayName)).toBeInTheDocument();
		expect(screen.getByText(userInputPrompts.displayName)).toHaveAttribute(
			'id',
			'testUserInput-mock-id1-label',
		);
		expect(screen.getByTitle('required')).toBeInTheDocument();
	});

	test('should render error message with empty values when field is required', () => {
		const mockField = createGenericComponent('Field', true, { error: 'EMPTY' });
		renderWithDi(<TextInputPrompt userInputPrompt={userInputPrompts} />, [
			injectable(Field, mockField),
		]);

		expect(screen.getByLabelText('error')).toBeInTheDocument();
	});
});
