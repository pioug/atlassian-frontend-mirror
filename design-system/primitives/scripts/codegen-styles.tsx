/* eslint-disable no-console */
import { readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import { createPartialSignedArtifact } from '@atlassian/codegen';

import { createColorStylesFromTemplate } from './color-codegen-template';
import { createElevationStylesFromTemplate } from './elevation-codegen-template';
import { createInverseColorMapTemplate } from './inverse-color-map-template';
import { createStylesFromFileTemplate } from './misc-codegen-template';
import { createShapeStylesFromTemplate } from './shape-codegen-template';
import { createSpacingStylesFromTemplate } from './spacing-codegen-template';
import { createTextStylesFromTemplate } from './text-codegen-template';
import { createTypographyStylesFromTemplate } from './typography-codegen-template';

const colorTokensDependencyPath = require.resolve(
	'../../tokens/src/artifacts/tokens-raw/atlassian-light',
);
const spacingTokensDependencyPath = require.resolve(
	'../../tokens/src/artifacts/tokens-raw/atlassian-spacing',
);
const shapeTokensDependencyPath = require.resolve(
	'../../tokens/src/artifacts/tokens-raw/atlassian-shape',
);

const templateFiles = readdirSync(join(__dirname, 'codegen-file-templates'), {
	withFileTypes: true,
})
	.filter((item) => !item.isDirectory())
	.map((item) => join(__dirname, 'codegen-file-templates', item.name));

// Output paths for partial codegen
const primitivesOutputs = [
	join(__dirname, '../src/xcss/style-maps.partial.tsx'),
	join(__dirname, '../../css/codemods/0.5.2-primitives-emotion-to-compiled/style-maps.partial.tsx'),
];

const forgeOutputPath = join(
	__dirname,
	'../../../forge/forge-ui/src/components/UIKit/tokens.partial.tsx',
);

// Generate partial sections for @atlaskit/primitives style-maps
const primitivesSourceFns = [
	// width, height, minWidth, maxWidth, minHeight, maxHeight
	...primitivesOutputs.map(
		(outputPath) => () =>
			createPartialSignedArtifact(
				(options) => options.map(createStylesFromFileTemplate).join('\n'),
				'yarn workspace @atlaskit/primitives codegen-styles',
				{
					id: 'dimensions',
					absoluteFilePath: outputPath,
					dependencies: templateFiles.filter((v) => v.includes('dimensions')),
				},
			),
	),
	// padding*, gap*, inset*
	...primitivesOutputs.map(
		(outputPath) => () =>
			createPartialSignedArtifact(
				createSpacingStylesFromTemplate,
				'yarn workspace @atlaskit/primitives codegen-styles',
				{
					id: 'spacing',
					absoluteFilePath: outputPath,
					dependencies: [spacingTokensDependencyPath],
				},
			),
	),
	// text color, background-color, border-color
	...primitivesOutputs.map(
		(outputPath) => () =>
			createPartialSignedArtifact(
				(options) => options.map(createColorStylesFromTemplate).join('\n'),
				'yarn workspace @atlaskit/primitives codegen-styles',
				{
					id: 'colors',
					absoluteFilePath: outputPath,
					dependencies: [colorTokensDependencyPath],
				},
			),
	),
	// inverse color map
	...primitivesOutputs.map(
		(outputPath) => () =>
			createPartialSignedArtifact(
				createInverseColorMapTemplate,
				'yarn workspace @atlaskit/primitives codegen-styles',
				{
					id: 'inverse-colors',
					absoluteFilePath: outputPath,
					dependencies: [colorTokensDependencyPath],
				},
			),
	),
	// elevation (opacity, shadow, surface)
	...primitivesOutputs.map(
		(outputPath) => () =>
			createPartialSignedArtifact(
				(options) => options.map(createElevationStylesFromTemplate).join('\n'),
				'yarn workspace @atlaskit/primitives codegen-styles',
				{
					id: 'elevation',
					absoluteFilePath: outputPath,
					dependencies: [colorTokensDependencyPath],
				},
			),
	),
	// border-width, border-radius
	...primitivesOutputs.map(
		(outputPath) => () =>
			createPartialSignedArtifact(
				(options) => options.map(createShapeStylesFromTemplate).join('\n'),
				'yarn workspace @atlaskit/primitives codegen-styles',
				{
					id: 'border',
					absoluteFilePath: outputPath,
					dependencies: [shapeTokensDependencyPath],
				},
			),
	),
	// border-color, border-radius, border-width, layer
	...primitivesOutputs.map(
		(outputPath) => () =>
			createPartialSignedArtifact(
				(options) => options.map(createStylesFromFileTemplate).join('\n'),
				'yarn workspace @atlaskit/primitives codegen-styles',
				{
					id: 'misc',
					absoluteFilePath: outputPath,
					dependencies: templateFiles,
				},
			),
	),
	// font*, lineheight
	...primitivesOutputs.map(
		(outputPath) => () =>
			createPartialSignedArtifact(
				createTypographyStylesFromTemplate,
				'yarn workspace @atlaskit/primitives codegen-styles',
				{
					id: 'typography',
					absoluteFilePath: outputPath,
					dependencies: templateFiles,
				},
			),
	),
	// font and weight map for text primitive
	...primitivesOutputs.map(
		(outputPath) => () =>
			createPartialSignedArtifact(
				createTextStylesFromTemplate,
				'yarn workspace @atlaskit/primitives codegen-styles',
				{
					id: 'text',
					absoluteFilePath: outputPath,
					dependencies: templateFiles,
				},
			),
	),
];

/**
 * Generate Forge UI Kit tokens using partial codegen
 *
 * Note: Forge uses a SINGLE codegen block (@codegen-start:forge-tokens) with all tokens,
 * unlike Primitives which uses separate blocks per category. This allows Forge to mix
 * generated token maps with manual utility functions in one file.
 *
 * @see https://developer.atlassian.com/platform/forge/ui-kit/components/xcss/
 */
const generateForgeTokensContent = (): string => {
	const sections = [
		'/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */',
		createStylesFromFileTemplate('dimensions'),
		'',
		createSpacingStylesFromTemplate(),
		'',
		...(['text', 'background', 'border'] as const).map(createColorStylesFromTemplate),
		'',
		createInverseColorMapTemplate(),
		'',
		...(['opacity', 'shadow', 'surface'] as const).map(createElevationStylesFromTemplate),
		'',
		...(['width', 'radius'] as const).map(createShapeStylesFromTemplate),
		'',
		createStylesFromFileTemplate('layer'),
		'',
		createTypographyStylesFromTemplate(),
		'',
		createTextStylesFromTemplate(),
	];

	return sections.join('\n');
};

const forgeSourceFn = () =>
	createPartialSignedArtifact(
		generateForgeTokensContent,
		'yarn workspace @atlaskit/primitives codegen-styles',
		{
			id: 'forge-tokens',
			absoluteFilePath: forgeOutputPath,
			dependencies: [
				...templateFiles,
				colorTokensDependencyPath,
				spacingTokensDependencyPath,
				shapeTokensDependencyPath,
			],
		},
	);

// Write all generated files
primitivesSourceFns.forEach((sourceFn) => {
	writeFileSync(primitivesOutputs[0], sourceFn());
	writeFileSync(primitivesOutputs[1], sourceFn());
});

writeFileSync(forgeOutputPath, forgeSourceFn());

console.log('Generated style maps for:');
primitivesOutputs.forEach((path) => console.log(`  - ${path}`));
console.log(`  - ${forgeOutputPath}`);
