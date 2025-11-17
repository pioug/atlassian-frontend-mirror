// This rule is banning the `Symbol` type from ts-morph. However we need this type in our functions below. The `symbol` replacement is throwing errors
/* eslint-disable @typescript-eslint/ban-types */
import { createSignedArtifact } from '@atlassian/codegen';
import { Project } from 'ts-morph';
import type { Symbol, SourceFile, ExportSpecifier, Node } from 'ts-morph';
import { resolve } from 'path';
import fs from 'fs';
import { generateComponentPropTypeSourceCode } from './codeGenerator';

const forgeUIProject = new Project({
	tsConfigFilePath: require.resolve('@atlassian/forge-ui/tsconfig.json'),
	skipAddingFilesFromTsConfig: true,
});

const isExportSpecifier = (node: Node): node is ExportSpecifier => 'getExportDeclaration' in node;

const isSourceFile = (node: Node): node is SourceFile => 'getFilePath' in node;

/**
 * This function tries to resolve the source file of a component symbol on
 * the component index file. e.g.
 *   export { Badge } from './badge/__generated__/index.partial';
 * in the index file will resolve to:
 *   platform/packages/forge/forge-ui/src/components/UIKit/badge/__generated__/index.partial.tsx
 */
const loadComponentSourceFile = (componentSymbol: Symbol, project: Project): SourceFile | null => {
	const declaration = componentSymbol.getDeclarations()[0];
	if (!declaration || !isExportSpecifier(declaration)) {
		return null;
	}
	const importSrcDeclaration = declaration
		.getExportDeclaration()
		.getModuleSpecifier()
		?.getSymbol()
		?.getValueDeclaration();
	if (!importSrcDeclaration || !isSourceFile(importSrcDeclaration)) {
		return null;
	}
	const importSrc = importSrcDeclaration.getFilePath();
	const sourceFile = project.addSourceFileAtPath(importSrc);
	const baseComponentSymbol = findBaseSymbolFromSourceFile(sourceFile, componentSymbol);
	if (!baseComponentSymbol) {
		return sourceFile;
	}
	// recursively resolve the source file of the base component symbol, it is
	// needed for TagProps
	let nestedSourceFile = loadComponentSourceFile(baseComponentSymbol!, project);
	try {
		return nestedSourceFile ?? sourceFile;
	} finally {
		if (nestedSourceFile) {
			// unload the parent source file if nested source file is found
			project.removeSourceFile(sourceFile);
		}
	}
};

const findBaseSymbolFromSourceFile = (sourceFile: SourceFile, symbol: Symbol) => {
	return sourceFile.getExportSymbols().find((exportSymbol) => {
		return (
			exportSymbol.getName() === symbol.getName() ||
			exportSymbol.getName() === symbol.getAliasedSymbol()!.getName()
		);
	});
};

const makeComponentPropTypeSourceCode = (
	componentSymbol: Symbol,
	componentSourceFile: SourceFile,
) => {
	const baseComponentSymbol = findBaseSymbolFromSourceFile(componentSourceFile, componentSymbol);
	if (!baseComponentSymbol) {
		throw new Error(
			'Could not find base component symbol for component: ' + componentSymbol.getName(),
		);
	}

	return generateComponentPropTypeSourceCode(componentSymbol, componentSourceFile);
};

const generateComponentPropTypeSourceFiles = (
	componentOutputDir: string,
	componentPropTypeSymbols: Symbol[],
) => {
	// eslint-disable-next-line no-console
	console.log('Generating component prop type source files');

	// iterate component prop declarations in the index file
	componentPropTypeSymbols.forEach((componentSymbol) => {
		const componentSourceFile = loadComponentSourceFile(componentSymbol, forgeUIProject);
		if (componentSourceFile) {
			try {
				const sourceCode = makeComponentPropTypeSourceCode(componentSymbol, componentSourceFile);
				const sourceFilePath = resolve(
					componentOutputDir,
					`${componentSymbol.getName()}.codegen.tsx`,
				);

				const signedSourceCode = createSignedArtifact(
					sourceCode,
					'yarn workspace @atlaskit/forge-react-types codegen',
					{
						description: `Extract component prop types from UIKit 2 components - ${componentSymbol.getName()}`,
						dependencies: [componentSourceFile.getFilePath()],
						outputFolder: componentOutputDir,
					},
				);
				fs.writeFileSync(sourceFilePath, signedSourceCode);

				// eslint-disable-next-line no-console
				console.log(`Generated component prop type file: ${componentSymbol.getName()}`);
			} finally {
				forgeUIProject.removeSourceFile(componentSourceFile);
			}
		} else {
			// eslint-disable-next-line no-console
			console.error(`Could not find source file for component: ${componentSymbol.getName()}`);
		}
	});
};

const updatePackageJsonWithADSComponentDependencies = (componentOutputDir: string) => {
	// collect all @atlaskit dependencies from the generated code in the component output dir
	const componentOutputProject = new Project({
		tsConfigFilePath: require.resolve('../../tsconfig.json'),
	});
	const utilizedPackages = componentOutputProject
		.getSourceFiles(`${componentOutputDir}/*.tsx`)
		.reduce((packages, source) => {
			source.getImportDeclarations().forEach((importDeclaration) => {
				const importPath = importDeclaration.getModuleSpecifierValue();
				// clean up import path so it contains only @atlaskit/package-name (without @atlaskit/package-name/further)
				const packageMatch = importPath.match(/(@atlaskit\/[^/]+)/);
				if (packageMatch) {
					packages.add(packageMatch[1]);
				}
			});
			return packages;
		}, new Set<string>());

	// eslint-disable-next-line no-console
	console.log('Updating package.json with ADS component dependencies');

	const forgeUIPackageJson = JSON.parse(
		fs.readFileSync(require.resolve('@atlassian/forge-ui/package.json')).toString(),
	);
	const packageJsonPath = resolve(__dirname, '..', '..', 'package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

	// Build updated dependencies: keep non-@atlaskit packages, and add/update @atlaskit packages
	const updatedDependencies = Object.entries<string>(packageJson.dependencies)
		.filter(([key]) => !key.startsWith('@atlaskit/'))
		.reduce<Record<string, string>>((acc, [key, value]) => {
			acc[key] = value;
			return acc;
		}, {});

	// Add @atlaskit packages that are being used
	// Prefer version from forgeUIPackageJson if available, otherwise keep existing version
	for (const packageName of utilizedPackages) {
		if (forgeUIPackageJson.dependencies?.[packageName]) {
			// Use version from forgeUIPackageJson
			updatedDependencies[packageName] = forgeUIPackageJson.dependencies[packageName];
		} else if (packageJson.dependencies?.[packageName]) {
			// Keep existing version if not in forgeUIPackageJson
			updatedDependencies[packageName] = packageJson.dependencies[packageName];
		}
		// If package is not in either, we skip it (shouldn't happen if codegen is working correctly)
	}

	// Sort dependencies alphabetically
	const sortedDependencies = Object.entries(updatedDependencies).sort(([a], [b]) =>
		a.localeCompare(b),
	);

	packageJson.dependencies = Object.fromEntries(sortedDependencies);
	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, '\t') + '\n');
};
/**
 * This copies types file from the types file in UIKit
 * to __generated__ folder.
 */
const generateSharedTypesFile = (componentOutputDir: string) => {
	// eslint-disable-next-line no-console
	console.log('Generating shared types file');

	const uiKit2TypesFile = require.resolve('@atlassian/forge-ui/UIKit/types');

	const signedSourceCode = createSignedArtifact(
		fs.readFileSync(uiKit2TypesFile, 'utf8'),
		'yarn workspace @atlaskit/forge-react-types codegen',
		{
			description:
				'Shared types file for UI Kit components. Add shared types to `packages/forge/forge-ui/src/components/UIKit/types.ts` for it to be code generated here and imported correctly into prop type files',
			dependencies: [uiKit2TypesFile],
			outputFolder: componentOutputDir,
		},
	);

	const typesFilePath = resolve(componentOutputDir, 'types.codegen.ts');
	fs.writeFileSync(typesFilePath, signedSourceCode);
};

const generateComponentPropTypes = (componentNames?: string) => {
	const componentOutputDir = resolve(__dirname, '..', '..', 'src', 'components', '__generated__');
	const componentIndexSourceFile = forgeUIProject.addSourceFileAtPath(
		require.resolve('@atlassian/forge-ui/UIKit'),
	);
	try {
		const componentNamesFilter = componentNames ? componentNames.split(',') : [];
		const componentPropTypeSymbols = componentIndexSourceFile
			.getExportSymbols()
			.filter((symbol) => {
				if (componentNamesFilter.length === 0) {
					return symbol.getName().endsWith('Props');
				}
				const symbolName = symbol.getName();
				return componentNamesFilter.some((componentName) => {
					return symbolName === `${componentName}Props`;
				});
			})
			.sort((a, b) => a.getName().localeCompare(b.getName()));

		// generate share types file first
		generateSharedTypesFile(componentOutputDir);

		generateComponentPropTypeSourceFiles(componentOutputDir, componentPropTypeSymbols);

		updatePackageJsonWithADSComponentDependencies(componentOutputDir);
	} finally {
		forgeUIProject.removeSourceFile(componentIndexSourceFile);
	}
};

export { generateComponentPropTypes };
