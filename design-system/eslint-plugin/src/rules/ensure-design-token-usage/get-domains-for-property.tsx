import { isColorCssPropertyName } from '../utils/is-color-css-property-name';
import { isCurrentSurfaceCustomPropertyName } from '../utils/is-current-surface-custom-property-name';

import { isShapeProperty } from './is-shape-property';
import { isSpacingProperty } from './is-spacing-property';
import type { Domains } from './types';

/**
 * Returns an array of domains that are relevant to the provided property based on the rule options.
 * @param propertyName camelCase CSS property
 * @param targetOptions Array containing the types of properties that should be included in the rule.
 * @example
 * ```
 * propertyName: padding, targetOptions: ['spacing'] -> returns ['spacing']
 * propertyName: backgroundColor, targetOptions: ['spacing'] -> returns []
 * propertyName: backgroundColor, targetOptions: ['color', 'spacing'] -> returns ['color']
 * ```
 */
export function getDomainsForProperty(propertyName: string, targetOptions: Domains): Domains {
	const domains: Domains = [];
	if (
		(isColorCssPropertyName(propertyName) || isCurrentSurfaceCustomPropertyName(propertyName)) &&
		targetOptions.includes('color')
	) {
		domains.push('color');
	}

	if (isSpacingProperty(propertyName) && targetOptions.includes('spacing')) {
		domains.push('spacing');
	}

	if (isShapeProperty(propertyName) && targetOptions.includes('shape')) {
		domains.push('shape');
	}

	return domains;
}
