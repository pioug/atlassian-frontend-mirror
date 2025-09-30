import path from 'path';

import fs from 'fs-extra';
import { optimize } from 'svgo';

import format from '@af/formatting/sync';
import { createSignedArtifact } from '@atlassian/codegen';

import { type Assets, dataCenterApps, svgoConfig, transformSVG } from '../utils';

const utilityIcons = ['more-atlassian-apps', 'custom-link'];

const labelMap: { [index: string]: string } = {
	'Loom Internal': 'Loom',
	'Chat New': 'Chat',
	'Search New': 'Search',
	'Studio New': 'Studio',
};

/**
 * generates components for each logo and icon in the raw directory
 * @param root - root directory
 * @param rawDirectory - directory containing raw SVGs
 * @param targetDirectory - directory to write new components to
 */
export default function generateComponents(
	root: string | undefined,
	rawDirectory: string,
	targetDirectory: string,
) {
	const assets: Assets = {};

	fs.emptyDirSync(path.resolve(root!, 'src', targetDirectory));

	// For each type of logo or icon, create a new JSX file
	(['logo-cs', 'logo', 'icon'] as const).forEach((type) => {
		const glyphs = fs
			.readdirSync(path.resolve(root!, rawDirectory, type))
			.filter((fileName) => path.extname(fileName) === '.svg')
			.filter((fileName) => !path.basename(fileName).includes('custom-theme'));

		glyphs.forEach((fileName) => {
			console.log(`Building ${type} ${fileName}...`);
			const svg = transformSVG(
				fs.readFileSync(path.resolve(root!, rawDirectory, type, fileName), 'utf-8'),
				type,
				fileName.replace('.svg', ''),
			);

			// @ts-ignore - svgo types are problematic
			const svgoResult = optimize(svg, svgoConfig).data;
			if (!svgoResult) {
				throw new Error('SVGO failure');
			}

			let customThemeSvgoResult: string | undefined;

			// Get the custom theming asset and optimise it, if it exists
			if (
				fs.existsSync(
					path.resolve(root!, rawDirectory, type, fileName.replace('.svg', '-custom-theme.svg')),
				)
			) {
				// Get custom theming asset
				const customThemeSvg = transformSVG(
					fs.readFileSync(
						path.resolve(root!, rawDirectory, type, fileName.replace('.svg', '-custom-theme.svg')),
						'utf-8',
					),
					type,
					fileName.replace('.svg', ''),
					true,
				);

				// @ts-ignore - svgo types are problematic
				customThemeSvgoResult = optimize(customThemeSvg, svgoConfig)?.data;
				if (!customThemeSvgoResult) {
					throw new Error('SVGO failure');
				}
			}

			const name = fileName.replace('.svg', '');

			const jsx = getLogoJSX(name, type, svgoResult, customThemeSvgoResult);
			// create file if it doesn't exist
			fs.ensureFileSync(path.resolve(root!, 'src', targetDirectory, name, `${type}.tsx`));
			fs.writeFileSync(
				path.resolve(root!, 'src', targetDirectory, name, `${type}.tsx`),
				createSignedArtifact(
					format(jsx, 'tsx'),
					'yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos',
				),
			);

			assets[name] = { ...assets[name], [type]: true };
		});
	});

	return assets;
}

/**
 *
 * @param name App name
 * @param type type (logo, logo-cs, icon)
 * @param svg optimised/processed SVG to render by default
 * @param customThemeSvg optimised/processed SVG to render when custom icon/text colors are set
 * @returns
 */
const getLogoJSX = (
	name: string,
	type: 'logo' | 'icon' | 'logo-cs',
	svg: string,
	customThemeSvg?: string,
) => {
	const capitalisedName = name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');

	let productLabel = name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	if (labelMap[productLabel]) {
		productLabel = labelMap[productLabel];
	}

	// convert name to PascalCase from kebab-case
	const componentName = `${capitalisedName}${type === 'icon' ? 'Icon' : type === 'logo' ? 'Logo' : 'LogoCS'}`;

	const WrapperName = type === 'icon' ? 'IconWrapper' : 'LogoWrapper';

	let propType = utilityIcons.includes(name)
		? 'UtilityIconProps'
		: type === 'icon'
			? 'AppIconProps'
			: 'AppLogoProps';

	if (customThemeSvg) {
		propType = type === 'icon' ? 'ThemedIconProps' : 'ThemedLogoProps';
	}

	let typeImport = `import type { ${propType} } from '../../utils/types';\n`;

	const deprecationText =
		type === 'icon'
			? `
 * @deprecated This component has been replaced by the component \`${componentName}\` in \`@atlaskit/logo\`.
 * Please migrate any usages of this temporary component, using the prop \`shouldUseNewLogoDesign\` where necessary
 * to enable the new design by default.`
			: '';

	return `import React from 'react';

import { ${WrapperName} } from '../../utils/${type === 'icon' ? 'icon-wrapper' : 'logo-wrapper'}';
${typeImport}
// \`height\` is set to 100% to allow the SVG to scale with the parent element${type === 'logo' || type === 'logo-cs' ? '\n// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.' : ''}
const svg = \`${svg}\`;
${customThemeSvg ? `const customThemeSvg = \`${customThemeSvg}\`;\n` : ''}
/**
 * __${componentName}__
 *
 * A temporary component to represent the ${type === 'logo-cs' ? 'logo' : type} for ${productLabel}.${deprecationText}
 *
 */
export function ${componentName}({
		${customThemeSvg ? 'iconColor, ' : ''}
		${customThemeSvg && (type === 'logo' || type === 'logo-cs') ? 'textColor,' : ''} size, appearance = "brand", label = "${productLabel}", testId
	}: ${propType}) {
	return <${WrapperName}
			svg={svg} ${customThemeSvg ? 'customThemeSvg={customThemeSvg}' : ''}
			${customThemeSvg ? 'iconColor={iconColor}' : ''}
			${customThemeSvg && type === 'logo' ? 'textColor={textColor}' : ''}
			label={label}
			${dataCenterApps.includes(name) ? 'isDataCenter={true}' : ''}
			${name === 'assets' ? 'isAssets={true}' : ''}
			appearance={appearance}
			size={size}
			testId={testId}
		/>;
}
`;
};
