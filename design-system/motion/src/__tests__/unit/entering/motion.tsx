import React from 'react';

import { token } from '@atlaskit/tokens';
import { act, render, screen, waitFor } from '@atlassian/testing-library';


import ExitingPersistence from '../../../entering/exiting-persistence';
import Motion, { Reanimate } from '../../../entering/motion';
import StaggeredEntrance from '../../../entering/staggered-entrance';
import { isReducedMotion } from '../../../index';

const MOTION_DURATION = 350;

jest.mock('@atlaskit/tokens', () => ({
	token: (path: string) => {
		if (path === 'motion.test.enter') {return 'var(--ds-test-enter)';}
		if (path === 'motion.test.exit') {return 'var(--ds-test-exit)';}
		return path;
	},
}));

jest.mock('../../../utils/accessibility');

const ENTERING_ANIMATION = token('motion.test.enter' as any);
const EXITING_ANIMATION = token('motion.test.exit' as any);

const TEST_MOTION_CSS = `
@keyframes FadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes FadeOut {
  0% { opacity: 1; }
  100% { opacity: 0; }
}
:root {
  --ds-test-enter: 350ms cubic-bezier(0.66, 0, 0.34, 1) FadeIn;
  --ds-test-exit: 350ms cubic-bezier(0.66, 0, 0.34, 1) FadeOut;
}
`;

const TestMotionWrapper = ({ children }: { children: React.ReactNode }) => (
	<>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles */}
		<style>{TEST_MOTION_CSS}</style>
		{children}
	</>
);

const renderWithMotionStyles = (
	ui: React.ReactElement,
) => render(ui, { wrapper: TestMotionWrapper });

beforeEach(() => {
	(isReducedMotion as jest.Mock).mockReturnValue(false);
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<Motion />', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});
	afterEach(() => {
		jest.useRealTimers();
	});

	it('should respect reduced motion', () => {
		renderWithMotionStyles(
			<Motion
				enteringAnimation={ENTERING_ANIMATION}
				exitingAnimation={EXITING_ANIMATION}
				testId="target"
			>
				<div />
			</Motion>
		);

		expect(screen.getByTestId('target')).toHaveCompiledCss('animation', 'none', {
			media: '(prefers-reduced-motion: reduce)',
		});
	});

	describe('entering', () => {
		it('should fill the animation backwards to prevent a frame of the element already being entered', () => {
			renderWithMotionStyles(
				<Motion
					enteringAnimation={ENTERING_ANIMATION}
					exitingAnimation={EXITING_ANIMATION}
					testId="target"
				>
					<div />
				</Motion>,
			);

			expect(screen.getByTestId('target').style.animation).toContain('backwards');
		});

		it('should animate in', () => {
			renderWithMotionStyles(
				<Motion
					enteringAnimation={ENTERING_ANIMATION}
					exitingAnimation={EXITING_ANIMATION}
					testId="target"
				>
					<div />
				</Motion>,
			);

			expect(screen.getByTestId('target')).toHaveCompiledCss('animation-play-state', 'running');
		});

		it('should callback when entering on finish', () => {
			const callback = jest.fn();
			renderWithMotionStyles(
				<Motion
					enteringAnimation={ENTERING_ANIMATION}
					exitingAnimation={EXITING_ANIMATION}
					onFinish={callback}
					testId="target"
				>
					<div />
				</Motion>,
			);
			act(() => {
				jest.advanceTimersByTime(1000);
			});

			expect(callback).toHaveBeenCalledWith('entering');
		});

		it('should callback when entering in a staggered list after finishing', () => {
			const step = 50;
			const callback = jest.fn();
			renderWithMotionStyles(
				<StaggeredEntrance delayStep={step} columns={1}>
					<Motion
						enteringAnimation={ENTERING_ANIMATION}
						exitingAnimation={EXITING_ANIMATION}
						testId="target"
					>
						<div />
					</Motion>
					<Motion
						enteringAnimation={ENTERING_ANIMATION}
						exitingAnimation={EXITING_ANIMATION}
						onFinish={callback}
						testId="target"
					>
						<div />
					</Motion>
				</StaggeredEntrance>,
			);

			// Step is actually logarithmic so we add a little on to make sure it hits the timeout.
			act(() => {
				jest.advanceTimersByTime(MOTION_DURATION + step + 2);
			});
			expect(callback).toHaveBeenCalledWith('entering');
		});

		it('should not callback if paused', () => {
			const callback = jest.fn();
			renderWithMotionStyles(
				<ExitingPersistence>
					<Motion
						enteringAnimation={ENTERING_ANIMATION}
						exitingAnimation={EXITING_ANIMATION}
						onFinish={callback}
						isPaused
					>
						<div />
					</Motion>
				</ExitingPersistence>,
			);
			act(() => {
				jest.runAllTimers();
			});

			expect(callback).not.toHaveBeenCalled();
		});

		it('should callback immediately if appear is false', () => {
			const callback = jest.fn();
			renderWithMotionStyles(
				<ExitingPersistence>
					<Motion
						enteringAnimation={ENTERING_ANIMATION}
						exitingAnimation={EXITING_ANIMATION}
						onFinish={callback}
					>
						<div />
					</Motion>
				</ExitingPersistence>,
			);

			expect(callback).toHaveBeenCalledWith('entering');
		});

		it('should call onFinish correctly when appear is true', () => {

			const onFinish = jest.fn();

			const { rerender } = renderWithMotionStyles(
				<ExitingPersistence appear>
					<Motion
						enteringAnimation={ENTERING_ANIMATION}
						exitingAnimation={EXITING_ANIMATION}
						onFinish={onFinish}
					>
						<div />
					</Motion>
				</ExitingPersistence>,
			);

			expect(onFinish).not.toHaveBeenCalled();

			act(() => {
				// `onFinish` is called after the entering duration
				jest.advanceTimersByTime(MOTION_DURATION);
			});

			expect(onFinish).toHaveBeenCalledTimes(1);
			expect(onFinish).toHaveBeenCalledWith('entering');
			onFinish.mockClear();

			rerender(<ExitingPersistence>{false}</ExitingPersistence>);

			expect(onFinish).not.toHaveBeenCalled();

			act(() => {
				// `onFinish` is called after the exiting duration
				jest.advanceTimersByTime(MOTION_DURATION);
			});

			expect(onFinish).toHaveBeenCalledTimes(1);
			expect(onFinish).toHaveBeenCalledWith('exiting');
		});

		it('should call onFinish correctly when appear is false', () => {
			const onFinish = jest.fn();

			const { rerender } = renderWithMotionStyles(
				<ExitingPersistence>
					<Motion
						enteringAnimation={ENTERING_ANIMATION}
						exitingAnimation={EXITING_ANIMATION}
						onFinish={onFinish}
					>
						<div />
					</Motion>
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
				jest.advanceTimersByTime(MOTION_DURATION);
			});

			expect(onFinish).toHaveBeenCalledTimes(1);
			expect(onFinish).toHaveBeenCalledWith('exiting');
		});

		it('should not animate if appear is false', () => {
			renderWithMotionStyles(
				<ExitingPersistence>
					<Motion
						enteringAnimation={ENTERING_ANIMATION}
						exitingAnimation={EXITING_ANIMATION}
						testId="target"
					>
						<div />
					</Motion>
				</ExitingPersistence>,
			);

			expect(screen.getByTestId('target')).not.toHaveCompiledCss('animation-play-state', 'running');
		});

		it('should animate on mount if appear is true', () => {
			renderWithMotionStyles(
				<ExitingPersistence appear>
					<Motion
						enteringAnimation={ENTERING_ANIMATION}
						exitingAnimation={EXITING_ANIMATION}
						testId="target"
					>
						<div />
					</Motion>
				</ExitingPersistence>,
			);

			expect(screen.getByTestId('target')).toHaveCompiledCss('animation-play-state', 'running');
		});
	});

	describe('exiting', () => {
		it('should call callback on finish', () => {
			const callback = jest.fn();
			const { rerender } = renderWithMotionStyles(
				<ExitingPersistence>
					<Motion
						enteringAnimation={ENTERING_ANIMATION}
						exitingAnimation={EXITING_ANIMATION}
						onFinish={callback}
					>
						<div />
					</Motion>
				</ExitingPersistence>,
			);

			rerender(<ExitingPersistence>{false}</ExitingPersistence>);
			act(() => {
				jest.advanceTimersByTime(MOTION_DURATION);
			});

			expect(callback).toHaveBeenCalledWith('exiting');
		});

		it('should not callback if the component is fully unmounted', () => {
			const callback = jest.fn();
			const { rerender } = renderWithMotionStyles(
				<ExitingPersistence>
					<Motion
						enteringAnimation={ENTERING_ANIMATION}
						exitingAnimation={EXITING_ANIMATION}
						onFinish={callback}
					>
						<div />
					</Motion>
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
			const { rerender } = renderWithMotionStyles(
				<ExitingPersistence>
					<Motion
						enteringAnimation={ENTERING_ANIMATION}
						exitingAnimation={EXITING_ANIMATION}
						testId="target"
					>
						<div />
					</Motion>
				</ExitingPersistence>,
			);

			rerender(<ExitingPersistence>{false}</ExitingPersistence>);

			expect(screen.getByTestId('target')).toHaveStyle({animationDelay:""});
		});

		it('should fill the animation forwards to prevent a frame of the element already being exited', () => {
			const { rerender } = renderWithMotionStyles(
				<ExitingPersistence>
					<Motion
						enteringAnimation={ENTERING_ANIMATION}
						exitingAnimation={EXITING_ANIMATION}
						testId="target"
					>
						<div />
					</Motion>
				</ExitingPersistence>,
			);

			rerender(<ExitingPersistence>{false}</ExitingPersistence>);

			expect(screen.getByTestId('target').style.animation).toContain('forwards');
		});

		it('should run the animation', () => {
			const { rerender } = renderWithMotionStyles(
				<ExitingPersistence>
					<Motion
						enteringAnimation={ENTERING_ANIMATION}
						exitingAnimation={EXITING_ANIMATION}
						testId="target"
					>
						<div />
					</Motion>
				</ExitingPersistence>,
			);

			rerender(<ExitingPersistence>{false}</ExitingPersistence>);

			expect(screen.getByTestId('target')).toHaveCompiledCss('animation-play-state', 'running');
		});
	});

	describe('reanimating', () => {
		describe('Reanimate.enter', () => {
			it('should animate in', async () => {
				const ref = React.createRef<any>();

				renderWithMotionStyles(
					<ExitingPersistence>
						<Motion
							ref={ref}
							enteringAnimation={ENTERING_ANIMATION}
							exitingAnimation={EXITING_ANIMATION}
							testId="target"
						>
							<div />
						</Motion>
					</ExitingPersistence>
				);

				expect(screen.getByTestId('target')).not.toHaveCompiledCss('animation-play-state', 'running');

				act(() => {
					ref.current?.reanimate(Reanimate.enter);
				});

				await waitFor(() => {
					expect(screen.getByTestId('target').style.animation).toContain('backwards');
				});
			});

			it('should animate in when appear is true', async () => {
				const ref = React.createRef<any>();

				renderWithMotionStyles(
					<ExitingPersistence appear>
						<Motion
							ref={ref}
							enteringAnimation={ENTERING_ANIMATION}
							exitingAnimation={EXITING_ANIMATION}
							testId="target"
						>
							<div />
						</Motion>
					</ExitingPersistence>
				);

				expect(screen.getByTestId('target')).toHaveCompiledCss('animation-play-state', 'running');

				act(() => {
					jest.advanceTimersByTime(MOTION_DURATION);
				});

				expect(screen.getByTestId('target')).not.toHaveCompiledCss('animation-play-state', 'running');

				act(() => {
					ref.current?.reanimate(Reanimate.enter);
				});

				await waitFor(() => {
					expect(screen.getByTestId('target').style.animation).toContain('backwards');
				});
			});
		});
		describe('Reanimate.exit_then_enter', () => {
			it('should animate out then in', async () => {
				const ref = React.createRef<any>();

				renderWithMotionStyles(
					<ExitingPersistence>
						<Motion
							ref={ref}
							enteringAnimation={ENTERING_ANIMATION}
							exitingAnimation={EXITING_ANIMATION}
							testId="target"
						>
							<div />
						</Motion>
					</ExitingPersistence>
				);

				expect(screen.getByTestId('target')).not.toHaveCompiledCss('animation-play-state', 'running');

				act(() => {
					ref.current?.reanimate(Reanimate.exit_then_enter);
				});

				expect(screen.getByTestId('target')).toHaveCompiledCss('animation-play-state', 'running');
				expect(screen.getByTestId('target')).toHaveStyle({animation:'var(--ds-test-exit) forwards'});


				act(() => {
					jest.advanceTimersByTime(MOTION_DURATION);
				});

				await waitFor(() => {
					expect(screen.getByTestId('target').style.animation).toContain('var(--ds-test-enter) backwards');
				});
			});
			it('should animate out then in when appear is true', async () => {
				const ref = React.createRef<any>();

				renderWithMotionStyles(
					<ExitingPersistence appear>
						<Motion
							ref={ref}
							enteringAnimation={ENTERING_ANIMATION}
							exitingAnimation={EXITING_ANIMATION}
							testId="target"
						>
							<div />
						</Motion>
					</ExitingPersistence>
				);

				expect(screen.getByTestId('target')).toHaveCompiledCss('animation-play-state', 'running');

				act(() => {
					jest.advanceTimersByTime(MOTION_DURATION);
				});

				expect(screen.getByTestId('target')).not.toHaveCompiledCss('animation-play-state', 'running');

				act(() => {
					ref.current?.reanimate(Reanimate.exit_then_enter);
				});

				expect(screen.getByTestId('target')).toHaveCompiledCss('animation-play-state', 'running');
				expect(screen.getByTestId('target')).toHaveStyle({animation:'var(--ds-test-exit) forwards'});


				act(() => {
					jest.advanceTimersByTime(MOTION_DURATION);
				});

				await waitFor(() => {
					expect(screen.getByTestId('target').style.animation).toContain('var(--ds-test-enter) backwards');
				});
			});
		});

	});

	it('should call onFinish correctly if reduced motion is preferred', () => {
		jest.useRealTimers();
		
		(isReducedMotion as jest.Mock).mockReturnValue(true);

		const onFinish = jest.fn();

		const { rerender } = renderWithMotionStyles(
			<ExitingPersistence appear>
				<Motion
					enteringAnimation={ENTERING_ANIMATION}
					exitingAnimation={EXITING_ANIMATION}
					onFinish={onFinish}
				>
					<div />
				</Motion>
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

	it('should handle rapid state transitions without double-firing callbacks', () => {
		const onFinish = jest.fn();
		const ref = React.createRef<any>();

		renderWithMotionStyles(
			<ExitingPersistence appear>
				<Motion
					ref={ref}
					enteringAnimation={ENTERING_ANIMATION}
					exitingAnimation={EXITING_ANIMATION}
					onFinish={onFinish}
				>
					<div />
				</Motion>
			</ExitingPersistence>,
		);

		expect(onFinish).not.toHaveBeenCalled();

		// Advance time partially through the entering animation
		act(() => {
			jest.advanceTimersByTime(MOTION_DURATION / 2);
		});

		// Still entering, should not have called onFinish yet
		expect(onFinish).not.toHaveBeenCalled();

		// Rapidly trigger exit-then-enter before entering completes
		act(() => {
			ref.current?.reanimate(Reanimate.exit_then_enter);
		});

		// Advance time partially through the exiting animation
		act(() => {
			jest.advanceTimersByTime(MOTION_DURATION / 2);
		});

		// Should not have called onFinish yet
		expect(onFinish).not.toHaveBeenCalled();

		// Rapidly trigger enter again before exiting completes
		act(() => {
			ref.current?.reanimate(Reanimate.enter);
		});

		// Advance time partially again
		act(() => {
			jest.advanceTimersByTime(MOTION_DURATION / 2);
		});

		// Still should not have fired - previous timeouts should have been cancelled
		expect(onFinish).not.toHaveBeenCalled();

		// Now complete the final entering animation
		act(() => {
			jest.advanceTimersByTime(MOTION_DURATION);
		});

		// Should have called onFinish exactly once for the final entering state
		expect(onFinish).toHaveBeenCalledTimes(1);
		expect(onFinish).toHaveBeenCalledWith('entering');
	});
});
