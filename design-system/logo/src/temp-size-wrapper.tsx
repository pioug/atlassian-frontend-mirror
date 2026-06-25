import React from 'react';

import { type LogoProps } from './types';
import { type AppIconProps, type AppLogoProps, type UtilityIconProps } from './utils/types';

type AnyLogoComponent =
	| React.ComponentType<AppLogoProps>
	| React.ComponentType<AppIconProps>
	| React.ComponentType<UtilityIconProps>;

/**
 * Creates a wrapper around the new logo or icon component to ensure it receives the correct default (medium) size prop.
 *
 * @param NewComponent - The new logo or icon component.
 */
export const tempSizeWrapper: (
	NewComponent: AnyLogoComponent,
) => ({ size, ...props }: LogoProps) => React.JSX.Element = (NewComponent: AnyLogoComponent) => {
	return ({ size, ...props }: LogoProps): React.JSX.Element => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const Component = NewComponent as React.ComponentType<any>;
		return <Component size={size || 'medium'} {...props} />;
	};
};
