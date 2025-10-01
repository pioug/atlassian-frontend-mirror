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

	const logoDesignCategory = getLogoDesignCategory(name);

	// Handle Rovo logo; multiple colours that all map to iconColor for other appearances
	switch (logoDesignCategory) {
		case 'rovo':
			updatedSvg = updatedSvg.replace(/fill="#1868DB"/g, `fill="var(--rovo-blue-color, #1868DB)"`);
			updatedSvg = updatedSvg.replace(/fill="#6A9A23"/g, `fill="var(--rovo-green-color, #6A9A23)"`);
			updatedSvg = updatedSvg.replace(
				/fill="#AF59E1"/g,
				`fill="var(--rovo-purple-color, #AF59E1)"`,
			);
			updatedSvg = updatedSvg.replace(
				/fill="#FCA700"/g,
				`fill="var(--rovo-yellow-color, #FCA700)"`,
			);
			break;
		case 'data-center':
			// Data center icons
			updatedSvg = updatedSvg.replace(
				/stroke="#DDDEE1"/g,
				`stroke="var(--border-color, #DDDEE1)" fill="none" `,
			);
			updatedSvg = updatedSvg.replace(/fill="white"/g, `fill="var(--tile-color, white)"`);
			updatedSvg = updatedSvg.replace(/fill="#1868DB"/g, `fill="var(--icon-color, #1868DB)"`);
			break;
		default:
			if (isThemable) {
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

const getLogoDesignCategory = (name: string) => {
	if (name === 'rovo-hex') {
		return 'rovo';
	} else if (dataCenterApps.includes(name)) {
		return 'data-center';
	}
	return 'tile';
};
