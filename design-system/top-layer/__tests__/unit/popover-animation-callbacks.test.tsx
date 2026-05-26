import React, { useState } from 'react';

import { act, render, screen } from '@atlassian/testing-library';

import { slideAndFade } from '../../src/entry-points/animations';
import { Popover } from '../../src/entry-points/popover';
import { Popup } from '../../src/entry-points/popup';

// JSDOM does not implement CSS transitions, so `transitionend` never fires naturally.
// When `animate` is set, the code falls back to a `setTimeout(fn, durationMs + 50)`.
// Unit tests use fake timers to drive that fallback. Real `transitionend` behaviour
// is covered by the Playwright tests in animation-lifecycle.spec.tsx.

const animation = slideAndFade();

/**
 * Minimal Popover wrapper that exercises `onEnterFinish` and `onExitFinish` directly.
 * Pass `animated` to toggle between the animated (fallback timer) and non-animated paths.
 */
function TestPopover({
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
		<Popover
			isOpen={isOpen}
			onEnterFinish={onEnterFinish}
			onExitFinish={onExitFinish}
			role="dialog"
			label="test-popover"
			animate={animated ? animation : undefined}
		>
			<div data-testid="content">content</div>
		</Popover>
	);
}

/**
 * Minimal Popup compound fixture that exercises `onEnterFinish` and `onExitFinish`
 * on `Popup.Content` and exposes the trigger's `aria-expanded` for assertions.
 */
function TestPopupCompound({
	isDefaultOpen,
	onEnterFinish,
	onExitFinish,
	animated = false,
}: {
	isDefaultOpen: boolean;
	onEnterFinish?: () => void;
	onExitFinish?: () => void;
	animated?: boolean;
}) {
	const [isOpen, setIsOpen] = useState(isDefaultOpen);
	return (
		<Popup
			placement={{ axis: 'block', edge: 'end', align: 'center' }}
			onClose={() => setIsOpen(false)}
		>
			<Popup.Trigger>
				<button type="button" data-testid="trigger" onClick={() => setIsOpen((prev) => !prev)}>
					Toggle
				</button>
			</Popup.Trigger>
			<Popup.Content
				isOpen={isOpen}
				onEnterFinish={onEnterFinish}
				onExitFinish={onExitFinish}
				animate={animated ? animation : undefined}
				role="dialog"
				label="popup-content"
			>
				<div data-testid="popup-body">body</div>
			</Popup.Content>
		</Popup>
	);
}

it('should capture and report a11y violations', async () => {
	const { container } = render(<TestPopupCompound isDefaultOpen={false} />);
	await expect(container).toBeAccessible();
});

describe('onEnterFinish — Popover with animate=false', () => {
	it('fires once after opening', () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={false} onEnterFinish={onEnterFinish} />);

		expect(onEnterFinish).not.toHaveBeenCalled();

		rerender(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} />);

		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('does not fire on initial mount when isOpen is false', () => {
		const onEnterFinish = jest.fn();
		render(<TestPopover isOpen={false} onEnterFinish={onEnterFinish} />);

		expect(onEnterFinish).not.toHaveBeenCalled();
	});

	it('fires on initial mount when isOpen is true', () => {
		const onEnterFinish = jest.fn();
		render(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} />);

		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('does not fire again when re-rendered with isOpen still true', () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={false} onEnterFinish={onEnterFinish} />);

		rerender(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} />);
		expect(onEnterFinish).toHaveBeenCalledTimes(1);

		rerender(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} />);
		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('fires again on a second open after close', () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={false} onEnterFinish={onEnterFinish} />);

		rerender(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} />);
		expect(onEnterFinish).toHaveBeenCalledTimes(1);

		rerender(<TestPopover isOpen={false} onEnterFinish={onEnterFinish} />);
		rerender(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} />);
		expect(onEnterFinish).toHaveBeenCalledTimes(2);
	});
});

// These tests are targeting the fallback timer path, which is only used when `animate` is set.
// The fallback timer is used in case the 'transitionend' event never fires (which is the case in JSDOM)
describe('onEnterFinish — Popover with animate=true', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('does not fire immediately on open', () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(
			<TestPopover isOpen={false} onEnterFinish={onEnterFinish} animated />,
		);

		rerender(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} animated />);

		expect(onEnterFinish).not.toHaveBeenCalled();
	});

	it('fires after the fallback timeout when transitionend never fires', () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(
			<TestPopover isOpen={false} onEnterFinish={onEnterFinish} animated />,
		);

		rerender(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} animated />);

		act(() => {
			jest.runAllTimers();
		});

		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('fires on initial mount when isOpen is true', () => {
		const onEnterFinish = jest.fn();
		render(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} animated />);

		act(() => {
			jest.runAllTimers();
		});

		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('does not fire when popup is closed before the entry animation completes', () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(
			<TestPopover isOpen={false} onEnterFinish={onEnterFinish} animated />,
		);

		rerender(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} animated />);

		// Close before the fallback timeout fires — cancels the pending listener
		rerender(<TestPopover isOpen={false} onEnterFinish={onEnterFinish} animated />);

		act(() => {
			jest.runAllTimers();
		});

		expect(onEnterFinish).not.toHaveBeenCalled();
	});
});

describe('onEnterFinish — StrictMode double-fire guard (Popover with animate=false)', () => {
	it('does not double-fire during open', () => {
		const onEnterFinish = jest.fn();

		const { rerender } = render(
			<React.StrictMode>
				<TestPopover isOpen={false} onEnterFinish={onEnterFinish} />
			</React.StrictMode>,
		);

		rerender(
			<React.StrictMode>
				<TestPopover isOpen={true} onEnterFinish={onEnterFinish} />
			</React.StrictMode>,
		);

		// StrictMode double-fires effects in development, but the prev-value ref
		// pattern ensures onEnterFinish is called exactly once.
		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});
});

describe('onEnterFinish — Popup compound integration', () => {
	it('fires when popup opens (animate=false)', () => {
		const onEnterFinish = jest.fn();
		render(<TestPopupCompound isDefaultOpen={false} onEnterFinish={onEnterFinish} />);

		expect(onEnterFinish).not.toHaveBeenCalled();

		act(() => {
			screen.getByTestId('trigger').click();
		});

		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('fires via fallback timeout when animate=true', () => {
		jest.useFakeTimers();
		try {
			const onEnterFinish = jest.fn();
			render(<TestPopupCompound isDefaultOpen={false} onEnterFinish={onEnterFinish} animated />);

			act(() => {
				screen.getByTestId('trigger').click();
			});

			expect(onEnterFinish).not.toHaveBeenCalled();

			act(() => {
				jest.runAllTimers();
			});

			expect(onEnterFinish).toHaveBeenCalledTimes(1);
		} finally {
			jest.useRealTimers();
		}
	});

	it('fires on initial mount when open by default (animate=false)', () => {
		const onEnterFinish = jest.fn();
		render(<TestPopupCompound isDefaultOpen={true} onEnterFinish={onEnterFinish} />);

		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('fires on initial mount when open by default (animate=true)', () => {
		jest.useFakeTimers();
		try {
			const onEnterFinish = jest.fn();
			render(<TestPopupCompound isDefaultOpen={true} onEnterFinish={onEnterFinish} animated />);

			expect(onEnterFinish).not.toHaveBeenCalled();

			act(() => {
				jest.runAllTimers();
			});

			expect(onEnterFinish).toHaveBeenCalledTimes(1);
		} finally {
			jest.useRealTimers();
		}
	});
});

describe('onExitFinish — Popover with animate=false', () => {
	it('fires once after closing', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={true} onExitFinish={onExitFinish} />);

		expect(onExitFinish).not.toHaveBeenCalled();

		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} />);

		expect(onExitFinish).toHaveBeenCalledTimes(1);
	});

	it('does not fire on initial mount when isOpen is true', () => {
		const onExitFinish = jest.fn();
		render(<TestPopover isOpen={true} onExitFinish={onExitFinish} />);

		expect(onExitFinish).not.toHaveBeenCalled();
	});

	it('does not fire on initial mount when isOpen is false', () => {
		// The prev-value ref starts equal to isOpen, so no true→false edge is detected.
		const onExitFinish = jest.fn();
		render(<TestPopover isOpen={false} onExitFinish={onExitFinish} />);

		expect(onExitFinish).not.toHaveBeenCalled();
	});

	it('does not fire again when re-rendered with isOpen still false', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={true} onExitFinish={onExitFinish} />);

		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} />);
		expect(onExitFinish).toHaveBeenCalledTimes(1);

		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} />);
		expect(onExitFinish).toHaveBeenCalledTimes(1);
	});

	it('fires again on a second close after open', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={true} onExitFinish={onExitFinish} />);

		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} />);
		expect(onExitFinish).toHaveBeenCalledTimes(1);

		rerender(<TestPopover isOpen={true} onExitFinish={onExitFinish} />);
		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} />);
		expect(onExitFinish).toHaveBeenCalledTimes(2);
	});
});

describe('onExitFinish — Popover with animate=true', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('does not fire immediately on close', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={true} onExitFinish={onExitFinish} animated />);

		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} animated />);

		expect(onExitFinish).not.toHaveBeenCalled();
	});

	it('fires after the fallback timeout when transitionend never fires', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={true} onExitFinish={onExitFinish} animated />);

		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} animated />);

		act(() => {
			jest.runAllTimers();
		});

		expect(onExitFinish).toHaveBeenCalledTimes(1);
	});

	it('does not fire when popup is reopened before the exit animation completes', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={true} onExitFinish={onExitFinish} animated />);

		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} animated />);

		// Reopen before the fallback timeout fires — cancels the pending listener
		rerender(<TestPopover isOpen={true} onExitFinish={onExitFinish} animated />);

		act(() => {
			jest.runAllTimers();
		});

		expect(onExitFinish).not.toHaveBeenCalled();
	});
});

describe('onExitFinish — StrictMode double-fire guard (Popover with animate=false)', () => {
	it('does not double-fire during close', () => {
		const onExitFinish = jest.fn();

		const { rerender } = render(
			<React.StrictMode>
				<TestPopover isOpen={true} onExitFinish={onExitFinish} />
			</React.StrictMode>,
		);

		rerender(
			<React.StrictMode>
				<TestPopover isOpen={false} onExitFinish={onExitFinish} />
			</React.StrictMode>,
		);

		// StrictMode double-fires effects in development, but the prev-value ref
		// pattern ensures onExitFinish is called exactly once.
		expect(onExitFinish).toHaveBeenCalledTimes(1);
	});
});

describe('onExitFinish — Popup compound integration', () => {
	it('fires when popup closes (animate=false)', () => {
		const onExitFinish = jest.fn();
		render(<TestPopupCompound isDefaultOpen={true} onExitFinish={onExitFinish} />);

		expect(onExitFinish).not.toHaveBeenCalled();

		act(() => {
			screen.getByTestId('trigger').click();
		});

		expect(onExitFinish).toHaveBeenCalledTimes(1);
	});

	it('fires via fallback timeout when animate=true', () => {
		jest.useFakeTimers();
		try {
			const onExitFinish = jest.fn();
			render(<TestPopupCompound isDefaultOpen={true} onExitFinish={onExitFinish} animated />);

			act(() => {
				screen.getByTestId('trigger').click();
			});

			expect(onExitFinish).not.toHaveBeenCalled();

			act(() => {
				jest.runAllTimers();
			});

			expect(onExitFinish).toHaveBeenCalledTimes(1);
		} finally {
			jest.useRealTimers();
		}
	});

	it('does not fire on initial mount when isOpen is false (animate=false)', () => {
		const onExitFinish = jest.fn();
		render(<TestPopupCompound isDefaultOpen={false} onExitFinish={onExitFinish} />);

		expect(onExitFinish).not.toHaveBeenCalled();
	});

	it('does not fire on initial mount when isOpen is false (animate=true)', () => {
		const onExitFinish = jest.fn();
		render(<TestPopupCompound isDefaultOpen={false} onExitFinish={onExitFinish} animated />);

		expect(onExitFinish).not.toHaveBeenCalled();
	});
});
