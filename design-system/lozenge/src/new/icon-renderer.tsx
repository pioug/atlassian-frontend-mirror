import React from 'react';

import { token } from '@atlaskit/tokens';
import type { IconColor } from '@atlaskit/tokens/css-type-schema';

import { type ThemeAppearance } from '../lozenge';

import { type IconProp, type LozengeColor } from './types';

export interface IconRendererProps {
	/**
	 * The icon component to render
	 */
	icon: IconProp;
	/**
	 * The lozenge color to determine icon color
	 */
	color: LozengeColor;
	/**
	 * Test ID for the icon
	 */
	testId?: string;
	/**
	 * Size of the icon
	 */
	size?: 'small' | 'medium';
}

// Map lozenge colors to appropriate icon colors
const getIconColor = (color: LozengeColor | ThemeAppearance): IconColor => {
	// For semantic colors, use corresponding semantic icon colors
	switch (color) {
		case 'success':
			return token('color.icon.success');
		case 'warning':
			return token('color.icon.warning');
		case 'danger':
			return token('color.icon.danger');
		case 'information':
			return token('color.icon.information');
		case 'neutral':
			return token('color.icon.subtlest');
		case 'discovery':
			return token('color.icon.discovery');
		// For accent colors, use corresponding accent icon colors
		case 'accent-red':
			return token('color.icon.accent.red');
		case 'accent-orange':
			return token('color.icon.accent.orange');
		case 'accent-yellow':
			return token('color.icon.accent.yellow');
		case 'accent-lime':
			return token('color.icon.accent.lime');
		case 'accent-green':
			return token('color.icon.accent.green');
		case 'accent-teal':
			return token('color.icon.accent.teal');
		case 'accent-blue':
			return token('color.icon.accent.blue');
		case 'accent-purple':
			return token('color.icon.accent.purple');
		case 'accent-magenta':
			return token('color.icon.accent.magenta');
		case 'accent-gray':
			return token('color.icon.accent.gray');
		default:
			return token('color.icon.subtlest');
	}
};

/**
 * Icon renderer for lozenge components
 * Handles proper sizing and color theming for icons
 */
export const IconRenderer = ({ icon: Icon, color, testId, size }: IconRendererProps) => {
	const iconColor = getIconColor(color);

	return <Icon color={iconColor} label="" size={size} testId={testId} />;
};

export default IconRenderer;
