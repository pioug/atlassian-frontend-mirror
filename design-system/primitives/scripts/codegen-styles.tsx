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

const targetPath = join(__dirname, '../', 'src', 'xcss', 'style-maps.partial.tsx');
const xcssCodemodPath = join(
	process.cwd(),
	'../../../',
	'packages/design-system/css/codemods/0.5.2-primitives-emotion-to-compiled/style-maps.partial.tsx',
);

const sourceFns = [
	// width, height, minWidth, maxWidth, minHeight, maxHeight
	() =>
		createPartialSignedArtifact(
			(options) => options.map(createStylesFromFileTemplate).join('\n'),
			'yarn workspace @atlaskit/primitives codegen-styles',
			{
				id: 'dimensions',
				absoluteFilePath: targetPath,
				dependencies: templateFiles.filter((v) => v.includes('dimensions')),
			},
		),
	() =>
		createPartialSignedArtifact(
			(options) => options.map(createStylesFromFileTemplate).join('\n'),
			'yarn workspace @atlaskit/primitives codegen-styles',
			{
				id: 'dimensions',
				absoluteFilePath: xcssCodemodPath,
				dependencies: templateFiles.filter((v) => v.includes('dimensions')),
			},
		),
	// padding*, gap*, inset*
	() =>
		createPartialSignedArtifact(
			createSpacingStylesFromTemplate,
			'yarn workspace @atlaskit/primitives codegen-styles',
			{
				id: 'spacing',
				absoluteFilePath: targetPath,
				dependencies: [spacingTokensDependencyPath],
			},
		),
	() =>
		createPartialSignedArtifact(
			createSpacingStylesFromTemplate,
			'yarn workspace @atlaskit/primitives codegen-styles',
			{
				id: 'spacing',
				absoluteFilePath: xcssCodemodPath,
				dependencies: [spacingTokensDependencyPath],
			},
		),
	// text color, background-color, border-color
	() =>
		createPartialSignedArtifact(
			(options) => options.map(createColorStylesFromTemplate).join('\n'),
			'yarn workspace @atlaskit/primitives codegen-styles',
			{
				id: 'colors',
				absoluteFilePath: targetPath,
				dependencies: [colorTokensDependencyPath],
			},
		),
	() =>
		createPartialSignedArtifact(
			(options) => options.map(createColorStylesFromTemplate).join('\n'),
			'yarn workspace @atlaskit/primitives codegen-styles',
			{
				id: 'colors',
				absoluteFilePath: xcssCodemodPath,
				dependencies: [colorTokensDependencyPath],
			},
		),
	// inverse color map
	() =>
		createPartialSignedArtifact(
			createInverseColorMapTemplate,
			'yarn workspace @atlaskit/primitives codegen-styles',
			{
				id: 'inverse-colors',
				absoluteFilePath: targetPath,
				dependencies: [colorTokensDependencyPath],
			},
		),
	// elevation (opacity, shadow, surface)
	() =>
		createPartialSignedArtifact(
			(options) => options.map(createElevationStylesFromTemplate).join('\n'),
			'yarn workspace @atlaskit/primitives codegen-styles',
			{
				id: 'elevation',
				absoluteFilePath: targetPath,
				dependencies: [colorTokensDependencyPath],
			},
		),
	() =>
		createPartialSignedArtifact(
			(options) => options.map(createElevationStylesFromTemplate).join('\n'),
			'yarn workspace @atlaskit/primitives codegen-styles',
			{
				id: 'elevation',
				absoluteFilePath: xcssCodemodPath,
				dependencies: [colorTokensDependencyPath],
			},
		),
	// border-width, border-radius
	() =>
		createPartialSignedArtifact(
			(options) => options.map(createShapeStylesFromTemplate).join('\n'),
			'yarn workspace @atlaskit/primitives codegen-styles',
			{
				id: 'border',
				absoluteFilePath: targetPath,
				dependencies: [shapeTokensDependencyPath],
			},
		),
	() =>
		createPartialSignedArtifact(
			(options) => options.map(createShapeStylesFromTemplate).join('\n'),
			'yarn workspace @atlaskit/primitives codegen-styles',
			{
				id: 'border',
				absoluteFilePath: xcssCodemodPath,
				dependencies: [shapeTokensDependencyPath],
			},
		),
	// border-color, border-radius, border-width, layer',
	() =>
		createPartialSignedArtifact(
			(options) => options.map(createStylesFromFileTemplate).join('\n'),
			'yarn workspace @atlaskit/primitives codegen-styles',
			{
				id: 'misc',
				absoluteFilePath: targetPath,
				dependencies: templateFiles,
			},
		),
	() =>
		createPartialSignedArtifact(
			(options) => options.map(createStylesFromFileTemplate).join('\n'),
			'yarn workspace @atlaskit/primitives codegen-styles',
			{
				id: 'misc',
				absoluteFilePath: xcssCodemodPath,
				dependencies: templateFiles,
			},
		),
	// font*, lineheight
	() =>
		createPartialSignedArtifact(
			createTypographyStylesFromTemplate,
			'yarn workspace @atlaskit/primitives codegen-styles',
			{
				id: 'typography',
				absoluteFilePath: targetPath,
				dependencies: templateFiles,
			},
		),
	() =>
		createPartialSignedArtifact(
			createTypographyStylesFromTemplate,
			'yarn workspace @atlaskit/primitives codegen-styles',
			{
				id: 'typography',
				absoluteFilePath: xcssCodemodPath,
				dependencies: templateFiles,
			},
		),
	// font and weight map for text primitive
	() =>
		createPartialSignedArtifact(
			createTextStylesFromTemplate,
			'yarn workspace @atlaskit/primitives codegen-styles',
			{
				id: 'text',
				absoluteFilePath: targetPath,
				dependencies: templateFiles,
			},
		),
	() =>
		createPartialSignedArtifact(
			createTextStylesFromTemplate,
			'yarn workspace @atlaskit/primitives codegen-styles',
			{
				id: 'text',
				absoluteFilePath: xcssCodemodPath,
				dependencies: templateFiles,
			},
		),
];

sourceFns.forEach((sourceFn) => {
	writeFileSync(targetPath, sourceFn());
	writeFileSync(xcssCodemodPath, sourceFn());
});

console.log(`${targetPath} written!`);
