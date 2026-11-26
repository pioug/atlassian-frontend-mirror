import React, { useState } from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import selectEvent from 'react-select-event';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import Select from '@atlaskit/select/default';
import type { OptionType, ValueType } from '@atlaskit/select/types';
import Textfield from '@atlaskit/textfield/text-field';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

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

	/**
	 * Smoke tests. The browser tests in
	 * `__tests__/playwright/ff-testing/platform-dst-top-layer/escape-in-layer.spec.tsx` cover the
	 * layers around and inside the inline edit.
	 */
	describe('Escape takes part in the layer stack', () => {
		function InlineEditForEscape({
			shouldPreventEscape = false,
			onCancel,
		}: {
			shouldPreventEscape?: boolean;
			onCancel?: () => void;
		}) {
			return (
				<InlineEdit
					defaultValue="Initial content"
					label="Inline edit"
					editView={({ errorMessage: _errorMessage, ...fieldProps }) => (
						<Textfield
							testId="edit-view"
							{...fieldProps}
							onKeyDown={(event) => {
								if (shouldPreventEscape && event.key === 'Escape') {
									event.preventDefault();
								}
							}}
						/>
					)}
					readView={() => <div data-testid="read-view">Initial content</div>}
					onConfirm={jest.fn()}
					onCancel={onCancel}
				/>
			);
		}

		function pressEscape(target: HTMLElement): boolean {
			// `false` when a handler called `preventDefault()`.
			return fireEvent.keyDown(target, { key: 'Escape' });
		}

		it('top layer: cancelling the edit takes the Escape', () => {
			passGate('platform-dst-top-layer');
			const onCancel = jest.fn();
			render(<InlineEditForEscape onCancel={onCancel} />);
			fireEvent.click(screen.getByTestId('read-view'));

			const isNotPrevented = pressEscape(screen.getByTestId('edit-view'));

			expect(isNotPrevented).toBe(false);
			expect(screen.getByTestId('read-view')).toBeInTheDocument();
			expect(onCancel).toHaveBeenCalledTimes(1);
		});

		it('top layer: in read view, Escape is not taken and nothing is cancelled', () => {
			passGate('platform-dst-top-layer');
			const onCancel = jest.fn();
			render(<InlineEditForEscape onCancel={onCancel} />);

			const isNotPrevented = pressEscape(screen.getByRole('button', { name: /edit/ }));

			expect(isNotPrevented).toBe(true);
			expect(onCancel).not.toHaveBeenCalled();
		});

		it('top layer: an Escape that an inner handler took keeps the edit open', () => {
			passGate('platform-dst-top-layer');
			render(<InlineEditForEscape shouldPreventEscape />);
			fireEvent.click(screen.getByTestId('read-view'));

			pressEscape(screen.getByTestId('edit-view'));

			expect(screen.getByTestId('edit-view')).toBeInTheDocument();
		});

		it('top layer: a held Escape is taken but does not cancel the edit or reset the draft', () => {
			passGate('platform-dst-top-layer');
			const onCancel = jest.fn();
			render(<InlineEditForEscape onCancel={onCancel} />);
			fireEvent.click(screen.getByTestId('read-view'));
			const input = screen.getByRole('textbox');
			fireEvent.change(input, { target: { value: 'New content' } });

			const isNotPrevented = fireEvent.keyDown(input, { key: 'Escape', repeat: true });

			expect(isNotPrevented).toBe(false);
			expect(onCancel).not.toHaveBeenCalled();
			expect(screen.getByRole('textbox')).toHaveValue('New content');
		});

		it('top layer: after Escape closes a Select menu, a held Escape keeps the edit open', async () => {
			passGate('platform-dst-top-layer');
			const onCancel = jest.fn();
			render(
				<InlineEdit<ValueType<OptionType>>
					defaultValue={null}
					label="Inline edit"
					editView={({ errorMessage: _errorMessage, ...fieldProps }) => (
						<Select
							{...fieldProps}
							inputId="inline-edit-select"
							defaultMenuIsOpen
							options={[
								{ label: 'Apple', value: 'apple' },
								{ label: 'Banana', value: 'banana' },
							]}
						/>
					)}
					readView={() => <div data-testid="read-view">None</div>}
					onConfirm={jest.fn()}
					onCancel={onCancel}
				/>,
			);
			fireEvent.click(screen.getByTestId('read-view'));
			const input = screen.getByRole('combobox');
			expect(screen.getByRole('listbox')).toBeInTheDocument();

			// The first press closes the menu and leaves the edit open.
			fireEvent.keyDown(input, { key: 'Escape' });
			await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
			expect(screen.getByRole('combobox')).toBeInTheDocument();

			// The key is still held, so the edit stays open.
			const isNotPrevented = fireEvent.keyDown(input, { key: 'Escape', repeat: true });
			expect(isNotPrevented).toBe(false);
			expect(screen.getByRole('combobox')).toBeInTheDocument();
			expect(onCancel).not.toHaveBeenCalled();

			// A new press cancels the edit.
			fireEvent.keyDown(input, { key: 'Escape' });
			expect(screen.getByTestId('read-view')).toBeInTheDocument();
			expect(onCancel).toHaveBeenCalledTimes(1);
		});

		function ControlledInlineEdit({ onCancel }: { onCancel?: () => void }) {
			return (
				<InlineEdit
					isEditing
					defaultValue="Initial content"
					label="Inline edit"
					editView={({ errorMessage: _errorMessage, ...fieldProps }) => (
						<Textfield testId="edit-view" {...fieldProps} />
					)}
					readView={() => <div data-testid="read-view">Initial content</div>}
					onConfirm={jest.fn()}
					onCancel={onCancel}
				/>
			);
		}

		it('top layer: a controlled edit without onCancel cannot end, so Escape is not taken', () => {
			passGate('platform-dst-top-layer');
			render(<ControlledInlineEdit />);

			const isNotPrevented = pressEscape(screen.getByTestId('edit-view'));

			expect(isNotPrevented).toBe(true);
			expect(screen.getByTestId('edit-view')).toBeInTheDocument();
		});

		it('top layer: a controlled edit with onCancel takes the Escape and asks to cancel', () => {
			passGate('platform-dst-top-layer');
			const onCancel = jest.fn();
			render(<ControlledInlineEdit onCancel={onCancel} />);

			const isNotPrevented = pressEscape(screen.getByTestId('edit-view'));

			expect(isNotPrevented).toBe(false);
			expect(onCancel).toHaveBeenCalledTimes(1);
		});

		it('legacy: in read view, Escape is not taken and calls onCancel', () => {
			failGate('platform-dst-top-layer');
			const onCancel = jest.fn();
			render(<InlineEditForEscape onCancel={onCancel} />);

			const isNotPrevented = pressEscape(screen.getByRole('button', { name: /edit/ }));

			expect(isNotPrevented).toBe(true);
			expect(onCancel).toHaveBeenCalledTimes(1);
		});

		it('legacy: cancelling the edit does not take the Escape', () => {
			failGate('platform-dst-top-layer');
			render(<InlineEditForEscape shouldPreventEscape={false} />);
			fireEvent.click(screen.getByTestId('read-view'));

			const isNotPrevented = pressEscape(screen.getByTestId('edit-view'));

			expect(isNotPrevented).toBe(true);
			expect(screen.getByTestId('read-view')).toBeInTheDocument();
		});

		it('legacy: an Escape that an inner handler took still cancels the edit', () => {
			failGate('platform-dst-top-layer');
			render(<InlineEditForEscape shouldPreventEscape />);
			fireEvent.click(screen.getByTestId('read-view'));

			pressEscape(screen.getByTestId('edit-view'));

			expect(screen.getByTestId('read-view')).toBeInTheDocument();
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
