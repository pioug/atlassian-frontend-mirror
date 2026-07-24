/* eslint-disable no-console */
import { readdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

// eslint-disable-next-line import/no-extraneous-dependencies
import { createPartialSignedArtifact, createSignedArtifact } from '@atlassian/codegen';

import { createColorStylesFromTemplate } from './color-codegen-template';
import { createElevationStylesFromTemplate } from './elevation-codegen-template';
import { createInverseColorMapTemplate } from './inverse-color-map-template';
import { createStylesFromFileTemplate } from './misc-codegen-template';
import { createShapeStylesFromTemplate } from './shape-codegen-template';
import { createSpacingStylesFromTemplate } from './spacing-codegen-template';
import { createTextStylesFromTemplate } from './text-codegen-template';
import { createTypographyStylesFromTemplate } from './typography-codegen-template';

const colorTokensDependencyPath =
	require.resolve('../../tokens/src/artifacts/tokens-raw/atlassian-light');
const spacingTokensDependencyPath =
	require.resolve('../../tokens/src/artifacts/tokens-raw/atlassian-spacing');
const shapeTokensDependencyPath =
	require.resolve('../../tokens/src/artifacts/tokens-raw/atlassian-shape');

const templateFiles = readdirSync(join(__dirname, 'codegen-file-templates'), {
	withFileTypes: true,
})
	.filter((item) => !item.isDirectory())
	.map((item) => join(__dirname, 'codegen-file-templates', item.name));

const primitiveOutputDirectories = [
	join(__dirname, '../src/xcss'),
	join(__dirname, '../../css/codemods/0.5.2-primitives-emotion-to-compiled'),
];

const forgeOutputPath = join(
	__dirname,
	'../../../forge/forge-ui/src/components/UIKit/tokens.partial.tsx',
);

type PrimitiveArtifactDefinition = {
	fileName: string;
	dependencies: string[];
	template: string | (() => string);
	needsTokenImport?: boolean;
};

const createPrimitiveArtifactSource = ({
	template,
	needsTokenImport,
}: Pick<PrimitiveArtifactDefinition, 'template' | 'needsTokenImport'>): string => {
	const source = typeof template === 'function' ? template() : template;

	if (!needsTokenImport) {
		return source;
	}

	return `import { token } from '@atlaskit/tokens';\n\n${source}`;
};

const primitiveArtifactDefinitions: PrimitiveArtifactDefinition[] = [
	{
		fileName: 'dimension.tsx',
		template: () => createStylesFromFileTemplate('dimensions').toString(),
		dependencies: templateFiles.filter((v) => v.includes('dimensions')),
	},
	{
		fileName: 'positive-space.tsx',
		template: () => createSpacingStylesFromTemplate('positive'),
		dependencies: [spacingTokensDependencyPath],
		needsTokenImport: true,
	},
	{
		fileName: 'negative-space.tsx',
		template: () => createSpacingStylesFromTemplate('negative'),
		dependencies: [spacingTokensDependencyPath],
		needsTokenImport: true,
	},
	{
		fileName: 'all-space.tsx',
		template: () => createSpacingStylesFromTemplate('all'),
		dependencies: [spacingTokensDependencyPath],
		needsTokenImport: true,
	},
	{
		fileName: 'border-color.tsx',
		template: () => createColorStylesFromTemplate('border'),
		dependencies: [colorTokensDependencyPath],
		needsTokenImport: true,
	},
	{
		fileName: 'background-color.tsx',
		template: () => createColorStylesFromTemplate('background'),
		dependencies: [colorTokensDependencyPath],
		needsTokenImport: true,
	},
	{
		fileName: 'text-color.tsx',
		template: () => createColorStylesFromTemplate('text'),
		dependencies: [colorTokensDependencyPath],
		needsTokenImport: true,
	},
	{
		fileName: 'fill.tsx',
		template: () => createColorStylesFromTemplate('fill'),
		dependencies: [colorTokensDependencyPath],
		needsTokenImport: true,
	},
	{
		fileName: 'inverse-color.tsx',
		template: createInverseColorMapTemplate,
		dependencies: [colorTokensDependencyPath],
	},
	{
		fileName: 'opacity.tsx',
		template: () => createElevationStylesFromTemplate('opacity'),
		dependencies: [colorTokensDependencyPath],
		needsTokenImport: true,
	},
	{
		fileName: 'shadow.tsx',
		template: () => createElevationStylesFromTemplate('shadow'),
		dependencies: [colorTokensDependencyPath],
		needsTokenImport: true,
	},
	{
		fileName: 'surface-color.tsx',
		template: () => createElevationStylesFromTemplate('surface'),
		dependencies: [colorTokensDependencyPath],
		needsTokenImport: true,
	},
	{
		fileName: 'layer.tsx',
		template: () => createStylesFromFileTemplate('layer').toString(),
		dependencies: templateFiles,
	},
	{
		fileName: 'border-width.tsx',
		template: () => createShapeStylesFromTemplate('width'),
		dependencies: [shapeTokensDependencyPath],
		needsTokenImport: true,
	},
	{
		fileName: 'border-radius.tsx',
		template: () => createShapeStylesFromTemplate('radius'),
		dependencies: [shapeTokensDependencyPath],
		needsTokenImport: true,
	},
	{
		fileName: 'font.tsx',
		template: () => createTypographyStylesFromTemplate('font'),
		dependencies: templateFiles,
		needsTokenImport: true,
	},
	{
		fileName: 'font-weight.tsx',
		template: () => createTypographyStylesFromTemplate('fontWeight'),
		dependencies: templateFiles,
		needsTokenImport: true,
	},
	{
		fileName: 'font-family.tsx',
		template: () => createTypographyStylesFromTemplate('fontFamily'),
		dependencies: templateFiles,
		needsTokenImport: true,
	},
	{
		fileName: 'text-size.tsx',
		template: () => createTextStylesFromTemplate('textSize'),
		dependencies: templateFiles,
		needsTokenImport: true,
	},
	{
		fileName: 'text-weight.tsx',
		template: () => createTextStylesFromTemplate('textWeight'),
		dependencies: templateFiles,
		needsTokenImport: true,
	},
	{
		fileName: 'metric-text-size.tsx',
		template: () => createTextStylesFromTemplate('metricTextSize'),
		dependencies: templateFiles,
		needsTokenImport: true,
	},
];

const primitiveOutputs = primitiveOutputDirectories.flatMap((outputDirectory) =>
	primitiveArtifactDefinitions.map((definition) => ({
		...definition,
		outputPath: join(outputDirectory, definition.fileName),
	})),
);

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
		...(['positive', 'negative', 'all'] as const).map(createSpacingStylesFromTemplate),
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
		...(['font', 'fontWeight', 'fontFamily'] as const).map(createTypographyStylesFromTemplate),
		'',
		...(['textSize', 'textWeight', 'metricTextSize'] as const).map(createTextStylesFromTemplate),
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
primitiveOutputs.forEach(({ outputPath, dependencies, template, needsTokenImport }) => {
	writeFileSync(
		outputPath,
		createSignedArtifact(
			createPrimitiveArtifactSource({ template, needsTokenImport }),
			'yarn workspace @atlaskit/primitives codegen-styles',
			{
				dependencies,
				outputFolder: dirname(outputPath),
			},
		),
	);
});

writeFileSync(forgeOutputPath, forgeSourceFn());

console.log('Generated style maps for:');
primitiveOutputs.forEach(({ outputPath }) => console.log(`  - ${outputPath}`));
console.log(`  - ${forgeOutputPath}`);
