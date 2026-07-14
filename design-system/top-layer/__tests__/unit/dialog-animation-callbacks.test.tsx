import React from 'react';

import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { Dialog } from '../../src/entry-points/dialog';

// JSDOM does not implement CSS transitions, so `transitionend` never fires naturally.
// When `animate` is set, the code falls back to a `setTimeout(fn, durationMs + 50)`.
// Unit tests use fake timers to drive that fallback. Real `transitionend` behaviour
// is covered by the Playwright tests.
//
// `Dialog` and `Popover` both delegate their entry/exit lifecycle to the shared
// `useAnimatedVisibility` hook, so these tests intentionally mirror
// `popover-animation-callbacks.test.tsx` to assert the two stay in sync.

/**
 * Minimal Dialog wrapper that exercises `onEnterFinish` and `onExitFinish` directly.
 * Pass `animated` to toggle between the animated (fallback timer) and non-animated paths.
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
			animate={animated}
		>
			<div data-testid="content">content</div>
		</Dialog>
	);
}

it('should capture and report a11y violations', async () => {
	const { container } = render(<TestDialog isOpen={true} />);
	await expect(container).toBeAccessible();
});

describe('onEnterFinish - Dialog with animate=false', () => {
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

// These tests target the fallback timer path, which is only used when `animate` is set.
// The fallback timer is used in case the 'transitionend' event never fires (which is the case in JSDOM)
describe('onEnterFinish - Dialog with animate=true', () => {
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

	it('fires after the fallback timeout when transitionend never fires', () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(
			<TestDialog isOpen={false} onEnterFinish={onEnterFinish} animated />,
		);

		rerender(<TestDialog isOpen={true} onEnterFinish={onEnterFinish} animated />);

		act(() => {
			jest.runAllTimers();
		});

		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('fires on initial mount when isOpen is true', () => {
		const onEnterFinish = jest.fn();
		render(<TestDialog isOpen={true} onEnterFinish={onEnterFinish} animated />);

		act(() => {
			jest.runAllTimers();
		});

		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('does not fire when the dialog is closed before the entry animation completes', () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(
			<TestDialog isOpen={false} onEnterFinish={onEnterFinish} animated />,
		);

		rerender(<TestDialog isOpen={true} onEnterFinish={onEnterFinish} animated />);

		// Close before the fallback timeout fires - cancels the pending listener
		rerender(<TestDialog isOpen={false} onEnterFinish={onEnterFinish} animated />);

		act(() => {
			jest.runAllTimers();
		});

		expect(onEnterFinish).not.toHaveBeenCalled();
	});
});

describe('onEnterFinish - StrictMode double-fire guard (Dialog with animate=false)', () => {
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

describe('onExitFinish - Dialog with animate=false', () => {
	it('fires once after closing', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestDialog isOpen={true} onExitFinish={onExitFinish} />);

		expect(onExitFinish).not.toHaveBeenCalled();

		rerender(<TestDialog isOpen={false} onExitFinish={onExitFinish} />);

		expect(onExitFinish).toHaveBeenCalledTimes(1);
	});

	it('does not fire on initial mount when isOpen is true', () => {
		const onExitFinish = jest.fn();
		render(<TestDialog isOpen={true} onExitFinish={onExitFinish} />);

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
		expect(onExitFinish).toHaveBeenCalledTimes(1);

		rerender(<TestDialog isOpen={false} onExitFinish={onExitFinish} />);
		expect(onExitFinish).toHaveBeenCalledTimes(1);
	});

	it('fires again on a second close after open', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestDialog isOpen={true} onExitFinish={onExitFinish} />);

		rerender(<TestDialog isOpen={false} onExitFinish={onExitFinish} />);
		expect(onExitFinish).toHaveBeenCalledTimes(1);

		rerender(<TestDialog isOpen={true} onExitFinish={onExitFinish} />);
		rerender(<TestDialog isOpen={false} onExitFinish={onExitFinish} />);
		expect(onExitFinish).toHaveBeenCalledTimes(2);
	});
});

describe('onExitFinish - Dialog with animate=true', () => {
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

	it('fires after the fallback timeout when transitionend never fires', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestDialog isOpen={true} onExitFinish={onExitFinish} animated />);

		rerender(<TestDialog isOpen={false} onExitFinish={onExitFinish} animated />);

		act(() => {
			jest.runAllTimers();
		});

		expect(onExitFinish).toHaveBeenCalledTimes(1);
	});

	it('does not fire when the dialog is reopened before the exit animation completes', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestDialog isOpen={true} onExitFinish={onExitFinish} animated />);

		rerender(<TestDialog isOpen={false} onExitFinish={onExitFinish} animated />);

		// Reopen before the fallback timeout fires - cancels the pending listener
		rerender(<TestDialog isOpen={true} onExitFinish={onExitFinish} animated />);

		act(() => {
			jest.runAllTimers();
		});

		expect(onExitFinish).not.toHaveBeenCalled();
	});

	// Regression: consumers reading the dialog host element inside `onExitFinish`
	// must still see it attached to the DOM. The phase transition to `closed`
	// (which triggers the unmount) must happen after the callback is invoked,
	// not before. The drawer relies on this to forward `onCloseComplete` with a
	// still-attached content node.
	it('fires onExitFinish while the dialog host element is still in the DOM', () => {
		let hostAttachedWhenCallbackFired: boolean | null = null;
		const onExitFinish = jest.fn(() => {
			const host = screen.queryByTestId('test-dialog');
			hostAttachedWhenCallbackFired = host !== null && document.body.contains(host);
		});

		const { rerender } = render(<TestDialog isOpen={true} onExitFinish={onExitFinish} animated />);

		rerender(<TestDialog isOpen={false} onExitFinish={onExitFinish} animated />);

		act(() => {
			jest.runAllTimers();
		});

		expect(onExitFinish).toHaveBeenCalledTimes(1);
		expect(hostAttachedWhenCallbackFired).toBe(true);
	});
});

describe('onExitFinish - StrictMode double-fire guard (Dialog with animate=false)', () => {
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

		// StrictMode double-fires effects in development, but the prev-value ref
		// pattern ensures onExitFinish is called exactly once.
		expect(onExitFinish).toHaveBeenCalledTimes(1);
	});
});
