export type Assets = Record<string, { logo: boolean; icon: boolean }>;

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
	'customer-service-management',
];

/**
 * SVGO optimisation configuration for logos.
 */
export const baseSvgoConfig = {
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
	],
	js2svg: { pretty: true },
};

export const svgoConfig = {
	...baseSvgoConfig,
	plugins: [...baseSvgoConfig.plugins, { name: 'removeXMLNS' }, { name: 'removeXlink' }],
};

// Adjust SVG
export const transformSVG = (
	svg: string,
	type: 'logo' | 'icon',
	name: string,
	isThemable: boolean = false,
) => {
	let updatedSvg = svg;

	updatedSvg = updatedSvg.replace('fill="none"', '');
	updatedSvg = updatedSvg.replace(/width="\d+"/, '');
	updatedSvg = updatedSvg.replace(/height="\d+"/, '');

	if (isThemable) {
		updatedSvg = updatedSvg
			.replace(/fill="#292A2E"/, `fill="var(--themed-icon-color, currentColor)"`)
			.replace(/fill="#292A2E"/g, `fill="var(--themed-text-color, currentColor)"`);
	} else {
		if (!noLegacyAppearance.includes(name)) {
			// Allow icons to be customised for App Switcher until Team '25
			updatedSvg = Object.entries(collectionColors)
				.reduce((acc, [_, hex]) => {
					const cssVar = `var(--tile-color,${hex})`;
					return acc.replace(new RegExp(`${hex}`, 'g'), cssVar);
				}, updatedSvg)
				.replace(/fill="#101214"/g, `fill="var(--icon-color, #101214)"`)
				.replace(/fill="white"/g, `fill="var(--icon-color, white)"`);
		}
	}

	// Insert 'height: 100%;' into the <svg> tag
	updatedSvg = updatedSvg.replace(/<svg/, '<svg height="100%"');

	if (type === 'logo') {
		updatedSvg = updatedSvg.replace(/fill="#292A2E"/g, `fill="var(--text-color, #292A2E)"`);
	}

	return updatedSvg;
};
