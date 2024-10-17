import React from 'react';

import { injectable } from 'react-magnetic-di';

import { Field } from '@atlaskit/form';

import { createGenericComponent, renderWithDi } from '../../common/test-utils';
import { type UserInputSelectPrompt, UserInputType } from '../../common/types';

import SelectInputPrompt from './main';
import { screen } from '@testing-library/react';

const userInputPrompts: UserInputSelectPrompt = {
	defaultValue: ['Atlassian', 'Apple', 'Google'],
	displayName: 'Test user input',
	inputType: UserInputType.DROPDOWN,
	required: true,
	variableName: 'testUserInput',
};

describe('Text field input prompt', () => {
	test('should render correct props', () => {
		const selectInputPrompt = renderWithDi(
			<SelectInputPrompt userInputPrompt={userInputPrompts} />,
		);

		expect(screen.getByText(userInputPrompts.displayName)).toBeInTheDocument();
		expect(screen.getByText(userInputPrompts.displayName)).toHaveAttribute(
			'id',
			'testUserInput-mock-id1-label',
		);
		expect(
			selectInputPrompt.container.querySelector('input[name="testUserInput"]'),
		).toBeInTheDocument();
	});

	test('should render error message with empty values when field is required', () => {
		const mockField = createGenericComponent('Field', true, { error: 'EMPTY' });
		renderWithDi(<SelectInputPrompt userInputPrompt={userInputPrompts} />, [
			injectable(Field, mockField),
		]);

		expect(screen.getByLabelText('error')).toBeInTheDocument();
	});
});
