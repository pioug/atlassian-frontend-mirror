import React, { type ComponentClass, type FunctionComponent } from 'react';

import { type IconProps, type NewIconProps } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import { type IconProp, type Spacing } from '../types';

type IconRenderPropArg = (IconProps | NewIconProps) & {
	motionOvershoot?: string;
};

function isIconRenderProp(
	func:
		| FunctionComponent<IconProps | NewIconProps>
		| ComponentClass<IconProps | NewIconProps>
		| ((iconProp: IconRenderPropArg) => IconProp),
): func is (iconProp: IconRenderPropArg) => IconProp {
	return (
		!(func as any).displayName && // most function components and class components have a displayName, negate them
		!(func as any).render && // forwardRef doesn't require a display name, however it does include a render function, negate them
		typeof func === 'function' // at the very least we need to be a function
	);
}

/**
 * How far an icon can move past its box before it reaches the border of the button, which is the
 * space around the icon in the button minus the width of the border, so that the icon doesn't go
 * over the border. Passed to icon render props so that, for example, `IconMotion` can use it as its
 * `overshoot`. These are worked out once here, as every icon in every button goes through this file.
 */
const OVERSHOOT_DEFAULT = `calc(${token('space.100')} - ${token('border.width')})`;
const OVERSHOOT_COMPACT = `calc(${token('space.050')} - ${token('border.width')})`;

const getOvershoot = (spacing?: Spacing) =>
	spacing === 'compact' ? OVERSHOOT_COMPACT : OVERSHOOT_DEFAULT;

/**
 * __Icon renderer__
 *
 * Used to support render props with icons.
 *
 */
const IconRenderer = ({
	icon: Icon,
	spacing,
}: {
	icon: IconProp;
	spacing?: Spacing;
}): React.JSX.Element => {
	// React Compiler opt-out: RC-incompatible (memoization breaks runtime behaviour).
	'use no memo';

	const isRenderProp = isIconRenderProp(Icon);
	let iconProps: IconProps | NewIconProps = {
		label: '',
		color: 'currentColor',
		size: fg('platform_dst_button_chevron_sizing')
			? (iconName) => (iconName.startsWith('Chevron') ? 'small' : 'medium')
			: undefined,
	};

	// Only a render prop can use `motionOvershoot`, so an icon component doesn't get it
	const icon = isRenderProp ? (
		Icon({ ...iconProps, motionOvershoot: getOvershoot(spacing) })
	) : (
		<Icon {...iconProps} />
	);

	// @ts-expect-error -- The render-prop guard returns IconProp (a component type), which is not a ReactNode.
	return <>{icon}</>;
};

export default IconRenderer;
