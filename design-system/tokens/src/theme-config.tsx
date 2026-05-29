/**
 * This file contains the source of truth for themes and all associated meta data.
 */
import type { ThemeColorModes } from './theme-color-modes';
import { themeIds, type ThemeIds } from './theme-ids';
import type { ThemeState } from './theme-state';

/**
 * Themes: The internal identifier of a theme.
 * These ids are what the actual theme files/folders are called.
 * style-dictionary will attempt to locate these in the file-system.
 */
export type Themes =
	| 'atlassian-light'
	| 'atlassian-light-future'
	| 'atlassian-light-increased-contrast'
	| 'atlassian-dark'
	| 'atlassian-dark-future'
	| 'atlassian-dark-increased-contrast'
	| 'atlassian-shape'
	| 'atlassian-spacing'
	| 'atlassian-typography'
	| 'atlassian-motion';
export type ThemeFileNames = Themes;

/**
 * ThemeOverrides: The internal identifier of a theme override. Which are themes that contain
 * a subset of tokens intended to override an existing theme. These ids are what the actual
 * theme files/folders are called. style-dictionary will attempt to locate these in the file-system.
 * Theme overrides are temporary and there may not be any defined at times.
 */
export type ThemeOverrides = Themes;

/**
 * Theme kinds: The type of theme.
 * Some themes are entirely focused on Color, whilst others are purely focused on spacing.
 * In the future other types may be introduced such as typography.
 */
type ThemeKinds = 'color' | 'spacing' | 'typography' | 'shape' | 'motion';

export type DataColorModes = Exclude<ThemeColorModes, 'auto'>;

/**
 * Contrast preferences: The system contrast preference
 */
const themeContrastModes = ['more', 'no-preference', 'auto'] as const;
export type ThemeContrastModes = (typeof themeContrastModes)[number];
export type DataContrastModes = 'more' | 'no-preference' | 'auto';

/**
 * Theme override ids: the equivalent of themeIds for theme overrides.
 * Theme overrides are temporary and there may not be any defined at times.
 */
const themeOverrideIds = [] as const;

export type ThemeOverrideIds = (typeof themeOverrideIds)[number];

export const themeIdsWithOverrides: readonly [
	'light-increased-contrast',
	'light',
	'light-future',
	'dark',
	'dark-future',
	'dark-increased-contrast',
	'spacing',
	'shape',
	'typography',
	'motion',
] = [...themeIds, ...themeOverrideIds] as const;

export type ThemeIdsWithOverrides = (typeof themeIdsWithOverrides)[number];

/**
 * Theme to use a base. This will create the theme as
 * an extension with all token values marked as optional
 * to allow tokens to be overridden as required.
 */
type ExtensionThemeId = ThemeIds;

/**
 * Palettes: The set of base tokens a given theme may be populated with.
 * For example: legacy light & dark themes use the "legacyPalette" containing colors from our
 * previous color set.
 */
export type Palettes =
	| 'defaultPalette'
	| 'spacingScale'
	| 'shapePalette'
	| 'typographyPalette'
	| 'motionPalette';

/**
 * ThemeConfig: the source of truth for all theme meta-data.
 * This object should be used whenever interfacing with themes.
 */
interface ThemeConfig {
	id: ThemeIds | ThemeOverrideIds;
	displayName: string;
	palette: Palettes;
	attributes: (
		| {
				type: 'color';
				// https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
				mode: DataColorModes;
		  }
		| {
				type: Extract<ThemeKinds, 'spacing' | 'typography' | 'shape' | 'motion'>;
		  }
	) & {
		/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required */
		/**
		 * @deprecated Use top-level `extends` property instead
		 */
		extends?: ExtensionThemeId;
		/* eslint-enable @repo/internal/deprecations/deprecation-ticket-required */
	};
	/**
	 * Theme to use a base. This will create the theme as
	 * an extension with all token values marked as optional
	 * to allow tokens to be overridden as required.
	 */
	extends?: ThemeIds;
	/**
	 * Theme to override. This will cause the theme to only
	 * output css variables which can be imported to temporarily
	 * override existing themes for testing purposes.
	 */
	override?: ThemeIds;
	/**
	 * Use when the theme provides an increased contrast
	 * version of another theme. This will cause the theme to be loaded
	 * under the media query `@media (prefers-contrast: more)`.
	 */
	increasesContrastFor?: ThemeIds;
}

const themeConfig: Record<Themes | ThemeOverrides, ThemeConfig> = {
	'atlassian-light': {
		id: 'light',
		displayName: 'Light Theme',
		palette: 'defaultPalette',
		attributes: {
			type: 'color',
			mode: 'light',
		},
	},
	'atlassian-light-future': {
		id: 'light-future',
		displayName: 'Future Light Theme',
		palette: 'defaultPalette',
		attributes: {
			type: 'color',
			mode: 'light',
		},
		override: 'light',
	},
	'atlassian-light-increased-contrast': {
		id: 'light-increased-contrast',
		displayName: 'Light Theme (increased contrast)',
		palette: 'defaultPalette',
		attributes: {
			type: 'color',
			mode: 'light',
		},
		extends: 'light',
		increasesContrastFor: 'light',
	},
	'atlassian-dark': {
		id: 'dark',
		displayName: 'Dark Theme',
		palette: 'defaultPalette',
		attributes: {
			type: 'color',
			mode: 'dark',
		},
	},
	'atlassian-dark-future': {
		id: 'dark-future',
		displayName: 'Future Dark Theme',
		palette: 'defaultPalette',
		attributes: {
			type: 'color',
			mode: 'dark',
		},
		override: 'light',
	},
	'atlassian-dark-increased-contrast': {
		id: 'dark-increased-contrast',
		displayName: 'Dark Theme (increased contrast)',
		palette: 'defaultPalette',
		attributes: {
			type: 'color',
			mode: 'dark',
		},
		extends: 'dark',
		increasesContrastFor: 'dark',
	},
	'atlassian-spacing': {
		id: 'spacing',
		displayName: 'Atlassian Spacing',
		palette: 'spacingScale',
		attributes: {
			type: 'spacing',
		},
	},
	'atlassian-typography': {
		id: 'typography',
		displayName: 'Atlassian Typography',
		palette: 'typographyPalette',
		attributes: {
			type: 'typography',
		},
	},
	'atlassian-shape': {
		id: 'shape',
		displayName: 'Shape',
		palette: 'shapePalette',
		attributes: {
			type: 'shape',
		},
	},
	'atlassian-motion': {
		id: 'motion',
		displayName: 'Motion',
		palette: 'motionPalette',
		attributes: {
			type: 'motion',
		},
	},
};

/**
 * Represents theme state once mounted to the page
 * (the page doesn't have an "auto" color mode, it's either light or dark)
 */
export interface ActiveThemeState extends ThemeState {
	colorMode: DataColorModes;
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export default themeConfig;

export { themeColorModes, type ThemeColorModes } from './theme-color-modes';
export { themeIds, type ThemeIds } from './theme-ids';
export { themeStateDefaults } from './theme-state-defaults';
export { type ThemeOptionsSchema, type CSSColor } from './theme-options-schema';
export { type ThemeState } from './theme-state';
