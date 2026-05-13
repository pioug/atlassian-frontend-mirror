import type { Rule } from 'eslint';
import { isNodeOfType, type Property, type SpreadElement } from 'eslint-codemod-utils';

import { getValue } from './get-value';

export function getValueForPropertyNode(
	propertyNode: Property | SpreadElement,
	context: Rule.RuleContext,
): string | number | null | undefined {
	const propertyValueRaw = isNodeOfType(propertyNode!, 'Property')
		? getValue(propertyNode.value, context)
		: null;

	const propertyValue = Array.isArray(propertyValueRaw) ? propertyValueRaw[0] : propertyValueRaw;

	return propertyValue;
}
