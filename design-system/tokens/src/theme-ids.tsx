export type ThemeIds = (typeof themeIds)[number];

/**
 * Theme ids: The value that will be mounted to the DOM as a data attr
 * For example: `data-theme="light:light dark:dark spacing:spacing"
 *
 * These ids must be kebab case
 */
export const themeIds = [
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
] as const;
