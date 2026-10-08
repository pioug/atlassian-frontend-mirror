import type { ThemeState } from './theme-state';

/**
 * Inputs for the dynamic colour themes. Every colour token is derived from these two colours.
 */
interface DynamicColorInputs {
	dynamicForeground: string;
	dynamicBackground: string;
}

type HeadingSize = 'xxlarge' | 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall' | 'xxsmall';

/**
 * Optional unitless multipliers for individual heading sizes, applied on top of `dynamicFontScale`.
 * Each defaults to `1`, e.g. `dynamicFontHeadingXxlargeScale: 1.5` makes only `xxlarge` headings
 * larger.
 */
type HeadingScaleInputs = {
	[Size in HeadingSize as `dynamicFontHeading${Capitalize<Size>}Scale`]?: number;
};

/**
 * The variable contract for custom themes that support runtime overrides.
 *
 * Add a theme here when it is introduced. Its theme dimensions and required override values are
 * then shared by TypeScript consumers.
 */
export interface CustomThemeOverrideRegistry {
	'UNSAFE-dynamic': {
		light: DynamicColorInputs;
	};
	'UNSAFE-dynamic-dark': {
		dark: DynamicColorInputs;
	};
	'UNSAFE-typography': {
		typography: {
			/**
			 * A CSS `font-family` value. Applies to body, heading and brand text; code stays monospace.
			 */
			dynamicFontFamily: string;
			/**
			 * Unitless multiplier for font sizes and line heights. `1` is the default scale.
			 */
			dynamicFontScale: number;
		} & HeadingScaleInputs;
	};
}

type ThemeOverrideKind = Exclude<
	keyof ThemeState,
	'colorMode' | 'contrastMode' | 'UNSAFE_themeOptions'
>;

type ThemeNamesForKind<Kind extends ThemeOverrideKind> = {
	[ThemeName in keyof CustomThemeOverrideRegistry]: Kind extends keyof CustomThemeOverrideRegistry[ThemeName]
		? ThemeName
		: never;
}[keyof CustomThemeOverrideRegistry];

type ThemeOverridesForKind<Kind extends ThemeOverrideKind> = Partial<{
	[ThemeName in ThemeNamesForKind<Kind>]: CustomThemeOverrideRegistry[ThemeName][Kind &
		keyof CustomThemeOverrideRegistry[ThemeName]];
}>;

type CustomThemeWithOverrides<Kind extends ThemeOverrideKind> = {
	[ThemeName in ThemeNamesForKind<Kind>]: {
		id: ThemeName;
		overrides: CustomThemeOverrideRegistry[ThemeName][Kind &
			keyof CustomThemeOverrideRegistry[ThemeName]];
	};
}[ThemeNamesForKind<Kind>];

type ThemeWithoutModes = Omit<ThemeState, 'colorMode' | 'contrastMode'>;

/**
 * A theme configuration that can provide typed overrides alongside a custom theme ID.
 *
 * @example
 * ```tsx
 * <AppProvider defaultTheme={{
 * 		light: {
 * 			id: 'UNSAFE-dynamic',
 * 			overrides: { dynamicForeground: '#172b4d', dynamicBackground: '#ffffff' },
 * 		},
 * 		dark: {
 * 			id: 'UNSAFE-dynamic-dark',
 * 			overrides: { dynamicForeground: '#ffffff', dynamicBackground: '#1d2125' },
 * 		},
 * 	}}
 * />
 * ```
 */
export type ThemeWithCustomOverrides = Partial<{
	[Kind in keyof ThemeWithoutModes]: Kind extends ThemeOverrideKind
		? ThemeWithoutModes[Kind] | CustomThemeWithOverrides<Kind>
		: ThemeWithoutModes[Kind];
}>;

/**
 * Custom CSS variable overrides grouped by the theme dimension and theme ID they apply to.
 */
type CustomThemeOverrides = Partial<{
	[Kind in ThemeOverrideKind]: ThemeOverridesForKind<Kind>;
}>;

function isThemeWithOverrides(
	value: unknown,
): value is { id: string; overrides: Record<string, unknown> } {
	return (
		typeof value === 'object' &&
		value !== null &&
		'id' in value &&
		'overrides' in value &&
		typeof value.id === 'string' &&
		typeof value.overrides === 'object' &&
		value.overrides !== null
	);
}

/**
 * Marks a subtree theme element with its provider's scope, so its override styles only match that
 * element.
 */
export const CUSTOM_THEME_SCOPE_ATTRIBUTE = 'data-theme-overrides-scope';

/**
 * Separates custom theme override values from the plain theme IDs consumed by the theme runtime.
 *
 * Pass a `scope` for subtree themes. The override selector then only matches the element carrying
 * `CUSTOM_THEME_SCOPE_ATTRIBUTE` with that value, so sibling subtrees using the same custom theme
 * with different values don't overwrite each other. Without a scope, the styles target `html` and
 * any subtree using the theme.
 */
export function getThemeAndOverrides(
	themeWithOverrides: ThemeWithCustomOverrides | undefined,
	scope?: string,
): {
	theme: Partial<ThemeWithoutModes>;
	inlineStyles: string;
} {
	const theme: Record<string, unknown> = {};
	const overrides: Record<string, Record<string, unknown>> = {};

	for (const [themeKind, value] of Object.entries(themeWithOverrides || {})) {
		if (isThemeWithOverrides(value)) {
			theme[themeKind] = value.id;
			overrides[themeKind] = { [value.id]: value.overrides };
			continue;
		}

		theme[themeKind] = value;
	}

	return {
		theme: theme as Partial<ThemeWithoutModes>,
		inlineStyles: getCustomThemeOverrideStyles(overrides as CustomThemeOverrides, scope),
	};
}

/**
 * Escapes a value for use inside a double-quoted CSS attribute selector.
 */
function escapeAttributeValue(value: string): string {
	return value.replace(/["\\]/g, '\\$&');
}

function getThemeOverrideSelector(themeKind: string, themeName: string, scope?: string): string {
	// Colour themes only apply in their own colour mode.
	const colorMode =
		themeKind === 'light' || themeKind === 'dark' ? `[data-color-mode="${themeKind}"]` : '';
	const theme = `${colorMode}[data-theme~="${themeKind}:${themeName}"]`;

	if (scope) {
		return `[data-subtree-theme][${CUSTOM_THEME_SCOPE_ATTRIBUTE}="${escapeAttributeValue(scope)}"]${theme}`;
	}

	return `html${theme}, [data-subtree-theme]${theme}`;
}

function getCssVariableName(propertyName: string): string {
	return `--ds-${propertyName.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
}

/**
 * Generates CSS for custom theme overrides.
 *
 * Override property names are converted from camel case to `--ds-` CSS custom properties.
 */
function getCustomThemeOverrideStyles(
	overrides: CustomThemeOverrides | undefined,
	scope?: string,
): string {
	if (!overrides) {
		return '';
	}

	return Object.entries(overrides)
		.flatMap(([themeKind, themes]) =>
			Object.entries(themes || {}).flatMap(([themeName, values]) => {
				const styles = Object.entries(values || {})
					// Unset optional inputs are skipped so the theme's `var()` fallback applies. Writing
					// `undefined` would be a valid custom property value that breaks the formula.
					.filter(([, value]) => value !== undefined && value !== null)
					.map(([propertyName, value]) => `${getCssVariableName(propertyName)}: ${value};`)
					.join('');

				return styles
					? `
		${getThemeOverrideSelector(themeKind, themeName, scope)} {
			${styles}
		}
	`
					: [];
			}),
		)
		.join('');
}
