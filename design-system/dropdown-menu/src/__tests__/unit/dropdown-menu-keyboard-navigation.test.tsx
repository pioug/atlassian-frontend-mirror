import React, { useEffect } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { replaceRaf, type Stub } from 'raf-stub';

import { KEY_DOWN, KEY_END, KEY_HOME, KEY_UP } from '@atlaskit/ds-lib/keycodes';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../index';

const triggerText = 'Options';

describe('dropdown menu keyboard navigation', () => {
	// requestAnimationFrame is replaced by raf-stub
	replaceRaf();
	const requestAnimationFrame = window.requestAnimationFrame as unknown as Stub;

	afterAll(() => {
		requestAnimationFrame.reset();
	});

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

		requestAnimationFrame.step();
	}

	function openDropdownWithKeydown(element: HTMLElement) {
		fireEvent.focus(element);
		requestAnimationFrame.step();

		fireEvent.keyDown(element, {
			key: KEY_DOWN,
			code: KEY_DOWN,
		});
		requestAnimationFrame.flush();
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

			requestAnimationFrame.step();

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
			requestAnimationFrame.step();

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

			requestAnimationFrame.step();

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
		requestAnimationFrame.step();

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
			requestAnimationFrame.flush();
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

		requestAnimationFrame.step();

		const allMenuItems = screen.getAllByRole('menuitem');
		const fourthMenuItem = allMenuItems[3];
		expect(fourthMenuItem).toHaveAccessibleName(fourth);
		expect(fourthMenuItem).toHaveFocus();

		fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
			key: KEY_UP,
			code: KEY_UP,
		});
		requestAnimationFrame.step();

		const secondMenuItem = allMenuItems[1];
		expect(secondMenuItem).toHaveAccessibleName(second);
		expect(secondMenuItem).toHaveFocus();

		fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
			key: KEY_END,
			code: KEY_END,
		});
		requestAnimationFrame.step();

		const secondLastMenuItem = allMenuItems.slice(-2)[0];
		expect(secondLastMenuItem).toHaveAccessibleName(secondLast);
		expect(secondLastMenuItem).toHaveFocus();

		fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
			key: KEY_HOME,
			code: KEY_HOME,
		});
		requestAnimationFrame.step();

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
		requestAnimationFrame.step();

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

		requestAnimationFrame.step();

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
		requestAnimationFrame.step();

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
			requestAnimationFrame.step();

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
});
