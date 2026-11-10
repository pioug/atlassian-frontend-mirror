/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import IconMotionBase, { type IconMotionHandle, type IconMotionProps } from './icon-motion-base';

export interface IconMotionRotateProps extends IconMotionProps {
	/**
	 * Holds the rotated pose (90°) when `true` and eases back to neutral when `false`. You decide when,
	 * from any state, such as the hover, press or focus state of a button around the icon.
	 */
	isActive?: boolean;
}

/**
 * The pose held by `IconMotion.Rotate`. `baseRotate` defines the transition back to neutral, and
 * `rotate` is the pose held while `isActive`. Under reduced motion the pose still changes, but
 * without a transition.
 */
const rotatePoses = cssMap({
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

/**
 * __IconMotion.Rotate__
 *
 * `IconMotion` that also rotates the icon 90° while `isActive`, and eases it back when it is not.
 * It takes every `IconMotion` prop, and still animates icons that are swapped.
 */
const IconMotionRotate: ForwardRefExoticComponent<
	IconMotionRotateProps & RefAttributes<IconMotionHandle>
> = forwardRef<IconMotionHandle, IconMotionRotateProps>(function IconMotionRotate(
	{ isActive, ...props },
	ref,
) {
	return (
		<IconMotionBase
			{...props}
			xcss={cx(rotatePoses.baseRotate, isActive && rotatePoses.rotate)}
			ref={ref}
		/>
	);
});

export default IconMotionRotate;
