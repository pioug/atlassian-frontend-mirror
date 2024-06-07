import React from 'react';

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
		const paragraphInputPrompt = renderWithDi(
			<ParagraphInputPrompt userInputPrompt={userInputPrompts} />,
		);

		expect(paragraphInputPrompt.getByRole('textbox')).toHaveAttribute(
			'name',
			userInputPrompts.variableName,
		);
		expect(paragraphInputPrompt.getByText(userInputPrompts.displayName)).toBeInTheDocument();
		expect(paragraphInputPrompt.getByText(userInputPrompts.displayName)).toHaveAttribute(
			'id',
			'testUserInput-uid1-label',
		);
		expect(paragraphInputPrompt.getByTitle('required')).toBeInTheDocument();
	});

	test('should render error message with empty values when field is required', () => {
		const mockField = createGenericComponent('Field', true, { error: 'EMPTY' });

		const errorParagraphInputPrompt = renderWithDi(
			<ParagraphInputPrompt userInputPrompt={userInputPrompts} />,
			[injectable(Field, mockField)],
		);

		expect(errorParagraphInputPrompt.getByLabelText('error')).toBeInTheDocument();
	});
});
