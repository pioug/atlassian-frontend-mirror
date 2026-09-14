/* eslint-disable @atlassian/a11y/require-jest-coverage -- This is a hook, it is headless */

import React, { useLayoutEffect, useRef } from 'react';

import { bindAll } from 'bind-event-listener';

import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { type TPhase, useAnimatedVisibility } from '../../src/internal/use-animated-visibility';

type TAnimatedVisibilityHarnessProps = {
	isOpen: boolean;
	shouldAnimate: boolean;
	onEnterFinish?: () => void;
	onToggleClosed?: (event: ToggleEvent) => void;
	onExitFinish?: () => void;
};

/**
 * Exercises the hook against the Popover API polyfill installed by the AFM
 * Jest environment. The polyfill mirrors browser timing: `beforetoggle` fires
 * synchronously from show/hide and `toggle` is queued as a task.
 */
function AnimatedVisibilityHarness({
	isOpen,
	shouldAnimate,
	onEnterFinish,
	onToggleClosed,
	onExitFinish,
}: TAnimatedVisibilityHarnessProps) {
	const elementRef = useRef<HTMLDivElement>(null);
	const { phase, isMounted, onBeforeToggle, onToggle } = useAnimatedVisibility({
		isOpen,
		shouldAnimate,
		elementRef,
		onEnterFinish,
		onExitFinish,
	});

	useLayoutEffect(() => {
		if (!isMounted) {
			return;
		}

		const element = elementRef.current;
		if (!element) {
			return;
		}

		return bindAll(element, [
			{ type: 'beforetoggle', listener: onBeforeToggle },
			{
				type: 'toggle',
				listener: (event: ToggleEvent) => {
					if (event.newState === 'closed') {
						onToggleClosed?.(event);
					}
					onToggle(event);
				},
			},
		]);
	}, [isMounted, onBeforeToggle, onToggle, onToggleClosed]);

	useLayoutEffect(() => {
		if (!isMounted) {
			return;
		}

		const element = elementRef.current;
		if (!element) {
			return;
		}

		if (isOpen) {
			element.showPopover();
			return;
		}

		element.hidePopover();
	}, [isMounted, isOpen]);

	return (
		<>
			<output data-testid="phase">{phase}</output>
			{phase !== 'closed' && (
				<div
					ref={elementRef}
					role="dialog"
					aria-label="Animated visibility host"
					// @ts-expect-error -- popover attribute not yet in React types
					// eslint-disable-next-line react/no-unknown-property -- popover attribute not yet in React types
					popover="manual"
					data-testid="host"
				>
					<div data-testid="child" />
				</div>
			)}
		</>
	);
}

function expectPhase(phase: TPhase) {
	expect(screen.getByTestId('phase')).toHaveTextContent(phase);
}

function flushNativeToggle() {
	act(() => {
		jest.runOnlyPendingTimers();
	});
}

type TMockAnimation = {
	animation: Animation;
	finish: () => void;
	cancel: () => void;
};

let animationSnapshots = new WeakMap<HTMLElement, TMockAnimation[]>();
let nextAnimationCount = 1;

function createMockAnimation(): TMockAnimation {
	let resolveFinished: ((animation: Animation) => void) | null = null;
	let rejectFinished: ((reason: unknown) => void) | null = null;
	const animation = {
		finished: new Promise<Animation>((resolve, reject) => {
			resolveFinished = resolve;
			rejectFinished = reject;
		}),
	} as Animation;

	return {
		animation,
		finish: () => resolveFinished?.(animation),
		cancel: () => rejectFinished?.(new DOMException('Cancelled', 'AbortError')),
	};
}

function getMockAnimations(this: HTMLElement): Animation[] {
	const animations = Array.from({ length: nextAnimationCount }, createMockAnimation);
	nextAnimationCount = 1;
	animationSnapshots.set(this, animations);
	return animations.map(({ animation }) => animation);
}

function getCurrentAnimations(element: HTMLElement): TMockAnimation[] {
	const animations = animationSnapshots.get(element);
	if (!animations) {
		throw new Error('Expected the element to have an animation snapshot');
	}
	return animations;
}

async function finishAnimations(animations: TMockAnimation[]) {
	await act(async () => {
		animations.forEach(({ finish }) => finish());
		await Promise.resolve();
	});
}

async function cancelAnimations(animations: TMockAnimation[]) {
	await act(async () => {
		animations.forEach(({ cancel }) => cancel());
		await Promise.resolve();
	});
}

describe('useAnimatedVisibility', () => {
	const originalGetAnimations = Object.getOwnPropertyDescriptor(
		HTMLElement.prototype,
		'getAnimations',
	);

	beforeAll(() => {
		Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
			configurable: true,
			value: getMockAnimations,
		});
	});

	beforeEach(() => {
		jest.useFakeTimers();
		animationSnapshots = new WeakMap();
		nextAnimationCount = 1;
	});

	afterEach(() => {
		act(() => {
			jest.runOnlyPendingTimers();
		});
		jest.useRealTimers();
	});

	afterAll(() => {
		if (originalGetAnimations) {
			Object.defineProperty(HTMLElement.prototype, 'getAnimations', originalGetAnimations);
			return;
		}
		Reflect.deleteProperty(HTMLElement.prototype, 'getAnimations');
	});

	describe('non-animated lifecycle', () => {
		it('does not mount the host when initially closed', () => {
			const onEnterFinish = jest.fn();
			const onExitFinish = jest.fn();

			render(
				<AnimatedVisibilityHarness
					isOpen={false}
					shouldAnimate={false}
					onEnterFinish={onEnterFinish}
					onExitFinish={onExitFinish}
				/>,
			);

			expectPhase('closed');
			expect(screen.queryByTestId('host')).not.toBeInTheDocument();
			expect(onEnterFinish).not.toHaveBeenCalled();
			expect(onExitFinish).not.toHaveBeenCalled();
		});

		it('mounts and natively shows the host', () => {
			const onEnterFinish = jest.fn();

			render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={false}
					onEnterFinish={onEnterFinish}
				/>,
			);

			const host = screen.getByTestId('host');
			expectPhase('open');
			expect(host).toBeVisible();
			expect(host).toHaveAttribute('data-popover-open');
			expect(onEnterFinish).toHaveBeenCalledTimes(1);
		});

		it('opens from the closed phase', () => {
			const onEnterFinish = jest.fn();
			const { rerender } = render(
				<AnimatedVisibilityHarness
					isOpen={false}
					shouldAnimate={false}
					onEnterFinish={onEnterFinish}
				/>,
			);

			rerender(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={false}
					onEnterFinish={onEnterFinish}
				/>,
			);

			expectPhase('open');
			expect(screen.getByTestId('host')).toBeVisible();
			expect(onEnterFinish).toHaveBeenCalledTimes(1);
		});

		it('adds inert in a microtask when closing', () => {
			const { rerender } = render(
				<AnimatedVisibilityHarness isOpen={true} shouldAnimate={false} />,
			);
			flushNativeToggle();
			const host = screen.getByTestId('host');

			rerender(<AnimatedVisibilityHarness isOpen={false} shouldAnimate={false} />);

			expect(host).not.toHaveAttribute('inert');
			expect(host).not.toHaveAttribute('aria-hidden');
			act(() => jest.runAllTicks());
			expect(host).toHaveAttribute('inert');
			expect(host).toHaveAttribute('aria-hidden', 'true');
			expect(
				screen.queryByRole('dialog', { name: 'Animated visibility host' }),
			).not.toBeInTheDocument();
			expect(screen.getByRole('dialog', { hidden: true })).toBe(host);
		});

		it('removes inert immediately when opening', () => {
			const { rerender } = render(
				<AnimatedVisibilityHarness isOpen={true} shouldAnimate={false} />,
			);
			flushNativeToggle();
			const host = screen.getByTestId('host');
			rerender(<AnimatedVisibilityHarness isOpen={false} shouldAnimate={false} />);
			act(() => jest.runAllTicks());
			expect(host).toHaveAttribute('inert');
			expect(host).toHaveAttribute('aria-hidden', 'true');

			rerender(<AnimatedVisibilityHarness isOpen={true} shouldAnimate={false} />);

			expect(host).not.toHaveAttribute('inert');
			expect(host).not.toHaveAttribute('aria-hidden');
			expect(screen.getByRole('dialog', { name: 'Animated visibility host' })).toBe(host);
		});

		it('does not apply stale closing attributes when reopened before the close microtask', () => {
			const { rerender } = render(
				<AnimatedVisibilityHarness isOpen={true} shouldAnimate={false} />,
			);
			flushNativeToggle();
			const host = screen.getByTestId('host');

			rerender(<AnimatedVisibilityHarness isOpen={false} shouldAnimate={false} />);
			rerender(<AnimatedVisibilityHarness isOpen={true} shouldAnimate={false} />);
			act(() => jest.runAllTicks());

			expect(host).not.toHaveAttribute('inert');
			expect(host).not.toHaveAttribute('aria-hidden');
			expect(screen.getByRole('dialog', { name: 'Animated visibility host' })).toBe(host);
		});

		it('applies closing attributes when the popover-open selector is unavailable', () => {
			const { rerender } = render(
				<AnimatedVisibilityHarness isOpen={true} shouldAnimate={false} />,
			);
			flushNativeToggle();
			const host = screen.getByTestId('host');
			jest.spyOn(host, 'matches').mockImplementation(() => {
				throw new DOMException('Unsupported selector', 'SyntaxError');
			});

			rerender(<AnimatedVisibilityHarness isOpen={false} shouldAnimate={false} />);
			act(() => jest.runAllTicks());

			expect(host).toHaveAttribute('inert');
			expect(host).toHaveAttribute('aria-hidden', 'true');
		});

		it('runs onToggleClosed before settling and unmounting the exit', () => {
			const calls: string[] = [];
			const onToggleClosed = jest.fn(() => {
				calls.push('toggle-closed');
				expectPhase('exiting');
				expect(screen.getByTestId('host')).toBeInTheDocument();
			});
			const onExitFinish = jest.fn(() => calls.push('exit-finish'));
			const { rerender } = render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={false}
					onToggleClosed={onToggleClosed}
					onExitFinish={onExitFinish}
				/>,
			);
			flushNativeToggle();
			const host = screen.getByTestId('host');

			rerender(
				<AnimatedVisibilityHarness
					isOpen={false}
					shouldAnimate={false}
					onToggleClosed={onToggleClosed}
					onExitFinish={onExitFinish}
				/>,
			);

			expectPhase('exiting');
			expect(host).toBeInTheDocument();
			expect(host).not.toBeVisible();
			expect(onExitFinish).not.toHaveBeenCalled();

			flushNativeToggle();
			expectPhase('closed');
			expect(screen.queryByTestId('host')).not.toBeInTheDocument();
			expect(onToggleClosed).toHaveBeenCalledTimes(1);
			expect(onExitFinish).toHaveBeenCalledTimes(1);
			expect(calls).toEqual(['toggle-closed', 'exit-finish']);
		});

		it('stays open when reopened before the native closed toggle', () => {
			const onEnterFinish = jest.fn();
			const onExitFinish = jest.fn();
			const { rerender } = render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={false}
					onEnterFinish={onEnterFinish}
					onExitFinish={onExitFinish}
				/>,
			);
			flushNativeToggle();
			onEnterFinish.mockClear();

			rerender(
				<AnimatedVisibilityHarness
					isOpen={false}
					shouldAnimate={false}
					onEnterFinish={onEnterFinish}
					onExitFinish={onExitFinish}
				/>,
			);
			rerender(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={false}
					onEnterFinish={onEnterFinish}
					onExitFinish={onExitFinish}
				/>,
			);
			flushNativeToggle();

			expectPhase('open');
			expect(screen.getByTestId('host')).toBeVisible();
			expect(onEnterFinish).toHaveBeenCalledTimes(1);
			expect(onExitFinish).not.toHaveBeenCalled();
		});
	});

	describe('animated lifecycle', () => {
		it('enters from the closed phase', async () => {
			const onEnterFinish = jest.fn();
			const { rerender } = render(
				<AnimatedVisibilityHarness
					isOpen={false}
					shouldAnimate={true}
					onEnterFinish={onEnterFinish}
				/>,
			);

			rerender(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onEnterFinish={onEnterFinish}
				/>,
			);

			const host = screen.getByTestId('host');
			expectPhase('entering');
			expect(host).toBeVisible();
			expect(onEnterFinish).not.toHaveBeenCalled();

			await finishAnimations(getCurrentAnimations(host));
			expectPhase('open');
			expect(onEnterFinish).toHaveBeenCalledTimes(1);
		});

		it('keeps entry mounted until every host animation settles', async () => {
			nextAnimationCount = 2;
			const onEnterFinish = jest.fn();

			render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onEnterFinish={onEnterFinish}
				/>,
			);

			const host = screen.getByTestId('host');
			const animations = getCurrentAnimations(host);
			expectPhase('entering');
			expect(host).toBeVisible();
			expect(animationSnapshots.has(screen.getByTestId('child'))).toBe(false);

			await finishAnimations(animations.slice(0, 1));
			expectPhase('entering');
			expect(onEnterFinish).not.toHaveBeenCalled();

			await finishAnimations(animations.slice(1));
			expectPhase('open');
			expect(onEnterFinish).toHaveBeenCalledTimes(1);
		});

		it('settles entry when the host animation is cancelled', async () => {
			const onEnterFinish = jest.fn();
			render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onEnterFinish={onEnterFinish}
				/>,
			);

			await cancelAnimations(getCurrentAnimations(screen.getByTestId('host')));

			expectPhase('open');
			expect(onEnterFinish).toHaveBeenCalledTimes(1);
		});

		it('settles animated entry when the host has no animations', async () => {
			nextAnimationCount = 0;
			const onEnterFinish = jest.fn();
			render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onEnterFinish={onEnterFinish}
				/>,
			);

			await act(async () => {
				await Promise.resolve();
			});

			expectPhase('open');
			expect(onEnterFinish).toHaveBeenCalledTimes(1);
		});

		it('waits for exit animations after the native closed toggle', async () => {
			const onExitFinish = jest.fn();
			const { rerender } = render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onExitFinish={onExitFinish}
				/>,
			);
			const host = screen.getByTestId('host');
			await finishAnimations(getCurrentAnimations(host));
			flushNativeToggle();

			rerender(
				<AnimatedVisibilityHarness
					isOpen={false}
					shouldAnimate={true}
					onExitFinish={onExitFinish}
				/>,
			);
			expectPhase('exiting');

			flushNativeToggle();
			const exitAnimations = getCurrentAnimations(host);
			expectPhase('exiting');
			expect(host).toBeInTheDocument();
			expect(onExitFinish).not.toHaveBeenCalled();

			await finishAnimations(exitAnimations);
			expectPhase('closed');
			expect(onExitFinish).toHaveBeenCalledTimes(1);
			expect(screen.queryByTestId('host')).not.toBeInTheDocument();
		});

		it('waits for every exit animation to finish or be cancelled', async () => {
			nextAnimationCount = 2;
			const onExitFinish = jest.fn();
			const { rerender } = render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onExitFinish={onExitFinish}
				/>,
			);
			const host = screen.getByTestId('host');
			await finishAnimations(getCurrentAnimations(host));
			flushNativeToggle();

			nextAnimationCount = 2;
			rerender(
				<AnimatedVisibilityHarness
					isOpen={false}
					shouldAnimate={true}
					onExitFinish={onExitFinish}
				/>,
			);
			flushNativeToggle();
			const exitAnimations = getCurrentAnimations(host);

			await finishAnimations(exitAnimations.slice(0, 1));
			expectPhase('exiting');
			expect(onExitFinish).not.toHaveBeenCalled();

			await cancelAnimations(exitAnimations.slice(1));
			expectPhase('closed');
			expect(onExitFinish).toHaveBeenCalledTimes(1);
		});

		it('settles on the native closed toggle when exit animations have already finished', async () => {
			const onExitFinish = jest.fn();
			const { rerender } = render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onExitFinish={onExitFinish}
				/>,
			);
			const host = screen.getByTestId('host');
			await finishAnimations(getCurrentAnimations(host));
			flushNativeToggle();

			rerender(
				<AnimatedVisibilityHarness
					isOpen={false}
					shouldAnimate={true}
					onExitFinish={onExitFinish}
				/>,
			);
			expectPhase('exiting');
			expect(host).toBeInTheDocument();
			expect(onExitFinish).not.toHaveBeenCalled();

			nextAnimationCount = 0;
			flushNativeToggle();
			await act(async () => {
				await Promise.resolve();
			});
			expectPhase('closed');
			expect(onExitFinish).toHaveBeenCalledTimes(1);
		});

		it('cancels pending entry settlement when close interrupts entry', async () => {
			const onEnterFinish = jest.fn();
			const onExitFinish = jest.fn();
			const { rerender } = render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onEnterFinish={onEnterFinish}
					onExitFinish={onExitFinish}
				/>,
			);
			flushNativeToggle();
			const host = screen.getByTestId('host');
			const entryAnimations = getCurrentAnimations(host);

			rerender(
				<AnimatedVisibilityHarness
					isOpen={false}
					shouldAnimate={true}
					onEnterFinish={onEnterFinish}
					onExitFinish={onExitFinish}
				/>,
			);
			expectPhase('exiting');

			await finishAnimations(entryAnimations);
			expectPhase('exiting');
			expect(onEnterFinish).not.toHaveBeenCalled();
			expect(onExitFinish).not.toHaveBeenCalled();
		});

		it('stays closed after native dismissal while isOpen remains true', async () => {
			const { rerender } = render(<AnimatedVisibilityHarness isOpen={true} shouldAnimate={true} />);
			const host = screen.getByTestId('host');
			await finishAnimations(getCurrentAnimations(host));
			flushNativeToggle();

			act(() => {
				host.hidePopover();
			});
			expectPhase('exiting');

			flushNativeToggle();
			await finishAnimations(getCurrentAnimations(host));
			expectPhase('closed');
			expect(screen.queryByTestId('host')).not.toBeInTheDocument();

			// An unrelated render with the same controlled value must not reopen it.
			rerender(<AnimatedVisibilityHarness isOpen={true} shouldAnimate={true} />);
			expectPhase('closed');
			expect(screen.queryByTestId('host')).not.toBeInTheDocument();

			// The consumer must acknowledge the dismiss before a later open request.
			rerender(<AnimatedVisibilityHarness isOpen={false} shouldAnimate={true} />);
			rerender(<AnimatedVisibilityHarness isOpen={true} shouldAnimate={true} />);
			expectPhase('entering');
			expect(screen.getByTestId('host')).toBeInTheDocument();
		});

		it('does not treat controlled open state as a reopen when a native close begins', async () => {
			const onExitFinish = jest.fn();
			const { rerender } = render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onExitFinish={onExitFinish}
				/>,
			);
			const host = screen.getByTestId('host');
			await finishAnimations(getCurrentAnimations(host));
			flushNativeToggle();

			act(() => {
				host.hidePopover();
			});

			expectPhase('exiting');
			expect(onExitFinish).not.toHaveBeenCalled();

			flushNativeToggle();
			const exitAnimations = getCurrentAnimations(host);
			rerender(
				<AnimatedVisibilityHarness
					isOpen={false}
					shouldAnimate={true}
					onExitFinish={onExitFinish}
				/>,
			);

			await finishAnimations(exitAnimations);
			expectPhase('closed');
			expect(onExitFinish).toHaveBeenCalledTimes(1);
		});

		it('cancels pending exit settlement when reopened', async () => {
			const onEnterFinish = jest.fn();
			const onExitFinish = jest.fn();
			const { rerender } = render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onEnterFinish={onEnterFinish}
					onExitFinish={onExitFinish}
				/>,
			);
			const host = screen.getByTestId('host');
			await finishAnimations(getCurrentAnimations(host));
			flushNativeToggle();
			onEnterFinish.mockClear();

			rerender(
				<AnimatedVisibilityHarness
					isOpen={false}
					shouldAnimate={true}
					onEnterFinish={onEnterFinish}
					onExitFinish={onExitFinish}
				/>,
			);
			flushNativeToggle();
			const exitAnimations = getCurrentAnimations(host);

			rerender(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onEnterFinish={onEnterFinish}
					onExitFinish={onExitFinish}
				/>,
			);
			expectPhase('entering');

			await finishAnimations(exitAnimations);
			expectPhase('entering');
			expect(onExitFinish).not.toHaveBeenCalled();

			await finishAnimations(getCurrentAnimations(host));
			expectPhase('open');
			expect(onEnterFinish).toHaveBeenCalledTimes(1);
		});

		it('ignores stale exit settlement after the reopened entry has settled', async () => {
			const onEnterFinish = jest.fn();
			const onExitFinish = jest.fn();
			const { rerender } = render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onEnterFinish={onEnterFinish}
					onExitFinish={onExitFinish}
				/>,
			);
			const host = screen.getByTestId('host');
			await finishAnimations(getCurrentAnimations(host));
			flushNativeToggle();
			onEnterFinish.mockClear();

			rerender(
				<AnimatedVisibilityHarness
					isOpen={false}
					shouldAnimate={true}
					onEnterFinish={onEnterFinish}
					onExitFinish={onExitFinish}
				/>,
			);
			flushNativeToggle();
			const staleExitAnimations = getCurrentAnimations(host);

			rerender(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onEnterFinish={onEnterFinish}
					onExitFinish={onExitFinish}
				/>,
			);
			const reopenedEntryAnimations = getCurrentAnimations(host);

			await finishAnimations(reopenedEntryAnimations);
			expectPhase('open');
			expect(onEnterFinish).toHaveBeenCalledTimes(1);

			await finishAnimations(staleExitAnimations);
			expectPhase('open');
			expect(host).toBeVisible();
			expect(onExitFinish).not.toHaveBeenCalled();
		});

		it('uses the latest callbacks for pending animations', async () => {
			const firstOnEnterFinish = jest.fn();
			const latestOnEnterFinish = jest.fn();
			const firstOnExitFinish = jest.fn();
			const latestOnExitFinish = jest.fn();
			const { rerender } = render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onEnterFinish={firstOnEnterFinish}
					onExitFinish={firstOnExitFinish}
				/>,
			);
			const host = screen.getByTestId('host');

			rerender(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onEnterFinish={latestOnEnterFinish}
					onExitFinish={firstOnExitFinish}
				/>,
			);
			await finishAnimations(getCurrentAnimations(host));
			expect(firstOnEnterFinish).not.toHaveBeenCalled();
			expect(latestOnEnterFinish).toHaveBeenCalledTimes(1);
			flushNativeToggle();

			rerender(
				<AnimatedVisibilityHarness
					isOpen={false}
					shouldAnimate={true}
					onEnterFinish={latestOnEnterFinish}
					onExitFinish={firstOnExitFinish}
				/>,
			);
			rerender(
				<AnimatedVisibilityHarness
					isOpen={false}
					shouldAnimate={true}
					onEnterFinish={latestOnEnterFinish}
					onExitFinish={latestOnExitFinish}
				/>,
			);
			flushNativeToggle();
			const exitAnimations = getCurrentAnimations(host);
			await finishAnimations(exitAnimations);

			expect(firstOnExitFinish).not.toHaveBeenCalled();
			expect(latestOnExitFinish).toHaveBeenCalledTimes(1);
		});

		it('does not call pending animation callbacks after unmount', async () => {
			const onEnterFinish = jest.fn();
			const { unmount } = render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onEnterFinish={onEnterFinish}
				/>,
			);
			const animations = getCurrentAnimations(screen.getByTestId('host'));

			unmount();
			await finishAnimations(animations);

			expect(onEnterFinish).not.toHaveBeenCalled();
		});

		it('does not call the exit callback after unmount', async () => {
			const onExitFinish = jest.fn();
			const { rerender, unmount } = render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onExitFinish={onExitFinish}
				/>,
			);
			const host = screen.getByTestId('host');
			await finishAnimations(getCurrentAnimations(host));
			flushNativeToggle();

			rerender(
				<AnimatedVisibilityHarness
					isOpen={false}
					shouldAnimate={true}
					onExitFinish={onExitFinish}
				/>,
			);
			flushNativeToggle();
			const exitAnimations = getCurrentAnimations(host);

			unmount();
			await finishAnimations(exitAnimations);

			expect(onExitFinish).not.toHaveBeenCalled();
		});
	});

	describe('animation configuration changes', () => {
		it('settles entry when animation is disabled while entering', () => {
			const onEnterFinish = jest.fn();
			const { rerender } = render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onEnterFinish={onEnterFinish}
				/>,
			);
			expectPhase('entering');

			rerender(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={false}
					onEnterFinish={onEnterFinish}
				/>,
			);

			expectPhase('open');
			expect(onEnterFinish).toHaveBeenCalledTimes(1);
		});

		it('does not restart entry when animation is enabled while open', () => {
			const onEnterFinish = jest.fn();
			const { rerender } = render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={false}
					onEnterFinish={onEnterFinish}
				/>,
			);
			expectPhase('open');
			expect(onEnterFinish).toHaveBeenCalledTimes(1);

			rerender(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onEnterFinish={onEnterFinish}
				/>,
			);

			expectPhase('open');
			expect(onEnterFinish).toHaveBeenCalledTimes(1);
		});

		it('settles exit on the native toggle when animation is disabled while exiting', () => {
			const onExitFinish = jest.fn();
			const { rerender } = render(
				<AnimatedVisibilityHarness
					isOpen={true}
					shouldAnimate={true}
					onExitFinish={onExitFinish}
				/>,
			);
			flushNativeToggle();

			rerender(
				<AnimatedVisibilityHarness
					isOpen={false}
					shouldAnimate={true}
					onExitFinish={onExitFinish}
				/>,
			);
			expectPhase('exiting');

			rerender(
				<AnimatedVisibilityHarness
					isOpen={false}
					shouldAnimate={false}
					onExitFinish={onExitFinish}
				/>,
			);
			flushNativeToggle();

			expectPhase('closed');
			expect(onExitFinish).toHaveBeenCalledTimes(1);
		});
	});
});
