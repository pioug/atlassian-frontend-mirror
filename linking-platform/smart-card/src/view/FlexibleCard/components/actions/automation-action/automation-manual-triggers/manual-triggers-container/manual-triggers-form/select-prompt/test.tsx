import React from 'react';

import { screen } from '@testing-library/react';
import { injectable } from 'react-magnetic-di';

import { Field } from '@atlaskit/form';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import { createGenericComponent, renderWithDi } from '../../common/test-utils';
import { type UserInputSelectPrompt, UserInputType } from '../../common/types';

import SelectInputPrompt from './main';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

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
