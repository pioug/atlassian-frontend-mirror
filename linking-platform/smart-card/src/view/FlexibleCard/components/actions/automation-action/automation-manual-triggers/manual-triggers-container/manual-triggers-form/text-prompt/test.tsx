import React from 'react';

import { screen } from '@testing-library/react';
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
		renderWithDi(<TextInputPrompt userInputPrompt={userInputPrompts} />);

		expect(screen.getByRole('textbox')).toHaveAttribute('name', userInputPrompts.variableName);
		expect(screen.getByText(userInputPrompts.displayName)).toBeInTheDocument();
		expect(screen.getByText(userInputPrompts.displayName)).toHaveAttribute(
			'id',
			// eg. `testUserInput-:r0:-label` coming from `React.useId()`
			expect.stringMatching(/^testUserInput-:[^:]+:-label$/),
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
	it('should capture and report a11y violations', async () => {
		const { container } = renderWithDi(<TextInputPrompt userInputPrompt={userInputPrompts} />);
		await expect(container).toBeAccessible();
	});
});
