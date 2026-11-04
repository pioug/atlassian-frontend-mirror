/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { skipA11yAudit } from '@af/accessibility-testing/skip-a11y-audit';
import __noop from '@atlaskit/ds-lib/noop';
import EmojiIcon from '@atlaskit/icon/core/emoji';
import { token } from '@atlaskit/tokens';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { Drawer } from '../../drawer';
import { DrawerCloseButton } from '../../drawer-panel/drawer-close-button';
import { DrawerContent } from '../../drawer-panel/drawer-content';
import { DrawerSidebar } from '../../drawer-panel/drawer-sidebar';
import { type DrawerProps } from '../../types';

declare var global: any;

const testId = 'test-drawer';

const findKeydownListenerCall = (listenerFn: any) =>
	listenerFn.mock.calls.find((e: any) => e[0] === 'keydown');

const createDrawer = (props: DrawerProps) => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	<Drawer width="wide" label="Default Drawer" testId={testId} {...props}>
		<DrawerSidebar>
			<DrawerCloseButton />
		</DrawerSidebar>
		<DrawerContent>Drawer contents</DrawerContent>
	</Drawer>
);

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('esc key', () => {
	beforeEach(() => {
		jest.spyOn(global.window, 'addEventListener');
		jest.spyOn(global.window, 'removeEventListener');
		skipA11yAudit();
	});

	afterEach(() => {
		global.window.addEventListener.mockRestore();
		global.window.removeEventListener.mockRestore();
	});

	it('should call onClose handler when pressing Escape', async () => {
		let isOpen = true;

		const onClose = jest.fn(() => {
			isOpen = false;
		});

		render(createDrawer({ isOpen: isOpen, onClose: onClose }));

		expect(screen.getByTestId('drawer-contents')).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		expect(onClose).toHaveBeenCalled();
	});
});

describe('Drawer Transitions', () => {
	beforeEach(() => {
		skipA11yAudit();
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

	it('should call onClose if user press ESC', async () => {
		const onClose = jest.fn();
		render(createDrawer({ isOpen: true, onClose: onClose }));
		await userEvent.keyboard('{Escape}');
		expect(onClose).toHaveBeenCalled();
	});

	it('should not call onClose if user press ESC while the drawer is closed', async () => {
		const onClose = jest.fn();
		render(createDrawer({ isOpen: false, onClose: onClose }));
		await userEvent.keyboard('{Escape}');
		expect(onClose).not.toHaveBeenCalled();
	});

	it('should call onClose when blanket is clicked', async () => {
		failGate('platform-dst-top-layer');
		const onClose = jest.fn();
		render(createDrawer({ isOpen: true, onClose: onClose }));
		expect(onClose).not.toHaveBeenCalled();
		// The top-layer drawer is a native <dialog> with no blanket. A press on the <dialog> itself
		// is a press on its backdrop.
		await userEvent.click(screen.queryByTestId(`${testId}--blanket`) ?? screen.getByTestId(testId));
		await waitFor(() => expect(onClose).toHaveBeenCalled());
	});

	// The top-layer drawer has no blanket. A press on the `::backdrop` targets the `<dialog>`.
	it('should call onClose when the backdrop is clicked (top layer)', async () => {
		passGate('platform-dst-top-layer');
		const onClose = jest.fn();
		render(createDrawer({ isOpen: true, onClose: onClose }));
		expect(onClose).not.toHaveBeenCalled();
		await userEvent.click(screen.getByRole('dialog', { name: 'Default Drawer' }));
		expect(onClose).toHaveBeenCalled();
	});

	it('should call onClose when the close button is clicked', () => {
		const onClose = jest.fn();
		render(createDrawer({ isOpen: true, onClose: onClose }));
		expect(onClose).not.toHaveBeenCalled();
		screen.getByTestId('DrawerCloseButton').click();
		expect(onClose).toHaveBeenCalled();
	});

	it('should call onClose when the close button with a custom icon is clicked', () => {
		const onClose = jest.fn();
		render(
			<Drawer width="wide" label="Default Drawer" onClose={onClose} isOpen>
				<DrawerSidebar>
					<DrawerCloseButton icon={EmojiIcon} />
				</DrawerSidebar>
				<DrawerContent>Drawer contents</DrawerContent>
			</Drawer>,
		);
		expect(onClose).not.toHaveBeenCalled();
		screen.getByTestId('DrawerCloseButton').click();
		expect(onClose).toHaveBeenCalled();
	});

	it('should call onCloseComplete when open state is changed to false', async () => {
		jest.useFakeTimers();
		const onCloseComplete = jest.fn();
		const { rerender } = render(createDrawer({ isOpen: true, onCloseComplete: onCloseComplete }));
		rerender(createDrawer({ isOpen: false, onCloseComplete: onCloseComplete }));
		await act(async () => {
			jest.runAllTimers();
			await Promise.resolve();
		});
		// The top-layer drawer settles its exit in a promise after the timers run.
		await waitFor(() => expect(onCloseComplete).toHaveBeenCalled());
		jest.useRealTimers();
	});

	it('should call onOpenComplete when open state is changed to true', async () => {
		jest.useFakeTimers();
		const onOpenComplete = jest.fn();
		render(createDrawer({ isOpen: true, onOpenComplete: onOpenComplete }));
		await act(async () => {
			jest.runAllTimers();
			await Promise.resolve();
		});
		// The top-layer drawer settles its entry in a promise after the timers run.
		await waitFor(() => expect(onOpenComplete).toHaveBeenCalled());
		jest.useRealTimers();
	});

	// Press a real key: on the top-layer path the first `keydown` listener on `window` is the
	// `Dialog` Escape listener, not the drawer's, so calling the first spied listener does not work.
	it('should call onKeyDown if user press ESC', async () => {
		const onKeyDown = jest.fn();
		render(createDrawer({ isOpen: true, onKeyDown: onKeyDown }));
		await userEvent.keyboard('{Escape}');
		expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'Escape' }));
	});

	it('should have role="dialog" and aria-modal="true" when opened', () => {
		failGate('platform-dst-top-layer');
		render(
			<Drawer isOpen width="wide" testId="drawer" label="Default drawer">
				<DrawerContent>
					<span>Content</span>
				</DrawerContent>
			</Drawer>,
		);
		const drawerContainer = screen.getByTestId('drawer');
		expect(drawerContainer).toHaveAttribute('role', 'dialog');
		expect(drawerContainer).toHaveAttribute('aria-modal', 'true');
	});

	// A native modal `<dialog>` has an implicit `dialog` role and is modal, so the top-layer drawer
	// sets neither attribute.
	it('should be a native modal dialog when opened (top layer)', () => {
		passGate('platform-dst-top-layer');
		render(
			<Drawer isOpen width="wide" testId="drawer" label="Default drawer">
				<DrawerContent>
					<span>Content</span>
				</DrawerContent>
			</Drawer>,
		);
		const dialog = screen.getByRole('dialog', { name: 'Default drawer' });
		expect(dialog).toBe(screen.getByTestId('drawer'));
		expect(dialog.tagName).toBe('DIALOG');
		expect(dialog).not.toHaveAttribute('role');
		expect(dialog).not.toHaveAttribute('aria-modal');
	});

	it('should autofocus the first focusable element when opened', () => {
		render(
			<Drawer isOpen width="wide" testId="drawer" label="Default drawer">
				<DrawerContent>
					<button type="button">First Button</button>
					<button type="button">Second Button</button>
				</DrawerContent>
			</Drawer>,
		);
		const firstButton = screen.getByRole('button', { name: 'First Button' });
		expect(firstButton).toHaveFocus();
	});

	it('should autofocus the focusable element with the autoFocus prop when opened', () => {
		failGate('platform-dst-top-layer');
		render(
			<Drawer isOpen width="wide" testId="drawer" label="Default drawer">
				<DrawerContent>
					<button type="button">First Button</button>
					<button type="button" autoFocus>
						Second Button
					</button>
				</DrawerContent>
			</Drawer>,
		);
		const secondButton = screen.getByRole('button', { name: 'Second Button' });
		expect(secondButton).toHaveFocus();
	});

	// React `autoFocus` calls `focus()` before `showModal()`, so the browser ignores it. React does
	// not set the HTML `autofocus` attribute, so the content sets it. `showModal()` then focuses it.
	// See `@atlaskit/top-layer` notes: `follow-ups/dialog-react-autofocus.md`.
	it('should focus the element with the autofocus attribute when opened (top layer)', () => {
		passGate('platform-dst-top-layer');
		render(
			<Drawer isOpen width="wide" testId="drawer" label="Default drawer">
				<DrawerContent>
					<button type="button">First Button</button>
					<button
						type="button"
						ref={(element) => {
							element?.setAttribute('autofocus', '');
						}}
					>
						Second Button
					</button>
				</DrawerContent>
			</Drawer>,
		);
		const secondButton = screen.getByRole('button', { name: 'Second Button' });
		expect(secondButton).toHaveFocus();
	});
});

const styles = cssMap({
	sidebar: {
		backgroundColor: token('color.background.discovery'),
	},
	content: {
		marginBlockStart: token('space.0'),
	},
});

describe('Drawer panel', () => {
	beforeEach(() => {
		skipA11yAudit();
	});
	it('should render with narrow width by default', () => {
		render(
			<Drawer testId={testId} isOpen>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>Drawer contents</DrawerContent>
			</Drawer>,
		);
		const drawerWrapper = screen.getByTestId(testId);
		expect(drawerWrapper).toHaveCompiledCss({
			width: '360px',
		});
	});

	it('should render with medium width', () => {
		render(
			<Drawer testId={testId} width="medium" isOpen>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>Drawer contents</DrawerContent>
			</Drawer>,
		);
		const drawerWrapper = screen.getByTestId(testId);
		expect(drawerWrapper).toHaveCompiledCss({
			width: '5in', // 480px
		});
	});

	it('should render with wide width', () => {
		render(
			<Drawer testId={testId} width="wide" isOpen>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>Drawer contents</DrawerContent>
			</Drawer>,
		);
		const drawerWrapper = screen.getByTestId(testId);
		expect(drawerWrapper).toHaveCompiledCss({
			width: '600px',
		});
	});

	it('should render with extended width', () => {
		render(
			<Drawer testId={testId} width="extended" isOpen>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>Drawer contents</DrawerContent>
			</Drawer>,
		);
		const drawerWrapper = screen.getByTestId(testId);
		expect(drawerWrapper).toHaveCompiledCss({
			width: '95vw',
		});
	});

	it('should render with full width', () => {
		render(
			<Drawer testId={testId} width="full" isOpen>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>Drawer contents</DrawerContent>
			</Drawer>,
		);
		const drawerWrapper = screen.getByTestId(testId);
		expect(drawerWrapper).toHaveCompiledCss({
			width: '100vw',
		});
	});

	it('should be able to be styled via xcss props', () => {
		render(
			<Drawer isOpen>
				<DrawerSidebar xcss={styles.sidebar}>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent xcss={styles.content}>Drawer contents</DrawerContent>
			</Drawer>,
		);

		const content = screen.getByTestId('drawer-contents');
		expect(content).toHaveCompiledCss({ marginBlockStart: 'var(--ds-space-0,0)' });

		const sidebar = screen.getByTestId('drawer-sidebar');
		expect(sidebar).toHaveCompiledCss({
			backgroundColor: 'var(--ds-background-discovery,#f8eefe)',
		});
	});
});

describe('Drawer sub components usage', () => {
	beforeEach(() => {
		skipA11yAudit();
	});
	it('should render when sub-components are not provided', () => {
		render(<Drawer isOpen>Drawer contents</Drawer>);
		expect(screen.getByText('Drawer contents')).toBeInTheDocument();
	});

	const errorMessage = `"Invariant failed: Drawer sub-components must be used within a Drawer component."`;

	it('should throw an error when DrawerContent is not a child of Drawer', () => {
		const consoleError = jest.spyOn(console, 'error').mockImplementation(__noop);
		expect(() => {
			render(<DrawerContent>Drawer contents</DrawerContent>);
		}).toThrowErrorMatchingInlineSnapshot(errorMessage);
		consoleError.mockRestore();
	});

	it('should throw an error when DrawerSidebar is not a child of Drawer', () => {
		const consoleError = jest.spyOn(console, 'error').mockImplementation(__noop);
		expect(() => {
			render(<DrawerSidebar>Drawer sidebar</DrawerSidebar>);
		}).toThrowErrorMatchingInlineSnapshot(errorMessage);
		consoleError.mockRestore();
	});

	it('should throw an error when DrawerCloseButton is not a child of Drawer', () => {
		const consoleError = jest.spyOn(console, 'error').mockImplementation(__noop);
		expect(() => {
			render(<DrawerCloseButton />);
		}).toThrowErrorMatchingInlineSnapshot(errorMessage);
		consoleError.mockRestore();
	});
});
