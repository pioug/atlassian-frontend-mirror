import { type ThemeAppearance } from '@atlaskit/lozenge';

import { type TagColor } from '../../../types';

/**
 * Maps Tag color values to Lozenge appearance values.
 * Used for migration_fallback rendering when feature flag is off.
 */
const colorToLozengeAppearanceMap: Record<string, ThemeAppearance> = {
	gray: 'default',
	grey: 'default',
	lime: 'success',
	green: 'success',
	blue: 'inprogress',
	red: 'removed',
	purple: 'new',
	yellow: 'moved',
	orange: 'moved',
	magenta: 'new',
	teal: 'inprogress',
	grayLight: 'default',
	greyLight: 'default',
	limeLight: 'success',
	greenLight: 'success',
	blueLight: 'inprogress',
	redLight: 'removed',
	purpleLight: 'new',
	yellowLight: 'moved',
	orangeLight: 'moved',
	magentaLight: 'new',
	tealLight: 'inprogress',
};

/**
 * Gets the Lozenge appearance for a given Tag color.
 */
export function getLozengeAppearance(color: TagColor | undefined): ThemeAppearance {
	return colorToLozengeAppearanceMap[color || 'gray'] || 'default';
}
