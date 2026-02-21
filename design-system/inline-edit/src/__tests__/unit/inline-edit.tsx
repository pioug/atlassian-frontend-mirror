import React, { useState } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import selectEvent from 'react-select-event';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import Select, { type OptionType, type ValueType } from '@atlaskit/select';
import Textfield from '@atlaskit/textfield';

import InlineEdit from '../../inline-edit';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('InlineEdit component', () => {
	describe('Simple render', () => {
		it('should render read view component by default', () => {
			const defaultValue = 'Some text';
			const onConfirm = jest.fn();

			render(
				<InlineEdit
					defaultValue={defaultValue}
					label="Inline edit"
					editView={({ errorMessage: _errorMessage, ...fieldProps }) => (
						<Textfield testId="edit-view" {...fieldProps} />
					)}
					readView={() => (
						<div data-testid="read-view">{defaultValue || 'Click to enter value'}</div>
					)}
					onConfirm={onConfirm}
				/>,
			);

			const read = screen.queryByTestId('read-view');
			expect(read).toBeInTheDocument();
		});

		it('should render edit component when user clicked', () => {
			const defaultValue = 'Some text';
			const onConfirm = jest.fn();
			const onEdit = jest.fn();

			render(
				<InlineEdit
					defaultValue={defaultValue}
					label="Inline edit"
					editView={({ errorMessage: _errorMessage, ...fieldProps }) => (
						<Textfield testId="edit-view" {...fieldProps} />
					)}
					readView={() => (
						<div data-testid="read-view">{defaultValue || 'Click to enter value'}</div>
					)}
					onConfirm={onConfirm}
					onEdit={onEdit}
				/>,
			);

			const read = screen.getByTestId('read-view');
			const edit = screen.queryByTestId('edit-view');

			expect(read).toBeInTheDocument();
			expect(edit).not.toBeInTheDocument();

			//enter edit mode
			fireEvent.click(read);

			expect(onEdit).toHaveBeenCalledTimes(1);

			const textField = screen.getByTestId('edit-view');
			const confirm = screen.queryByText('Confirm');
			const cancel = screen.queryByText('Cancel');

			expect(textField).toBeInTheDocument();
			expect(confirm).toBeInTheDocument();
			expect(cancel).toBeInTheDocument();
		});

		it('should edit the content', () => {
			const defaultValue = 'Some text';
			const onConfirm = jest.fn();

			render(
				<InlineEdit
					defaultValue={defaultValue}
					label="Inline edit"
					editView={({ errorMessage: _errorMessage, ...fieldProps }) => (
						<Textfield testId="edit-view" {...fieldProps} />
					)}
					readView={() => (
						<div data-testid="read-view">{defaultValue || 'Click to enter value'}</div>
					)}
					onConfirm={onConfirm}
				/>,
			);

			const read = screen.getByTestId('read-view');
			const edit = screen.queryByTestId('edit-view');

			expect(read).toBeInTheDocument();
			expect(edit).not.toBeInTheDocument();

			//enter edit mode
			fireEvent.click(read);

			const textField = screen.getByTestId('edit-view');
			const confirm = screen.getByText('Confirm');

			fireEvent.change(textField, { target: { value: 'New content' } });
			fireEvent.click(confirm);

			expect(onConfirm).toHaveBeenCalledWith('New content', expect.objectContaining({}));
		});

		it('should be able to update the content - integration', () => {
			const InlineEditExample = () => {
				const [editValue, setEditValue] = useState('Old content');

				return (
					<InlineEdit
						defaultValue={editValue}
						label="Inline edit"
						editView={({ errorMessage: _errorMessage, ...fieldProps }) => (
							<Textfield testId="edit-view" {...fieldProps} />
						)}
						readView={() => (
							<div data-testid="read-view">{editValue || 'Click to enter value'}</div>
						)}
						onConfirm={(value) => setEditValue(value)}
					/>
				);
			};

			render(<InlineEditExample />);

			const read = screen.getByTestId('read-view');
			expect(read).toBeInTheDocument();
			expect(read).toHaveTextContent('Old content');

			//enter edit mode
			fireEvent.click(read);

			const textField = screen.getByTestId('edit-view');
			const confirm = screen.getByText('Confirm');

			fireEvent.change(textField, { target: { value: 'New content' } });
			fireEvent.click(confirm);

			expect(screen.getByTestId('read-view')).toHaveTextContent('New content');
		});

		it('Should return to default value on click of Cancel', () => {
			const defaultValue = 'Some text';
			const editedValue = 'Edited text';
			const onConfirm = jest.fn();

			render(
				<InlineEdit
					defaultValue={defaultValue}
					label="Inline edit"
					editView={({ errorMessage: _errorMessage, ...fieldProps }) => (
						<Textfield testId="edit-view" {...fieldProps} />
					)}
					readView={() => (
						<div data-testid="read-view">{defaultValue || 'Click to enter value'}</div>
					)}
					onConfirm={onConfirm}
					testId="inline-edit"
				/>,
			);

			const read = screen.queryByTestId('read-view') as HTMLElement;
			expect(read).toBeInTheDocument();
			expect(read).toHaveTextContent(defaultValue);

			fireEvent.click(read);

			const textField = screen.getByTestId('edit-view');
			fireEvent.change(textField, { target: { value: editedValue } });
			expect(textField).toHaveValue(editedValue);

			const cancel = screen.getByTestId(/--cancel/i);
			expect(cancel).toBeInTheDocument();

			fireEvent.click(cancel);
			expect(read).toHaveTextContent(defaultValue);
		});
	});

	describe('Reset on escape key press', () => {
		const onConfirmMock = jest.fn();
		const InlineEditExample = ({
			onConfirmMock,
			defaultValue,
		}: {
			onConfirmMock: jest.Mock;
			defaultValue: string;
		}) => {
			return (
				<InlineEdit
					defaultValue={defaultValue}
					label="Inline edit"
					editView={({ errorMessage: _errorMessage, ...fieldProps }) => (
						<Textfield testId="edit-view" {...fieldProps} />
					)}
					readView={() => (
						<div data-testid="read-view">{defaultValue || 'Click to enter value'}</div>
					)}
					onConfirm={onConfirmMock}
					hideActionButtons={true}
				/>
			);
		};

		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should reset to default value on escape key press', async () => {
			render(<InlineEditExample onConfirmMock={onConfirmMock} defaultValue="Initial content" />);

			const read = screen.getByTestId('read-view');
			expect(read).toBeInTheDocument();
			expect(read).toHaveTextContent('Initial content');

			fireEvent.click(read);

			const textField = screen.getByTestId('edit-view');

			fireEvent.change(textField, { target: { value: 'New content' } });

			// Edit view should have value updated
			expect(textField).toHaveValue('New content');

			fireEvent.keyDown(textField, {
				key: 'Escape',
				code: 'Escape',
				keyCode: 27,
				charCode: 27,
			});

			// Should switch back to read view and the original value
			expect(screen.getByTestId('read-view')).toHaveTextContent('Initial content');

			fireEvent.click(screen.getByTestId('read-view'));

			// Value displayed in edit view when reopened should be reset
			const reopenedTextField = screen.getByTestId('edit-view');
			expect(reopenedTextField).toHaveValue('Initial content');
		});
	});

	describe('accessible edit button label', () => {
		it('should contain the default label', () => {
			render(
				<InlineEdit
					label="Inline edit"
					defaultValue=""
					onConfirm={() => {}}
					readView={() => <div>Read view</div>}
					editView={() => <div>Edit view</div>}
				/>,
			);

			expect(screen.getByRole('button', { name: 'Edit, Inline edit, edit' })).toBeInTheDocument();
		});

		it('should use the custom label', () => {
			render(
				<InlineEdit
					label="Inline edit"
					defaultValue=""
					editButtonLabel="my custom edit button label"
					onConfirm={() => {}}
					readView={() => <div>Read view</div>}
					editView={() => <div>Edit view</div>}
				/>,
			);

			expect(
				screen.getByRole('button', { name: 'my custom edit button label, Inline edit, edit' }),
			).toBeInTheDocument();
		});

		it('should extract text from a ReactNode label', () => {
			render(
				<InlineEdit
					label={<>Team name ReactNode</>}
					defaultValue=""
					onConfirm={() => {}}
					readView={() => <div>Read view</div>}
					editView={() => <div>Edit view</div>}
				/>,
			);

			expect(
				screen.getByRole('button', { name: 'Edit, Team name ReactNode, edit' }),
			).toBeInTheDocument();
		});

		it('should extract text from a nested ReactNode label', () => {
			render(
				<InlineEdit
					label={
						<span>
							Team <strong>name</strong>
						</span>
					}
					defaultValue=""
					onConfirm={() => {}}
					readView={() => <div>Read view</div>}
					editView={() => <div>Edit view</div>}
				/>,
			);

			expect(screen.getByRole('button', { name: 'Edit, Team name, edit' })).toBeInTheDocument();
		});
	});

	describe('generic types', () => {
		const selectOptions = [
			{ label: 'Apple', value: 'Apple' },
			{ label: 'Banana', value: 'Banana' },
			{ label: 'Cherry', value: 'Cherry' },
		];

		it('should be able to handle different types', () => {
			const onConfirm = jest.fn();
			const InlineEditWithDropdown = () => {
				const [editValue] = useState<OptionType[]>([]);

				return (
					<InlineEdit<ValueType<OptionType, true>>
						defaultValue={editValue}
						label="Inline edit"
						editView={(fieldProps) => (
							<Select<OptionType, true>
								{...fieldProps}
								options={selectOptions}
								isMulti
								autoFocus
								openMenuOnFocus
							/>
						)}
						readView={() => (
							<div data-testid="read-view">
								{editValue.length > 0
									? editValue.map((option) => option.label).join(', ')
									: 'Click to enter value'}
							</div>
						)}
						onConfirm={onConfirm}
					/>
				);
			};

			render(<InlineEditWithDropdown />);

			const readView = screen.getByTestId('read-view');
			expect(readView).toBeInTheDocument();

			fireEvent.click(readView);

			selectEvent.openMenu(screen.getByRole('combobox'));
			const firstOption = screen.getByText('Apple');
			fireEvent.click(firstOption);
			const submitButton = screen.getByRole('button', {
				name: 'Confirm',
			});
			fireEvent.click(submitButton);

			expect(onConfirm).toHaveBeenCalledWith(
				expect.arrayContaining([expect.objectContaining({ label: 'Apple', value: 'Apple' })]),
				expect.anything(),
			);
		});
	});

	describe('analytics', () => {
		it('should send event to atlaskit/analytics', () => {
			const defaultValue = '';
			const newValue = 'new value';
			const onConfirm = jest.fn();
			const onAnalyticsEvent = jest.fn();

			render(
				<AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
					<InlineEdit
						defaultValue={defaultValue}
						label="Inline edit"
						editView={({ errorMessage: _errorMessage, ...fieldProps }) => (
							<Textfield {...fieldProps} autoFocus />
						)}
						readView={() => <span>{defaultValue || 'Click to enter value'}</span>}
						onConfirm={onConfirm}
						testId="test"
					/>
				</AnalyticsListener>,
			);

			const button = screen.getByTestId('test--edit-button');
			fireEvent.click(button);
			const input = screen.getByRole('textbox', { name: /inline edit/i });
			fireEvent.change(input, { target: { value: newValue } });

			const confirm = screen.getByTestId('test--confirm');
			fireEvent.click(confirm);

			expect(onConfirm).toHaveBeenCalled();
			expect(onAnalyticsEvent.mock.calls[onAnalyticsEvent.mock.calls.length - 1]).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						payload: {
							action: 'confirmed',
							actionSubject: 'inlineEdit',
							attributes: {
								componentName: 'inlineEdit',
								packageName,
								packageVersion,
							},
						},
					}),
				]),
			);
		});
	});
});
