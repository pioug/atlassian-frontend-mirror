/* eslint-disable @repo/internal/react/consistent-props-definitions */
/* eslint-disable @repo/internal/react/consistent-types-definitions */
import { type ReactNode } from 'react';

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and supported Atlassian Design System component APIs instead.
 */
export type ThemeModes = 'light' | 'dark';

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and supported Atlassian Design System component APIs instead.
 */
export interface Theme {
	mode: ThemeModes;
}

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and supported Atlassian Design System component APIs instead.
 */
export interface GlobalThemeTokens extends Theme {}

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and supported Atlassian Design System component APIs instead.
 */
export type ThemeProps = AtlaskitThemeProps | CustomThemeProps | NoThemeProps;

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and supported Atlassian Design System component APIs instead.
 */
export interface CustomThemeProps {
	theme: Theme;
	[index: string]: any;
}

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and supported Atlassian Design System component APIs instead.
 */
export interface AtlaskitThemeProps {
	theme: { __ATLASKIT_THEME__: Theme };
	[index: string]: any;
}

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and supported Atlassian Design System component APIs instead.
 */
export interface AKThemeProviderProps {
	mode?: ThemeModes;
	background?: ThemedValue<string>;
	children?: ReactNode;
}

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and supported Atlassian Design System component APIs instead.
 */
export interface NoThemeProps {
	[index: string]: any;
}

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and supported Atlassian Design System component APIs instead.
 */
export type DefaultValue = string | number;

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and supported Atlassian Design System component APIs instead.
 */
export type ThemedValue<V = DefaultValue> = (props?: ThemeProps) => V | '';

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use an Atlassian Design System layered component, or `@atlaskit/top-layer` for low-level
 * overlays.
 */
export interface Layers {
	card: 100;
	navigation: 200;
	dialog: 300;
	layer: 400;
	blanket: 500;
	modal: 510;
	flag: 600;
	spotlight: 700;
	tooltip: 9999;
}
