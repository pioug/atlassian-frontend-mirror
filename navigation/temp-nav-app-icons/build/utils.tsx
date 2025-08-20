export type Assets = Record<string, { icon: boolean; logo: boolean; 'logo-cs': boolean }>;

const collectionColors = {
	strategy: '#FB9700',
	service: '#FFC716',
	dev: '#94C748',
	teamwork: '#1868DB',
	discovery: '#C97CF4',
	trello: '#1558BC',
	loom: '#625df5',
	customer: '#6CC3E0',
	platform: '#DDDEE1',
};

export const dataCenterApps = [
	'jira-data-center',
	'jira-service-management-data-center',
	'confluence-data-center',
	'bitbucket-data-center',
	'crowd',
	'bamboo',
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
	type: 'logo' | 'icon' | 'logo-cs',
	name: string,
	isThemable: boolean = false,
) => {
	let updatedSvg = svg;

	// Error if the height is not 24 or 32
	if (
		/height="(\d+)"/.test(updatedSvg) &&
		!['24', '32'].includes(updatedSvg.match(/height="(\d+)"/)?.[1] || '')
	) {
		throw new Error(`Invalid height for ${name}: ${updatedSvg.match(/height="(\d+)"/)?.[1]}`);
	}

	updatedSvg = updatedSvg.replace('fill="none"', '');
	updatedSvg = updatedSvg.replace(/width="\d+"/, '');
	updatedSvg = updatedSvg.replace(/height="\d+"/, '');

	if (dataCenterApps.includes(name)) {
		// Data center icons
		updatedSvg = updatedSvg.replace(
			/stroke="#DDDEE1"/g,
			`stroke="var(--border-color, #DDDEE1)" fill="none" `,
		);
		updatedSvg = updatedSvg.replace(/fill="white"/g, `fill="var(--tile-color, white)"`);
		updatedSvg = updatedSvg.replace(/fill="#1868DB"/g, `fill="var(--icon-color, #1868DB)"`);
	} else if (isThemable) {
		// Themed icons
		updatedSvg = updatedSvg
			.replace(/fill="#292A2E"/, `fill="var(--themed-icon-color, currentColor)"`)
			.replace(/fill="#292A2E"/g, `fill="var(--themed-text-color, currentColor)"`);
	} else {
		// Standard app icons
		updatedSvg = Object.entries(collectionColors)
			.reduce((acc, [_, hex]) => {
				const cssVar = `var(--tile-color,${hex})`;
				return acc.replace(new RegExp(`${hex}`, 'gi'), cssVar);
			}, updatedSvg)
			.replace(/fill="#101214"/g, `fill="var(--icon-color, #101214)"`)
			.replace(/fill="white"/g, `fill="var(--icon-color, white)"`);
	}

	// Insert 'height: 100%;' into the <svg> tag
	updatedSvg = updatedSvg.replace(/<svg/, '<svg height="100%"');

	if (type === 'logo') {
		updatedSvg = updatedSvg.replace(/fill="#292A2E"/g, `fill="var(--text-color, #292A2E)"`);
	} else if (type === 'logo-cs') {
		updatedSvg = updatedSvg.replace(/fill="#1E1F21"/g, `fill="var(--text-color, #1e1f21)"`);
	}

	return updatedSvg;
};
