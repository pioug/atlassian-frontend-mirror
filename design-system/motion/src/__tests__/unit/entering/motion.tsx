import React from 'react';

import { token } from '@atlaskit/tokens';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act, render, screen } from '@atlassian/testing-library';

import ExitingPersistence from '../../../entering/exiting-persistence';
import Motion, { Reanimate } from '../../../entering/motion';
import StaggeredEntrance from '../../../entering/staggered-entrance';
import { isReducedMotion } from '../../../index';
import { CustomMotionExample } from '../__fixtures__/custom-motion';

const MOTION_DURATION = 350;

jest.mock('@atlaskit/tokens', () => ({
	token: (path: string) => {
		if (path === 'motion.test.enter') {
			return 'var(--ds-test-enter)';
		}
		if (path === 'motion.test.exit') {
			return 'var(--ds-test-exit)';
		}
		if (path === 'motion.test.enter.delay') {
			return 'var(--ds-test-enter-delay)';
		}
		if (path === 'motion.test.exit.delay') {
			return 'var(--ds-test-exit-delay)';
		}
		return path;
	},
}));

jest.mock('../../../utils/is-reduced-motion');

const ENTERING_ANIMATION = token('motion.test.enter' as any);
const EXITING_ANIMATION = token('motion.test.exit' as any);
const ENTERING_DELAYED_ANIMATION = token('motion.test.enter.delay' as any);
const EXITING_DELAYED_ANIMATION = token('motion.test.exit.delay' as any);

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
  --ds-test-enter-delay: 350ms cubic-bezier(0.66, 0, 0.34, 1) 120ms FadeIn;
  --ds-test-exit-delay: 200ms cubic-bezier(0.66, 0, 0.34, 1) 80ms FadeOut;
}
`;

const TestMotionWrapper = ({ children }: { children: React.ReactNode }) => (
	<>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles */}
		<style>{TEST_MOTION_CSS}</style>
		{children}
	</>
);

const renderWithMotionStyles = (ui: React.ReactElement) =>
	render(ui, { wrapper: TestMotionWrapper });

beforeEach(() => {
	(isReducedMotion as jest.Mock).mockReturnValue(false);
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<Motion />', () => {
	beforeEach(() => {
		jest.useFakeTimers();

		const styleMock = new CSSStyleDeclaration();
		jest.spyOn(window, 'getComputedStyle').mockReturnValue(styleMock);
		jest.spyOn(styleMock, 'getPropertyValue').mockImplementation((name) => {
			if (name === '--ds-test-enter') {
				return '350ms cubic-bezier(0.66, 0, 0.34, 1) FadeIn';
			}
			if (name === '--ds-test-exit') {
				return '350ms cubic-bezier(0.66, 0, 0.34, 1) FadeOut';
			}
			if (name === '--ds-test-enter-delay') {
				return '350ms cubic-bezier(0.66, 0, 0.34, 1) 120ms FadeIn';
			}
			if (name === '--ds-test-exit-delay') {
				return '200ms cubic-bezier(0.66, 0, 0.34, 1) 80ms FadeOut';
			}
			return '';
		});
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
			</Motion>,
		);

		expect(screen.getByTestId('target')).toHaveCompiledCss('animation', 'none', {
			media: '(prefers-reduced-motion: reduce)',
		});
	});

	describe('entering', () => {
		describe('token motion', () => {
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

				expect(screen.getByTestId('target').style.animation).toContain('var(--ds-test-enter)');
				expect(screen.getByTestId('target')).toHaveCompiledCss('animation-fill-mode', 'backwards');
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

			it('should call onFinish for entering only after token duration and delay', () => {
				const callback = jest.fn();
				renderWithMotionStyles(
					<Motion
						enteringAnimation={ENTERING_DELAYED_ANIMATION}
						exitingAnimation={EXITING_ANIMATION}
						onFinish={callback}
						testId="target"
					>
						<div />
					</Motion>,
				);

				act(() => {
					jest.advanceTimersByTime(469);
				});
				expect(callback).not.toHaveBeenCalled();

				act(() => {
					jest.advanceTimersByTime(1);
				});
				expect(callback).toHaveBeenCalledWith('entering');
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
							testId="target2"
						>
							<div />
						</Motion>
					</StaggeredEntrance>,
				);

				expect(screen.getByTestId('target2')).toHaveCompiledCss('visibility', 'hidden');

				// Step is actually logarithmic so we add a little on to make sure it hits the timeout.
				act(() => {
					jest.advanceTimersByTime(step + 2);
				});

				expect(screen.getByTestId('target2')).not.toHaveCompiledCss('visibility', 'hidden');

				expect(callback).not.toHaveBeenCalled();

				// Advance by the motion duration
				act(() => {
					jest.advanceTimersByTime(MOTION_DURATION);
				});

				expect(callback).toHaveBeenCalledWith('entering');
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

				expect(screen.getByTestId('target')).not.toHaveCompiledCss(
					'animation-play-state',
					'running',
				);
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

		describe('custom motion', () => {
			beforeEach(() => {
				const styleMock = new CSSStyleDeclaration();
				jest.spyOn(window, 'getComputedStyle').mockReturnValue(styleMock);
				jest.spyOn(styleMock, 'getPropertyValue').mockImplementation((name) => {
					if (name === 'animation-duration') {
						return '0.25s';
					}
					if (name === 'animation-delay') {
						return '0.2s';
					}
					return '';
				});
			});

			it('should set entering animationDuration and animationDelay from custom motion', () => {
				renderWithMotionStyles(
					<CustomMotionExample testId="target">
						<div />
					</CustomMotionExample>,
				);

				expect(screen.getByTestId('target')).toHaveCompiledCss(
					'animation-duration',
					'var(--ds-duration-long,.25s)',
				);
				expect(screen.getByTestId('target')).toHaveCompiledCss(
					'animation-delay',
					'var(--ds-duration-medium,.2s)',
				);
			});

			it('should call onFinish for entering only after token duration and delay', () => {
				const callback = jest.fn();
				renderWithMotionStyles(
					<CustomMotionExample onFinish={callback} testId="target">
						<div />
					</CustomMotionExample>,
				);

				act(() => {
					jest.advanceTimersByTime(449);
				});
				expect(callback).not.toHaveBeenCalled();

				act(() => {
					jest.advanceTimersByTime(1);
				});
				expect(callback).toHaveBeenCalledWith('entering');
			});
		});
	});

	describe('exiting', () => {
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

			expect(screen.getByTestId('target')).toHaveCompiledCss('animation-fill-mode', 'forwards');
		});

		describe('token motion', () => {
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

				//Expect no animation delay property to be set
				expect(screen.getByTestId('target')).toHaveStyle({ animationDelay: '' });
			});

			it('should call onFinish for exiting only after token duration and delay', () => {
				const callback = jest.fn();
				const { rerender } = renderWithMotionStyles(
					<ExitingPersistence>
						<Motion
							enteringAnimation={ENTERING_ANIMATION}
							exitingAnimation={EXITING_DELAYED_ANIMATION}
							onFinish={callback}
						>
							<div />
						</Motion>
					</ExitingPersistence>,
				);

				// Initial mount in non-appear mode triggers entering callback immediately.
				callback.mockClear();
				rerender(<ExitingPersistence>{false}</ExitingPersistence>);
				expect(callback).not.toHaveBeenCalled();

				act(() => {
					jest.advanceTimersByTime(279);
				});
				expect(callback).not.toHaveBeenCalled();

				act(() => {
					jest.advanceTimersByTime(1);
				});
				expect(callback).toHaveBeenCalledWith('exiting');
			});
		});

		describe('custom motion', () => {
			beforeEach(() => {
				const styleMock = new CSSStyleDeclaration();
				jest.spyOn(window, 'getComputedStyle').mockReturnValue(styleMock);
				jest.spyOn(styleMock, 'getPropertyValue').mockImplementation((name) => {
					if (name === 'animation-duration') {
						return '0.2s';
					}
					if (name === 'animation-delay') {
						return '0.15s';
					}
					return '';
				});
			});

			it('should set exiting animationDuration and animationDelay from custom motion', () => {
				const { rerender } = renderWithMotionStyles(
					<ExitingPersistence>
						<CustomMotionExample testId="target">
							<div />
						</CustomMotionExample>
					</ExitingPersistence>,
				);

				rerender(<ExitingPersistence>{false}</ExitingPersistence>);

				expect(screen.getByTestId('target')).toHaveCompiledCss(
					'animation-duration',
					'var(--ds-duration-medium,.2s)',
				);
				expect(screen.getByTestId('target')).toHaveCompiledCss(
					'animation-delay',
					'var(--ds-duration-short,.15s)',
				);
			});

			it('should call onFinish for exiting only after custom duration and delay', () => {
				const callback = jest.fn();
				const { rerender } = renderWithMotionStyles(
					<ExitingPersistence>
						<CustomMotionExample onFinish={callback}>
							<div />
						</CustomMotionExample>
					</ExitingPersistence>,
				);

				// Initial mount in non-appear mode triggers entering callback immediately.
				callback.mockClear();
				rerender(<ExitingPersistence>{false}</ExitingPersistence>);

				act(() => {
					jest.advanceTimersByTime(349);
				});
				expect(callback).not.toHaveBeenCalled();

				act(() => {
					jest.advanceTimersByTime(1);
				});
				expect(callback).toHaveBeenCalledWith('exiting');
			});
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
					</ExitingPersistence>,
				);

				expect(screen.getByTestId('target')).not.toHaveCompiledCss(
					'animation-play-state',
					'running',
				);

				act(() => {
					ref.current?.reanimate(Reanimate.enter);
				});

				expect(screen.getByTestId('target').style.animation).toContain('var(--ds-test-enter)');
				expect(screen.getByTestId('target')).toHaveCompiledCss('animation-fill-mode', 'backwards');
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
					</ExitingPersistence>,
				);

				expect(screen.getByTestId('target')).toHaveCompiledCss('animation-play-state', 'running');

				act(() => {
					jest.advanceTimersByTime(MOTION_DURATION);
				});

				expect(screen.getByTestId('target')).not.toHaveCompiledCss(
					'animation-play-state',
					'running',
				);

				act(() => {
					ref.current?.reanimate(Reanimate.enter);
				});

				expect(screen.getByTestId('target')).toHaveCompiledCss('animation-fill-mode', 'backwards');
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
					</ExitingPersistence>,
				);

				expect(screen.getByTestId('target')).not.toHaveCompiledCss(
					'animation-play-state',
					'running',
				);

				act(() => {
					ref.current?.reanimate(Reanimate.exit_then_enter);
				});
				expect(screen.getByTestId('target')).toHaveCompiledCss('animation-play-state', 'running');

				expect(screen.getByTestId('target')).toHaveCompiledCss('animation-fill-mode', 'forwards');

				act(() => {
					jest.advanceTimersByTime(MOTION_DURATION);
				});

				expect(screen.getByTestId('target').style.animation).toContain('var(--ds-test-enter)');
				expect(screen.getByTestId('target')).toHaveCompiledCss('animation-fill-mode', 'backwards');
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
					</ExitingPersistence>,
				);

				expect(screen.getByTestId('target')).toHaveCompiledCss('animation-play-state', 'running');

				act(() => {
					jest.advanceTimersByTime(MOTION_DURATION);
				});

				expect(screen.getByTestId('target')).not.toHaveCompiledCss(
					'animation-play-state',
					'running',
				);

				act(() => {
					ref.current?.reanimate(Reanimate.exit_then_enter);
				});

				expect(screen.getByTestId('target')).toHaveCompiledCss('animation-play-state', 'running');
				expect(screen.getByTestId('target')).toHaveCompiledCss('animation-fill-mode', 'forwards');
				expect(screen.getByTestId('target').style.animation).toContain('var(--ds-test-exit)');

				act(() => {
					jest.advanceTimersByTime(MOTION_DURATION);
				});

				expect(screen.getByTestId('target').style.animation).toContain('var(--ds-test-enter)');
				expect(screen.getByTestId('target')).toHaveCompiledCss('animation-fill-mode', 'backwards');
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

	describe('platform-dst-use-motion feature gate', () => {
		it('should render a single wrapper div and animate when the gate is on', () => {
			passGate('platform-dst-use-motion');

			renderWithMotionStyles(
				<Motion
					enteringAnimation={ENTERING_ANIMATION}
					exitingAnimation={EXITING_ANIMATION}
					testId="target"
				>
					<div data-testid="child" />
				</Motion>,
			);

			const target = screen.getByTestId('target');
			expect(target.tagName).toBe('DIV');
			// Token animations are applied via the inline style.
			expect(target.style.animation).toContain('var(--ds-test-enter)');
			// Child is rendered directly inside the single wrapper.
			expect(target).toContainElement(screen.getByTestId('child'));
		});

		it('should call onFinish for entering and exiting when the gate is on', () => {
			passGate('platform-dst-use-motion');
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

			act(() => {
				jest.advanceTimersByTime(MOTION_DURATION);
			});

			expect(onFinish).toHaveBeenCalledTimes(1);
			expect(onFinish).toHaveBeenCalledWith('entering');
			onFinish.mockClear();

			rerender(<ExitingPersistence>{false}</ExitingPersistence>);

			act(() => {
				jest.advanceTimersByTime(MOTION_DURATION);
			});

			expect(onFinish).toHaveBeenCalledTimes(1);
			expect(onFinish).toHaveBeenCalledWith('exiting');
		});

		it('should support reanimate via the imperative ref when the gate is on', () => {
			passGate('platform-dst-use-motion');
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

			act(() => {
				jest.advanceTimersByTime(MOTION_DURATION);
			});
			onFinish.mockClear();

			act(() => {
				ref.current?.reanimate(Reanimate.enter);
			});
			act(() => {
				jest.advanceTimersByTime(MOTION_DURATION);
			});

			expect(onFinish).toHaveBeenCalledWith('entering');
		});

		it('should use the legacy implementation when the gate is off', () => {
			failGate('platform-dst-use-motion');

			renderWithMotionStyles(
				<Motion
					enteringAnimation={ENTERING_ANIMATION}
					exitingAnimation={EXITING_ANIMATION}
					testId="target"
				>
					<div />
				</Motion>,
			);

			const target = screen.getByTestId('target');
			expect(target.tagName).toBe('DIV');
			expect(target.style.animation).toContain('var(--ds-test-enter)');
		});
	});
});
