import { spacing as spacingScale } from '@atlaskit/tokens/tokens-raw';

import { borderWidthValueToToken } from './border-width-value-to-token';
import { isBorderSizeProperty } from './is-border-size-property';
import { isShapeProperty } from './is-shape-property';
import { normaliseValue } from './normalise-value';
import { radiusValueToToken } from './radius-value-to-token';

const spacingValueToToken = Object.fromEntries(
	spacingScale.map((token) => [token.value, token.cleanName]),
);

export function findTokenNameByPropertyValue(
	propertyName: string,
	value: string,
): string | undefined {
	const lookupValue = normaliseValue(propertyName, value);
	const tokenName = isShapeProperty(propertyName)
		? isBorderSizeProperty(propertyName)
			? borderWidthValueToToken[lookupValue]
			: radiusValueToToken[lookupValue]
		: spacingValueToToken[lookupValue];

	if (!tokenName) {
		return undefined;
	}

	return tokenName;
}
