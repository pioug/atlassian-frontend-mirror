import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { type OptionsType, PopupSelect } from '../../../index';

const user = userEvent.setup();

const OPTIONS: OptionsType = [
	{ label: '0', value: 'zero' },
	{ label: '1', value: 'one' },
	{ label: '2', value: 'two' },
	{ label: '3', value: 'three' },
	{ label: '4', value: 'four' },
];

const ariaLabelSuffix =
	'Option 0 focused, 0 of 6. 6 results available. Use Up and Down to choose options, press Enter to select the currently focused option, press Escape to exit the menu.';

const addedListeners = () => {
	//@ts-ignore
	const { mock } = global.window.addEventListener as jest.Mock;
	const results = mock.calls.filter((call) => call[0] !== 'error');
	return results;
};

const removedListeners = () => {
	//@ts-ignore
	const { mock } = global.window.removeEventListener as jest.Mock;
	const results = mock.calls.filter((call) => call[0] !== 'error');
	return results;
};

const RENDERED_POPUP_CLASS = 'popup-select__menu-list';
const RENDERED_POPUP_SELECTOR = `.${RENDERED_POPUP_CLASS}`;
const PORTALED_CONTAINER = document.body;

describe('Popup Select', () => {
	beforeEach(() => {
		//@ts-ignore
		jest.spyOn(global.window, 'addEventListener');
		//@ts-ignore
		jest.spyOn(global.window, 'removeEventListener');
	});

	afterEach(() => {
		//@ts-ignore
		global.window.addEventListener.mockRestore();
		//@ts-ignore
		global.window.removeEventListener.mockRestore();
	});

	// If this isn't the first test, it will fail. Don't know why ¯\_(ツ)_/¯
	it('should maintain focus in select element after tabbing when open', async () => {
		const onChangeMock = jest.fn();
		render(
			<React.Fragment>
				<PopupSelect
					options={OPTIONS}
					value={OPTIONS[0]}
					testId={'PopupSelect'}
					onChange={(value) => onChangeMock(value)}
					target={({ ref }) => (
						<button ref={ref} data-testid="select-trigger">
							Target
						</button>
					)}
					label="Options"
				/>
			</React.Fragment>,
		);

		const selectTrigger = screen.getByText('Target');

		await user.click(selectTrigger);

		// Has focus initially, will move to the input
		await waitFor(() => {
			expect(selectTrigger).not.toHaveFocus();
			expect(PORTALED_CONTAINER.querySelector('#react-select-2-input')).toHaveFocus();
		});

		fireEvent.keyDown(selectTrigger, {
			key: 'Tab',
			code: 'Tab',
		});

		await waitFor(() => {
			expect(selectTrigger).not.toHaveFocus();
			expect(PORTALED_CONTAINER.querySelector('#react-select-2-input')).toHaveFocus();
		});
	});

	it('should return focus to trigger element on close', async () => {
		const onChangeMock = jest.fn();
		render(
			<React.Fragment>
				<PopupSelect
					options={OPTIONS}
					value={OPTIONS[0]}
					testId={'PopupSelect'}
					onChange={(value) => onChangeMock(value)}
					target={({ ref }) => (
						<button ref={ref} data-testid="select-trigger">
							Target
						</button>
					)}
					label="Options"
				/>
			</React.Fragment>,
		);

		const selectTrigger = screen.getByText('Target');

		await user.click(selectTrigger);
		await user.click(screen.getByText('1'));

		expect(onChangeMock).toHaveBeenCalledWith({ label: '1', value: 'one' });
		expect(selectTrigger).toHaveFocus();
	});

	it('should return focus to trigger element on escape', async () => {
		const onChangeMock = jest.fn();
		render(
			<React.Fragment>
				<PopupSelect
					options={OPTIONS}
					value={OPTIONS[0]}
					testId={'PopupSelect'}
					onChange={(value) => onChangeMock(value)}
					target={({ ref }) => (
						<button ref={ref} data-testid="select-trigger">
							Target
						</button>
					)}
					label="Options"
				/>
			</React.Fragment>,
		);

		const selectTrigger = screen.getByText('Target');

		await fireEvent.click(selectTrigger);

		const escapeKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
			key: 'Escape',
		});

		document.dispatchEvent(escapeKeyDownEvent);

		expect(onChangeMock).not.toHaveBeenCalled();
		expect(selectTrigger).toHaveFocus();
	});

	it('should stay open when cleared', async () => {
		render(
			<PopupSelect
				options={OPTIONS}
				value={OPTIONS[0]}
				isClearable
				target={({ ref }) => <button ref={ref}>Target</button>}
				label="Options"
			/>,
		);

		const selectTrigger = screen.getByText('Target');

		await user.click(selectTrigger);

		const clearIndicator = screen.getAllByRole('presentation')[0];

		expect(clearIndicator).toBeInTheDocument();

		// can't click indicator icon, cause it has `focusable="false"` attribute
		if (clearIndicator.parentElement) {
			await user.click(clearIndicator.parentElement);
		} else {
			fail('clear indicator should have focusable parent');
		}

		// Menu should still be open
		expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
	});

	it('should clean up event listeners', () => {
		const { unmount } = render(
			<PopupSelect
				options={OPTIONS}
				value={OPTIONS[0]}
				isClearable
				target={({ ref }) => <button ref={ref}>Target</button>}
				label="Options"
			/>,
		);

		expect(addedListeners().length).toBe(1);

		unmount();

		expect(removedListeners().length).toBe(1);
	});

	it('should trigger onMenuClose method when closed', async () => {
		const onMenuCloseMock = jest.fn();
		render(
			<React.Fragment>
				<PopupSelect
					options={OPTIONS}
					value={OPTIONS[0]}
					testId={'PopupSelect'}
					onClose={onMenuCloseMock}
					target={({ ref }) => (
						<button ref={ref} data-testid="select-trigger">
							Target
						</button>
					)}
					label="Options"
				/>
				<button data-testid="focus-decoy">Focus decoy</button>
			</React.Fragment>,
		);

		const selectTrigger = screen.getByText('Target');

		await user.click(selectTrigger);

		expect(screen.getByText('Select...')).toBeInTheDocument();

		await user.click(selectTrigger);

		expect(onMenuCloseMock).toHaveBeenCalled();
	});

	it('event listeners should continue to work when stopPropagation is called in parent', async () => {
		render(
			<div onClick={(e) => e.stopPropagation()} role="presentation">
				<PopupSelect
					options={OPTIONS}
					value={OPTIONS[0]}
					target={({ ref }) => <button ref={ref}>Target</button>}
					label="Options"
				/>
			</div>,
		);

		await user.click(screen.getByText('Target'));

		expect(screen.getByText('Select...')).toBeInTheDocument();
	});

	const PopupSelectOpenTest = ({
		isOpen,
		defaultIsOpen,
	}: {
		isOpen?: boolean;
		defaultIsOpen?: boolean;
	}) => (
		<PopupSelect
			options={OPTIONS}
			value={OPTIONS[0]}
			isOpen={isOpen}
			defaultIsOpen={defaultIsOpen}
			classNamePrefix="popup-select"
			target={({ ref }) => (
				<button ref={ref} data-testid="target">
					Target
				</button>
			)}
			label="Options"
		/>
	);

	describe('accessible name for the input field', () => {
		it('should have an accessible name that references the label prop', async () => {
			const label = 'Options';

			render(
				<PopupSelect
					options={OPTIONS}
					value={OPTIONS[0]}
					label={label}
					testId={'PopupSelect'}
					target={({ ref }) => (
						<button ref={ref} data-testid="select-trigger">
							Target
						</button>
					)}
				/>,
			);

			const selectTrigger = screen.getByText('Target');

			await user.click(selectTrigger);

			const input = screen.getByRole('combobox');

			expect(input).toHaveAccessibleName(label + '. ' + ariaLabelSuffix);
		});

		it('should have an accessible name that references the placeholder prop if the label prop is not provided', async () => {
			const placeholder = 'placeholder';

			render(
				<PopupSelect
					options={OPTIONS}
					value={OPTIONS[0]}
					placeholder={placeholder}
					testId={'PopupSelect'}
					target={({ ref }) => (
						<button ref={ref} data-testid="select-trigger">
							Target
						</button>
					)}
				/>,
			);

			const selectTrigger = screen.getByText('Target');

			await user.click(selectTrigger);

			const input = screen.getByRole('combobox');

			expect(input).toHaveAccessibleName(placeholder + '. ' + ariaLabelSuffix);
		});
		it('should announce selected option if the label prop is not provided', async () => {
			render(
				<PopupSelect
					options={OPTIONS}
					isSearchable={false}
					searchThreshold={-1}
					target={({ ref }) => (
						<button ref={ref} data-testid="select-trigger">
							Target
						</button>
					)}
				/>,
			);

			const selectTrigger = screen.getByText('Target');

			await user.click(selectTrigger);

			const input = screen.getByRole('combobox');
			expect(input).toHaveAccessibleName(ariaLabelSuffix);
		});

		it('should announce selected option and respect the label prop if provided', async () => {
			const selectedOptionText = 'Test Label. ' + ariaLabelSuffix;

			render(
				<PopupSelect
					options={OPTIONS}
					isSearchable={false}
					searchThreshold={-1}
					label={'Test Label'}
					target={({ ref }) => (
						<button ref={ref} data-testid="select-trigger">
							Target
						</button>
					)}
				/>,
			);

			const selectTrigger = screen.getByText('Target');

			await user.click(selectTrigger);

			const input = screen.getByRole('combobox');
			expect(input).toHaveAccessibleName(selectedOptionText);
		});
	});

	describe('isOpen prop', () => {
		it('should open and close the menu', async () => {
			const { container, rerender } = render(<PopupSelectOpenTest />);

			// No prop is set, so initially the popup should be closed
			await waitFor(() =>
				expect(container.querySelector(RENDERED_POPUP_SELECTOR)).not.toBeInTheDocument(),
			);

			// Change `isOpen` to `true`
			rerender(<PopupSelectOpenTest isOpen />);

			// Menu should be open
			await waitFor(() =>
				expect(PORTALED_CONTAINER.querySelector(RENDERED_POPUP_SELECTOR)).toBeInTheDocument(),
			);

			// Change `isOpen` to `false`
			rerender(<PopupSelectOpenTest isOpen={false} />);

			// Menu should be closed
			await waitFor(() =>
				expect(PORTALED_CONTAINER.querySelector(RENDERED_POPUP_SELECTOR)).not.toBeInTheDocument(),
			);
		});

		it('should not allow the popup to close when set to true', async () => {
			const { getByTestId } = render(
				<>
					<PopupSelectOpenTest isOpen />
					<button data-testid="close-decoy">Close decoy</button>
				</>,
			);

			// Click elsewhere to trigger close
			const closeDecoy = getByTestId('close-decoy');
			closeDecoy.click();

			// Popup should remain open
			await waitFor(() =>
				expect(PORTALED_CONTAINER.querySelector(RENDERED_POPUP_SELECTOR)).toBeInTheDocument(),
			);
		});

		it('should not allow the popup to open when set to false', async () => {
			render(<PopupSelectOpenTest isOpen={false} />);

			// Click target to trigger open
			const target = screen.getByTestId('target');
			await user.click(target);

			// Popup should remain closed
			expect(PORTALED_CONTAINER.getElementsByClassName(RENDERED_POPUP_CLASS).length).toBe(0);
		});

		it('should have preference over the `defaultIsOpen` prop', async () => {
			render(<PopupSelectOpenTest isOpen={false} defaultIsOpen />);

			// Popup should be closed
			await waitFor(() =>
				expect(PORTALED_CONTAINER.querySelector(RENDERED_POPUP_SELECTOR)).not.toBeInTheDocument(),
			);

			render(<PopupSelectOpenTest isOpen defaultIsOpen={false} />);

			// Popup should be open
			await waitFor(() =>
				expect(PORTALED_CONTAINER.querySelector(RENDERED_POPUP_SELECTOR)).toBeInTheDocument(),
			);
		});
	});

	describe('defaultIsOpen prop', () => {
		it('should open the popup on mount when set to true', async () => {
			render(<PopupSelectOpenTest defaultIsOpen />);

			// Popup should be open after some time:
			await waitFor(() => {
				expect(PORTALED_CONTAINER.querySelector('.popup-select__menu-list')).toBeInTheDocument();
			});
		});

		it('should not open the popup on mount when set to false', () => {
			render(<PopupSelectOpenTest defaultIsOpen={false} />);

			// Popup should be closed
			expect(PORTALED_CONTAINER.getElementsByClassName(RENDERED_POPUP_CLASS).length).toBe(0);
		});

		it('should not open the popup if set to true after mount', () => {
			const { rerender } = render(<PopupSelectOpenTest defaultIsOpen={false} />);

			// Popup should be closed
			expect(PORTALED_CONTAINER.getElementsByClassName(RENDERED_POPUP_CLASS).length).toBe(0);

			rerender(<PopupSelectOpenTest defaultIsOpen />);

			// Popup should remain closed
			expect(PORTALED_CONTAINER.getElementsByClassName(RENDERED_POPUP_CLASS).length).toBe(0);
		});
	});

	describe('trigger button', () => {
		const renderPopupSelect = () => {
			const renderResult = render(
				<PopupSelect
					options={OPTIONS}
					target={({ isOpen, ...triggerProps }) => <button {...triggerProps}>Target</button>}
					label="Options"
				/>,
			);

			return { ...renderResult, trigger: screen.getByText('Target') };
		};

		it('should have aria-haspopup attribute', () => {
			const { trigger } = renderPopupSelect();
			expect(trigger).toHaveAttribute('aria-haspopup', 'true');
		});

		it('should have aria-expanded attribute', async () => {
			const { trigger } = renderPopupSelect();

			expect(trigger).toHaveAttribute('aria-expanded', 'false');

			await user.click(trigger);

			expect(trigger).toHaveAttribute('aria-expanded', 'true');
		});

		it('when open, should have aria-controls attribute which is equal to the popup container id', async () => {
			const { trigger, container } = renderPopupSelect();

			expect(trigger).not.toHaveAttribute('aria-controls');
			// opens popup
			await user.click(trigger);

			const controledId = trigger.getAttribute('aria-controls');
			expect(controledId).toBeDefined();

			const body = container.parentElement as HTMLBodyElement;

			const popupWrapper = body.querySelector(`#${controledId}`);
			expect(popupWrapper).toBeDefined();
		});
	});
});
