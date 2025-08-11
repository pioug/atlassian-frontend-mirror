import React, { type ComponentClass, type FunctionComponent } from 'react';

import { type IconProps, type NewIconProps } from '@atlaskit/icon/types';

import { type IconProp } from '../types';

function isIconRenderProp(
	func:
		| FunctionComponent<IconProps | NewIconProps>
		| ComponentClass<IconProps | NewIconProps>
		| ((iconProp: IconProps | NewIconProps) => IconProp),
): func is (iconProp: IconProps | NewIconProps) => IconProp {
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
		// @ts-ignore - TS2322 TypeScript 5.9.2 upgrade
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
