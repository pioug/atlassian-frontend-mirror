import type { Format } from 'style-dictionary';

import motionPalette from '../../../schema/palettes/motion-palette';
import {
	COLOR_MODE_ATTRIBUTE,
	CONTRAST_MODE_ATTRIBUTE,
	SUBTREE_THEME_ATTRIBUTE,
	THEME_DATA_ATTRIBUTE,
} from '../../../src/constants';
import themeConfig, { type Themes } from '../../../src/theme-config';
import { getCSSCustomProperty } from '../../../src/utils/get-css-custom-property';
import getIncreasedContrastTheme from '../../../src/utils/get-increased-contrast-theme';
import { getValue } from '../get-value';
import sortTokens from '../sort-tokens';
import { themeNameToId } from '../theme-name-to-id';
import { fontTokenToCSS } from '../transformers/font-token-to-css';

/**
 * A shared value declared once as a custom property. Token values that exactly match
 * `resolvedValue` are output as `var(<property>)` instead of repeating the expression.
 */
export interface CustomProperty {
	property: string;
	value: string;
	resolvedValue: string;
}

/**
 * Returns the custom properties referenced by `declarations`, directly or through other custom
 * properties, preserving their original (dependency) order.
 */
function getUsedCustomProperties(
	customProperties: CustomProperty[],
	declarations: string[],
): CustomProperty[] {
	let referencingText = declarations.join('\n');
	const used = new Set<CustomProperty>();

	// Dependents are declared after the properties they reference, so walk backwards.
	[...customProperties].reverse().forEach((customProperty) => {
		if (referencingText.includes(`var(${customProperty.property})`)) {
			used.add(customProperty);
			referencingText += `\n${customProperty.value}`;
		}
	});

	return customProperties.filter((customProperty) => used.has(customProperty));
}

export const cssVariableFormatter: Format['formatter'] = ({ dictionary, options }) => {
	if (!options.themeName) {
		throw new Error('options.themeName required');
	}

	const theme = themeConfig[options.themeName as Themes];
	const colorModes = ['light', 'dark'] as const;

	if (!theme.id) {
		throw new Error(
			`Theme Id should include in one of the following Ids: [${Object.values(themeConfig)
				.map(({ id }) => id)
				.join(', ')}]`,
		);
	}

	const tokens = sortTokens(
		dictionary.allTokens.filter(
			(token) => token.attributes && token.attributes.group !== 'palette',
		),
	).map((token) => {
		const tokenName = getCSSCustomProperty(token.path);

		if (token.attributes?.group === 'typography') {
			token.value = fontTokenToCSS(token);
		}

		return { ...token, name: tokenName };
	});

	let output = '';
	let indent = 0;

	function outputLine(line: string) {
		output += `${' '.repeat(indent)}${line}\n`;
	}

	let themeId = theme.override || theme.id;

	if (theme.attributes.type === 'color') {
		let selectors: string[] = colorModes.map(
			(mode) =>
				`html[${COLOR_MODE_ATTRIBUTE}="${mode}"][${THEME_DATA_ATTRIBUTE}~="${mode}:${themeId}"], [${SUBTREE_THEME_ATTRIBUTE}][${COLOR_MODE_ATTRIBUTE}="${mode}"][${THEME_DATA_ATTRIBUTE}~="${mode}:${themeId}"]`,
		);

		const hasIncreasedContrastTheme = Boolean(getIncreasedContrastTheme(themeId));
		const targetIncreasedContrastTheme = options.increasedContrastTarget
			? themeNameToId(options.increasedContrastTarget)
			: undefined;

		if (hasIncreasedContrastTheme) {
			// TODO: This is not enabled yet as it's not needed due to specificity,
			// but we should consider adding this in future.
			//
			// If this is a standard theme that has an increased contrast theme,
			// append selectors with `prefers-contrast: no-preference` so they aren't
			// matched when inactive.
			// selectors = selectors.map(
			//   (selector) => `${selector}[${CONTRAST_MODE_ATTRIBUTE}="no-preference"]`,
			// );
		} else if (targetIncreasedContrastTheme) {
			// If this theme IS an increased contrast theme, add additional selectors targeting the
			// standard theme combined with `prefers-contrast: more`.
			selectors = [
				...selectors,
				...colorModes.map(
					(mode) =>
						`html[${COLOR_MODE_ATTRIBUTE}="${mode}"][${CONTRAST_MODE_ATTRIBUTE}="more"][${THEME_DATA_ATTRIBUTE}~="${mode}:${targetIncreasedContrastTheme}"]`,
				),
			];
		}

		outputLine(`${selectors.join(',\n')} {`);
		indent += 2;
		outputLine(`color-scheme: ${theme.attributes.mode};`);
	} else if (theme.attributes.type === 'motion') {
		Object.entries(motionPalette.motion.keyframe).forEach(([tokenName, tokenValue]) => {
			outputLine(`@keyframes ${tokenName} {`);
			indent += 2;
			Object.entries(tokenValue.value).forEach(([keyframeName, keyframeValue]) => {
				outputLine(`${keyframeName} {`);
				indent += 2;
				Object.entries(keyframeValue).forEach(([property, value]) => {
					outputLine(`${property}: ${value};`);
				});
				indent -= 2;
				outputLine('}');
			});
			indent -= 2;
			outputLine('}');
		});
		outputLine(
			`html[${THEME_DATA_ATTRIBUTE}~="${theme.attributes.type}:${themeId}"], [${SUBTREE_THEME_ATTRIBUTE}][${THEME_DATA_ATTRIBUTE}~="${theme.attributes.type}:${themeId}"] {`,
		);
		indent += 2;
	} else {
		outputLine(
			`html[${THEME_DATA_ATTRIBUTE}~="${theme.attributes.type}:${themeId}"], [${SUBTREE_THEME_ATTRIBUTE}][${THEME_DATA_ATTRIBUTE}~="${theme.attributes.type}:${themeId}"] {`,
		);
		indent += 2;
	}

	const customProperties: CustomProperty[] = options.customProperties ?? [];
	const referenceByValue = new Map(
		customProperties.map(({ property, resolvedValue }) => [resolvedValue, `var(${property})`]),
	);

	const declarations = tokens.map((token) => {
		const tokenValue = getValue(dictionary, token);
		const reference = typeof tokenValue === 'string' && referenceByValue.get(tokenValue);
		return `${token.name}: ${reference || tokenValue};`;
	});

	getUsedCustomProperties(customProperties, declarations).forEach(({ property, value }) => {
		outputLine(`${property}: ${value};`);
	});
	declarations.forEach(outputLine);

	indent -= 2;
	outputLine('}');

	return output;
};
