import React, { type ComponentClass, type FunctionComponent } from 'react';

import { type IconProps, type UNSAFE_NewIconProps } from '@atlaskit/icon/types';

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
const IconRenderer = ({ icon: Icon }: { icon: IconProp }) => {
	return (
		<>
			{isIconRenderProp(Icon) ? (
				Icon({ label: '', color: 'currentColor' })
			) : (
				<Icon label="" color={'currentColor'} />
			)}
		</>
	);
};

export default IconRenderer;
