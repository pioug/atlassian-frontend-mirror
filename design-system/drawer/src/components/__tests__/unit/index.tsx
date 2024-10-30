import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EmojiIcon from '@atlaskit/icon/core/migration/emoji';

import Drawer from '../../index';
import { type DrawerProps } from '../../types';

declare var global: any;

const testId = 'test-drawer';

const findKeydownListenerCall = (listenerFn: any) =>
	listenerFn.mock.calls.find((e: any) => e[0] === 'keydown');

const escKeyDown = () => {
	const event = new KeyboardEvent('keydown', {
		key: 'Escape',
	});
	global.window.dispatchEvent(event);
};

const createDrawer = (props: DrawerProps) => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	<Drawer width="wide" label="Default Drawer" testId={testId} {...props}>
		<code>Drawer contents</code>
	</Drawer>
);

describe('esc key', () => {
	beforeEach(() => {
		jest.spyOn(global.window, 'addEventListener');
		jest.spyOn(global.window, 'removeEventListener');
	});

	afterEach(() => {
		global.window.addEventListener.mockRestore();
		global.window.removeEventListener.mockRestore();
	});

	it('should call onClose handler when pressing Escape', () => {
		let isOpen = true;

		const onClose = jest.fn(() => {
			isOpen = false;
		});

		render(createDrawer({ isOpen: isOpen, onClose: onClose }));

		expect(screen.getByTestId('drawer-contents')).toBeInTheDocument();

		fireEvent.keyDown(screen.getByTestId('drawer-contents'), { key: 'Escape' });

		expect(onClose).toHaveBeenCalled();
	});
});

describe('Drawer Transitions', () => {
	beforeEach(() => {
		jest.spyOn(global.window, 'addEventListener');
		jest.spyOn(global.window, 'removeEventListener');
	});

	afterEach(() => {
		global.window.addEventListener.mockRestore();
		global.window.removeEventListener.mockRestore();
	});

	it('should add a keydown listener only when drawer is opened', () => {
		const { rerender } = render(createDrawer({ isOpen: false }));

		expect(findKeydownListenerCall(window.addEventListener)).toBeUndefined();

		rerender(createDrawer({ isOpen: true }));

		const listenerCall = findKeydownListenerCall(window.addEventListener);
		expect(listenerCall).toBeTruthy();

		const eventHandler = listenerCall[1];
		expect(typeof eventHandler).toBe('function');
	});

	it('should add a keydown listener when drawer is mounted as opened', () => {
		render(createDrawer({ isOpen: true }));

		const listenerCall = findKeydownListenerCall(window.addEventListener);
		expect(listenerCall).toBeTruthy();

		const eventHandler = listenerCall[1];
		expect(typeof eventHandler).toBe('function');
	});

	it('should remove a keydown listener when drawer is closed', () => {
		const { rerender } = render(createDrawer({ isOpen: true }));

		expect(findKeydownListenerCall(window.removeEventListener)).toBeUndefined();

		rerender(createDrawer({ isOpen: false }));

		const [, eventHandler] = findKeydownListenerCall(window.removeEventListener);
		expect(typeof eventHandler).toBe('function');
	});

	it('should remove a keydown listener when the component is unmounted', () => {
		const { unmount } = render(createDrawer({ isOpen: true }));

		unmount();

		expect(global.window.removeEventListener).toHaveBeenCalled();
	});

	it('should call onClose if user press ESC', () => {
		const onClose = jest.fn();

		render(createDrawer({ isOpen: true, onClose: onClose }));
		escKeyDown();

		expect(onClose).toHaveBeenCalled();
	});

	it('should not call onClose if user press ESC while the drawer is closed', () => {
		const onClose = jest.fn();

		render(createDrawer({ isOpen: false, onClose: onClose }));

		escKeyDown();
		expect(onClose).not.toHaveBeenCalled();
	});

	it('should call onClose when blanket is clicked', async () => {
		const onClose = jest.fn();
		render(createDrawer({ isOpen: true, onClose: onClose }));

		expect(onClose).not.toHaveBeenCalled();
		await userEvent.click(screen.getByTestId(`${testId}--blanket`)); // Blanket
		expect(onClose).toHaveBeenCalled();
	});

	it('should call onClose when back button is clicked', () => {
		const onClose = jest.fn();
		render(createDrawer({ isOpen: true, onClose: onClose }));

		expect(onClose).not.toHaveBeenCalled();
		screen.getByTestId('DrawerPrimitiveSidebarCloseButton').click();
		expect(onClose).toHaveBeenCalled();
	});

	it('should call onClose when custom back button is clicked', () => {
		const onClose = jest.fn();
		render(createDrawer({ isOpen: true, icon: EmojiIcon, onClose: onClose }));

		expect(onClose).not.toHaveBeenCalled();
		screen.getByTestId('DrawerPrimitiveSidebarCloseButton').click();
		expect(onClose).toHaveBeenCalled();
	});

	it('should call onCloseComplete when DrawerPrimitive calls onCloseComplete', () => {
		jest.useFakeTimers();
		const onCloseComplete = jest.fn();
		const { rerender } = render(createDrawer({ isOpen: true, onCloseComplete: onCloseComplete }));

		rerender(createDrawer({ isOpen: false, onCloseComplete: onCloseComplete }));

		act(() => {
			jest.runAllTimers();
		});
		expect(onCloseComplete).toHaveBeenCalled();
		jest.useRealTimers();
	});

	it('should call onOpenComplete when DrawerPrimitive calls onOpenComplete', () => {
		jest.useFakeTimers();
		const onOpenComplete = jest.fn();
		render(createDrawer({ isOpen: true, onOpenComplete: onOpenComplete }));

		act(() => {
			jest.runAllTimers();
		});
		expect(onOpenComplete).toHaveBeenCalled();
		jest.useRealTimers();
	});

	it('should call onKeyDown if user press ESC', () => {
		const onKeyDown = jest.fn();
		const event = { key: 'Escape' };

		render(createDrawer({ isOpen: true, onKeyDown: onKeyDown }));
		const [eventName, eventHandler] = findKeydownListenerCall(window.addEventListener);

		eventHandler(event);

		expect(eventName).toBe('keydown');
		expect(onKeyDown).toHaveBeenCalledWith(event);
	});

	it("should NOT call onClose if user doesn't press ESC", () => {
		const onClose = jest.fn();
		const event = { key: 'another-key' };

		render(createDrawer({ isOpen: true, onClose: onClose }));
		const [, eventHandler] = findKeydownListenerCall(window.addEventListener);

		eventHandler(event);

		expect(onClose).not.toHaveBeenCalled();
	});
});
