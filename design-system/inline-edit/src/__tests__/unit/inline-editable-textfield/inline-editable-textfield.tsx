import React, { useState } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

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
