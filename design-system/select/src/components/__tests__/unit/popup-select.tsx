/* eslint-disable testing-library/no-node-access,testing-library/no-container */
import React from 'react';

import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { type OptionsType, PopupSelect } from '../../../index';

const user = userEvent.setup();

const OPTIONS: OptionsType = [
	{ label: '1', value: 'one' },
	{ label: '2', value: 'two' },
	{ label: '3', value: 'three' },
	{ label: '4', value: 'four' },
	{ label: '5', value: 'five' },
];

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

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
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

	it('should return focus to trigger element on close and escape', async () => {
		const onChangeMock = jest.fn();
		const { unmount } = render(
			<React.Fragment>
				<PopupSelect
					options={OPTIONS}
					value={OPTIONS[0]}
					testId={'PopupSelect'}
					onChange={(value) => onChangeMock(value)}
					target={({ ref }) => (
						<button type="button" ref={ref} data-testid="select-trigger">
							Target
						</button>
					)}
					label="Options"
				/>
			</React.Fragment>,
		);

		const selectTrigger = screen.getByText('Target');

		// Test focus return on close
		await user.click(selectTrigger);
		await user.click(screen.getByText('1'));

		expect(onChangeMock).toHaveBeenCalledWith({ label: '1', value: 'one' });
		expect(selectTrigger).toHaveFocus();

		// Clean up and test focus return on escape
		unmount();
		onChangeMock.mockClear();

		render(
			<React.Fragment>
				<PopupSelect
					options={OPTIONS}
					value={OPTIONS[0]}
					testId={'PopupSelect'}
					onChange={(value) => onChangeMock(value)}
					target={({ ref }) => (
						<button type="button" ref={ref} data-testid="select-trigger">
							Target
						</button>
					)}
					label="Options"
				/>
			</React.Fragment>,
		);

		const selectTrigger2 = screen.getByText('Target');

		fireEvent.click(selectTrigger2);

		const escapeKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
			key: 'Escape',
		});

		document.dispatchEvent(escapeKeyDownEvent);

		expect(onChangeMock).not.toHaveBeenCalled();
		expect(selectTrigger2).toHaveFocus();
	});

	it('should stay open when cleared', async () => {
		render(
			<PopupSelect
				options={OPTIONS}
				value={OPTIONS[0]}
				isClearable
				target={({ ref }) => (
					<button type="button" ref={ref}>
						Target
					</button>
				)}
				label="Options"
			/>,
		);

		const selectTrigger = screen.getByText('Target');

		await user.click(selectTrigger);

		const clearIndicator = screen.getByRole('button', {
			name: 'clear',
		});

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
				target={({ ref }) => (
					<button type="button" ref={ref}>
						Target
					</button>
				)}
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
					onMenuClose={onMenuCloseMock}
					target={({ ref }) => (
						<button type="button" ref={ref} data-testid="select-trigger">
							Target
						</button>
					)}
					label="Options"
				/>
				<button type="button" data-testid="focus-decoy">
					Focus decoy
				</button>
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
			// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
			<div onClick={(e) => e.stopPropagation()} role="presentation">
				<PopupSelect
					options={OPTIONS}
					value={OPTIONS[0]}
					target={({ ref }) => (
						<button type="button" ref={ref}>
							Target
						</button>
					)}
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
				<button type="button" ref={ref} data-testid="target">
					Target
				</button>
			)}
			label="Options"
		/>
	);

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
			render(
				<>
					<PopupSelectOpenTest isOpen />
					<button type="button" data-testid="close-decoy">
						Close decoy
					</button>
				</>,
			);

			// Click elsewhere to trigger close
			const closeDecoy = screen.getByTestId('close-decoy');
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
			const view = render(
				<PopupSelect
					options={OPTIONS}
					target={({ isOpen, ...triggerProps }) => (
						<button type="button" {...triggerProps}>
							Target
						</button>
					)}
					label="Options"
				/>,
			);

			return { ...view, trigger: screen.getByText('Target') };
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

			const controlledId = trigger.getAttribute('aria-controls');
			expect(controlledId).toBeDefined();

			const body = container.parentElement as HTMLBodyElement;

			const popupWrapper = body.querySelector(`[id="${controlledId}"]`);
			expect(popupWrapper).toBeDefined();
		});
	});

	describe('onMenuOpen and onMenuClose handlers', () => {
		it('should trigger onMenuOpen and onMenuClose methods when opened and closed respectively', async () => {
			const onMenuOpenMock = jest.fn();
			const onMenuCloseMock = jest.fn();
			render(
				<React.Fragment>
					<PopupSelect
						options={OPTIONS}
						value={OPTIONS[0]}
						testId={'PopupSelect'}
						onMenuOpen={onMenuOpenMock}
						onMenuClose={onMenuCloseMock}
						target={({ ref }) => (
							<button type="button" ref={ref} data-testid="select-trigger">
								Target
							</button>
						)}
						label="Options"
					/>
					<button type="button" data-testid="focus-decoy">
						Focus decoy
					</button>
				</React.Fragment>,
			);

			const selectTrigger = screen.getByText('Target');

			await user.click(selectTrigger);

			expect(screen.getByText('Select...')).toBeInTheDocument();

			await user.click(selectTrigger);

			expect(onMenuOpenMock).toHaveBeenCalledTimes(1);
			expect(onMenuCloseMock).toHaveBeenCalledTimes(1);
		});
	});

	describe('UNSAFE_is_experimental_generic', () => {
		const testId = 'popup-select';
		const renderPopupSelect = () => {
			const view = render(
				<PopupSelect
					options={OPTIONS}
					target={({ isOpen, ...triggerProps }) => (
						<button type="button" {...triggerProps}>
							Target
						</button>
					)}
					testId={testId}
					UNSAFE_is_experimental_generic
				/>,
			);

			return { ...view, trigger: screen.getByText('Target') };
		};

		it('should pass down and replace semantics', async () => {
			const { trigger } = renderPopupSelect();

			await user.click(trigger);

			const input = screen.getByTestId(`${testId}-select--input`);
			expect(input).toHaveAttribute('aria-haspopup', 'dialog');
			expect(input).not.toHaveAttribute('aria-haspopup', 'true');

			const dialog = screen.getByTestId(`${testId}-select--listbox`);
			expect(dialog).toHaveAttribute('role', 'dialog');
			expect(dialog).not.toHaveAttribute('role', 'listbox');
			expect(dialog).not.toHaveAttribute('aria-multiselectable');

			const list = within(dialog).getByRole('list');
			expect(within(list).queryAllByRole('listitem')).toHaveLength(OPTIONS.length);
			expect(within(list).queryAllByRole('option')).toHaveLength(0);
		});
	});
});
