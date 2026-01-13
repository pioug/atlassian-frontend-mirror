import React from 'react';

import { fireEvent, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import { mockTransformedRules } from '../common/mocks';
import { renderWithDi } from '../common/test-utils';

import UserInputForm, { type UserInputProps } from './main';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

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

		renderWithDi(
			<UserInputForm
				clearSelectedRule={userInputProps.clearSelectedRule}
				selectedRule={userInputProps.selectedRule}
				invokeRule={userInputProps.invokeRule}
			/>,
		);

		expect(screen.getByRole('textbox', { name: 'Text user input' })).toBeInTheDocument();
		expect(screen.getByRole('textbox', { name: 'Number user input' })).toBeInTheDocument();
		expect(screen.getByRole('textbox', { name: 'Paragraph user input' })).toBeInTheDocument();
		expect(screen.getByRole('checkbox', { name: 'Boolean user input' })).toBeInTheDocument();
		expect(screen.getByRole('combobox', { name: 'Dropdown user input' })).toBeInTheDocument();
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

		renderWithDi(
			<UserInputForm
				clearSelectedRule={userInputProps.clearSelectedRule}
				selectedRule={userInputProps.selectedRule}
				invokeRule={userInputProps.invokeRule}
			/>,
		);

		act(() => {
			fireEvent(
				screen.getByText('Continue'),
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

		renderWithDi(
			<UserInputForm
				clearSelectedRule={userInputProps.clearSelectedRule}
				selectedRule={userInputProps.selectedRule}
				invokeRule={userInputProps.invokeRule}
			/>,
		);

		act(() => {
			fireEvent(
				screen.getByText('Continue'),
				new MouseEvent('click', {
					bubbles: true,
					cancelable: true,
				}),
			);
		});

		expect(screen.getByRole('button', { name: 'Continue' })).toHaveProperty('disabled');
	});
	it('should capture and report a11y violations', async () => {
		const userInputProps: UserInputProps = {
			selectedRule: {
				rule: mockTransformedRules[2],
				objects: [],
			},
			clearSelectedRule: () => {},
			invokeRule: async (_ruleId, _objects, _userInputs) => {},
		};
		const { container } = renderWithDi(
			<UserInputForm
				clearSelectedRule={userInputProps.clearSelectedRule}
				selectedRule={userInputProps.selectedRule}
				invokeRule={userInputProps.invokeRule}
			/>,
		);
		await expect(container).toBeAccessible();
	});
});
