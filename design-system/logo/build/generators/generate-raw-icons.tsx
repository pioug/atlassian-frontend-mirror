import path from 'path';

import fs from 'fs-extra';
import { optimize } from 'svgo';

import format from '@af/formatting/sync';
import { createSignedArtifact } from '@atlassian/codegen';

import { baseSvgoConfig } from '../utils';

/**
 * Generates raw assets for each icon in the raw directory
 * @param root - root directory of package
 * @param rawDirectory - directory containing raw SVGs
 * @param targetDirectory - directory under <root>/src/ to write raw icons to
 */
export default function generateRawIcons(
	root: string | undefined,
	rawDirectory: string,
	targetDirectory: string,
) {
	const rawIconsDirectory = path.resolve(root!, 'src', targetDirectory);
	fs.ensureDirSync(rawIconsDirectory);

	// Get all icon SVGs
	const icons = fs
		.readdirSync(path.resolve(root!, rawDirectory, 'icon'))
		.filter((fileName) => path.extname(fileName) === '.svg')
		.filter((fileName) => !path.basename(fileName).includes('custom-theme'));

	const rawIcons: Record<string, string> = {};

	icons.forEach((fileName) => {
		console.log(`Generating favicon for ${fileName}...`);
		const svg = fs.readFileSync(path.resolve(root!, rawDirectory, 'icon', fileName), 'utf-8');

		// Optimize SVG
		// @ts-ignore - svgo types are problematic
		const svgoResult = optimize(svg, baseSvgoConfig).data;
		if (!svgoResult) {
			throw new Error('SVGO failure');
		}

		// Change the size of the SVG to 16x16
		const svgString = svgoResult
			.replace(/width="[^"]*"/, 'width="16"')
			.replace(/height="[^"]*"/, 'height="16"');

		// Encode the icon for use as a src. Standard URI decode, but:
		// - single quotes as they don't need to be encoded
		// - whitespace is stripped out
		// - some encoded characters are actually supported by browsers and can be switched back
		// For more info; https://codepen.io/tigt/post/optimizing-svgs-in-data-uris
		const encodedSvg = encodeURIComponent(svgString.replace(/\s+/g, ' ').replace(/"/g, "'"))
			.replace(/%3C/g, '<')
			.replace(/%3E/g, '>')
			.replace(/%20/g, ' ')
			.replace(/%3D/g, '=')
			.replace(/%3A/g, ':')
			.replace(/%2F/g, '/');
		const dataUrl = `data:image/svg+xml,${encodedSvg}`;

		// Add to raw icons object
		const name = fileName
			.replace('.svg', '')
			.split('-')
			.map((word, index) => {
				return index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1);
			})
			.join('');
		rawIcons[name] = dataUrl;
	});

	const rawIconsString = `
	${Object.entries(rawIcons)
		.map(([name, value]) => `export const ${name}Icon = ${JSON.stringify(value)};`)
		.join('\n')}

	export const rawIcons = {
		${Object.keys(rawIcons)
			.map((name) => `	'${name}': ${name}Icon,`)
			.join('\n')}
	};
	`;

	// Write all raw icons to a single file
	fs.writeFileSync(
		path.resolve(rawIconsDirectory, 'index.tsx'),
		createSignedArtifact(
			format(rawIconsString, 'tsx'),
			'yarn workspace @atlaskit/logo generate:components',
		),
	);
}
