import type { AllowList } from './types';

/**
 * By default these are allowed as keys in style objects.
 *
 * For objects like `media` any of their descendant properties will also be allowed.
 */
export const defaultAllowedDynamicKeys: AllowList = {
	'@atlaskit/primitives': ['media'],
	'@atlaskit/primitives/responsive': ['media'],
	'@atlaskit/tokens': ['CURRENT_SURFACE_CSS_VAR'],
	'@atlaskit/tokens/constants': ['CURRENT_SURFACE_CSS_VAR'],
};
