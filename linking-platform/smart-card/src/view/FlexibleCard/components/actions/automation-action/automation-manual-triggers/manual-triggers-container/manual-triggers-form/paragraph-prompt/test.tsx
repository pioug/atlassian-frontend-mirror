import React from 'react';

import { screen } from '@testing-library/react';
import { injectable } from 'react-magnetic-di';

import { Field } from '@atlaskit/form';

import { createGenericComponent, renderWithDi } from '../../common/test-utils';
import { type UserInputParagraphPrompt, UserInputType } from '../../common/types';

import ParagraphInputPrompt from './main';

const userInputPrompts: UserInputParagraphPrompt = {
	defaultValue: '',
	displayName: 'Test user input',
	inputType: UserInputType.PARAGRAPH,
	required: true,
	variableName: 'testUserInput',
};

describe('Paragraph field input prompt', () => {
	test('should render correct props', () => {
		renderWithDi(<ParagraphInputPrompt userInputPrompt={userInputPrompts} />);

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

		renderWithDi(<ParagraphInputPrompt userInputPrompt={userInputPrompts} />, [
			injectable(Field, mockField),
		]);

		expect(screen.getByLabelText('error')).toBeInTheDocument();
	});
});
