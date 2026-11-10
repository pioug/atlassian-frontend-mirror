import React, { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';

import IconMotionBase, { type IconMotionHandle, type IconMotionProps } from './icon-motion-base';
import IconMotionRotate from './icon-motion-rotate';

export type { IconMotionHandle, IconMotionProps } from './icon-motion-base';
export type { IconMotionRotateProps } from './icon-motion-rotate';

/**
 * The base is wrapped so that the `xcss` it takes for effects such as `IconMotion.Rotate` isn't part
 * of the public props.
 */
const IconMotionPublic: ForwardRefExoticComponent<
	IconMotionProps & RefAttributes<IconMotionHandle>
> = forwardRef<IconMotionHandle, IconMotionProps>(function IconMotion(props, ref) {
	return <IconMotionBase {...props} ref={ref} />;
});

/**
 * __IconMotion__
 *
 * Animates an icon when it is swapped for a different one, using the `motion.iconography` tokens.
 * Effects that respond to an interaction are available as properties, such as `IconMotion.Rotate`.
 */
const IconMotion: typeof IconMotionPublic & { Rotate: typeof IconMotionRotate } = Object.assign(
	IconMotionPublic,
	{ Rotate: IconMotionRotate },
);

export default IconMotion;
