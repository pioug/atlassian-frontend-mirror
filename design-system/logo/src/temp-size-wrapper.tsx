import React from 'react';

import { type LogoProps } from './types';
import { type AppIconProps, type AppLogoProps } from './utils/types';

/**
 * Creates a wrapper around the new logo or icon component to ensure it receives the correct default (medium) size prop.
 *
 * @param NewComponent - The new logo or icon component.
 */
export const tempSizeWrapper: (
	NewComponent: React.ComponentType<AppLogoProps> | React.ComponentType<AppIconProps>,
) => ({ size, ...props }: LogoProps) => React.JSX.Element = (
	NewComponent: React.ComponentType<AppLogoProps> | React.ComponentType<AppIconProps>,
) => {
	return ({ size, ...props }: LogoProps): React.JSX.Element => {
		return <NewComponent size={size || 'medium'} {...props} />;
	};
};
