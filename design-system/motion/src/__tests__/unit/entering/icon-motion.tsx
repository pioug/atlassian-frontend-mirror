import React from 'react';

import IconButton from '@atlaskit/button/icon/button';
import { token } from '@atlaskit/tokens';
import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import IconMotion, { type IconMotionHandle } from '../../../entering/icon-motion';
import { type Transition } from '../../../entering/types';
import { isReducedMotion } from '../../../utils/is-reduced-motion';

const MOTION_DURATION = 350;

jest.mock('@atlaskit/tokens', () => ({
	...jest.requireActual('@atlaskit/tokens'),
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

const ENTERING_ANIMATION = token('motion.test.enter' as any) as any;
const EXITING_ANIMATION = token('motion.test.exit' as any) as any;

const IconA = () => <span data-testid="icon-a" />;
const IconB = () => <span data-testid="icon-b" />;

/**
 * `IconMotion` applies motion to the element wrapping each icon, because `Icon` doesn't
 * forward a ref.
 */
const getSlot = (testId: string): HTMLElement => {
	// eslint-disable-next-line testing-library/no-node-access
	return screen.getByTestId(testId).parentElement!;
};

// eslint-disable-next-line testing-library/no-node-access
const getSlotOf = (icon: HTMLElement): HTMLElement => icon.parentElement!;

const getAnimationStyleOf = (icon: HTMLElement): string =>
	getSlotOf(icon).getAttribute('style') ?? '';

const getAnimationStyle = (testId: string): string => getSlot(testId).getAttribute('style') ?? '';

describe('IconMotion', () => {
	beforeEach(() => {
		(isReducedMotion as jest.Mock).mockReturnValue(false);
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
		jest.restoreAllMocks();
	});

	const renderIcon = (
		icon: React.ReactElement,
		props: Partial<React.ComponentProps<typeof IconMotion>> = {},
	) => {
		return render(
			<IconMotion
				enteringAnimation={ENTERING_ANIMATION}
				exitingAnimation={EXITING_ANIMATION}
				testId="icon-motion"
				{...props}
			>
				{icon}
			</IconMotion>,
		);
	};

	it('does not animate the initial icon by default', () => {
		renderIcon(<IconA />);

		expect(screen.getByTestId('icon-motion')).toBeInTheDocument();
		expect(getAnimationStyle('icon-a')).not.toContain('--ds-test');
	});

	it('animates the initial icon in when shouldAppear is set', () => {
		renderIcon(<IconA />, { shouldAppear: true });

		expect(getAnimationStyle('icon-a')).toContain('var(--ds-test-enter)');
	});

	it('exits the previous icon and enters the new icon when the icon changes', () => {
		const { rerender } = renderIcon(<IconA />);

		rerender(
			<IconMotion
				enteringAnimation={ENTERING_ANIMATION}
				exitingAnimation={EXITING_ANIMATION}
				testId="icon-motion"
			>
				<IconB />
			</IconMotion>,
		);

		// The previous icon exits first
		expect(getAnimationStyle('icon-a')).toContain('var(--ds-test-exit)');
		expect(getSlot('icon-a')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.queryByTestId('icon-b')).not.toBeInTheDocument();

		act(() => {
			jest.advanceTimersByTime(MOTION_DURATION);
		});

		expect(getAnimationStyle('icon-b')).toContain('var(--ds-test-enter)');
		expect(getSlot('icon-b')).not.toHaveAttribute('aria-hidden');
	});

	it('removes the previous icon once its exit animation has finished', () => {
		const { rerender } = renderIcon(<IconA />);

		rerender(
			<IconMotion enteringAnimation={ENTERING_ANIMATION} exitingAnimation={EXITING_ANIMATION}>
				<IconB />
			</IconMotion>,
		);

		expect(screen.getByTestId('icon-a')).toBeInTheDocument();

		act(() => {
			jest.advanceTimersByTime(MOTION_DURATION);
		});

		expect(screen.queryByTestId('icon-a')).not.toBeInTheDocument();
		expect(screen.getByTestId('icon-b')).toBeInTheDocument();
	});

	it('mounts the new icon only after the previous icon has exited', () => {
		const { rerender } = renderIcon(<IconA />);

		rerender(
			<IconMotion enteringAnimation={ENTERING_ANIMATION} exitingAnimation={EXITING_ANIMATION}>
				<IconB />
			</IconMotion>,
		);

		expect(screen.getByTestId('icon-a')).toBeInTheDocument();
		expect(screen.queryByTestId('icon-b')).not.toBeInTheDocument();

		act(() => {
			jest.advanceTimersByTime(MOTION_DURATION);
		});

		expect(screen.queryByTestId('icon-a')).not.toBeInTheDocument();
		expect(screen.getByTestId('icon-b')).toBeInTheDocument();
	});

	describe('shouldExitThenEnter', () => {
		const renderSwap = (shouldExitThenEnter: boolean) => {
			const { rerender } = render(
				<IconMotion
					enteringAnimation={ENTERING_ANIMATION}
					exitingAnimation={EXITING_ANIMATION}
					shouldExitThenEnter={shouldExitThenEnter}
				>
					<IconA />
				</IconMotion>,
			);
			rerender(
				<IconMotion
					enteringAnimation={ENTERING_ANIMATION}
					exitingAnimation={EXITING_ANIMATION}
					shouldExitThenEnter={shouldExitThenEnter}
				>
					<IconB />
				</IconMotion>,
			);
		};

		it('waits for the old icon to exit when it is true', () => {
			renderSwap(true);

			expect(screen.getByTestId('icon-a')).toBeInTheDocument();
			expect(screen.queryByTestId('icon-b')).not.toBeInTheDocument();
		});

		it('enters the new icon while the old icon exits when it is false', () => {
			renderSwap(false);

			expect(getAnimationStyle('icon-a')).toContain('var(--ds-test-exit)');
			expect(getAnimationStyle('icon-b')).toContain('var(--ds-test-enter)');
		});

		it('places both icons in the same container so they can overlay', () => {
			renderSwap(false);

			// eslint-disable-next-line testing-library/no-node-access
			expect(getSlot('icon-a').parentElement).toBe(getSlot('icon-b').parentElement);
		});
	});

	describe('reanimate', () => {
		const setUpHandle = (props: Partial<React.ComponentProps<typeof IconMotion>> = {}) => {
			const ref = React.createRef<IconMotionHandle>();
			render(
				<IconMotion
					ref={ref}
					enteringAnimation={ENTERING_ANIMATION}
					exitingAnimation={EXITING_ANIMATION}
					{...props}
				>
					<IconA />
				</IconMotion>,
			);
			return ref;
		};

		it('exits the icon and then enters a fresh copy of it by default', () => {
			const ref = setUpHandle();
			expect(getAnimationStyle('icon-a')).not.toContain('--ds-test');

			act(() => ref.current?.reanimate());
			expect(screen.getAllByTestId('icon-a')).toHaveLength(1);
			expect(getAnimationStyle('icon-a')).toContain('var(--ds-test-exit)');

			act(() => {
				jest.advanceTimersByTime(MOTION_DURATION);
			});
			expect(screen.getAllByTestId('icon-a')).toHaveLength(1);
			expect(getAnimationStyle('icon-a')).toContain('var(--ds-test-enter)');
		});

		it('overlays the old and new copies when shouldExitThenEnter is false', () => {
			const ref = setUpHandle({ shouldExitThenEnter: false });

			act(() => ref.current?.reanimate());

			const copies = screen.getAllByTestId('icon-a');
			expect(copies).toHaveLength(2);
			expect(getAnimationStyleOf(copies[0])).toContain('var(--ds-test-exit)');
			expect(getAnimationStyleOf(copies[1])).toContain('var(--ds-test-enter)');
			// eslint-disable-next-line testing-library/no-node-access
			expect(getSlotOf(copies[0]).parentElement).toBe(getSlotOf(copies[1]).parentElement);
		});

		it('calls onFinish for the replayed exit and enter', () => {
			const onFinish = jest.fn();
			const ref = setUpHandle({ onFinish });
			onFinish.mockClear();

			act(() => ref.current?.reanimate());
			// The enter is only scheduled once the exit has finished and rendered
			act(() => {
				jest.advanceTimersByTime(MOTION_DURATION);
			});
			act(() => {
				jest.advanceTimersByTime(MOTION_DURATION);
			});

			expect(onFinish.mock.calls.map(([state]) => state)).toEqual(['exiting', 'entering']);
		});

		it('does nothing when there is no icon', () => {
			const ref = React.createRef<IconMotionHandle>();
			render(<IconMotion ref={ref}>{null}</IconMotion>);

			act(() => ref.current?.reanimate());

			expect(screen.queryByTestId('icon-a')).not.toBeInTheDocument();
		});

		it('does not apply animations when reduced motion is preferred', () => {
			(isReducedMotion as jest.Mock).mockReturnValue(true);
			const ref = setUpHandle();

			act(() => ref.current?.reanimate());

			expect(getAnimationStyle('icon-a')).not.toContain('--ds-test');
		});

		describe('when called more than once', () => {
			const advance = (ms: number) =>
				act(() => {
					jest.advanceTimersByTime(ms);
				});

			it('replays once when called twice in a row', () => {
				const onFinish = jest.fn();
				const ref = setUpHandle({ onFinish });
				onFinish.mockClear();

				act(() => {
					ref.current?.reanimate();
					ref.current?.reanimate();
				});
				advance(MOTION_DURATION);
				advance(MOTION_DURATION);

				expect(screen.getAllByTestId('icon-a')).toHaveLength(1);
				expect(getAnimationStyle('icon-a')).not.toContain('--ds-test');
				expect(onFinish.mock.calls.map(([state]) => state)).toEqual(['exiting', 'entering']);
			});

			it('does not stack copies when called again during the exit', () => {
				const ref = setUpHandle();

				act(() => ref.current?.reanimate());
				advance(MOTION_DURATION / 2);
				act(() => ref.current?.reanimate());
				expect(screen.getAllByTestId('icon-a')).toHaveLength(1);

				advance(MOTION_DURATION);
				advance(MOTION_DURATION);

				// An interrupted exit is dropped rather than finished, so the icon settles without an animation
				expect(screen.getAllByTestId('icon-a')).toHaveLength(1);
				expect(getAnimationStyle('icon-a')).not.toContain('--ds-test');
			});

			it('settles on a single copy when the copies overlay', () => {
				const ref = setUpHandle({ shouldExitThenEnter: false });

				act(() => {
					ref.current?.reanimate();
					ref.current?.reanimate();
				});
				advance(MOTION_DURATION);
				advance(MOTION_DURATION);

				expect(screen.getAllByTestId('icon-a')).toHaveLength(1);
				expect(getAnimationStyle('icon-a')).not.toContain('--ds-test');
			});
		});
	});

	describe('overshoot', () => {
		it('sets the slide overshoot on the element that wraps the icons', () => {
			render(
				<IconMotion testId="icon-motion" overshoot="var(--ds-space-075)">
					<IconA />
				</IconMotion>,
			);

			expect(
				screen.getByTestId('icon-motion').style.getPropertyValue('--ds-motion-slide-overshoot'),
			).toBe('var(--ds-space-075)');
		});

		it('does not set the slide overshoot when it is not passed', () => {
			render(
				<IconMotion testId="icon-motion">
					<IconA />
				</IconMotion>,
			);

			expect(
				screen.getByTestId('icon-motion').style.getPropertyValue('--ds-motion-slide-overshoot'),
			).toBe('');
		});
	});

	it('does not animate when the same icon re-renders', () => {
		const { rerender } = renderIcon(<IconA />);
		const slot = getSlot('icon-a');

		rerender(
			<IconMotion enteringAnimation={ENTERING_ANIMATION} exitingAnimation={EXITING_ANIMATION}>
				<IconA />
			</IconMotion>,
		);

		expect(getSlot('icon-a')).toBe(slot);
		expect(getAnimationStyle('icon-a')).not.toContain('--ds-test');
	});

	it('animates when the same icon type is given a different key', () => {
		const { rerender } = renderIcon(<IconA key="one" />);

		rerender(
			<IconMotion enteringAnimation={ENTERING_ANIMATION} exitingAnimation={EXITING_ANIMATION}>
				<IconA key="two" />
			</IconMotion>,
		);

		// The outgoing icon is still exiting, and the incoming icon of the same type waits for it
		expect(screen.getAllByTestId('icon-a')).toHaveLength(1);
		expect(getAnimationStyle('icon-a')).toContain('var(--ds-test-exit)');

		act(() => {
			jest.advanceTimersByTime(MOTION_DURATION);
		});

		expect(screen.getAllByTestId('icon-a')).toHaveLength(1);
		expect(getAnimationStyle('icon-a')).toContain('var(--ds-test-enter)');
	});

	it('calls onFinish for the exiting and entering icons', () => {
		const onFinish = jest.fn<void, [Transition]>();
		const { rerender } = renderIcon(<IconA />, { onFinish });
		onFinish.mockClear();

		rerender(
			<IconMotion
				enteringAnimation={ENTERING_ANIMATION}
				exitingAnimation={EXITING_ANIMATION}
				onFinish={onFinish}
			>
				<IconB />
			</IconMotion>,
		);

		act(() => {
			jest.advanceTimersByTime(MOTION_DURATION);
		});

		act(() => {
			jest.advanceTimersByTime(MOTION_DURATION);
		});

		expect(onFinish).toHaveBeenCalledWith('exiting');
		expect(onFinish).toHaveBeenCalledWith('entering');
	});

	it('does not apply animations when reduced motion is preferred', () => {
		(isReducedMotion as jest.Mock).mockReturnValue(true);
		const { rerender } = renderIcon(<IconA />);

		rerender(
			<IconMotion enteringAnimation={ENTERING_ANIMATION} exitingAnimation={EXITING_ANIMATION}>
				<IconB />
			</IconMotion>,
		);

		// With reduced motion the outgoing icon is released immediately
		expect(screen.queryByTestId('icon-a')).not.toBeInTheDocument();
		expect(getAnimationStyle('icon-b')).not.toContain('--ds-test');
	});

	describe('interaction motion', () => {
		type EffectProps = Pick<
			React.ComponentProps<typeof IconMotion>,
			'interactionMotion' | 'isInteractionActive' | 'enteringAnimation' | 'exitingAnimation'
		>;

		const renderEffect = ({
			interactionMotion,
			isInteractionActive,
			enteringAnimation,
			exitingAnimation,
		}: EffectProps) =>
			render(
				<IconMotion
					testId="icon-motion"
					interactionMotion={interactionMotion}
					isInteractionActive={isInteractionActive}
					enteringAnimation={enteringAnimation}
					exitingAnimation={exitingAnimation}
				>
					<IconA />
				</IconMotion>,
			);

		// jsdom can't compute `transform`, so a pose is detected by the element's classes changing
		const getClassName = (): string => screen.getByTestId('icon-motion').className;

		const getClassNameFor = (props: EffectProps): string => {
			const { unmount } = renderEffect(props);
			const className = getClassName();
			unmount();
			return className;
		};

		it('styles the icon only when interaction motion is set', () => {
			expect(getClassNameFor({ interactionMotion: 'rotate' })).not.toBe(getClassNameFor({}));
		});

		it('holds the pose while isInteractionActive and releases it when it is not', () => {
			const held = getClassNameFor({ interactionMotion: 'rotate', isInteractionActive: true });

			expect(getClassNameFor({ interactionMotion: 'rotate', isInteractionActive: false })).not.toBe(
				held,
			);
			expect(getClassNameFor({ interactionMotion: 'rotate' })).toBe(
				getClassNameFor({ interactionMotion: 'rotate', isInteractionActive: false }),
			);
		});

		it('ignores isInteractionActive without interaction motion', () => {
			expect(getClassNameFor({ isInteractionActive: true })).toBe(getClassNameFor({}));
		});

		it('still swaps icons while interaction motion is set', () => {
			const { rerender } = renderEffect({
				interactionMotion: 'rotate',
				enteringAnimation: ENTERING_ANIMATION,
				exitingAnimation: EXITING_ANIMATION,
			});

			rerender(
				<IconMotion
					testId="icon-motion"
					interactionMotion="rotate"
					enteringAnimation={ENTERING_ANIMATION}
					exitingAnimation={EXITING_ANIMATION}
				>
					<IconB />
				</IconMotion>,
			);

			expect(getAnimationStyle('icon-a')).toContain('var(--ds-test-exit)');

			act(() => {
				jest.advanceTimersByTime(MOTION_DURATION);
			});

			expect(getAnimationStyle('icon-b')).toContain('var(--ds-test-enter)');
		});
	});

	describe('without an icon', () => {
		it('exits the icon when the children are removed and enters it when they return', () => {
			const { rerender } = renderIcon(<IconA />);

			rerender(
				<IconMotion
					enteringAnimation={ENTERING_ANIMATION}
					exitingAnimation={EXITING_ANIMATION}
					testId="icon-motion"
				>
					{null}
				</IconMotion>,
			);

			expect(getAnimationStyle('icon-a')).toContain('var(--ds-test-exit)');

			act(() => {
				jest.advanceTimersByTime(MOTION_DURATION);
			});

			expect(screen.queryByTestId('icon-a')).not.toBeInTheDocument();

			rerender(
				<IconMotion
					enteringAnimation={ENTERING_ANIMATION}
					exitingAnimation={EXITING_ANIMATION}
					testId="icon-motion"
				>
					<IconB />
				</IconMotion>,
			);

			expect(getAnimationStyle('icon-b')).toContain('var(--ds-test-enter)');
		});
	});

	describe('inside an IconButton', () => {
		// `IconButton` calls a function passed as `icon` as a render function, so `IconMotion` is
		// returned from it and the icon element is its direct child.
		const ButtonWithIcon = ({ isExpanded }: { isExpanded: boolean }) => (
			<IconButton
				label={isExpanded ? 'Collapse' : 'Expand'}
				icon={() => (
					<IconMotion enteringAnimation={ENTERING_ANIMATION} exitingAnimation={EXITING_ANIMATION}>
						{isExpanded ? <IconB /> : <IconA />}
					</IconMotion>
				)}
			/>
		);

		it('animates the icon swap and keeps the button label', () => {
			const { rerender } = render(<ButtonWithIcon isExpanded={false} />);

			// The label is the button's visually hidden text. It is asserted by text because Compiled's
			// test-time <style> tags end up inside the button and pollute the computed accessible name.
			expect(screen.getByText('Expand')).toBeInTheDocument();
			expect(getAnimationStyle('icon-a')).not.toContain('--ds-test');

			rerender(<ButtonWithIcon isExpanded />);

			expect(screen.getByText('Collapse')).toBeInTheDocument();
			expect(getAnimationStyle('icon-a')).toContain('var(--ds-test-exit)');

			act(() => {
				jest.advanceTimersByTime(MOTION_DURATION);
			});

			expect(screen.queryByTestId('icon-a')).not.toBeInTheDocument();
			expect(getAnimationStyle('icon-b')).toContain('var(--ds-test-enter)');
		});
	});
});
