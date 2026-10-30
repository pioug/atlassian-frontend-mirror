import React, { useState } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { Drawer } from '../../drawer';

function Content({ id }: { id: string }) {
	return (
		<div data-testid={`${id}-content`}>
			<button data-testid={`${id}-button`} type="button">
				Action
			</button>
		</div>
	);
}

function ClosingDrawer({
	id = 'drawer',
	onClose,
	onCloseComplete,
	children,
}: {
	id?: string;
	onClose: jest.Mock;
	onCloseComplete?: jest.Mock;
	children?: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<Drawer
			testId={id}
			label={id}
			isOpen={isOpen}
			onClose={() => {
				onClose();
				setIsOpen(false);
			}}
			onCloseComplete={onCloseComplete}
		>
			<Content id={id} />
			{children}
		</Drawer>
	);
}

function TriggeredDrawer({
	id,
	onClose,
	children,
}: {
	id: string;
	onClose: jest.Mock;
	children?: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<button data-testid={`${id}-trigger`} type="button" onClick={() => setIsOpen(true)}>
				Open {id}
			</button>
			<Drawer
				testId={id}
				label={id}
				isOpen={isOpen}
				onClose={() => {
					onClose();
					setIsOpen(false);
				}}
			>
				<Content id={id} />
				{children}
			</Drawer>
		</>
	);
}

function IgnoringDrawer({ onClose }: { onClose: jest.Mock }) {
	return (
		<Drawer testId="drawer" label="drawer" isOpen onClose={() => onClose()}>
			<Content id="drawer" />
		</Drawer>
	);
}

// Runs the polyfill's task-queued `cancel`, Dialog toggles, and legacy timers, but not the exit.
function flushTasks() {
	act(() => {
		jest.advanceTimersByTime(1);
	});
}

/**
 * Where a user's Escape lands. A browser moves focus into a modal `<dialog>` when it opens, so an
 * Escape with focus on `<body>` goes to the top open `<dialog>`. jsdom does not move focus.
 */
function getEscapeTarget(): Element {
	// eslint-disable-next-line testing-library/no-node-access -- where focus is, as a browser sees it
	const focused = document.activeElement;
	if (focused && focused !== document.body) {
		return focused;
	}
	// eslint-disable-next-line testing-library/no-node-access -- the top open `<dialog>`, in document order
	const openDialogs = Array.from(document.querySelectorAll('dialog[open]'));
	return openDialogs[openDialogs.length - 1] ?? document.body;
}

function pressEscape(target: Element = getEscapeTarget()) {
	fireEvent.keyDown(target, { key: 'Escape' });
	flushTasks();
	fireEvent.keyUp(target, { key: 'Escape' });
	flushTasks();
}

// A held key repeats `keydown`, then sends one `keyup`.
function holdEscape(target: Element) {
	fireEvent.keyDown(target, { key: 'Escape' });
	fireEvent.keyDown(target, { key: 'Escape', repeat: true });
	fireEvent.keyDown(target, { key: 'Escape', repeat: true });
	flushTasks();
	fireEvent.keyUp(target, { key: 'Escape' });
	flushTasks();
}

function clickElement(element: Element) {
	fireEvent.pointerDown(element);
	fireEvent.mouseDown(element);
	fireEvent.pointerUp(element);
	fireEvent.mouseUp(element);
	fireEvent.click(element);
	flushTasks();
}

// Browsers fire `click` on the nearest common ancestor of the press and the release.
function dragElement({ from, to, ancestor }: { from: Element; to: Element; ancestor: Element }) {
	fireEvent.pointerDown(from);
	fireEvent.mouseDown(from);
	fireEvent.pointerUp(to);
	fireEvent.mouseUp(to);
	fireEvent.click(ancestor);
	flushTasks();
}

describe.each([false, true])('Drawer onClose parity (platform-dst-top-layer=%s)', (isTopLayer) => {
	const originalMatchMedia = window.matchMedia;
	const originalGetAnimations = Object.getOwnPropertyDescriptor(
		HTMLElement.prototype,
		'getAnimations',
	);
	// Holds the top-layer exit open until a test settles it. Fake timers hold the legacy exit.
	let finishAnimation: () => void;

	beforeEach(() => {
		jest.useFakeTimers();
		if (isTopLayer) {
			passGate('platform-dst-top-layer');
		} else {
			failGate('platform-dst-top-layer');
		}
		window.matchMedia = () => ({ matches: false }) as MediaQueryList;
		const finished = new Promise<Animation>((resolve) => {
			finishAnimation = () => resolve({} as Animation);
		});
		const pendingAnimation = { finished } as Animation;
		Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
			configurable: true,
			value: () => [pendingAnimation],
		});
	});

	afterEach(() => {
		jest.useRealTimers();
		window.matchMedia = originalMatchMedia;
		if (originalGetAnimations) {
			Object.defineProperty(HTMLElement.prototype, 'getAnimations', originalGetAnimations);
		} else {
			Reflect.deleteProperty(HTMLElement.prototype, 'getAnimations');
		}
	});

	function getBackdrop(id = 'drawer') {
		return screen.getByTestId(isTopLayer ? id : `${id}--blanket`);
	}

	function renderDrawer(element: React.ReactElement) {
		render(element);
		flushTasks();
	}

	function dismiss(action: string, id = 'drawer') {
		if (action === 'Escape') {
			pressEscape();
		} else {
			clickElement(getBackdrop(id));
		}
	}

	async function finishExit() {
		await act(async () => {
			finishAnimation();
			jest.runAllTimers();
		});
	}

	it.each(['Escape', 'backdrop click'])('should call onClose once for one %s', (action) => {
		const onClose = jest.fn();
		renderDrawer(<ClosingDrawer onClose={onClose} />);
		dismiss(action);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	// The second action runs during the exit: the consumer set `isOpen={false}`. Legacy calls
	// `onClose` again. The top-layer path does not: the drawer is already closing.
	it.each([
		{ first: 'Escape', second: 'Escape' },
		{ first: 'Escape', second: 'backdrop click' },
		{ first: 'backdrop click', second: 'backdrop click' },
		{ first: 'backdrop click', second: 'Escape' },
	])(
		'should call onClose for $first then not again for $second during the exit (top-layer only)',
		async ({ first, second }) => {
			const onClose = jest.fn();
			const onCloseComplete = jest.fn();
			renderDrawer(<ClosingDrawer onClose={onClose} onCloseComplete={onCloseComplete} />);
			dismiss(first);
			// Still mounted: the exit has not finished.
			expect(screen.getByTestId('drawer-button')).toBeInTheDocument();
			dismiss(second);
			expect(onClose).toHaveBeenCalledTimes(isTopLayer ? 1 : 2);
			expect(onCloseComplete).toHaveBeenCalledTimes(0);

			await finishExit();
			expect(onCloseComplete).toHaveBeenCalledTimes(1);
			expect(screen.queryByTestId('drawer-button')).not.toBeInTheDocument();
		},
	);

	it('should not call onClose for clicks inside the drawer content', () => {
		const onClose = jest.fn();
		renderDrawer(<ClosingDrawer onClose={onClose} />);
		clickElement(screen.getByTestId('drawer-button'));
		clickElement(screen.getByTestId('drawer-content'));
		expect(onClose).toHaveBeenCalledTimes(0);
	});

	it('should not call onClose for a drag from the content to the backdrop', () => {
		const onClose = jest.fn();
		renderDrawer(<ClosingDrawer onClose={onClose} />);
		fireEvent.pointerDown(screen.getByTestId('drawer-button'));
		fireEvent.mouseDown(screen.getByTestId('drawer-button'));
		fireEvent.mouseUp(getBackdrop());
		// On the top-layer path, browsers fire `click` on the nearest common ancestor: the backdrop element.
		fireEvent.click(getBackdrop());
		flushTasks();
		expect(onClose).toHaveBeenCalledTimes(0);
	});

	// Legacy Blanket is a sibling of the panel, so the `click` does not land on it.
	it('should not call onClose for a drag from the backdrop into the content', () => {
		const onClose = jest.fn();
		renderDrawer(<ClosingDrawer onClose={onClose} />);
		dragElement({
			from: getBackdrop(),
			to: screen.getByTestId('drawer-button'),
			// Legacy: the Blanket is a sibling of the panel, so the `click` lands outside it.
			ancestor: isTopLayer ? getBackdrop() : document.body,
		});
		expect(onClose).toHaveBeenCalledTimes(0);
	});

	it('should not call onClose again for a drag from the backdrop into the content during the exit', () => {
		const onClose = jest.fn();
		renderDrawer(<ClosingDrawer onClose={onClose} />);
		dismiss('backdrop click');
		// Still mounted: the exit has not finished.
		expect(screen.getByTestId('drawer-button')).toBeInTheDocument();
		dragElement({
			from: getBackdrop(),
			to: screen.getByTestId('drawer-button'),
			// Legacy: the Blanket is a sibling of the panel, so the `click` lands outside it.
			ancestor: isTopLayer ? getBackdrop() : document.body,
		});
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it.each(['Escape', 'backdrop click'])(
		'should call onClose for each %s and stay open when the consumer keeps the drawer open',
		(action) => {
			const onClose = jest.fn();
			renderDrawer(<IgnoringDrawer onClose={onClose} />);
			dismiss(action);
			dismiss(action);
			dismiss(action);
			expect(onClose).toHaveBeenCalledTimes(3);
			expect(screen.getByTestId('drawer-button')).toBeInTheDocument();
			if (isTopLayer) {
				expect((screen.getByTestId('drawer') as HTMLDialogElement).open).toBe(true);
			}
		},
	);

	it('should call onClose once for a held Escape when the consumer keeps the drawer open', () => {
		const onClose = jest.fn();
		renderDrawer(<IgnoringDrawer onClose={onClose} />);
		holdEscape(screen.getByTestId('drawer-button'));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it.each(['Escape', 'backdrop click'])(
		'should call onClose only for the top nested drawer for one %s',
		(action) => {
			const onCloseOuter = jest.fn();
			const onCloseInner = jest.fn();
			const { rerender } = render(<ClosingDrawer id="outer" onClose={onCloseOuter} />);
			flushTasks();
			// Open the inner drawer after the outer one, as a user would.
			rerender(
				<ClosingDrawer id="outer" onClose={onCloseOuter}>
					<ClosingDrawer id="inner" onClose={onCloseInner} />
				</ClosingDrawer>,
			);
			flushTasks();
			dismiss(action, 'inner');
			expect(onCloseInner).toHaveBeenCalledTimes(1);
			expect(onCloseOuter).toHaveBeenCalledTimes(0);
		},
	);

	it('should call onClose again for an Escape on the trigger during the exit only on the legacy path', () => {
		const onClose = jest.fn();
		renderDrawer(<TriggeredDrawer id="drawer" onClose={onClose} />);
		clickElement(screen.getByTestId('drawer-trigger'));
		pressEscape();
		// Still mounted: the exit has not finished.
		expect(screen.getByTestId('drawer-button')).toBeInTheDocument();
		pressEscape(screen.getByTestId('drawer-trigger'));
		expect(onClose).toHaveBeenCalledTimes(isTopLayer ? 1 : 2);
	});

	// Legacy: the exiting nested drawer takes the Escape again. Top-layer: the outer drawer asks.
	it('should send an Escape on the nested trigger during its exit to the nested drawer on legacy and the outer drawer on top-layer', () => {
		const onCloseOuter = jest.fn();
		const onCloseInner = jest.fn();
		renderDrawer(
			<TriggeredDrawer id="outer" onClose={onCloseOuter}>
				<TriggeredDrawer id="inner" onClose={onCloseInner} />
			</TriggeredDrawer>,
		);
		clickElement(screen.getByTestId('outer-trigger'));
		clickElement(screen.getByTestId('inner-trigger'));
		pressEscape();
		expect(screen.getByTestId('inner-button')).toBeInTheDocument();
		pressEscape(screen.getByTestId('inner-trigger'));
		expect(onCloseInner).toHaveBeenCalledTimes(isTopLayer ? 1 : 2);
		expect(onCloseOuter).toHaveBeenCalledTimes(isTopLayer ? 1 : 0);
	});
});
