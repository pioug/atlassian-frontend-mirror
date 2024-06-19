import React, { type ComponentClass, type FunctionComponent } from 'react';

import { type IconProps, type UNSAFE_NewIconProps } from '@atlaskit/icon/types';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { type IconProp } from '../types';

function isIconRenderProp(
	func:
		| FunctionComponent<IconProps | UNSAFE_NewIconProps>
		| ComponentClass<IconProps | UNSAFE_NewIconProps>
		| ((iconProp: IconProps | UNSAFE_NewIconProps) => IconProp),
): func is (iconProp: IconProps | UNSAFE_NewIconProps) => IconProp {
	return (
		!(func as any).displayName && // most function components and class components have a displayName, negate them
		!(func as any).render && // forwardRef doesn't require a display name, however it does include a render function, negate them
		typeof func === 'function' // at the very least we need to be a function
	);
}

/**
 * __Icon renderer__
 *
 * Used to support render props with icons.
 *
 */
const IconRenderer = ({
	icon: Icon,
	size,
}: {
	icon: IconProp;
	size: IconProps['size'] | UNSAFE_NewIconProps['LEGACY_size'];
}) => {
		return (
			<>
				{getBooleanFF('platform.design-system-team.button-render-prop-fix_lyo55') && isIconRenderProp(Icon) ? (
					Icon({ label: '', size: size, color: 'currentColor' })
				) : (
					<Icon label="" size={size} color={'currentColor'} />
				)}
			</>
		);
};

export default IconRenderer;
