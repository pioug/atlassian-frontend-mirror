export type Assets = Record<string, { logo: boolean; icon: boolean }>;

import { CSS_VAR_ICON, CSS_VAR_THEMED_ICON, CSS_VAR_THEMED_TEXT } from '../src/utils/constants';

const collectionColors = {
	strategy: '#FB9700',
	service: '#FFC716',
	dev: '#94C748',
	teamwork: '#1868DB',
	discovery: '#C97CF4',
	trello: '#1558BC',
	customer: '#6CC3E0',
	platform: '#DDDEE1',
};

const noLegacyAppearance = [
	// Platform
	'company-hub',
	'home',
	'analytics',
	'admin',
	'projects',
	'goals',
	'teams',
	'search',
	'chat',
	'studio',
	// Atlassian Home logos
	'custom-link',
	'more-atlassian-apps',
	// New apps
	'talent',
	'focus',
	'assets',
];

/**
 * SVGO optimisation configuration for logos.
 */
export const svgoConfig = {
	multipass: true,
	plugins: [
		{
			name: 'preset-default',
			params: {
				overrides: {
					removeViewBox: false,
					removeUnknownsAndDefaults: false,
					cleanupIds: { minify: false },
					mergePaths: { floatPrecision: 2 },
				},
			},
		},
		{ name: 'removeTitle' },
		{ name: 'removeDesc', params: { removeAny: true } },
		{ name: 'removeXMLNS' },
		{ name: 'removeXlink' },
	],
	js2svg: { pretty: true },
};

// Adjust SVG
export const transformSVG = (
	svg: string,
	type: 'logo' | 'icon',
	name: string,
	isThemable: boolean = false,
) => {
	let updatedSvg = svg;

	if (!noLegacyAppearance.includes(name)) {
		// Allow icons to be customised for App Switcher until Team '25
		updatedSvg = Object.entries(collectionColors)
			.reduce((acc, [_, hex]) => {
				const cssVar = `var(--tile-color,${hex})`;
				return acc.replace(new RegExp(`${hex}`, 'g'), cssVar);
			}, updatedSvg)
			.replace(/fill="#111213"/g, `fill="var(${CSS_VAR_ICON}, #111213"`)
			.replace(/fill="#101214"/g, `fill="var(${CSS_VAR_ICON}, #101214"`)
			.replace(/fill="white"/g, `fill="var(${CSS_VAR_ICON}, white)"`);
	}

	updatedSvg = updatedSvg.replace('width="32"', '');
	updatedSvg = updatedSvg.replace('height="32"', '');

	if (isThemable) {
		updatedSvg = updatedSvg
			.replace(/fill="#292A2E"/, `fill="var(${CSS_VAR_THEMED_ICON}, currentColor)"`)
			.replace(/fill="#292A2E"/g, `fill="var(${CSS_VAR_THEMED_TEXT}, currentColor)"`);
	}

	if (type === 'logo') {
		updatedSvg = updatedSvg.replace(/fill="#292A2E"/g, 'fill="currentColor"');
	} else {
		// Insert 'height: 100%;' into the <svg> tag
		updatedSvg = updatedSvg.replace(/<svg/, '<svg height="100%"');
	}
	return updatedSvg;
};
