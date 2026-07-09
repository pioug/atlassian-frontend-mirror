import React from 'react';

import { token } from '@atlaskit/tokens';
import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import ExitingPersistence from '../../../entering/exiting-persistence';
import StaggeredEntrance from '../../../entering/staggered-entrance';
import { type Transition } from '../../../entering/types';
import { useMotion, type UseMotionProps } from '../../../entering/use-motion';
import { isReducedMotion } from '../../../index';

const MOTION_DURATION = 350;

jest.mock('@atlaskit/tokens', () => ({
	token: (path: string) => {
		if (path === 'motion.test.enter') {
			return 'var(--ds-test-enter)';
		}
		if (path === 'motion.test.exit') {
			return 'var(--ds-test-exit)';
		}
		return path;
	},
}));

jest.mock('../../../utils/is-reduced-motion');

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

const renderWithMotionStyles = (ui: React.ReactElement) =>
	render(ui, { wrapper: TestMotionWrapper });

/**
 * Derives inline animation styles from the motion `state` returned by `useMotion`.
 *
 * The hook no longer owns element styling - it exposes the current `state` and the
 * consumer decides how to render each state. These tests apply the animation via inline
 * `style` (keyed off `state`) so the assertions can inspect the resulting styles.
 */
const getStyleForState = (
	state: ReturnType<typeof useMotion>['state'],
	{
		enteringAnimation,
		exitingAnimation,
	}: { enteringAnimation?: string; exitingAnimation?: string },
): React.CSSProperties | undefined => {
	if (isReducedMotion()) {
		return undefined;
	}
	if (state === 'init') {
		return { visibility: 'hidden' };
	}
	if (state === 'entering' && enteringAnimation) {
		return { animation: `${enteringAnimation} backwards` };
	}
	if (state === 'exiting' && exitingAnimation) {
		return { animation: `${exitingAnimation} forwards` };
	}
	return undefined;
};

/**
 * A consumer of `useMotion` that spreads the result directly onto a `<section>`,
 * demonstrating that motion can be applied without an extra wrapper element.
 */
const MotionSection = ({
	testId = 'target',
	enteringAnimation,
	exitingAnimation,
	...props
}: UseMotionProps & {
	testId?: string;
	enteringAnimation?: string;
	exitingAnimation?: string;
}) => {
	// The hook returns the current motion `state`; the consumer maps that to styling.
	const { state, ref } = useMotion<HTMLElement>(props);
	return (
		<section
			data-testid={testId}
			ref={ref}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={getStyleForState(state, { enteringAnimation, exitingAnimation })}
		/>
	);
};

beforeEach(() => {
	(isReducedMotion as jest.Mock).mockReturnValue(false);
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('useMotion()', () => {
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
			return '';
		});
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should render motion onto the host element without an extra wrapper', () => {
		renderWithMotionStyles(
			<MotionSection enteringAnimation={ENTERING_ANIMATION} exitingAnimation={EXITING_ANIMATION} />,
		);

		const section = screen.getByTestId('target');
		// The element the hook is spread onto stays a `<section>` - the hook does not
		// introduce its own wrapper element (unlike the `Motion` component's `<div>`).
		expect(section.tagName).toBe('SECTION');
		// No descendant wrapper elements were added.
		// eslint-disable-next-line testing-library/no-node-access
		expect(section.children).toHaveLength(0);
	});

	it('should apply the entering animation to the host element', () => {
		renderWithMotionStyles(
			<MotionSection enteringAnimation={ENTERING_ANIMATION} exitingAnimation={EXITING_ANIMATION} />,
		);

		const section = screen.getByTestId('target');
		// Token animations are applied via the inline style returned by the hook.
		expect(section.getAttribute('style') ?? '').toContain('var(--ds-test-enter)');
	});

	it('lets the consumer apply their own style alongside the animation style', () => {
		// The hook owns only the motion `state` - consumers own their element's styling
		// and merge the state-derived animation style with their own.
		const ConsumerStyledSection = () => {
			const { state, ref } = useMotion<HTMLElement>();
			const consumerStyle: React.CSSProperties = {
				color: 'red',
				...getStyleForState(state, {
					enteringAnimation: ENTERING_ANIMATION,
					exitingAnimation: EXITING_ANIMATION,
				}),
			};
			return (
				<section
					data-testid="target"
					ref={ref}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					style={consumerStyle}
				/>
			);
		};

		renderWithMotionStyles(<ConsumerStyledSection />);

		const inlineStyle = screen.getByTestId('target').getAttribute('style') ?? '';
		expect(inlineStyle).toContain('color: red');
		expect(inlineStyle).toContain('var(--ds-test-enter)');
	});

	it('should not apply animation styles when reduced motion is preferred', () => {
		(isReducedMotion as jest.Mock).mockReturnValue(true);
		const onFinish = jest.fn<void, [Transition]>();

		renderWithMotionStyles(
			<ExitingPersistence appear>
				<MotionSection
					enteringAnimation={ENTERING_ANIMATION}
					exitingAnimation={EXITING_ANIMATION}
					onFinish={onFinish}
				/>
			</ExitingPersistence>,
		);

		// With reduced motion, onFinish is called immediately without waiting for a timer.
		expect(onFinish).toHaveBeenCalledWith('entering');
	});

	it('should call onFinish for entering and exiting via ExitingPersistence', () => {
		const onFinish = jest.fn<void, [Transition]>();

		const { rerender } = renderWithMotionStyles(
			<ExitingPersistence appear>
				<MotionSection
					enteringAnimation={ENTERING_ANIMATION}
					exitingAnimation={EXITING_ANIMATION}
					onFinish={onFinish}
				/>
			</ExitingPersistence>,
		);

		expect(onFinish).not.toHaveBeenCalled();

		act(() => {
			jest.advanceTimersByTime(MOTION_DURATION);
		});

		expect(onFinish).toHaveBeenCalledTimes(1);
		expect(onFinish).toHaveBeenCalledWith('entering');
		onFinish.mockClear();

		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		// Still mounted while exit animation plays.
		expect(screen.getByTestId('target')).toBeInTheDocument();
		expect(onFinish).not.toHaveBeenCalled();

		act(() => {
			jest.advanceTimersByTime(MOTION_DURATION);
		});

		expect(onFinish).toHaveBeenCalledTimes(1);
		expect(onFinish).toHaveBeenCalledWith('exiting');
	});

	it('should keep the element mounted until the exit animation finishes, then remove it', () => {
		const { rerender } = renderWithMotionStyles(
			<ExitingPersistence appear>
				<MotionSection
					enteringAnimation={ENTERING_ANIMATION}
					exitingAnimation={EXITING_ANIMATION}
				/>
			</ExitingPersistence>,
		);

		act(() => {
			jest.advanceTimersByTime(MOTION_DURATION);
		});

		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		// The exit animation is now playing - element persists.
		expect(screen.getByTestId('target')).toBeInTheDocument();

		act(() => {
			jest.advanceTimersByTime(MOTION_DURATION);
		});

		// Exit finished - ExitingPersistence removes the element.
		expect(screen.queryByTestId('target')).not.toBeInTheDocument();
	});

	it('should pick up a staggered delay from StaggeredEntrance', () => {
		const step = 50;
		const onFinish = jest.fn<void, [Transition]>();

		renderWithMotionStyles(
			<StaggeredEntrance delayStep={step} columns={1}>
				<MotionSection
					testId="first"
					enteringAnimation={ENTERING_ANIMATION}
					exitingAnimation={EXITING_ANIMATION}
				/>
				<MotionSection
					testId="second"
					enteringAnimation={ENTERING_ANIMATION}
					exitingAnimation={EXITING_ANIMATION}
					onFinish={onFinish}
				/>
			</StaggeredEntrance>,
		);

		// The second item is waiting for its stagger delay, so it is hidden and the
		// entering animation has not been applied yet.
		const secondInitialStyle = screen.getByTestId('second').getAttribute('style') ?? '';
		expect(secondInitialStyle).toContain('visibility: hidden');
		expect(secondInitialStyle).not.toContain('var(--ds-test-enter)');
		expect(onFinish).not.toHaveBeenCalled();

		// Advance past the stagger delay - the item is no longer hidden and the
		// animation is now applied.
		act(() => {
			jest.advanceTimersByTime(step + 2);
		});
		const secondEnteringStyle = screen.getByTestId('second').getAttribute('style') ?? '';
		expect(secondEnteringStyle).not.toContain('visibility: hidden');
		expect(secondEnteringStyle).toContain('var(--ds-test-enter)');
		expect(onFinish).not.toHaveBeenCalled();

		// Advance past the animation duration - entering finishes.
		act(() => {
			jest.advanceTimersByTime(MOTION_DURATION);
		});
		expect(onFinish).toHaveBeenCalledWith('entering');
	});
});
