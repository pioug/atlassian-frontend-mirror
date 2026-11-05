import React, { useState } from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import InlineEditableTextfield from '../../../inline-editable-textfield';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Simple render', () => {
	it('should render read view component by default', () => {
		const defaultValue = 'Some text';
		const onConfirm = jest.fn();

		render(
			<InlineEditableTextfield
				testId="editable-textfield"
				defaultValue={defaultValue}
				label="Inline editable textfield"
				onConfirm={onConfirm}
				placeholder="Click to enter text"
			/>,
		);

		const read = screen.queryByTestId('read-view-editable-textfield');
		expect(read).toBeInTheDocument();

		expect(read?.innerText).toContain(defaultValue);
	});

	it('should be able to update edit content', () => {
		const InlineEditableTextFieldExample = () => {
			const [editValue, setEditValue] = useState('Old content');

			return (
				<InlineEditableTextfield
					testId="editable-textfield"
					defaultValue={editValue}
					label="Inline editable textfield"
					onConfirm={(value) => setEditValue(value)}
					placeholder="Click to enter text"
				/>
			);
		};

		render(<InlineEditableTextFieldExample />);

		const read = screen.queryByTestId('read-view-editable-textfield');
		expect(read).toBeInTheDocument();

		const button = screen.getByTestId('editable-textfield--edit-button');
		fireEvent.click(button);

		const textField = screen.getByTestId('editable-textfield');
		const confirm = screen.getByText('Confirm');

		fireEvent.change(textField, { target: { value: 'New content' } });
		fireEvent.click(confirm);

		expect(screen.getByTestId('read-view-editable-textfield').innerText).toContain('New content');
	});

	it('oncancel should clear the unsaved edit content back to defaultValue', () => {
		const onCancel = jest.fn();
		const onConfirm = jest.fn();

		const InlineEditableTextFieldExample = () => {
			const defaultValue = 'Default content';

			return (
				<InlineEditableTextfield
					testId="editable-textfield"
					defaultValue={defaultValue}
					label="Inline editable textfield"
					onCancel={onCancel}
					onConfirm={onConfirm}
					placeholder="Click to enter text"
				/>
			);
		};

		render(<InlineEditableTextFieldExample />);

		const read = screen.queryByTestId('read-view-editable-textfield');
		expect(read).toBeInTheDocument();

		const button = screen.getByTestId('editable-textfield--edit-button');
		fireEvent.click(button);

		const textField = screen.getByTestId('editable-textfield');
		expect(textField).toBeInTheDocument();
		const cancel = screen.getByText('Cancel');

		fireEvent.change(textField, { target: { value: 'New content' } });
		expect(onCancel).not.toHaveBeenCalled();

		fireEvent.click(cancel);
		expect(onCancel).toHaveBeenCalled();

		const button2 = screen.getByTestId('editable-textfield--edit-button');
		fireEvent.click(button2);
		const textField2 = screen.getByTestId('editable-textfield') as HTMLInputElement;
		expect(textField2).toBeInTheDocument();
		expect(textField2.value).toEqual('Default content');
	});

	it('onblur should not clear the unsaved edit content back to defaultValue', () => {
		const onCancel = jest.fn();
		const onConfirm = jest.fn();

		const InlineEditableTextFieldExample = () => {
			const defaultValue = 'Default content';

			return (
				<InlineEditableTextfield
					testId="editable-textfield"
					defaultValue={defaultValue}
					label="Inline editable textfield"
					onCancel={onCancel}
					onConfirm={onConfirm}
					placeholder="Click to enter text"
				/>
			);
		};

		render(<InlineEditableTextFieldExample />);

		const read = screen.getByTestId('read-view-editable-textfield') as HTMLInputElement;
		expect(read).toBeInTheDocument();

		const button = screen.getByTestId('editable-textfield--edit-button');
		fireEvent.click(button);

		const textField = screen.getByTestId('editable-textfield') as HTMLInputElement;

		fireEvent.change(textField, { target: { value: 'New content' } });
		fireEvent.blur(textField);
		expect(onCancel).not.toHaveBeenCalled();

		fireEvent.click(read);
		expect(textField.value).toEqual('New content');
	});
});

it.each([true, false])(
	'keeps validation visible while invalid input is corrected (top layer %s)',
	async (isTopLayerEnabled) => {
		if (isTopLayerEnabled) {
			passGate('platform-dst-top-layer');
		} else {
			failGate('platform-dst-top-layer');
		}
		const user = userEvent.setup();
		const onConfirm = jest.fn();
		render(
			<InlineEditableTextfield
				defaultValue="Existing"
				placeholder="Enter name"
				label="Name"
				startWithEditViewOpen
				validate={(value) => (value.trim() ? undefined : 'Enter a name')}
				onConfirm={onConfirm}
			/>,
		);
		const input = screen.getByRole('textbox', { name: 'Name' });
		await user.clear(input);
		await user.click(screen.getByRole('button', { name: 'Confirm' }));
		expect(await screen.findByText('Enter a name')).toBeVisible();
		if (isTopLayerEnabled) {
			expect(input).toHaveAccessibleDescription('Enter a name');
		}
		await user.click(input);
		expect(screen.getByText('Enter a name')).toBeVisible();
		expect(input).toHaveFocus();
		expect(onConfirm).not.toHaveBeenCalled();

		await user.type(input, 'Corrected');
		await user.keyboard('{Enter}');
		await waitFor(() => expect(onConfirm).toHaveBeenCalledWith('Corrected', expect.anything()));
		expect(screen.queryByText('Enter a name')).not.toBeInTheDocument();
	},
);

it.each([true, false])(
	'keeps focus in the field when the validation message opens (top layer %s)',
	async (isTopLayerEnabled) => {
		if (isTopLayerEnabled) {
			passGate('platform-dst-top-layer');
		} else {
			failGate('platform-dst-top-layer');
		}
		const user = userEvent.setup();
		render(
			<InlineEditableTextfield
				defaultValue="Existing"
				placeholder="Enter name"
				label="Name"
				startWithEditViewOpen
				validate={(value) => (value.trim() ? undefined : 'Enter a name')}
				onConfirm={jest.fn()}
			/>,
		);
		const input = screen.getByRole('textbox', { name: 'Name' });
		expect(input).toHaveFocus();

		// An invalid value opens the message while the user types.
		await user.clear(input);
		expect(await screen.findByText('Enter a name')).toBeVisible();
		expect(input).toHaveFocus();

		// Typing goes on in the field.
		await user.keyboard('A');
		expect(input).toHaveValue('A');
	},
);

it.each([true, false])(
	'closes the validation message when the value becomes valid during the edit (top layer %s)',
	async (isTopLayerEnabled) => {
		if (isTopLayerEnabled) {
			passGate('platform-dst-top-layer');
		} else {
			failGate('platform-dst-top-layer');
		}
		const user = userEvent.setup();
		const onConfirm = jest.fn();
		render(
			<InlineEditableTextfield
				defaultValue="Existing"
				placeholder="Enter name"
				label="Name"
				startWithEditViewOpen
				validate={(value) => (value.trim() ? undefined : 'Enter a name')}
				onConfirm={onConfirm}
			/>,
		);
		const input = screen.getByRole('textbox', { name: 'Name' });
		await user.clear(input);
		expect(await screen.findByText('Enter a name')).toBeVisible();
		if (isTopLayerEnabled) {
			// The popover (`role="none"`) that shows the message.
			expect(screen.getByRole('none')).toHaveTextContent('Enter a name');
		}

		await user.type(input, 'Corrected');

		await waitFor(() => expect(screen.queryByText('Enter a name')).not.toBeInTheDocument());
		if (isTopLayerEnabled) {
			// The popover itself closes, not only its text.
			await waitFor(() => expect(screen.queryByRole('none')).not.toBeInTheDocument());
		}
		// The edit view stays open with the new value.
		expect(input).toHaveFocus();
		expect(input).toHaveValue('Corrected');
		expect(onConfirm).not.toHaveBeenCalled();
	},
);
