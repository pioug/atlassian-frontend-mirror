/* eslint-disable testing-library/no-node-access */
// @ts-nocheck
import React from 'react';

import { act, createEvent, fireEvent, render, screen } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';
import { hasOpenDialogOrPopover } from '@atlaskit/top-layer/page-surface/has-open-dialog-or-popover';
import { flushPopoverExit } from '@atlaskit/top-layer/testing/flush-popover-exit';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { components } from '../../components';
import { MenuPortal } from '../../components/menu-portal';
import { scrollTo } from '../../internal/scroll-to';
import Select from '../../select';
import StateManagedSelect from '../../state-manager';

// A spy that keeps the real behaviour, so that tests can see when Select scrolls its list.
jest.mock('../../internal/scroll-to', () => {
	const actual = jest.requireActual('../../internal/scroll-to');
	return { scrollTo: jest.fn(actual.scrollTo) };
});

/**
 * Unit-test coverage for the `MenuPortal` flag-routing wrapper.
 *
 * Detailed top-layer DOM contract (`:popover-open`, light-dismiss, stacking,
 * ARIA wiring) is covered by the Playwright suite under
 * `__tests__/playwright/`. These unit tests cover:
 *
 * 1. Flag OFF + no `menuPortalTarget` + `position="absolute"` renders inline.
 * 2. The flag-on branch is exercised at module load (any crash surfaces here).
 *
 * Note: `MenuPortal` reads `controlRef` at render time, so the menu wrapper
 * does not appear on the very first render in jsdom (the ref callback fires
 * post-commit). This affects the legacy path too; the browser suite covers
 * those rows.
 */

const options = [
	{ label: 'one', value: '1' },
	{ label: 'two', value: '2' },
];

const TEST_ID = 'react-select';

function isInTopLayerPopover(node: HTMLElement | null): boolean {
	return Boolean(node?.closest('[popover]'));
}

function renderSelect(extraProps: Record<string, unknown> = {}) {
	return render(
		<Select testId={TEST_ID} options={options} onInputChange={__noop} {...extraProps} />,
	);
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('MenuPortal - inline render path (flag OFF only)', () => {
	it('flag OFF, no portal target, position absolute - inline menu (no popover)', () => {
		failGate('platform-dst-top-layer');
		renderSelect({ menuIsOpen: true });
		const list = screen.getByTestId(`${TEST_ID}-select--listbox-container`);
		expect(isInTopLayerPopover(list)).toBe(false);
	});

	it('flag OFF, no portal target, menu closed - no popover element exists', () => {
		failGate('platform-dst-top-layer');
		renderSelect({ menuIsOpen: false });
		expect(document.querySelector('[popover]')).toBeNull();
	});
});

describe('MenuPortal - flag-routing wrapper module-level smoke', () => {
	it('flag ON: Select renders without crashing (menu closed)', () => {
		passGate('platform-dst-top-layer');
		expect(() => renderSelect({ menuIsOpen: false })).not.toThrow();
	});
});

/**
 * Close-propagation contract: when the popover is closed programmatically
 * (e.g. the open-layer observer dismissing it because a Modal opened),
 * `handlePopoverClose` must propagate `onMenuClose` so `Select.menuIsOpen`
 * stays in sync. Select's light-dismiss hook uses the same bridge for outside
 * clicks and Escape, including Escape-specific input cleanup.
 */
function getOnlyPopover(): HTMLElement {
	const elements = document.querySelectorAll('[popover]');
	if (elements.length !== 1) {
		throw new Error(`expected exactly one popover element, found ${elements.length}`);
	}
	return elements[0] as HTMLElement;
}

/**
 * The polyfill coalesces popover toggle events via `setTimeout` (so they
 * fire as a task, matching browser timing). Flush the timer and the
 * follow-up microtask so the assertion sees the post-dismiss state.
 */
async function flushPopoverScheduling(): Promise<void> {
	await act(async () => {
		jest.runAllTimers();
		await Promise.resolve();
	});
}

describe('MenuPortalTopLayer - close propagation (flag ON)', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('propagates onMenuClose when the popover is closed programmatically', async () => {
		const onMenuClose = jest.fn();
		renderSelect({ menuIsOpen: true, onMenuClose, 'aria-label': 'choose option' });
		const popover = getOnlyPopover();
		expect(popover.matches(':popover-open')).toBe(true);

		act(() => popover.hidePopover());

		await flushPopoverScheduling();

		expect(popover.matches(':popover-open')).toBe(false);
		expect(onMenuClose).toHaveBeenCalledTimes(1);
	});

	it('keeps the dismissal boundary current when a custom Control replaces its DOM node', async () => {
		const FirstControl = ({ innerRef, children }) => <div ref={innerRef}>{children}</div>;
		const SecondControl = ({ innerRef, children }) => <div ref={innerRef}>{children}</div>;
		const selectRef = React.createRef();
		const onMenuClose = jest.fn();
		const { rerender } = renderSelect({
			ref: selectRef,
			menuIsOpen: true,
			onMenuClose,
			components: { Control: FirstControl },
		});
		const oldControl = selectRef.current.controlRef;
		const removeListener = jest.spyOn(document, 'removeEventListener');
		rerender(
			<Select
				ref={selectRef}
				testId={TEST_ID}
				options={options}
				menuIsOpen
				onMenuClose={onMenuClose}
				onInputChange={__noop}
				components={{ Control: SecondControl }}
			/>,
		);
		expect(selectRef.current.controlRef).not.toBe(oldControl);
		expect(removeListener).not.toHaveBeenCalledWith('pointerup', expect.any(Function), {
			capture: true,
		});
		const popover = getOnlyPopover();
		await flushPopoverScheduling();
		fireEvent.pointerDown(screen.getByTestId(`${TEST_ID}-select--input`));
		fireEvent.pointerUp(screen.getByTestId(`${TEST_ID}-select--input`));
		fireEvent.click(screen.getByTestId(`${TEST_ID}-select--input`));
		await flushPopoverScheduling();
		expect(popover.matches(':popover-open')).toBe(true);
		expect(onMenuClose).not.toHaveBeenCalled();
		// A press outside: the pointer goes down and comes back up outside.
		fireEvent.pointerDown(document.body);
		fireEvent.pointerUp(document.body);
		fireEvent.click(document.body);
		expect(onMenuClose).toHaveBeenCalledTimes(1);
	});

	it.each(['close', 'unmount'])('removes the light-dismiss listeners on %s', (cleanup) => {
		const selectRef = React.createRef();
		const { rerender, unmount } = renderSelect({ ref: selectRef, menuIsOpen: true });
		const removeListener = jest.spyOn(document, 'removeEventListener');

		if (cleanup === 'unmount') {
			unmount();
		} else {
			rerender(
				<Select
					ref={selectRef}
					testId={TEST_ID}
					options={options}
					menuIsOpen={false}
					onInputChange={__noop}
				/>,
			);
		}

		expect(removeListener).toHaveBeenCalledWith('pointerup', expect.any(Function), {
			capture: true,
		});
		expect(removeListener).toHaveBeenCalledWith('keydown', expect.any(Function), undefined);
	});

	it('leaves an already-handled Escape alone', () => {
		const onMenuClose = jest.fn();
		renderSelect({
			menuIsOpen: true,
			onMenuClose,
			onKeyDown: (event) => event.preventDefault(),
		});
		fireEvent.keyDown(screen.getByTestId(`${TEST_ID}-select--input`), { key: 'Escape' });
		expect(onMenuClose).not.toHaveBeenCalled();
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});

	it.each([undefined, { MenuPortal }])(
		'closes the built-in menu once on Escape without stopping propagation (components: %p)',
		async (components) => {
			const callbackOrder: string[] = [];
			const onParentKeyDown = jest.fn();
			const onSelectKeyDown = jest.fn();
			const onInputChange = jest.fn(() => callbackOrder.push('onInputChange'));
			const onMenuClose = jest.fn(() => callbackOrder.push('onMenuClose'));
			render(
				<div role="presentation" onKeyDown={onParentKeyDown}>
					<StateManagedSelect
						testId={TEST_ID}
						options={options}
						defaultMenuIsOpen
						onKeyDown={onSelectKeyDown}
						components={components}
						onInputChange={onInputChange}
						onMenuClose={onMenuClose}
						shouldPreventEscapePropagation
					/>
				</div>,
			);

			const input = screen.getByTestId(`${TEST_ID}-select--input`);
			const escapeEvent = createEvent.keyDown(input, {
				key: 'Escape',
				bubbles: true,
				cancelable: true,
			});

			fireEvent(input, escapeEvent);

			expect(escapeEvent.defaultPrevented).toBe(true);
			expect(onSelectKeyDown).toHaveBeenCalledTimes(1);
			expect(onParentKeyDown).toHaveBeenCalledTimes(1);

			await flushPopoverScheduling();

			expect(onInputChange).toHaveBeenCalledTimes(1);
			expect(onInputChange).toHaveBeenCalledWith('', {
				action: 'menu-close',
				prevInputValue: '',
			});
			expect(onMenuClose).toHaveBeenCalledTimes(1);
			expect(callbackOrder).toEqual(['onInputChange', 'onMenuClose']);
			expect(screen.queryByTestId(`${TEST_ID}-select--listbox-container`)).not.toBeInTheDocument();
		},
	);

	it('also handles Escape bubbling through the built-in Select container', () => {
		const onParentKeyDown = jest.fn();
		render(
			<div role="presentation" onKeyDown={onParentKeyDown}>
				<StateManagedSelect testId={TEST_ID} options={options} defaultMenuIsOpen />
			</div>,
		);

		const container = screen.getByTestId(`${TEST_ID}-select--container`);
		const escapeEvent = createEvent.keyDown(container, {
			key: 'Escape',
			bubbles: true,
			cancelable: true,
		});

		fireEvent(container, escapeEvent);

		expect(escapeEvent.defaultPrevented).toBe(true);
		expect(onParentKeyDown).toHaveBeenCalledTimes(1);
	});

	it('leaves Escape handling to a custom MenuPortal', () => {
		const onMenuClose = jest.fn();
		renderSelect({
			menuIsOpen: true,
			onMenuClose,
			components: { MenuPortal: ({ children }) => children },
		});
		const input = screen.getByTestId(`${TEST_ID}-select--input`);
		const event = createEvent.keyDown(input, { key: 'Escape', bubbles: true, cancelable: true });
		fireEvent(input, event);
		expect(event.defaultPrevented).toBe(false);
		expect(onMenuClose).not.toHaveBeenCalled();
	});

	it.each(['input', 'document'])('restores a hidden input when Escape comes from %s', (target) => {
		const select = (menuIsOpen: boolean) => (
			<Select
				testId={TEST_ID}
				options={options}
				value={[options[0]]}
				isMulti
				menuIsOpen={menuIsOpen}
				onInputChange={__noop}
				onMenuClose={__noop}
			/>
		);
		const { rerender } = render(select(false));
		const input = screen.getByTestId(`${TEST_ID}-select--input`);

		fireEvent.keyDown(input, { key: 'ArrowLeft' });
		expect(input).toHaveStyle({ opacity: '0' });

		rerender(select(true));
		fireEvent.keyDown(target === 'input' ? input : document.body, { key: 'Escape' });
		rerender(select(false));

		expect(input).not.toHaveStyle({ opacity: '0' });
	});

	it('does not cancel or stop Escape when the top-layer menu is closed', () => {
		const onKeyDown = jest.fn();
		render(
			<div role="presentation" onKeyDown={onKeyDown}>
				<StateManagedSelect testId={TEST_ID} options={options} />
			</div>,
		);
		const input = screen.getByTestId(`${TEST_ID}-select--input`);
		const escapeEvent = createEvent.keyDown(input, {
			key: 'Escape',
			bubbles: true,
			cancelable: true,
		});

		fireEvent(input, escapeEvent);

		expect(escapeEvent.defaultPrevented).toBe(false);
		expect(onKeyDown).toHaveBeenCalledTimes(1);
	});
});

/**
 * Focus on close. Select hides the menu's `Popover` and keeps the menu mounted
 * until the `Popover` has finished closing. The platform rule then applies
 * through Popover's fallback: focus that is inside the menu returns to the
 * element that was focused when the menu opened.
 */
describe('MenuPortalTopLayer - focus when the menu closes (flag ON)', () => {
	// Select pulls focus that leaves the input for its MenuList back to the input, so the
	// focusable content sits in Menu, as DatePicker's calendar does.
	function MenuWithButton(props) {
		return (
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			<components.Menu {...props}>
				<button type="button">Inside menu</button>
				{props.children}
			</components.Menu>
		);
	}

	// Moves focus into the menu in a passive effect, as DatePicker and Calendar do.
	function MenuThatTakesFocus(props) {
		const buttonRef = React.useRef<HTMLButtonElement>(null);
		React.useEffect(() => {
			buttonRef.current?.focus();
		}, []);
		return (
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			<components.Menu {...props}>
				<button type="button" ref={buttonRef}>
					Inside menu
				</button>
				{props.children}
			</components.Menu>
		);
	}

	// Stands in for app code that moves focus in the same commit that closes the menu.
	function FocusElsewhereOnMount() {
		React.useLayoutEffect(() => {
			screen.getByRole('button', { name: 'Elsewhere' }).focus();
		}, []);
		return null;
	}

	function getUi({
		menuIsOpen,
		hasOpener = true,
		isFocusMovedOnClose = false,
		Menu = MenuWithButton,
		onFocus = __noop,
		onMenuClose = __noop,
	}: {
		menuIsOpen: boolean;
		hasOpener?: boolean;
		isFocusMovedOnClose?: boolean;
		Menu?: typeof MenuWithButton;
		onFocus?: () => void;
		onMenuClose?: () => void;
	}) {
		return (
			<div>
				{hasOpener ? <button type="button">Opener</button> : null}
				<button type="button">Elsewhere</button>
				{isFocusMovedOnClose && !menuIsOpen ? <FocusElsewhereOnMount /> : null}
				<Select
					testId={TEST_ID}
					classNamePrefix="test"
					options={options}
					menuIsOpen={menuIsOpen}
					onFocus={onFocus}
					onInputChange={__noop}
					onMenuClose={onMenuClose}
					components={{ Menu }}
				/>
			</div>
		);
	}

	function focusElement(element: HTMLElement) {
		act(() => element.focus());
	}

	function focusButton(name: string) {
		focusElement(screen.getByRole('button', { name }));
	}

	function queryMenuButton() {
		return screen.queryByRole('button', { name: 'Inside menu', hidden: true });
	}

	beforeEach(() => {
		passGate('platform-dst-top-layer');
	});

	it('returns focus to the opener when the menu closes with focus inside it', async () => {
		const { rerender } = render(getUi({ menuIsOpen: false }));
		focusButton('Opener');
		rerender(getUi({ menuIsOpen: true }));
		focusButton('Inside menu');

		rerender(getUi({ menuIsOpen: false }));
		await flushPopoverExit();

		expect(queryMenuButton()).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Opener' })).toHaveFocus();
	});

	it('hides the menu at once and unmounts it after the close finishes', async () => {
		const { rerender } = render(getUi({ menuIsOpen: true }));
		const popover = getOnlyPopover();
		expect(popover.matches(':popover-open')).toBe(true);

		rerender(getUi({ menuIsOpen: false }));

		expect(popover.matches(':popover-open')).toBe(false);
		expect(queryMenuButton()).toBeInTheDocument();

		await flushPopoverExit();

		expect(queryMenuButton()).not.toBeInTheDocument();
		expect(document.querySelector('[popover]')).toBeNull();
	});

	it('keeps the opener in StrictMode when content takes focus in a passive effect', async () => {
		const getStrictUi = (menuIsOpen: boolean) => (
			<React.StrictMode>{getUi({ menuIsOpen, Menu: MenuThatTakesFocus })}</React.StrictMode>
		);
		const { rerender } = render(getStrictUi(false));
		focusButton('Opener');
		rerender(getStrictUi(true));
		await flushPopoverExit();
		expect(screen.getByRole('button', { name: 'Inside menu' })).toHaveFocus();

		rerender(getStrictUi(false));
		await flushPopoverExit();

		expect(screen.getByRole('button', { name: 'Opener' })).toHaveFocus();
	});

	it('returns focus to the input so that Select and its onFocus see it', async () => {
		const onFocus = jest.fn();
		const { rerender } = render(getUi({ menuIsOpen: false, onFocus }));
		const input = screen.getByTestId(`${TEST_ID}-select--input`);
		focusElement(input);
		rerender(getUi({ menuIsOpen: true, onFocus }));
		focusButton('Inside menu');
		expect(screen.getByTestId(`${TEST_ID}-select--control`)).not.toHaveClass(
			'test__control--is-focused',
		);
		onFocus.mockClear();

		rerender(getUi({ menuIsOpen: false, onFocus }));
		await flushPopoverExit();

		expect(input).toHaveFocus();
		expect(onFocus).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId(`${TEST_ID}-select--control`)).toHaveClass(
			'test__control--is-focused',
		);
	});

	it.each(['was <body>', 'is gone'])(
		'does not move focus to the input when the opener %s',
		async (openerState) => {
			const isOpenerGone = openerState === 'is gone';
			const { rerender } = render(getUi({ menuIsOpen: false }));
			if (isOpenerGone) {
				focusButton('Opener');
			}
			rerender(getUi({ menuIsOpen: true }));
			// For 'is gone', remove the opener while the menu is open.
			rerender(getUi({ menuIsOpen: true, hasOpener: !isOpenerGone }));
			focusButton('Inside menu');

			rerender(getUi({ menuIsOpen: false, hasOpener: !isOpenerGone }));
			await flushPopoverExit();

			expect(document.body).toHaveFocus();
		},
	);

	it.each(['on <body>', 'on another element'])(
		'does not move focus when focus is %s as the menu closes',
		async (focusState) => {
			const { rerender } = render(getUi({ menuIsOpen: false }));
			focusButton('Opener');
			rerender(getUi({ menuIsOpen: true }));
			focusButton('Inside menu');
			if (focusState === 'on <body>') {
				act(() => screen.getByRole('button', { name: 'Inside menu' }).blur());
			} else {
				focusButton('Elsewhere');
			}

			rerender(getUi({ menuIsOpen: false }));
			await flushPopoverExit();

			expect(screen.getByRole('button', { name: 'Opener' })).not.toHaveFocus();
			expect(
				focusState === 'on <body>' ? document.body : screen.getByText('Elsewhere'),
			).toHaveFocus();
		},
	);

	it('keeps focus that moved elsewhere in the commit that closed the menu', async () => {
		const { rerender } = render(getUi({ menuIsOpen: false }));
		focusButton('Opener');
		rerender(getUi({ menuIsOpen: true }));
		focusButton('Inside menu');

		rerender(getUi({ menuIsOpen: false, isFocusMovedOnClose: true }));
		await flushPopoverExit();

		expect(screen.getByRole('button', { name: 'Elsewhere' })).toHaveFocus();
	});

	it('does not return focus after an outside press that leaves focus in the menu', async () => {
		function OutsidePressSelect() {
			const [menuIsOpen, setMenuIsOpen] = React.useState(false);
			return (
				<div>
					<button type="button">Opener</button>
					<button type="button" onClick={() => setMenuIsOpen(true)}>
						Open menu
					</button>
					<div data-testid="outside">Outside</div>
					<Select
						aria-label="Choose an option"
						testId={TEST_ID}
						options={options}
						menuIsOpen={menuIsOpen}
						onMenuClose={() => setMenuIsOpen(false)}
						onInputChange={__noop}
						components={{ Menu: MenuWithButton }}
					/>
				</div>
			);
		}
		render(<OutsidePressSelect />);
		focusButton('Opener');
		act(() => screen.getByRole('button', { name: 'Open menu' }).click());
		await flushPopoverExit();
		focusButton('Inside menu');

		// A press on an element that does not take focus leaves focus in the menu.
		const outside = screen.getByTestId('outside');
		fireEvent.pointerDown(outside);
		fireEvent.pointerUp(outside);
		await flushPopoverExit();

		expect(queryMenuButton()).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Opener' })).not.toHaveFocus();
		expect(document.body).toHaveFocus();
	});

	it('reopens when the menu opens again during the close', async () => {
		const { rerender } = render(getUi({ menuIsOpen: true }));
		const popover = getOnlyPopover();

		rerender(getUi({ menuIsOpen: false }));
		rerender(getUi({ menuIsOpen: true }));
		await flushPopoverExit();

		expect(popover.matches(':popover-open')).toBe(true);
		expect(queryMenuButton()).toBeInTheDocument();

		// The next close still finishes.
		rerender(getUi({ menuIsOpen: false }));
		await flushPopoverExit();
		expect(queryMenuButton()).not.toBeInTheDocument();
	});

	describe('when the menu reopens during the close', () => {
		let getBoundingClientRectSpy: jest.SpyInstance;

		beforeEach(() => {
			// jsdom has no layout. Put the options below the visible part of the list. As in a
			// browser, a hidden popover has no layout.
			getBoundingClientRectSpy = jest
				.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
				.mockImplementation(function getRect(this: HTMLElement) {
					const isShown = Boolean(this.closest('[popover]')?.matches(':popover-open'));
					const top = isShown && this.getAttribute('role') === 'option' ? 200 : 0;
					const height = isShown ? 40 : 0;
					return { top, bottom: top + height, left: 0, right: 0, width: 0, height, x: 0, y: top };
				});
		});

		afterEach(() => {
			getBoundingClientRectSpy.mockRestore();
		});

		it('scrolls the list to the focused option', async () => {
			render(
				<StateManagedSelect
					aria-label="Choose an option"
					testId={TEST_ID}
					options={options}
					// jsdom supports touch events, so by default Select blurs its input on a pick.
					blurInputOnSelect={false}
				/>,
			);
			const input = screen.getByTestId(`${TEST_ID}-select--input`);
			focusElement(input);
			fireEvent.keyDown(input, { key: 'ArrowDown' });
			const popover = getOnlyPopover();
			// Pick the first option, so the menu closes with focus on the input.
			fireEvent.keyDown(input, { key: 'Enter' });
			expect(popover.matches(':popover-open')).toBe(false);
			expect(screen.getByRole('listbox', { hidden: true })).toBeInTheDocument();
			expect(input).toHaveFocus();
			scrollTo.mockClear();

			fireEvent.keyDown(input, { key: 'ArrowDown' });
			await flushPopoverExit();

			expect(popover.matches(':popover-open')).toBe(true);
			expect(scrollTo).toHaveBeenCalledWith(screen.getByRole('listbox'), expect.any(Number));
		});
	});

	it('ends the close after fast open and close toggles', async () => {
		const { rerender } = render(getUi({ menuIsOpen: false }));
		focusButton('Opener');
		rerender(getUi({ menuIsOpen: true }));
		focusButton('Inside menu');
		rerender(getUi({ menuIsOpen: false }));
		rerender(getUi({ menuIsOpen: true }));
		rerender(getUi({ menuIsOpen: false }));
		await flushPopoverExit();

		expect(queryMenuButton()).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Opener' })).toHaveFocus();
	});

	it('does not treat a closing menu as open', async () => {
		const onMenuClose = jest.fn();
		const { rerender } = render(getUi({ menuIsOpen: true, onMenuClose }));
		const input = screen.getByTestId(`${TEST_ID}-select--input`);

		rerender(getUi({ menuIsOpen: false, onMenuClose }));

		// The menu is still mounted, but it is closed.
		expect(queryMenuButton()).toBeInTheDocument();
		expect(hasOpenDialogOrPopover()).toBe(false);
		expect(input).toHaveAttribute('aria-expanded', 'false');
		expect(input).not.toHaveAttribute('aria-controls');
		// Light dismiss and Escape no longer listen.
		fireEvent.pointerDown(document.body);
		fireEvent.pointerUp(document.body);
		fireEvent.keyDown(document.body, { key: 'Escape' });
		expect(onMenuClose).not.toHaveBeenCalled();

		await flushPopoverExit();
	});

	it('ends the close when no menu was showing', () => {
		const onMenuOpen = jest.fn();
		const ui = (menuIsOpen: boolean) => (
			<Select
				aria-label="Choose an option"
				testId={TEST_ID}
				options={[]}
				noOptionsMessage={() => null}
				openMenuOnFocus
				menuIsOpen={menuIsOpen}
				onInputChange={__noop}
				onMenuClose={__noop}
				onMenuOpen={onMenuOpen}
			/>
		);
		const { rerender } = render(ui(true));
		expect(document.querySelector('[popover]')).toBeNull();

		rerender(ui(false));

		// Nothing was showing, so the close ended at once: a later focus is not taken as a return.
		expect(document.querySelector('[popover]')).toBeNull();
		act(() => screen.getByTestId(`${TEST_ID}-select--input`).focus());
		expect(onMenuOpen).toHaveBeenCalledTimes(1);
	});

	it('unmounts a custom MenuPortal at once, as before', () => {
		function CustomMenuPortal({ children }) {
			return <div data-testid="custom-menu-portal">{children}</div>;
		}
		const ui = (menuIsOpen: boolean) => (
			<Select
				aria-label="Choose an option"
				testId={TEST_ID}
				options={options}
				menuIsOpen={menuIsOpen}
				onInputChange={__noop}
				components={{ MenuPortal: CustomMenuPortal }}
			/>
		);
		const { rerender } = render(ui(true));
		expect(screen.getByTestId('custom-menu-portal')).toBeInTheDocument();

		rerender(ui(false));

		expect(screen.queryByTestId('custom-menu-portal')).not.toBeInTheDocument();
	});

	it('can unmount while the menu is closing', async () => {
		const { rerender, unmount } = render(getUi({ menuIsOpen: true }));
		rerender(getUi({ menuIsOpen: false }));

		expect(() => unmount()).not.toThrow();
		await flushPopoverExit();
		expect(document.querySelector('[popover]')).toBeNull();
	});

	describe('with openMenuOnFocus', () => {
		const CloseMenuContext = React.createContext<() => void>(__noop);

		function MenuWithCloseButton(props) {
			const closeMenu = React.useContext(CloseMenuContext);
			return (
				// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
				<components.Menu {...props}>
					<button type="button" onClick={closeMenu}>
						Close menu
					</button>
					{props.children}
				</components.Menu>
			);
		}

		// The app owns `menuIsOpen`, and a button inside the menu closes it.
		function OpenMenuOnFocusSelect({ onFocus }: { onFocus: () => void }) {
			const [menuIsOpen, setMenuIsOpen] = React.useState(false);
			const closeMenu = React.useCallback(() => setMenuIsOpen(false), []);
			return (
				<div>
					<button type="button">Opener</button>
					<button type="button" onClick={() => setMenuIsOpen(true)}>
						Open menu
					</button>
					<CloseMenuContext.Provider value={closeMenu}>
						<Select
							aria-label="Choose an option"
							testId={TEST_ID}
							options={options}
							openMenuOnFocus
							menuIsOpen={menuIsOpen}
							onMenuOpen={() => setMenuIsOpen(true)}
							onMenuClose={__noop}
							onFocus={onFocus}
							onInputChange={__noop}
							components={{ Menu: MenuWithCloseButton }}
						/>
					</CloseMenuContext.Provider>
				</div>
			);
		}

		async function closeFromInsideMenu() {
			focusButton('Close menu');
			act(() => screen.getByRole('button', { name: 'Close menu' }).click());
			await flushPopoverExit();
		}

		it('does not reopen the menu when focus returns to the input', async () => {
			const onFocus = jest.fn();
			render(<OpenMenuOnFocusSelect onFocus={onFocus} />);
			const input = screen.getByTestId(`${TEST_ID}-select--input`);
			focusElement(input);
			expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
			onFocus.mockClear();

			await closeFromInsideMenu();

			expect(input).toHaveFocus();
			expect(onFocus).toHaveBeenCalledTimes(1);
			expect(
				screen.queryByRole('button', { name: 'Close menu', hidden: true }),
			).not.toBeInTheDocument();

			// The next real focus of the input still opens the menu.
			act(() => input.blur());
			focusElement(input);
			expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
		});

		it('still opens the menu on a later focus after focus returned to another element', async () => {
			render(<OpenMenuOnFocusSelect onFocus={__noop} />);
			focusButton('Opener');
			act(() => screen.getByRole('button', { name: 'Open menu' }).click());
			await flushPopoverExit();

			await closeFromInsideMenu();

			expect(screen.getByRole('button', { name: 'Opener' })).toHaveFocus();
			focusElement(screen.getByTestId(`${TEST_ID}-select--input`));
			expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
		});
	});
});

/**
 * Contract for `MenuPortalCloseContext`: default value is `undefined` and
 * consumers must guard with `if (closeSelect)`. Together this lets
 * `MenuPortalTopLayer` render outside the provider chain without crashing.
 * Pin the default here so a future change cannot silently break that guard.
 */
describe('MenuPortalCloseContext - default value', () => {
	it('default value is `undefined` (consumer is responsible for guarding)', () => {
		// Importing inline so the context module is only loaded for this test.
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { MenuPortalCloseContext } = require('../../internal/menu-portal-close-context');
		const captured: { value: unknown } = { value: 'unset' };
		function Probe() {
			captured.value = React.useContext(MenuPortalCloseContext);
			return null;
		}
		render(<Probe />);
		expect(captured.value).toBeUndefined();
	});
});
