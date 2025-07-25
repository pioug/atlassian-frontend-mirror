import React from 'react';

import { screen } from '@testing-library/react';
import { injectable } from 'react-magnetic-di';

import { Field } from '@atlaskit/form';

import { createGenericComponent, renderWithDi } from '../../common/test-utils';
import { type UserInputSelectPrompt, UserInputType } from '../../common/types';

import SelectInputPrompt from './main';

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
			// eg. `testUserInput-:r0:-label` coming from `React.useId()`
			expect.stringMatching(/^testUserInput-:[^:]+:-label$/),
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
	it('should capture and report a11y violations', async () => {
		const { container } = renderWithDi(<SelectInputPrompt userInputPrompt={userInputPrompts} />);
		await expect(container).toBeAccessible();
	});
});
