import React, { useEffect } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { replaceRaf, type Stub } from 'raf-stub';

import {
	KEY_DOWN,
	KEY_END,
	KEY_HOME,
	KEY_LEFT,
	KEY_RIGHT,
	KEY_UP,
} from '@atlaskit/ds-lib/keycodes';

import DropdownMenu from '../../dropdown-menu';
import DropdownItem from '../../dropdown-menu-item';
import DropdownItemGroup from '../../dropdown-menu-item-group';

const triggerText = 'Options';

/**
 * Everything except `setTimeout`/`clearTimeout`, which are the only APIs we need to control
 * in order to flush `focus-trap`'s deferred initial focus.
 */
const TIMER_APIS_TO_LEAVE_ALONE = [
	'Date',
	'cancelAnimationFrame',
	'cancelIdleCallback',
	'clearImmediate',
	'clearInterval',
	'hrtime',
	'nextTick',
	'performance',
	'queueMicrotask',
	'requestAnimationFrame',
	'requestIdleCallback',
	'setImmediate',
	'setInterval',
] as const;

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('dropdown menu keyboard navigation', () => {
	// requestAnimationFrame is replaced by raf-stub
	replaceRaf();
	const requestAnimationFrame = window.requestAnimationFrame as unknown as Stub;

	// `focus-trap` >= 2.4.6 applies the trap's initial focus inside a `setTimeout(…, 0)`
	// rather than synchronously within `activate()`. Popup activates the trap in a
	// `requestAnimationFrame` callback, so stepping raf-stub alone is no longer enough for
	// focus to have landed. Faking only the timer APIs lets us flush that deferred focus
	// synchronously, keeping these tests free of polling. `requestAnimationFrame` is left
	// real so raf-stub stays in control of it.
	beforeEach(() => {
		jest.useFakeTimers({ doNotFake: [...TIMER_APIS_TO_LEAVE_ALONE] });
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	afterAll(() => {
		requestAnimationFrame.reset();
	});

	/**
	 * Step a single animation frame, then flush any focus deferred by `focus-trap`.
	 */
	function stepFrame() {
		requestAnimationFrame.step();
		jest.runOnlyPendingTimers();
	}

	/**
	 * Flush all pending animation frames, then any focus deferred by `focus-trap`.
	 */
	function flushFrames() {
		requestAnimationFrame.flush();
		jest.runOnlyPendingTimers();
	}

	function openDropdownWithClick(element: HTMLElement) {
		// JSDOM sets clientX and clientY to 0,0
		// for all click events. This breaks the if condition
		// used inside dropdown menu to differentiate mouse clicks
		// from the "clicks" triggered by the keyboard
		// when Enter or Space is pressed.
		fireEvent.click(element, {
			clientX: 1,
			clientY: 1,
			detail: 1,
		});

		stepFrame();
	}

	function openDropdownWithKeydown(element: HTMLElement) {
		fireEvent.focus(element);
		stepFrame();

		fireEvent.keyDown(element, {
			key: KEY_DOWN,
			code: KEY_DOWN,
		});
		flushFrames();
	}

	const items = ['Move', 'Clone', 'Delete'];
	const testId = 'testId';

	it('should NOT open the menu when DOWN arrow is pressed while the trigger is NOT focused', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId}>
				<DropdownItemGroup>
					{items.map((text) => (
						<DropdownItem>{text}</DropdownItem>
					))}
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
			key: KEY_DOWN,
			code: KEY_DOWN,
		});

		expect(screen.queryByTestId(`${testId}--content`)).not.toBeInTheDocument();
	});

	it('should open the menu when DOWN arrow is pressed while the trigger is focused', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId}>
				<DropdownItemGroup>
					{items.map((text) => (
						<DropdownItem>{text}</DropdownItem>
					))}
				</DropdownItemGroup>
			</DropdownMenu>,
		);
		openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));

		expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();
	});

	describe('with open menu', () => {
		it('should focus the first element by default when accessed using a keyboard', () => {
			render(
				<DropdownMenu trigger={triggerText} testId={testId}>
					<DropdownItemGroup>
						{items.map((text) => (
							<DropdownItem>{text}</DropdownItem>
						))}
					</DropdownItemGroup>
				</DropdownMenu>,
			);

			openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));
			expect(screen.getByText(items[0])).toBeInTheDocument();

			stepFrame();

			const firstMenuItem = screen.getAllByRole('menuitem')[0];
			expect(firstMenuItem).toHaveAccessibleName(items[0]);
			expect(firstMenuItem).toHaveFocus();
		});

		it('should focus the content wrapper when clicked with a mouse', () => {
			render(
				<DropdownMenu trigger={triggerText} testId={testId}>
					<DropdownItemGroup>
						{items.map((text) => (
							<DropdownItem>{text}</DropdownItem>
						))}
					</DropdownItemGroup>
				</DropdownMenu>,
			);

			openDropdownWithClick(screen.getByTestId(`${testId}--trigger`));

			expect(screen.getByText(items[0])).toBeInTheDocument();
			stepFrame();

			expect(screen.getByTestId(`${testId}--content`)).toHaveFocus();
		});

		it('should focus the next element on pressing the DOWN arrow', () => {
			render(
				<DropdownMenu trigger={triggerText} testId={testId}>
					<DropdownItemGroup>
						{items.map((text) => (
							<DropdownItem>{text}</DropdownItem>
						))}
					</DropdownItemGroup>
				</DropdownMenu>,
			);
			openDropdownWithClick(screen.getByTestId(`${testId}--trigger`));

			fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
				key: KEY_DOWN,
				code: KEY_DOWN,
			});

			fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
				key: KEY_DOWN,
				code: KEY_DOWN,
			});

			stepFrame();

			const secondMenuItem = screen.getAllByRole('menuitem')[1];
			expect(secondMenuItem).toHaveAccessibleName(items[1]);
			expect(secondMenuItem).toHaveFocus();
		});
	});

	it('should focus the previous element on pressing the UP arrow', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId}>
				<DropdownItemGroup>
					{items.map((text) => (
						<DropdownItem>{text}</DropdownItem>
					))}
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		// Open the menu and bring focus to the first element be focused
		openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));

		// Bring focus to the second element
		fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
			key: KEY_DOWN,
			code: KEY_DOWN,
		});

		// Bring focus to the third element
		fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
			key: KEY_DOWN,
			code: KEY_DOWN,
		});

		// Bring focus to the previous element
		fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
			key: KEY_UP,
			code: KEY_UP,
		});
		stepFrame();

		const lastMenuItem = screen.getAllByRole('menuitem')[1];
		expect(lastMenuItem).toHaveAccessibleName(items[1]);
		expect(lastMenuItem).toHaveFocus();
	});

	it('should focus the next element on pressing the DOWN arrow for async loaded content', async () => {
		let updateAsyncContent: ((show: boolean) => void) | undefined;
		const AsyncDropdownItem = () => {
			const [shouldShowAsyncContent, setShowAsyncContent] = React.useState(false);
			useEffect(() => {
				updateAsyncContent = (show: boolean) => setShowAsyncContent(show);
			}, []);
			return shouldShowAsyncContent ? (
				<>
					<DropdownItem>Async 1</DropdownItem>
					<DropdownItem>Async 2</DropdownItem>
				</>
			) : null;
		};

		render(
			<DropdownMenu trigger={triggerText} testId={testId}>
				<AsyncDropdownItem key="async" />
				{items.map((text) => (
					<DropdownItem key={text}>{text}</DropdownItem>
				))}
			</DropdownMenu>,
		);

		const dropdownElement = screen.getByTestId(`${testId}--trigger`);

		openDropdownWithClick(dropdownElement);

		const initialMenuItems = screen.getAllByRole('menuitem');
		expect(initialMenuItems.length).toEqual(3);
		expect(initialMenuItems.map((e) => e.textContent)).toEqual(items);

		await act(async () => {
			updateAsyncContent?.(true);
			flushFrames();
		});

		fireEvent.keyDown(dropdownElement, {
			key: KEY_DOWN,
			code: KEY_DOWN,
		});

		const asyncMenuItems = screen.getAllByRole('menuitem');
		expect(asyncMenuItems.length).toEqual(5);
		expect(asyncMenuItems.map((e) => e.textContent)).toEqual(['Async 1', 'Async 2', ...items]);
		expect(asyncMenuItems[0]).toHaveFocus();
	});

	it('should skip over disabled items while keyboard navigating', () => {
		const second = 'Second';
		const fourth = 'Fourth';
		const secondLast = 'Second Last';

		render(
			<DropdownMenu trigger={triggerText} testId={testId}>
				<DropdownItemGroup>
					<DropdownItem isDisabled>First</DropdownItem>
					<DropdownItem>{second}</DropdownItem>
					<DropdownItem isDisabled={true}>Third</DropdownItem>
					<DropdownItem>{fourth}</DropdownItem>
					<DropdownItem>{secondLast}</DropdownItem>
					<DropdownItem isDisabled>Last</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);
		openDropdownWithClick(screen.getByTestId(`${testId}--trigger`));

		fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
			key: KEY_DOWN,
			code: KEY_DOWN,
		});

		fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
			key: KEY_DOWN,
			code: KEY_DOWN,
		});

		stepFrame();

		const allMenuItems = screen.getAllByRole('menuitem');
		const fourthMenuItem = allMenuItems[3];
		expect(fourthMenuItem).toHaveAccessibleName(fourth);
		expect(fourthMenuItem).toHaveFocus();

		fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
			key: KEY_UP,
			code: KEY_UP,
		});
		stepFrame();

		const secondMenuItem = allMenuItems[1];
		expect(secondMenuItem).toHaveAccessibleName(second);
		expect(secondMenuItem).toHaveFocus();

		fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
			key: KEY_END,
			code: KEY_END,
		});
		stepFrame();

		const secondLastMenuItem = allMenuItems.slice(-2)[0];
		expect(secondLastMenuItem).toHaveAccessibleName(secondLast);
		expect(secondLastMenuItem).toHaveFocus();

		fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
			key: KEY_HOME,
			code: KEY_HOME,
		});
		stepFrame();

		expect(secondMenuItem).toHaveFocus();
	});

	it('should skip disabled elements and focus on the first focusable element with autoFucus', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId} autoFocus>
				<DropdownItemGroup>
					<DropdownItem isDisabled>{items[0]}</DropdownItem>
					<DropdownItem>{items[1]}</DropdownItem>
					<DropdownItem>{items[2]}</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);
		openDropdownWithClick(screen.getByTestId(`${testId}--trigger`));

		const secondMenuItem = screen.getAllByRole('menuitem')[1];
		expect(secondMenuItem).toHaveAccessibleName(items[1]);
		expect(secondMenuItem).toHaveFocus();
	});

	it('should skip disabled elements and focus on the first focusable element with keyboard navigation', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId}>
				<DropdownItemGroup>
					<DropdownItem isDisabled>{items[0]}</DropdownItem>
					<DropdownItem>{items[1]}</DropdownItem>
					<DropdownItem>{items[2]}</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);
		openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));

		const secondMenuItem = screen.getAllByRole('menuitem')[1];
		expect(secondMenuItem).toHaveAccessibleName(items[1]);
		expect(secondMenuItem).toHaveFocus();
	});

	it('should focus the first element on pressing the HOME arrow', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId}>
				<DropdownItemGroup>
					{items.map((text) => (
						<DropdownItem>{text}</DropdownItem>
					))}
				</DropdownItemGroup>
			</DropdownMenu>,
		);
		openDropdownWithClick(screen.getByTestId(`${testId}--trigger`));

		fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
			key: KEY_DOWN,
			code: KEY_DOWN,
		});

		fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
			key: KEY_HOME,
			code: KEY_HOME,
		});
		stepFrame();

		const firstMenuItem = screen.getAllByRole('menuitem')[0];
		expect(firstMenuItem).toHaveAccessibleName(items[0]);
		expect(firstMenuItem).toHaveFocus();
	});

	it('should focus the last element on pressing the END arrow', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId}>
				<DropdownItemGroup>
					{items.map((text) => (
						<DropdownItem>{text}</DropdownItem>
					))}
				</DropdownItemGroup>
			</DropdownMenu>,
		);
		openDropdownWithClick(screen.getByTestId(`${testId}--trigger`));

		fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
			key: KEY_DOWN,
			code: KEY_DOWN,
		});

		fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
			key: KEY_END,
			code: KEY_END,
		});

		stepFrame();

		const lastMenuItem = screen.getAllByRole('menuitem').slice(-1)[0];
		expect(lastMenuItem).toHaveAccessibleName(items.slice(-1)[0]);
		expect(lastMenuItem).toHaveFocus();
	});

	it('should loop and move focus to the last element while the first element is focused and KEY_UP pressed', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId}>
				<DropdownItemGroup>
					{items.map((text) => (
						<DropdownItem>{text}</DropdownItem>
					))}
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		// Open the menu and bring focus to the first element be focused
		openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));

		const firstMenuItem = screen.getAllByRole('menuitem')[0];
		expect(firstMenuItem).toHaveAccessibleName(items[0]);
		expect(firstMenuItem).toHaveFocus();

		fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
			key: KEY_UP,
			code: KEY_UP,
		});
		stepFrame();

		// Assert that the focus has looped over to the last element
		const lastMenuItem = screen.getAllByRole('menuitem')[items.length - 1];
		expect(lastMenuItem).toHaveAccessibleName(items[items.length - 1]);
		expect(lastMenuItem).toHaveFocus();
	});

	it('should loop and move focus to the first element whild the last element is focused and KEY_DOWN pressed', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId}>
				<DropdownItemGroup>
					{items.map((text) => (
						<DropdownItem>{text}</DropdownItem>
					))}
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		// Open the menu and bring focus to the first element be focused
		openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));

		let index = 0;

		// Bring focus to the last element
		while (index < 3) {
			const menuItem = screen.getAllByRole('menuitem')[index];
			expect(menuItem).toHaveAccessibleName(items[index]);
			expect(menuItem).toHaveFocus();

			fireEvent.keyDown(menuItem, {
				key: KEY_DOWN,
				code: KEY_DOWN,
			});
			stepFrame();

			index++;
		}
		// Assert that the focus has looped over to the first element
		const firstMenuItem = screen.getAllByRole('menuitem')[0];
		expect(firstMenuItem).toHaveFocus();
	});

	it('should not allow the dropdown to reopen if the trigger is activated again', () => {
		const onOpenChange = jest.fn();
		render(
			<DropdownMenu trigger={triggerText} testId={testId} onOpenChange={onOpenChange}>
				<DropdownItemGroup>
					{items.map((text) => (
						<DropdownItem>{text}</DropdownItem>
					))}
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));
		expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();
		expect(onOpenChange).toHaveBeenCalledWith({
			isOpen: true,
			event: expect.any(KeyboardEvent),
		});
		expect(onOpenChange).toHaveBeenCalledTimes(1);

		onOpenChange.mockClear();

		// this should not be possible to do as focus should not be able
		// to go back to the trigger when the menu is open, but checking here to be safe
		openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));
		expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	describe('Left and Right arrow navigation (ARIA)', () => {
		it('should NOT close the root menu when Left arrow is pressed (no navigation within menu)', () => {
			render(
				<DropdownMenu trigger={triggerText} testId={testId}>
					<DropdownItemGroup>
						{items.map((text) => (
							<DropdownItem key={text}>{text}</DropdownItem>
						))}
					</DropdownItemGroup>
				</DropdownMenu>,
			);

			openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));
			expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();

			const firstMenuItem = screen.getAllByRole('menuitem')[0];
			fireEvent.keyDown(firstMenuItem, {
				key: KEY_LEFT,
				code: KEY_LEFT,
			});
			stepFrame();

			// Root menu stays open; Left does not navigate within menu
			expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();
		});

		it('should open nested menu when Right arrow is pressed on nested trigger', () => {
			const NestedDropdown = ({ level = 0 }: { level?: number }) => (
				<DropdownMenu
					shouldRenderToParent
					placement="right-start"
					testId={`nested-${level}`}
					trigger={({ triggerRef, ...triggerProps }) => (
						<DropdownItem {...triggerProps} ref={triggerRef}>
							Nested Menu
						</DropdownItem>
					)}
				>
					<DropdownItemGroup>
						<NestedDropdown level={level + 1} />
						<DropdownItem testId={`nested-item-${level + 1}`}>Item</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>
			);

			render(
				<DropdownMenu trigger={triggerText} testId={testId}>
					<DropdownItemGroup>
						<NestedDropdown level={1} />
						<DropdownItem>Regular item</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>,
			);

			openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));
			expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();

			// Focus the nested trigger (first menuitem)
			const nestedTrigger = screen.getByText('Nested Menu');
			nestedTrigger.focus();
			stepFrame();

			fireEvent.keyDown(nestedTrigger, {
				key: KEY_RIGHT,
				code: KEY_RIGHT,
			});
			flushFrames();

			expect(screen.getByTestId('nested-1--content')).toBeInTheDocument();
		});

		it('should close nested menu and return focus to parent trigger when Left arrow is pressed', () => {
			const NestedDropdown = ({ level = 0 }: { level?: number }) => (
				<DropdownMenu
					shouldRenderToParent
					placement="right-start"
					testId={`nested-${level}`}
					trigger={({ triggerRef, ...triggerProps }) => (
						<DropdownItem {...triggerProps} ref={triggerRef}>
							Nested Menu
						</DropdownItem>
					)}
				>
					<DropdownItemGroup>
						<DropdownItem testId={`nested-item-${level + 1}`}>Nested item</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>
			);

			render(
				<DropdownMenu trigger={triggerText} testId={testId}>
					<DropdownItemGroup>
						<NestedDropdown level={1} />
					</DropdownItemGroup>
				</DropdownMenu>,
			);

			openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));
			const parentNestedTrigger = screen.getByText('Nested Menu');
			fireEvent.click(parentNestedTrigger, { clientX: 1, clientY: 1, detail: 1 });
			stepFrame();

			expect(screen.getByTestId('nested-1--content')).toBeInTheDocument();

			const nestedMenuItem = screen.getByText('Nested item');
			nestedMenuItem.focus();

			fireEvent.keyDown(nestedMenuItem, {
				key: KEY_LEFT,
				code: KEY_LEFT,
			});
			stepFrame();

			expect(screen.queryByTestId('nested-1--content')).not.toBeInTheDocument();
			expect(screen.getByTestId('nested-1--trigger')).toHaveFocus();
		});
	});

	describe('shouldPreventEscapePropagation', () => {
		it('should close the dropdown and call stopPropagation when Escape is pressed and shouldPreventEscapePropagation is true', () => {
			const mockOnOpenChange = jest.fn();

			render(
				<DropdownMenu
					trigger={triggerText}
					testId={testId}
					onOpenChange={mockOnOpenChange}
					shouldPreventEscapePropagation={true}
				>
					<DropdownItemGroup>
						{items.map((text) => (
							<DropdownItem>{text}</DropdownItem>
						))}
					</DropdownItemGroup>
				</DropdownMenu>,
			);

			openDropdownWithClick(screen.getByTestId(`${testId}--trigger`));
			expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();
			mockOnOpenChange.mockClear();

			const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
			const spy = jest.spyOn(event, 'stopPropagation');

			fireEvent(screen.getByTestId(`${testId}--content`), event);
			stepFrame();

			expect(screen.queryByTestId(`${testId}--content`)).not.toBeInTheDocument();
			expect(mockOnOpenChange).toHaveBeenCalledWith({
				isOpen: false,
				event: expect.any(Object),
			});
			expect(spy).toHaveBeenCalled();
			spy.mockRestore();
		});

		it('should close the dropdown and NOT call stopPropagation when Escape is pressed and shouldPreventEscapePropagation is false (default)', () => {
			const mockOnOpenChange = jest.fn();

			render(
				<DropdownMenu
					trigger={triggerText}
					testId={testId}
					onOpenChange={mockOnOpenChange}
					shouldPreventEscapePropagation={false}
				>
					<DropdownItemGroup>
						{items.map((text) => (
							<DropdownItem>{text}</DropdownItem>
						))}
					</DropdownItemGroup>
				</DropdownMenu>,
			);

			openDropdownWithClick(screen.getByTestId(`${testId}--trigger`));
			expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();
			mockOnOpenChange.mockClear();

			const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
			const spy = jest.spyOn(event, 'stopPropagation');

			fireEvent(screen.getByTestId(`${testId}--content`), event);
			stepFrame();

			expect(screen.queryByTestId(`${testId}--content`)).not.toBeInTheDocument();
			expect(mockOnOpenChange).toHaveBeenCalledWith({
				isOpen: false,
				event: expect.any(Object),
			});
			expect(spy).not.toHaveBeenCalled();
			spy.mockRestore();
		});
	});
});
