import { fg } from '@atlaskit/platform-feature-flags';

import type { ThemeState } from './theme-state';

/**
 * Can't evaluate typography feature flags at the module level,
 * it will always resolve to false when server side rendered or when flags are loaded async.
 */
interface ThemeStateDefaults extends Omit<ThemeState, 'shape' | 'motion'> {
	shape: () => ThemeState['shape'];
	motion: () => ThemeState['motion'];
}

function getShapeDefault(): ThemeState['shape'] {
	if (fg('platform-dst-shape-theme-default')) {
		return 'shape';
	}
	return undefined;
}

function getMotionDefault(): ThemeState['motion'] {
	if (fg('platform-dst-motion-theme-default')) {
		return 'motion';
	}
	return undefined;
}

/**
 * themeStateDefaults: the default values for ThemeState used by theming utilities
 */
export const themeStateDefaults: ThemeStateDefaults = {
	colorMode: 'auto',
	contrastMode: 'auto',
	dark: 'dark',
	light: 'light',
	shape: getShapeDefault,
	spacing: 'spacing',
	typography: 'typography',
	motion: getMotionDefault,
	UNSAFE_themeOptions: undefined,
};
