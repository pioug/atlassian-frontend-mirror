/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type CSSProperties,
	forwardRef,
	type ForwardRefExoticComponent,
	type ReactElement,
	type RefAttributes,
	useImperativeHandle,
	useState,
} from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { type MotionIconography } from '@atlaskit/tokens/css-type-schema';

import { isReducedMotion } from '../utils/is-reduced-motion';
import ExitingPersistence from './exiting-persistence';
import { type Transition } from './types';
import { useMotion } from './use-motion';

const styles = cssMap({
	root: {
		display: 'inline-flex',
		// Clips the slide of the `cycle` motion tokens. The clip grows by `overshoot` on every side, which
		// is how far the icon travels past its own box, so the icon just clears the clip as it finishes.
		clipPath: 'inset(calc(var(--ds-motion-slide-overshoot, 0px) * -1))',
	},
	// Every icon is placed in the same grid cell, so that with `shouldExitThenEnter` off the exiting and
	// entering icons overlay each other instead of sitting side by side.
	container: {
		display: 'inline-grid',
	},
	slot: {
		display: 'inline-flex',
		gridArea: '1 / 1',
		willChange: 'opacity, transform',
	},
	// `init` and `hidden` are states where the element is mounted but should not be seen.
	// `useMotion` does not style them.
	hidden: {
		visibility: 'hidden',
	},
});

/**
 * The pose each `interactionMotion` holds. `baseRotate` defines the transition back to neutral, and
 * `rotate` is the pose held while `isInteractionActive`. Under reduced motion the pose still changes,
 * but without a transition.
 */
const poses = cssMap({
	baseRotate: {
		transitionTimingFunction: token('motion.easing.out.bold'),
		transitionDuration: token('motion.duration.long'),
		transitionProperty: 'transform',
		transform: 'rotate(0deg)',
		willChange: 'transform',
		'@media (prefers-reduced-motion: reduce)': { transitionDuration: '0s' },
	},
	rotate: {
		transform: 'rotate(90deg)',
	},
});

export type IconInteractionMotion = 'rotate';

export interface IconMotionProps {
	/**
	 * The icon to render. When the icon changes (a different icon component, or a different `key`),
	 * the previous icon plays `exitingAnimation`, then the new icon plays `enteringAnimation`.
	 *
	 * Passing nothing (`isOpen && <Icon />`) removes the icon, so it plays `exitingAnimation`, and
	 * passing an icon again plays `enteringAnimation`.
	 *
	 * Pass the icon element itself. A swap is detected from the element's type and `key`, so a
	 * wrapper component that renders different icons internally won't trigger an animation.
	 *
	 * Inside an `IconButton`, return `IconMotion` from the `icon` render function and spread the
	 * props the button passes onto the icon, so its colour and size still apply. The button also passes
	 * a `motionOvershoot` that matches its `spacing`, which is for `IconMotion` and not the icon:
	 * `icon={({ motionOvershoot, ...iconProps }) => <IconMotion overshoot={motionOvershoot}>{isOpen ? <UpIcon {...iconProps} /> : <DownIcon {...iconProps} />}</IconMotion>}`
	 */
	children: ReactElement | false | null | undefined;

	/**
	 * Motion token played by an icon as it appears.
	 */
	enteringAnimation?: MotionIconography;

	/**
	 * Motion token played by an icon as it disappears.
	 */
	exitingAnimation?: MotionIconography;

	/**
	 * When `true`, the initial icon plays `enteringAnimation` on first render.
	 * By default the initial icon is shown without animating.
	 */
	shouldAppear?: boolean;

	/**
	 * The motion the icon holds while `isInteractionActive` is `true`, which eases back to neutral
	 * when it is `false`. It does nothing on its own, so pass `isInteractionActive` to say when to
	 * play it.
	 */
	interactionMotion?: IconInteractionMotion;

	/**
	 * Holds the `interactionMotion` pose when `true` and eases back when `false`. You decide when,
	 * from any state, such as the hover, press or focus state of a button around the icon.
	 */
	isInteractionActive?: boolean;

	/**
	 * Called when an icon has finished entering or exiting.
	 */
	onFinish?: (state: Transition) => void;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;

	/**
	 * How far past its own box the icon travels, and how far the clip around the icon extends, as a
	 * CSS length. Use a space token, such as `token('space.100')`.
	 *
	 * This only applies to the `cycle` motion tokens (`motion.iconography.enter.cycle.*` and
	 * `motion.iconography.exit.cycle.*`), which slide the icon out of its box. Other motions ignore it.
	 * The icon is always clipped to its box, so `overshoot` is how far the clip is widened to match the
	 * space around the icon, such as the padding of the button it sits in.
	 */
	overshoot?: string;

	/**
	 * When `true`, the icon being replaced finishes exiting before the new icon enters. When `false`,
	 * the new icon enters while the old icon exits, with the two overlaid in the same spot.
	 */
	shouldExitThenEnter?: boolean;
}

/**
 * What `IconMotion` exposes through its `ref`.
 */
export interface IconMotionHandle {
	/**
	 * Plays the exit and enter animations of the current icon again, by swapping in a fresh copy of
	 * it. It follows `shouldExitThenEnter`: the icon exits and then enters again when it is `true`, and the
	 * two copies overlay when it is `false`. It does nothing visible when no icon is rendered.
	 */
	reanimate: () => void;
}

type IconSlotProps = Pick<
	IconMotionProps,
	'children' | 'enteringAnimation' | 'exitingAnimation' | 'onFinish'
>;

/**
 * Wraps a single icon and runs its enter or exit animation. `Icon` doesn't forward a ref, so the
 * motion is applied to this element instead.
 */
const IconSlot = ({
	children,
	enteringAnimation,
	exitingAnimation,
	onFinish,
}: IconSlotProps): JSX.Element => {
	const { ref, state } = useMotion<HTMLSpanElement>({ onFinish });

	// `useMotion` completes straight away under reduced motion, but it leaves the animation to us.
	let animation: MotionIconography | undefined;
	if (!isReducedMotion()) {
		if (state === 'entering') {
			animation = enteringAnimation;
		} else if (state === 'exiting') {
			animation = exitingAnimation;
		}
	}

	return (
		<span
			ref={ref}
			css={[styles.slot, (state === 'init' || state === 'hidden') && styles.hidden]}
			// The token must be inline: `useMotion` reads `style.animation` to time the exit.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={{ animation }}
			// An icon on its way out shouldn't be announced alongside its replacement.
			aria-hidden={state === 'exiting' ? true : undefined}
		>
			{children}
		</span>
	);
};

/**
 * __IconMotion__
 *
 * Animates an icon when it is swapped for a different one, using the `motion.iconography` tokens.
 * The icon being replaced plays `exitingAnimation`, and once it has finished the new icon plays
 * `enteringAnimation`.
 */
const IconMotion: ForwardRefExoticComponent<IconMotionProps & RefAttributes<IconMotionHandle>> =
	forwardRef<IconMotionHandle, IconMotionProps>(function IconMotion(
		{
			children,
			enteringAnimation,
			exitingAnimation,
			shouldAppear = false,
			interactionMotion,
			isInteractionActive,
			onFinish,
			testId,
			overshoot,
			shouldExitThenEnter = true,
		},
		ref,
	) {
		// Component functions can't be React keys, so a counter that increments whenever the icon
		// changes is used as the key instead. `ExitingPersistence` then sees the old key disappear
		// and the new key arrive. Updating state during render is React's recommended way to derive
		// state from props.
		const type = children ? children.type : undefined;
		const key = children ? children.key : undefined;
		const [tracked, setTracked] = useState({ type, key, count: 0 });
		let count = tracked.count;
		if (tracked.type !== type || tracked.key !== key) {
			count = tracked.count + 1;
			setTracked({ type, key, count });
		}

		useImperativeHandle(
			ref,
			() => ({
				// A new count is a new key, so the slot is swapped for a fresh copy of the same icon
				reanimate: () => setTracked((previous) => ({ ...previous, count: previous.count + 1 })),
			}),
			[],
		);

		return (
			<span
				css={[
					styles.root,
					interactionMotion === 'rotate' && poses.baseRotate,
					isInteractionActive && interactionMotion === 'rotate' && poses.rotate,
				]}
				// The keyframes of the `cycle` tokens and the clip in `styles.root` read this from here
				style={{ '--ds-motion-slide-overshoot': overshoot } as CSSProperties}
				data-testid={testId}
			>
				<span css={styles.container}>
					<ExitingPersistence appear={shouldAppear} exitThenEnter={shouldExitThenEnter}>
						{/* No slot is rendered without an icon, so that a later icon doesn't wait for an empty slot to exit */}
						{children && (
							<IconSlot
								key={count}
								enteringAnimation={enteringAnimation}
								exitingAnimation={exitingAnimation}
								onFinish={onFinish}
							>
								{children}
							</IconSlot>
						)}
					</ExitingPersistence>
				</span>
			</span>
		);
	});

export default IconMotion;
