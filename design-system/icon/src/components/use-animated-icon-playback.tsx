import { type Ref, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import type { AnimatedIconRef } from '../types';
import { useAnimatedIconTrigger } from './use-animated-icon-trigger';

const prefersReducedMotion = (): boolean =>
	typeof window !== 'undefined' &&
	typeof window.matchMedia === 'function' &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * One step of a motion timeline: `phase` is returned by the hook for `durationMs`.
 */
export type MotionStep<P extends string> = {
	phase: P;
	durationMs: number;
};

export type AnimatedIconPlaybackOptions = {
	/**
	 * When `true`, a motion started by a trigger plays its whole timeline even if the trigger goes inactive
	 * part way (for example the pointer leaves). The trigger's `reset()` is then called once the timeline ends.
	 * Defaults to `false`: the motion is cancelled immediately.
	 */
	nonInterruptible?: boolean;
};

type PlaybackState<P extends string> = { phase: P | undefined; lastPhase: P | undefined };

// Goes idle while remembering which phase was active. Returns the same state if already idle, so no render.
const toIdle = <P extends string>(state: PlaybackState<P>): PlaybackState<P> =>
	state.phase === undefined ? state : { phase: undefined, lastPhase: state.phase };

/**
 * Shared playback control for animated icons: "play once, guarded, interruptible".
 *
 * - `reanimate()` on the ref starts a motion. It is ignored while one is already playing.
 * - When an `AnimatedIconTrigger` above becomes active, the icon plays once, then tells the trigger it is done.
 *   The trigger clears once every icon it started is done, so icons of different durations all play through.
 * - When the trigger goes inactive mid-motion, the motion is cancelled immediately, unless the icon passes
 *   `{ nonInterruptible: true }`, in which case the whole timeline plays and the trigger is told at the end.
 *
 * A motion is a timeline of steps that run back to back. The hook returns the name of the current step's
 * phase, or `undefined` when idle, and the icon maps each phase to styles. The second value, `lastPhase`, is the
 * phase that was active when the motion finished or was interrupted (`undefined` before the first motion), for
 * the rare icon that must keep part of a phase's styles after going idle. Most icons only need `[phase]`. A hold is just a step whose
 * phase the icon styles the same as the one before it.
 *
 * ```ts
 * const TIMELINE = [
 * 	{ phase: 'shade', durationMs: 700 },
 * 	{ phase: 'hold', durationMs: 100 },
 * 	{ phase: 'redraw', durationMs: 600 },
 * ] as const;
 * ```
 *
 * When the user prefers reduced motion nothing plays: the phase stays `undefined`, so icons never need their own
 * reduced motion CSS. The trigger is still told the icon is done straight away so it doesn't stay active.
 *
 * Call this once per icon. A second call with the same ref overwrites `reanimate()` and starts a second timer;
 * model overlapping effects as phases of one timeline instead.
 *
 * `timeline` must be a module-level constant. A new array on every render would change `play`, re-run the
 * trigger effect and cancel the motion.
 *
 * To write a new animated icon: define the glyph, the timeline, and a style for each phase.
 */
export const useAnimatedIconPlayback = <P extends string>(
	ref: Ref<AnimatedIconRef> | undefined,
	timeline: readonly MotionStep<P>[],
	{ nonInterruptible = false }: AnimatedIconPlaybackOptions = {},
): readonly [phase: P | undefined, lastPhase: P | undefined] => {
	const motion = useAnimatedIconTrigger();
	const isMotionActive = motion?.isActive;
	const startMotion = motion?.start;
	// `lastPhase` is the most recent phase that was active. It survives the phase going back to `undefined`
	// (the motion finished or was interrupted), and is replaced when the next motion starts. Both change in
	// the one state update, so tracking it costs no extra render.
	const [{ phase, lastPhase }, setState] = useState<PlaybackState<P>>({
		phase: undefined,
		lastPhase: undefined,
	});
	// Holds the timer of the step that is currently running. Defined for as long as a motion is playing.
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	// Called when the motion that is currently playing finishes. Cleared if the motion is cancelled.
	const onCompleteRef = useRef<(() => void) | undefined>(undefined);

	const runStep = useCallback(
		(index: number) => {
			const step = timeline[index];
			if (!step) {
				timeoutRef.current = undefined;
				setState(toIdle);
				const complete = onCompleteRef.current;
				onCompleteRef.current = undefined;
				complete?.();
				return;
			}
			setState({ phase: step.phase, lastPhase: step.phase });
			timeoutRef.current = setTimeout(() => runStep(index + 1), step.durationMs);
		},
		[timeline],
	);

	// Does nothing while a motion is already playing, so spamming `reanimate()` can't restart or stack
	// motions. A caller that supplies `onComplete` while one is playing still gets it called at the end.
	const play = useCallback(
		(onComplete?: () => void) => {
			if (prefersReducedMotion()) {
				onComplete?.();
				return;
			}
			if (onComplete) {
				onCompleteRef.current = onComplete;
			}
			if (timeoutRef.current !== undefined) {
				return;
			}
			runStep(0);
		},
		[runStep],
	);

	// Removes the phase immediately and clears the pending timeout, which stops the rest of the timeline.
	const cancel = useCallback(() => {
		clearTimeout(timeoutRef.current);
		timeoutRef.current = undefined;
		onCompleteRef.current = undefined;
		setState(toIdle);
	}, []);

	useImperativeHandle(ref, () => ({ reanimate: () => play() }), [play]);

	// The trigger's `done` for the motion this icon started, so it can be called if the icon unmounts first.
	const doneRef = useRef<(() => void) | undefined>(undefined);

	useEffect(() => {
		if (!isMotionActive || !startMotion) {
			return;
		}
		// The trigger stays active until every icon it started has called its own `done`.
		const { done, cancel: cancelMotion } = startMotion();
		doneRef.current = done;
		play(done);
		// Runs when the trigger deactivates before the motion completes (and on unmount), so the
		// motion is interruptible rather than finishing after the pointer has left. The trigger stops
		// waiting for it without counting it as finished.
		// A non-interruptible motion keeps its timer and plays on; the effect below clears it on unmount.
		if (nonInterruptible) {
			return undefined;
		}
		return () => {
			cancel();
			cancelMotion();
		};
	}, [isMotionActive, play, cancel, startMotion, nonInterruptible]);

	// A ref-driven motion has no cleanup of its own, so clear its timer on unmount. An icon that unmounts
	// part way through must still tell the trigger it is done, or the trigger would wait for it forever.
	const isMountedRef = useRef(false);
	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
			clearTimeout(timeoutRef.current);
			const done = doneRef.current;
			// React Strict Mode unmounts and remounts straight away. Waiting a microtask lets that remount
			// win, so the trigger isn't told the icon is done before it has played.
			void Promise.resolve().then(() => {
				if (!isMountedRef.current) {
					done?.();
				}
			});
		};
	}, []);

	return [phase, lastPhase];
};
