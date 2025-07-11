/* eslint-disable @repo/internal/react/consistent-props-definitions */
/* eslint-disable @repo/internal/react/consistent-types-definitions */
// Non-deprecated types
import { type ReactNode } from 'react';

// Deprecated / legacy types
export type ThemeModes = 'light' | 'dark';
export interface Theme {
	mode: ThemeModes;
}
export interface GlobalThemeTokens extends Theme {}

export type ThemeProps = AtlaskitThemeProps | CustomThemeProps | NoThemeProps;
export interface CustomThemeProps {
	theme: Theme;
	[index: string]: any;
}
export interface AtlaskitThemeProps {
	theme: { __ATLASKIT_THEME__: Theme };
	[index: string]: any;
}

export interface AKThemeProviderProps {
	mode?: ThemeModes;
	background?: ThemedValue<string>;
	children?: ReactNode;
}

export interface NoThemeProps {
	[index: string]: any;
}

export type DefaultValue = string | number;

export type ThemedValue<V = DefaultValue> = (props?: ThemeProps) => V | '';

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
