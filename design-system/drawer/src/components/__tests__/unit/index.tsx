import React from 'react';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EmojiIcon from '@atlaskit/icon/glyph/emoji';

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
		const event = { key: 'Escape' };

		render(createDrawer({ isOpen: true, onClose: onClose }));

		const [, eventHandler] = findKeydownListenerCall(window.addEventListener);

		eventHandler(event);

		expect(onClose.mock.calls[0][0]).toBe(event);
	});

	it('should not call onClose if user press ESC while the drawer is closed', () => {
		const onClose = jest.fn();

		const { rerender } = render(createDrawer({ isOpen: false, onClose: onClose }));

		escKeyDown();
		expect(onClose).not.toHaveBeenCalled();

		rerender(createDrawer({ isOpen: true, onClose: onClose }));

		escKeyDown();
		expect(onClose).toHaveBeenCalled();
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
	// this funtionality is currently broken and
	// will be fixed by https://ecosystem.atlassian.net/projects/AK/queues/issue/AK-6444
	it.skip('should NOT retain Drawer contents by default', () => {
		render(createDrawer({ isOpen: true }));

		// TODO: rewrite assertion with RTL once functionality is fixed.
		// expect(
		//   (wrapper.find('Slide').find('Transition').props() as any).unmountOnExit,
		// ).toBeTruthy();
	});

	// this funtionality is currently broken and
	// will be fixed by https://ecosystem.atlassian.net/projects/AK/queues/issue/AK-6444
	it.skip('should retain Drawer contents when shouldUnmountOnExit is passed', () => {
		render(createDrawer({ isOpen: true, shouldUnmountOnExit: false }));

		// expect(
		//   (wrapper.find('Slide').find('Transition').props() as any).unmountOnExit,
		// ).toBeFalsy();
	});
});
