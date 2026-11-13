import React, { createRef } from 'react';

import { act, render } from '@atlassian/testing-library/testing-library/react';

import type { AnimatedIconRef } from '../../../types';
import { AnimatedIconContext, type AnimatedIconContextValue } from '../../animated-icon-context';
import {
	type AnimatedIconPlaybackOptions,
	type MotionStep,
	useAnimatedIconPlayback,
} from '../../use-animated-icon-playback';

const SINGLE = [{ phase: 'playing', durationMs: 400 }] as const;

const MULTI = [
	{ phase: 'shade', durationMs: 700 },
	{ phase: 'hold', durationMs: 100 },
	{ phase: 'redraw', durationMs: 600 },
] as const;
const MULTI_TOTAL = 1400;

/**
 * What a test passes for the trigger. `reset` is called once when the icon says it is done, which is
 * what `start()` hands back as `done`.
 */
type MotionValue = { isActive: boolean; reset: () => void } | undefined;

// A real trigger keeps `start` stable between renders, and the hook re-runs its effect if it changes.
const startByReset = new WeakMap<() => void, AnimatedIconContextValue['start']>();
const toContextValue = (value: MotionValue): AnimatedIconContextValue | undefined => {
	if (!value) {
		return undefined;
	}
	let start = startByReset.get(value.reset);
	if (!start) {
		const { reset } = value;
		start = () => ({ done: reset, cancel: () => {} });
		startByReset.set(reset, start);
	}
	return { isActive: value.isActive, start };
};

/**
 * Renders the hook inside an `AnimatedIconContext` and exposes what it returns through `result.current`.
 * `rerender` swaps the context value without remounting, as an `AnimatedIconTrigger` would.
 */
const setup = <P extends string>(
	timeline: readonly MotionStep<P>[],
	initial?: MotionValue,
	options?: AnimatedIconPlaybackOptions,
) => {
	const ref = createRef<AnimatedIconRef>();
	const result: { current: P | undefined } = { current: undefined };
	const lastPhase: { current: P | undefined } = { current: undefined };

	const Harness = () => {
		[result.current, lastPhase.current] = useAnimatedIconPlayback(ref, timeline, options);
		return null;
	};
	const tree = (value: MotionValue) => (
		<AnimatedIconContext.Provider value={toContextValue(value)}>
			<Harness />
		</AnimatedIconContext.Provider>
	);

	const view = render(tree(initial));
	return {
		ref,
		result,
		lastPhase,
		rerender: (value: MotionValue) => view.rerender(tree(value)),
		unmount: view.unmount,
	};
};

const advance = (ms: number) => {
	act(() => {
		jest.advanceTimersByTime(ms);
	});
};

describe('useAnimatedIconPlayback', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	describe('single step', () => {
		it('is idle by default', () => {
			const { result } = setup(SINGLE);
			expect(result.current).toBeUndefined();
		});

		it('plays for the duration when reanimate() is called, then stops', () => {
			const { result, ref } = setup(SINGLE);

			act(() => ref.current?.reanimate());
			expect(result.current).toBe('playing');

			advance(399);
			expect(result.current).toBe('playing');

			advance(1);
			expect(result.current).toBeUndefined();
		});

		it('ignores reanimate() while a motion is already playing', () => {
			const { result, ref } = setup(SINGLE);

			act(() => ref.current?.reanimate());
			advance(300);
			act(() => ref.current?.reanimate());
			act(() => ref.current?.reanimate());
			expect(jest.getTimerCount()).toBe(1);

			// The extra calls did not extend the original window.
			advance(100);
			expect(result.current).toBeUndefined();
		});

		it('plays again once the previous motion has completed', () => {
			const { result, ref } = setup(SINGLE);

			act(() => ref.current?.reanimate());
			advance(400);
			act(() => ref.current?.reanimate());

			expect(result.current).toBe('playing');
		});

		it('plays when the trigger becomes active and calls reset once at the end', () => {
			const reset = jest.fn();
			const { result } = setup(SINGLE, { isActive: true, reset });
			expect(result.current).toBe('playing');

			advance(400);
			expect(result.current).toBeUndefined();
			expect(reset).toHaveBeenCalledTimes(1);
		});

		it('cancels immediately, without calling reset, when the trigger goes inactive', () => {
			const reset = jest.fn();
			const { result, rerender } = setup(SINGLE, { isActive: true, reset });
			expect(result.current).toBe('playing');

			rerender({ isActive: false, reset });
			expect(result.current).toBeUndefined();
			expect(jest.getTimerCount()).toBe(0);

			advance(400);
			expect(reset).not.toHaveBeenCalled();
		});

		it('still calls reset when the trigger activates during a ref-driven motion', () => {
			const reset = jest.fn();
			const { ref, rerender } = setup(SINGLE, { isActive: false, reset });

			act(() => ref.current?.reanimate());
			advance(200);
			rerender({ isActive: true, reset });
			expect(jest.getTimerCount()).toBe(1);

			advance(200);
			expect(reset).toHaveBeenCalledTimes(1);
		});

		it('clears the timer on unmount', () => {
			const { ref, unmount } = setup(SINGLE);

			act(() => ref.current?.reanimate());
			expect(jest.getTimerCount()).toBe(1);

			unmount();
			expect(jest.getTimerCount()).toBe(0);
		});
	});

	describe('multiple steps', () => {
		it('moves through each phase in order, then goes idle', () => {
			const { result, ref } = setup(MULTI);
			expect(result.current).toBeUndefined();

			act(() => ref.current?.reanimate());
			expect(result.current).toBe('shade');

			advance(699);
			expect(result.current).toBe('shade');
			advance(1);
			expect(result.current).toBe('hold');

			advance(99);
			expect(result.current).toBe('hold');
			advance(1);
			expect(result.current).toBe('redraw');

			advance(599);
			expect(result.current).toBe('redraw');
			advance(1);
			expect(result.current).toBeUndefined();
			expect(jest.getTimerCount()).toBe(0);
		});

		it.each([
			['shade', 300],
			['hold', 750],
			['redraw', 1000],
		])('ignores reanimate() during %s', (phase, elapsed) => {
			const { result, ref } = setup(MULTI);

			act(() => ref.current?.reanimate());
			advance(elapsed);
			expect(result.current).toBe(phase);

			act(() => ref.current?.reanimate());
			expect(result.current).toBe(phase);
			expect(jest.getTimerCount()).toBe(1);

			// The ignored call did not restart the timeline or extend it.
			advance(MULTI_TOTAL - elapsed);
			expect(result.current).toBeUndefined();
		});

		it('plays the whole timeline again after it completes', () => {
			const { result, ref } = setup(MULTI);

			act(() => ref.current?.reanimate());
			advance(MULTI_TOTAL);
			expect(result.current).toBeUndefined();

			act(() => ref.current?.reanimate());
			expect(result.current).toBe('shade');
		});

		it('calls the trigger reset once, only after the last step', () => {
			const reset = jest.fn();
			const { result } = setup(MULTI, { isActive: true, reset });
			expect(result.current).toBe('shade');

			advance(700);
			expect(reset).not.toHaveBeenCalled();
			advance(100);
			expect(reset).not.toHaveBeenCalled();
			advance(599);
			expect(reset).not.toHaveBeenCalled();

			advance(1);
			expect(result.current).toBeUndefined();
			expect(reset).toHaveBeenCalledTimes(1);
		});

		it('cancels the rest of the timeline when the trigger goes inactive mid-timeline', () => {
			const reset = jest.fn();
			const { result, rerender } = setup(MULTI, { isActive: true, reset });

			advance(750);
			expect(result.current).toBe('hold');

			rerender({ isActive: false, reset });
			expect(result.current).toBeUndefined();
			expect(jest.getTimerCount()).toBe(0);

			advance(MULTI_TOTAL);
			expect(result.current).toBeUndefined();
			expect(reset).not.toHaveBeenCalled();
		});

		it('keeps the pending reset when the trigger activates during a ref-driven motion', () => {
			const reset = jest.fn();
			const { ref, rerender } = setup(MULTI, { isActive: false, reset });

			act(() => ref.current?.reanimate());
			advance(300);
			rerender({ isActive: true, reset });
			expect(jest.getTimerCount()).toBe(1);

			advance(MULTI_TOTAL - 300 - 1);
			expect(reset).not.toHaveBeenCalled();
			advance(1);
			expect(reset).toHaveBeenCalledTimes(1);
		});

		it('remembers the interrupted phase as lastPhase until the next motion starts', () => {
			const reset = jest.fn();
			const { result, lastPhase, rerender, ref } = setup(MULTI, { isActive: true, reset });
			expect(lastPhase.current).toBe('shade');

			advance(750);
			rerender({ isActive: false, reset });
			expect(result.current).toBeUndefined();
			expect(lastPhase.current).toBe('hold');

			act(() => ref.current?.reanimate());
			expect(lastPhase.current).toBe('shade');
		});

		it('reports the final phase as lastPhase after a completed motion', () => {
			const { result, lastPhase, ref } = setup(MULTI);
			expect(lastPhase.current).toBeUndefined();

			act(() => ref.current?.reanimate());
			advance(MULTI_TOTAL);
			expect(result.current).toBeUndefined();
			expect(lastPhase.current).toBe('redraw');
		});

		it('clears the timer on unmount mid-timeline', () => {
			const { ref, unmount } = setup(MULTI);

			act(() => ref.current?.reanimate());
			advance(750);
			expect(jest.getTimerCount()).toBe(1);

			unmount();
			expect(jest.getTimerCount()).toBe(0);
		});
	});

	describe('nonInterruptible', () => {
		const options = { nonInterruptible: true };

		it('plays the whole timeline after the trigger goes inactive, then calls reset once', () => {
			const reset = jest.fn();
			const { result, rerender } = setup(MULTI, { isActive: true, reset }, options);

			advance(750);
			expect(result.current).toBe('hold');

			rerender({ isActive: false, reset });
			expect(result.current).toBe('hold');
			expect(jest.getTimerCount()).toBe(1);

			advance(50);
			expect(result.current).toBe('redraw');
			expect(reset).not.toHaveBeenCalled();

			advance(MULTI_TOTAL - 800);
			expect(result.current).toBeUndefined();
			expect(reset).toHaveBeenCalledTimes(1);
		});

		it('does not restart when the trigger activates again during the motion', () => {
			const reset = jest.fn();
			const { result, rerender } = setup(MULTI, { isActive: true, reset }, options);

			advance(300);
			rerender({ isActive: false, reset });
			rerender({ isActive: true, reset });
			expect(result.current).toBe('shade');
			expect(jest.getTimerCount()).toBe(1);

			advance(MULTI_TOTAL - 300);
			expect(result.current).toBeUndefined();
			expect(reset).toHaveBeenCalledTimes(1);
		});

		it('still clears the timer on unmount', () => {
			const { unmount } = setup(MULTI, { isActive: true, reset: jest.fn() }, options);

			advance(300);
			unmount();
			expect(jest.getTimerCount()).toBe(0);
		});
	});

	describe('when the user prefers reduced motion', () => {
		const originalMatchMedia = window.matchMedia;

		beforeEach(() => {
			window.matchMedia = jest.fn().mockImplementation((query: string) => ({
				matches: query === '(prefers-reduced-motion: reduce)',
			}));
		});

		afterEach(() => {
			window.matchMedia = originalMatchMedia;
		});

		it('never enters a phase when reanimate() is called', () => {
			const { result, ref } = setup(MULTI);

			act(() => ref.current?.reanimate());

			expect(result.current).toBeUndefined();
			expect(jest.getTimerCount()).toBe(0);
		});

		it('resets the trigger straight away without playing', () => {
			const reset = jest.fn();
			const { result } = setup(MULTI, { isActive: true, reset });

			expect(result.current).toBeUndefined();
			expect(jest.getTimerCount()).toBe(0);
			expect(reset).toHaveBeenCalledTimes(1);
		});
	});
});
