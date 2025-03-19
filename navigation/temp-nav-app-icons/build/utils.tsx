const utilityIcons = ['more-atlassian-apps', 'custom-link'];

export const getLogoJSX = (name: string, type: 'logo' | 'icon', svg: string) => {
	const capitalisedName = name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');

	const productLabel = name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	// convert name to PascalCase from kebab-case
	const componentName = `${capitalisedName}${type === 'icon' ? 'Icon' : 'Logo'}`;

	const WrapperName = `${type.charAt(0).toUpperCase() + type.slice(1)}Wrapper`;

	let typeImport = `import type { ${type === 'icon' ? 'AppIconProps' : 'AppLogoProps'} } from '../../utils/types';\n`;
	if (utilityIcons.includes(name)) {
		typeImport = `import type { UtilityIconProps } from '../../utils/types';\n`;
	}

	const propType = utilityIcons.includes(name)
		? 'UtilityIconProps'
		: type === 'icon'
			? 'AppIconProps'
			: 'AppLogoProps';

	return `import React from 'react';

import { ${WrapperName} } from '../../utils/${type === 'icon' ? 'icon-wrapper' : 'logo-wrapper'}';
${typeImport}
// \`height\` is set to 100% to allow the SVG to scale with the parent element${type === 'logo' ? '\n// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.' : ''}
const svg = \`${svg}\`;

/**
 * __${componentName}__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into \`@atlaskit/logo\`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function ${componentName}(${type === 'icon' ? '{ size, appearance = "brand", label, testId }' : '{ label, testId }'}: ${propType}) {
	return <${WrapperName} svg={svg} ${type === 'icon' ? 'size={size} appearance={appearance}' : ''} ${utilityIcons.includes(name) ? 'label={label}' : `label={label || "${productLabel}"}`} testId={testId} />;
}
`;
};

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

// Adjust SVG
export const transformSVG = (svg: string, type: 'logo' | 'icon', name: string) => {
	let updatedSvg = svg;

	if (!noLegacyAppearance.includes(name)) {
		// Allow icons to be customised for App Switcher until Team '25
		updatedSvg = Object.entries(collectionColors)
			.reduce((acc, [_, hex]) => {
				const cssVar = `var(--tile-color,${hex})`;
				return acc.replace(new RegExp(`${hex}`, 'g'), cssVar);
			}, updatedSvg)
			.replace(/fill="#111213"/g, 'fill="var(--icon-color, #111213"')
			.replace(/fill="#101214"/g, 'fill="var(--icon-color, #101214"')
			.replace(/fill="white"/g, 'fill="var(--icon-color, white)"');
	}

	updatedSvg = updatedSvg.replace('width="32"', '');
	updatedSvg = updatedSvg.replace('height="32"', '');

	if (type === 'logo') {
		updatedSvg = updatedSvg.replace(/fill="#292A2E"/g, 'fill="currentColor"');
	} else {
		// Insert 'height: 100%;' into the <svg> tag
		updatedSvg = updatedSvg.replace(/<svg/, '<svg height="100%"');
	}
	return updatedSvg;
};

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
