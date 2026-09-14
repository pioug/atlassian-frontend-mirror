import React from 'react';

import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { Dialog } from '../../src/dialog/dialog-content';

const originalGetAnimations = Object.getOwnPropertyDescriptor(
	HTMLElement.prototype,
	'getAnimations',
);

function getAnimationsThatFinish(): Animation[] {
	const finished = new Promise<Animation>((resolve) => {
		setTimeout(() => resolve({} as Animation), 100);
	});
	return [{ finished } as Animation];
}

async function finishAnimations() {
	await act(async () => {
		jest.runAllTimers();
		await Promise.resolve();
	});
}

function flushNativeToggle() {
	act(() => {
		jest.runAllTimers();
	});
}

beforeAll(() => {
	Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
		configurable: true,
		value: getAnimationsThatFinish,
	});
});

afterAll(() => {
	if (originalGetAnimations) {
		Object.defineProperty(HTMLElement.prototype, 'getAnimations', originalGetAnimations);
		return;
	}
	Reflect.deleteProperty(HTMLElement.prototype, 'getAnimations');
});

// JSDOM does not implement the Web Animations API. The mock above returns an animation whose
// `finished` promise settles after a timer. Real animation completion is covered by Playwright.
//
// `Dialog` and `Popover` both delegate their entry/exit lifecycle to the shared
// `useAnimatedVisibility` hook, so these tests intentionally mirror
// `popover-animation-callbacks.test.tsx` to assert the two stay in sync.

/**
 * Minimal Dialog wrapper that exercises `onEnterFinish` and `onExitFinish` directly.
 * Pass `animated` to toggle between the animated and non-animated paths.
 */
function TestDialog({
	isOpen,
	onEnterFinish,
	onExitFinish,
	animated = false,
}: {
	isOpen: boolean;
	onEnterFinish?: () => void;
	onExitFinish?: () => void;
	animated?: boolean;
}) {
	return (
		<Dialog
			isOpen={isOpen}
			onClose={() => {}}
			onEnterFinish={onEnterFinish}
			onExitFinish={onExitFinish}
			label="test-dialog"
			testId="test-dialog"
			shouldAnimate={animated}
		>
			<div data-testid="content">content</div>
		</Dialog>
	);
}

it('should capture and report a11y violations', async () => {
	const { container } = render(<TestDialog isOpen={true} />);
	await expect(container).toBeAccessible();
});

describe('onEnterFinish - Dialog with shouldAnimate=false', () => {
	it('fires once after opening', () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(<TestDialog isOpen={false} onEnterFinish={onEnterFinish} />);

		expect(onEnterFinish).not.toHaveBeenCalled();

		rerender(<TestDialog isOpen={true} onEnterFinish={onEnterFinish} />);

		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('does not fire on initial mount when isOpen is false', () => {
		const onEnterFinish = jest.fn();
		render(<TestDialog isOpen={false} onEnterFinish={onEnterFinish} />);

		expect(onEnterFinish).not.toHaveBeenCalled();
	});

	it('fires on initial mount when isOpen is true', () => {
		const onEnterFinish = jest.fn();
		render(<TestDialog isOpen={true} onEnterFinish={onEnterFinish} />);

		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('does not fire again when re-rendered with isOpen still true', () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(<TestDialog isOpen={false} onEnterFinish={onEnterFinish} />);

		rerender(<TestDialog isOpen={true} onEnterFinish={onEnterFinish} />);
		expect(onEnterFinish).toHaveBeenCalledTimes(1);

		rerender(<TestDialog isOpen={true} onEnterFinish={onEnterFinish} />);
		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('fires again on a second open after close', () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(<TestDialog isOpen={false} onEnterFinish={onEnterFinish} />);

		rerender(<TestDialog isOpen={true} onEnterFinish={onEnterFinish} />);
		expect(onEnterFinish).toHaveBeenCalledTimes(1);

		rerender(<TestDialog isOpen={false} onEnterFinish={onEnterFinish} />);
		rerender(<TestDialog isOpen={true} onEnterFinish={onEnterFinish} />);
		expect(onEnterFinish).toHaveBeenCalledTimes(2);
	});
});

describe('onEnterFinish - Dialog with shouldAnimate=true', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('does not fire immediately on open', () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(
			<TestDialog isOpen={false} onEnterFinish={onEnterFinish} animated />,
		);

		rerender(<TestDialog isOpen={true} onEnterFinish={onEnterFinish} animated />);

		expect(onEnterFinish).not.toHaveBeenCalled();
	});

	it('fires after the animations settle', async () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(
			<TestDialog isOpen={false} onEnterFinish={onEnterFinish} animated />,
		);

		rerender(<TestDialog isOpen={true} onEnterFinish={onEnterFinish} animated />);

		await finishAnimations();

		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('fires on initial mount when isOpen is true', async () => {
		const onEnterFinish = jest.fn();
		render(<TestDialog isOpen={true} onEnterFinish={onEnterFinish} animated />);

		await finishAnimations();

		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('does not fire when the dialog is closed before the entry animation completes', async () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(
			<TestDialog isOpen={false} onEnterFinish={onEnterFinish} animated />,
		);

		rerender(<TestDialog isOpen={true} onEnterFinish={onEnterFinish} animated />);

		// Close before the entry animation finishes, cancelling the pending listener.
		rerender(<TestDialog isOpen={false} onEnterFinish={onEnterFinish} animated />);

		await finishAnimations();

		expect(onEnterFinish).not.toHaveBeenCalled();
	});
});

describe('onEnterFinish - StrictMode double-fire guard (Dialog with shouldAnimate=false)', () => {
	it('does not double-fire during open', () => {
		const onEnterFinish = jest.fn();

		const { rerender } = render(
			<React.StrictMode>
				<TestDialog isOpen={false} onEnterFinish={onEnterFinish} />
			</React.StrictMode>,
		);

		rerender(
			<React.StrictMode>
				<TestDialog isOpen={true} onEnterFinish={onEnterFinish} />
			</React.StrictMode>,
		);

		// StrictMode double-fires effects in development, but the prev-value ref
		// pattern ensures onEnterFinish is called exactly once.
		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});
});

describe('onExitFinish - Dialog with shouldAnimate=false', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('fires once after closing', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestDialog isOpen={true} onExitFinish={onExitFinish} />);

		expect(onExitFinish).not.toHaveBeenCalled();

		rerender(<TestDialog isOpen={false} onExitFinish={onExitFinish} />);

		expect(onExitFinish).not.toHaveBeenCalled();

		flushNativeToggle();

		expect(onExitFinish).toHaveBeenCalledTimes(1);
	});

	it('does not fire on initial mount when isOpen is true', () => {
		const onExitFinish = jest.fn();
		render(<TestDialog isOpen={true} onExitFinish={onExitFinish} />);
		flushNativeToggle();

		expect(onExitFinish).not.toHaveBeenCalled();
	});

	it('does not fire on initial mount when isOpen is false', () => {
		// The prev-value ref starts equal to isOpen, so no true->false edge is detected.
		const onExitFinish = jest.fn();
		render(<TestDialog isOpen={false} onExitFinish={onExitFinish} />);

		expect(onExitFinish).not.toHaveBeenCalled();
	});

	it('does not fire again when re-rendered with isOpen still false', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestDialog isOpen={true} onExitFinish={onExitFinish} />);

		rerender(<TestDialog isOpen={false} onExitFinish={onExitFinish} />);
		flushNativeToggle();
		expect(onExitFinish).toHaveBeenCalledTimes(1);

		rerender(<TestDialog isOpen={false} onExitFinish={onExitFinish} />);
		flushNativeToggle();
		expect(onExitFinish).toHaveBeenCalledTimes(1);
	});

	it('fires again on a second close after open', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestDialog isOpen={true} onExitFinish={onExitFinish} />);

		rerender(<TestDialog isOpen={false} onExitFinish={onExitFinish} />);
		flushNativeToggle();
		expect(onExitFinish).toHaveBeenCalledTimes(1);

		rerender(<TestDialog isOpen={true} onExitFinish={onExitFinish} />);
		rerender(<TestDialog isOpen={false} onExitFinish={onExitFinish} />);
		flushNativeToggle();
		expect(onExitFinish).toHaveBeenCalledTimes(2);
	});
});

describe('onExitFinish - Dialog with shouldAnimate=true', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('does not fire immediately on close', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestDialog isOpen={true} onExitFinish={onExitFinish} animated />);

		rerender(<TestDialog isOpen={false} onExitFinish={onExitFinish} animated />);

		expect(onExitFinish).not.toHaveBeenCalled();
	});

	it('fires after the animations settle', async () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestDialog isOpen={true} onExitFinish={onExitFinish} animated />);

		rerender(<TestDialog isOpen={false} onExitFinish={onExitFinish} animated />);

		await finishAnimations();

		expect(onExitFinish).toHaveBeenCalledTimes(1);
	});

	it('does not fire when the dialog is reopened before the exit animation completes', async () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestDialog isOpen={true} onExitFinish={onExitFinish} animated />);

		rerender(<TestDialog isOpen={false} onExitFinish={onExitFinish} animated />);

		// Reopen before the exit animation finishes, cancelling the pending listener.
		rerender(<TestDialog isOpen={true} onExitFinish={onExitFinish} animated />);

		await finishAnimations();

		expect(onExitFinish).not.toHaveBeenCalled();
	});

	// Regression: consumers reading the dialog host element inside `onExitFinish`
	// must still see it attached to the DOM. The phase transition to `closed`
	// (which triggers the unmount) must happen after the callback is invoked,
	// not before. The drawer relies on this to forward `onCloseComplete` with a
	// still-attached content node.
	it('fires onExitFinish while the dialog host element is still in the DOM', async () => {
		let hostAttachedWhenCallbackFired: boolean | null = null;
		const onExitFinish = jest.fn(() => {
			const host = screen.queryByTestId('test-dialog');
			hostAttachedWhenCallbackFired = host !== null && document.body.contains(host);
		});

		const { rerender } = render(<TestDialog isOpen={true} onExitFinish={onExitFinish} animated />);

		rerender(<TestDialog isOpen={false} onExitFinish={onExitFinish} animated />);

		await finishAnimations();

		expect(onExitFinish).toHaveBeenCalledTimes(1);
		expect(hostAttachedWhenCallbackFired).toBe(true);
	});
});

describe('onExitFinish - StrictMode double-fire guard (Dialog with shouldAnimate=false)', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('does not double-fire during close', () => {
		const onExitFinish = jest.fn();

		const { rerender } = render(
			<React.StrictMode>
				<TestDialog isOpen={true} onExitFinish={onExitFinish} />
			</React.StrictMode>,
		);

		rerender(
			<React.StrictMode>
				<TestDialog isOpen={false} onExitFinish={onExitFinish} />
			</React.StrictMode>,
		);

		expect(onExitFinish).not.toHaveBeenCalled();

		flushNativeToggle();

		// StrictMode double-fires effects in development, but the prev-value ref
		// pattern ensures onExitFinish is called exactly once.
		expect(onExitFinish).toHaveBeenCalledTimes(1);
	});
});
