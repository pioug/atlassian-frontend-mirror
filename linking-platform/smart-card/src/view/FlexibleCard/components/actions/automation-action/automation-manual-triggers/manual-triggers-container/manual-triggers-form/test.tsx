import React from 'react';

import { act } from 'react-dom/test-utils';

import { mockTransformedRules } from '../common/mocks';
import { renderWithDi } from '../common/test-utils';

import UserInputForm, { type UserInputProps } from './main';
import { fireEvent } from '@testing-library/dom';

describe('UserInputForm', () => {
	test('should render the modal', () => {
		const userInputProps: UserInputProps = {
			selectedRule: {
				rule: mockTransformedRules[2],
				objects: [],
			},
			clearSelectedRule: () => {},
			invokeRule: async (_ruleId, _objects, _userInputs) => {},
		};

		const inputForm = renderWithDi(
			<UserInputForm
				clearSelectedRule={userInputProps.clearSelectedRule}
				selectedRule={userInputProps.selectedRule}
				invokeRule={userInputProps.invokeRule}
			/>,
		);

		expect(inputForm.getByRole('textbox', { name: 'Text user input' })).toBeInTheDocument();
		expect(inputForm.getByRole('textbox', { name: 'Number user input' })).toBeInTheDocument();
		expect(inputForm.getByRole('textbox', { name: 'Paragraph user input' })).toBeInTheDocument();
		expect(inputForm.getByRole('checkbox', { name: 'Boolean user input' })).toBeInTheDocument();
		expect(inputForm.getByRole('combobox', { name: 'Dropdown user input' })).toBeInTheDocument();
	});

	test('should submit inputs', () => {
		const mockInvokeRule = jest.fn();
		const userInputProps: UserInputProps = {
			selectedRule: {
				rule: mockTransformedRules[2],
				objects: [],
			},
			clearSelectedRule: () => {},
			invokeRule: mockInvokeRule,
		};

		const inputForm = renderWithDi(
			<UserInputForm
				clearSelectedRule={userInputProps.clearSelectedRule}
				selectedRule={userInputProps.selectedRule}
				invokeRule={userInputProps.invokeRule}
			/>,
		);

		act(() => {
			fireEvent(
				inputForm.getByText('Continue'),
				new MouseEvent('click', {
					bubbles: true,
					cancelable: true,
				}),
			);
		});

		expect(mockInvokeRule).toHaveBeenCalledWith(2, [], expect.any(Object));
	});
	test('should disable the button after click', async () => {
		const userInputProps: UserInputProps = {
			selectedRule: {
				rule: mockTransformedRules[2],
				objects: [],
			},
			clearSelectedRule: () => {},
			invokeRule: jest.fn(),
		};

		const inputForm = renderWithDi(
			<UserInputForm
				clearSelectedRule={userInputProps.clearSelectedRule}
				selectedRule={userInputProps.selectedRule}
				invokeRule={userInputProps.invokeRule}
			/>,
		);

		act(() => {
			fireEvent(
				inputForm.getByText('Continue'),
				new MouseEvent('click', {
					bubbles: true,
					cancelable: true,
				}),
			);
		});

		expect(inputForm.getByRole('button', { name: 'Continue' })).toHaveProperty('disabled');
	});
});
