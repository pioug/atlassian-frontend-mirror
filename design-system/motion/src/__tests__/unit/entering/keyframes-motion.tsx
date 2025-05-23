import React from 'react';

import { act, render, screen } from '@testing-library/react';

import ExitingPersistence from '../../../entering/exiting-persistence';
import KeyframesMotion from '../../../entering/keyframes-motion';
import StaggeredEntrance from '../../../entering/staggered-entrance';
import { easeIn, easeOut, isReducedMotion } from '../../../index';
import { durations, exitingDurations } from '../../../utils/durations';

jest.mock('../../../utils/accessibility');

const duration = 'large';

beforeEach(() => {
	(isReducedMotion as jest.Mock).mockReturnValue(false);
});

describe('<KeyframesMotion />', () => {
	beforeEach(() => {
		jest.useRealTimers();
	});

	it('should respect reduced motion', () => {
		render(
			<KeyframesMotion
				duration={duration}
				enteringAnimation="fade-in"
				animationTimingFunction="linear"
			>
				{(props) => <div data-testid="target" {...props} />}
			</KeyframesMotion>,
		);

		expect(screen.getByTestId('target')).toHaveCompiledCss('animation', 'none', {
			media: '(prefers-reduced-motion: reduce)',
		});
	});

	describe('entering', () => {
		afterEach(() => {
			jest.useRealTimers();
		});
		it('should fill the animation backwards to prevent a frame of the element already being entered', () => {
			render(
				<KeyframesMotion
					animationTimingFunction="ease-out"
					animationTimingFunctionExiting="ease-in"
					duration={duration}
					enteringAnimation="fade-in"
				>
					{(props) => <div data-testid="target" {...props} />}
				</KeyframesMotion>,
			);

			expect(screen.getByTestId('target')).toHaveCompiledCss('animation-fill-mode', 'backwards');
		});

		it('should use the entering timing function', () => {
			render(
				<KeyframesMotion
					animationTimingFunction="ease-out"
					animationTimingFunctionExiting="ease-in"
					duration={duration}
					enteringAnimation="fade-in"
				>
					{(props) => <div data-testid="target" {...props} />}
				</KeyframesMotion>,
			);

			expect(screen.getByTestId('target')).toHaveCompiledCss(
				'animation-timing-function',
				easeOut.replace('0.', '.'),
			);
		});

		it('should animate in', () => {
			render(
				<KeyframesMotion
					animationTimingFunction="ease-out"
					animationTimingFunctionExiting="ease-in"
					duration={duration}
					enteringAnimation="fade-in"
				>
					{(props) => <div data-testid="target" {...props} />}
				</KeyframesMotion>,
			);

			expect(screen.getByTestId('target')).toHaveCompiledCss('animation-play-state', 'running');
		});

		it('should animate over {duration} ms', () => {
			render(
				<KeyframesMotion
					animationTimingFunction="ease-out"
					animationTimingFunctionExiting="ease-in"
					duration={duration}
					enteringAnimation="fade-in"
				>
					{(props) => <div data-testid="target" {...props} />}
				</KeyframesMotion>,
			);

			expect(screen.getByTestId('target')).toHaveCompiledCss('animation-duration', '.7s');
		});

		it('should callback when entering on finish', () => {
			jest.useFakeTimers();
			const callback = jest.fn();
			render(
				<KeyframesMotion
					animationTimingFunction="linear"
					duration={duration}
					enteringAnimation="fade-in"
					onFinish={callback}
				>
					{(props) => <div {...props} />}
				</KeyframesMotion>,
			);
			act(() => {
				jest.advanceTimersByTime(1000);
			});

			expect(callback).toHaveBeenCalledWith('entering');
		});

		it('should callback when entering in a staggered list after finishing', () => {
			jest.useFakeTimers();
			const step = 50;
			const callback = jest.fn();
			render(
				<StaggeredEntrance delayStep={step} columns={1}>
					<KeyframesMotion
						animationTimingFunction="linear"
						duration={duration}
						enteringAnimation="fade-in"
					>
						{(props) => <div {...props} />}
					</KeyframesMotion>
					<KeyframesMotion
						animationTimingFunction="linear"
						duration={duration}
						enteringAnimation="fade-in"
						onFinish={callback}
					>
						{(props) => <div {...props} />}
					</KeyframesMotion>
				</StaggeredEntrance>,
			);

			// Step is actually logarithmic so we add a little on to make sure it hits the timeout.
			act(() => {
				jest.advanceTimersByTime(durations.large + step + 2);
			});
			expect(callback).toHaveBeenCalledWith('entering');
		});

		it('should not callback if paused', () => {
			jest.useFakeTimers();
			const callback = jest.fn();
			render(
				<ExitingPersistence>
					<KeyframesMotion
						animationTimingFunction="linear"
						duration={duration}
						enteringAnimation="fade-in"
						onFinish={callback}
						isPaused
					>
						{(props) => <div {...props} />}
					</KeyframesMotion>
				</ExitingPersistence>,
			);
			act(() => {
				jest.runAllTimers();
			});

			expect(callback).not.toHaveBeenCalled();
		});

		it('should callback immediately if appear is false', () => {
			const callback = jest.fn();
			render(
				<ExitingPersistence>
					<KeyframesMotion
						animationTimingFunction="linear"
						duration={duration}
						enteringAnimation="fade-in"
						onFinish={callback}
					>
						{(props) => <div {...props} />}
					</KeyframesMotion>
				</ExitingPersistence>,
			);

			expect(callback).toHaveBeenCalledWith('entering');
		});

		it('should call onFinish correctly when appear is true', () => {
			jest.useFakeTimers();

			const onFinish = jest.fn();

			const { rerender } = render(
				<ExitingPersistence appear>
					<KeyframesMotion
						animationTimingFunction="linear"
						duration={duration}
						enteringAnimation="fade-in"
						onFinish={onFinish}
					>
						{(props) => <div {...props} />}
					</KeyframesMotion>
				</ExitingPersistence>,
			);

			expect(onFinish).not.toHaveBeenCalled();

			act(() => {
				// `onFinish` is called after the entering duration
				jest.advanceTimersByTime(durations[duration]);
			});

			expect(onFinish).toHaveBeenCalledTimes(1);
			expect(onFinish).toHaveBeenCalledWith('entering');
			onFinish.mockClear();

			rerender(<ExitingPersistence>{false}</ExitingPersistence>);

			expect(onFinish).not.toHaveBeenCalled();

			act(() => {
				// `onFinish` is called after the exiting duration
				jest.advanceTimersByTime(exitingDurations[duration]);
			});

			expect(onFinish).toHaveBeenCalledTimes(1);
			expect(onFinish).toHaveBeenCalledWith('exiting');

			jest.useRealTimers();
		});

		it('should call onFinish correctly when appear is false', () => {
			jest.useFakeTimers();

			const onFinish = jest.fn();

			const { rerender } = render(
				<ExitingPersistence>
					<KeyframesMotion
						animationTimingFunction="linear"
						duration={duration}
						enteringAnimation="fade-in"
						onFinish={onFinish}
					>
						{(props) => <div {...props} />}
					</KeyframesMotion>
				</ExitingPersistence>,
			);

			// `onFinish` is called immediately because `appear={false}` means there's no entrance animation
			expect(onFinish).toHaveBeenCalledTimes(1);
			expect(onFinish).toHaveBeenCalledWith('entering');
			onFinish.mockClear();

			rerender(<ExitingPersistence>{false}</ExitingPersistence>);

			expect(onFinish).not.toHaveBeenCalled();

			act(() => {
				// `onFinish` is called after the exiting duration
				jest.advanceTimersByTime(exitingDurations[duration]);
			});

			expect(onFinish).toHaveBeenCalledTimes(1);
			expect(onFinish).toHaveBeenCalledWith('exiting');

			jest.useRealTimers();
		});

		it('should not animate if appear is false', () => {
			render(
				<ExitingPersistence>
					<KeyframesMotion
						animationTimingFunction="linear"
						duration={duration}
						enteringAnimation="fade-in"
					>
						{(props) => <div data-testid="target" {...props} />}
					</KeyframesMotion>
				</ExitingPersistence>,
			);

			expect(screen.getByTestId('target')).not.toHaveCompiledCss('animation-play-state', 'running');
		});

		it('should animate on mount if appear is true', () => {
			render(
				<ExitingPersistence appear>
					<KeyframesMotion
						animationTimingFunction="linear"
						duration={duration}
						enteringAnimation="fade-in"
					>
						{(props) => <div data-testid="target" {...props} />}
					</KeyframesMotion>
				</ExitingPersistence>,
			);

			expect(screen.getByTestId('target')).toHaveCompiledCss('animation-play-state', 'running');
			expect(screen.getByTestId('target')).toHaveCompiledCss('animation-duration', `.7s`);
		});
	});

	describe('exiting', () => {
		afterEach(() => {
			jest.useRealTimers();
		});
		it('should take half the time to callback on finish', () => {
			jest.useFakeTimers();
			const callback = jest.fn();
			const { rerender } = render(
				<ExitingPersistence>
					<KeyframesMotion
						animationTimingFunction="linear"
						duration={duration}
						enteringAnimation="fade-in"
						onFinish={callback}
					>
						{(props) => <div {...props} />}
					</KeyframesMotion>
				</ExitingPersistence>,
			);

			rerender(<ExitingPersistence>{false}</ExitingPersistence>);
			act(() => {
				jest.advanceTimersByTime(350);
			});

			expect(callback).toHaveBeenCalledWith('exiting');
		});

		it('should not callback if the component is fully unmounted', () => {
			jest.useFakeTimers();
			const callback = jest.fn();
			const { rerender } = render(
				<ExitingPersistence>
					<KeyframesMotion
						animationTimingFunction="linear"
						duration={duration}
						enteringAnimation="fade-in"
						onFinish={callback}
					>
						{(props) => <div {...props} />}
					</KeyframesMotion>
				</ExitingPersistence>,
			);
			jest.runAllTimers();
			callback.mockReset();
			rerender(<span />);

			act(() => {
				jest.runAllTimers();
			});

			expect(callback).not.toHaveBeenCalled();
		});

		it('should have no delay', () => {
			const { rerender } = render(
				<ExitingPersistence>
					<KeyframesMotion
						animationTimingFunction="ease-out"
						animationTimingFunctionExiting="ease-in"
						duration={duration}
						enteringAnimation="fade-in"
					>
						{(props) => <div data-testid="target" {...props} />}
					</KeyframesMotion>
				</ExitingPersistence>,
			);

			rerender(<ExitingPersistence>{false}</ExitingPersistence>);

			expect(screen.getByTestId('target')).toHaveCompiledCss('animation-delay', '0ms');
		});

		it('should fill the animation forwards to prevent a frame of the element already being exited', () => {
			const { rerender } = render(
				<ExitingPersistence>
					<KeyframesMotion
						animationTimingFunction="ease-out"
						animationTimingFunctionExiting="ease-in"
						duration={duration}
						enteringAnimation="fade-in"
					>
						{(props) => <div data-testid="target" {...props} />}
					</KeyframesMotion>
				</ExitingPersistence>,
			);

			rerender(<ExitingPersistence>{false}</ExitingPersistence>);

			expect(screen.getByTestId('target')).toHaveCompiledCss('animation-fill-mode', 'forwards');
		});

		it('should run the animation', () => {
			const { rerender } = render(
				<ExitingPersistence>
					<KeyframesMotion
						animationTimingFunction="ease-out"
						animationTimingFunctionExiting="ease-in"
						duration={duration}
						enteringAnimation="fade-in"
					>
						{(props) => <div data-testid="target" {...props} />}
					</KeyframesMotion>
				</ExitingPersistence>,
			);

			rerender(<ExitingPersistence>{false}</ExitingPersistence>);

			expect(screen.getByTestId('target')).toHaveCompiledCss('animation-play-state', 'running');
		});

		it('should take half the time it took when entering', () => {
			const { rerender } = render(
				<ExitingPersistence>
					<KeyframesMotion
						animationTimingFunction="ease-out"
						animationTimingFunctionExiting="ease-in"
						duration={duration}
						enteringAnimation="fade-in"
					>
						{(props) => <div data-testid="target" {...props} />}
					</KeyframesMotion>
				</ExitingPersistence>,
			);

			rerender(<ExitingPersistence>{false}</ExitingPersistence>);

			expect(screen.getByTestId('target')).toHaveCompiledCss('animation-duration', '.35s');
		});

		it('should use its own timing function', () => {
			const { rerender } = render(
				<ExitingPersistence>
					<KeyframesMotion
						animationTimingFunction="ease-out"
						animationTimingFunctionExiting="ease-in"
						duration={duration}
						enteringAnimation="fade-in"
					>
						{(props) => <div data-testid="target" {...props} />}
					</KeyframesMotion>
				</ExitingPersistence>,
			);

			rerender(<ExitingPersistence>{false}</ExitingPersistence>);

			expect(screen.getByTestId('target')).toHaveCompiledCss(
				'animation-timing-function',
				easeIn.replace(new RegExp(/0\./, 'g'), '.'),
			);
		});
	});

	it('should call onFinish correctly if reduced motion is preferred', () => {
		(isReducedMotion as jest.Mock).mockReturnValue(true);

		const onFinish = jest.fn();

		const { rerender } = render(
			<ExitingPersistence>
				<KeyframesMotion
					animationTimingFunction="linear"
					duration={duration}
					enteringAnimation="fade-in"
					onFinish={onFinish}
				>
					{(props) => <div {...props} />}
				</KeyframesMotion>
			</ExitingPersistence>,
		);

		// onFinish is called immediately because reduced motion disables the animation

		expect(onFinish).toHaveBeenCalledTimes(1);
		expect(onFinish).toHaveBeenCalledWith('entering');
		onFinish.mockClear();

		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		// onFinish is called immediately because reduced motion disables the animation

		expect(onFinish).toHaveBeenCalledTimes(1);
		expect(onFinish).toHaveBeenCalledWith('exiting');
	});
});
