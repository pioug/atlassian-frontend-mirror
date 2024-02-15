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

const isExportSpecifier = (node: Node): node is ExportSpecifier =>
  'getExportDeclaration' in node;

const isSourceFile = (node: Node): node is SourceFile => 'getFilePath' in node;

/**
 * This function tries to resolve the source file of a component symbol on
 * the component index file. e.g.
 *   export { Badge } from './badge/__generated__/index.partial';
 * in the index file will resolve to:
 *   platform/packages/forge/forge-ui/src/components/UIKit2-codegen/badge/__generated__/index.partial.tsx
 */
const loadComponentSourceFile = (
  componentSymbol: Symbol,
  project: Project,
): SourceFile | null => {
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
  const baseComponentSymbol = findBaseSymbolFromSourceFile(
    sourceFile,
    componentSymbol,
  );
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

const findBaseSymbolFromSourceFile = (
  sourceFile: SourceFile,
  symbol: Symbol,
) => {
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
  const baseComponentSymbol = findBaseSymbolFromSourceFile(
    componentSourceFile,
    componentSymbol,
  );
  if (!baseComponentSymbol) {
    throw new Error(
      'Could not find base component symbol for component: ' +
        componentSymbol.getName(),
    );
  }

  return generateComponentPropTypeSourceCode(
    componentSymbol,
    componentSourceFile,
  );
};

const generateComponentPropTypeSourceFiles = (
  componentOutputDir: string,
  componentPropTypeSymbols: Symbol[],
) => {
  // eslint-disable-next-line no-console
  console.log('Generating component prop type source files');

  // iterate component prop declarations in the index file
  componentPropTypeSymbols.forEach((componentSymbol) => {
    const componentSourceFile = loadComponentSourceFile(
      componentSymbol,
      forgeUIProject,
    );
    if (componentSourceFile) {
      try {
        const sourceCode = makeComponentPropTypeSourceCode(
          componentSymbol,
          componentSourceFile,
        );
        const sourceFilePath = resolve(
          componentOutputDir,
          `${componentSymbol.getName()}.tsx`,
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
        console.log(
          `Generated component prop type file: ${componentSymbol.getName()}`,
        );
      } finally {
        forgeUIProject.removeSourceFile(componentSourceFile);
      }
    } else {
      // eslint-disable-next-line no-console
      console.error(
        `Could not find source file for component: ${componentSymbol.getName()}`,
      );
    }
  });
};

const generateComponentIndexSourceFile = (
  componentOutputDir: string,
  componentPropTypeSymbols: Symbol[],
) => {
  // eslint-disable-next-line no-console
  console.log('Generating index file for component prop types');

  const indexFileContent = componentPropTypeSymbols
    .map((symbol) => {
      const componentName = symbol.getName();
      const componentAliasedName = symbol.getAliasedSymbol()?.getName();
      if (componentName !== componentAliasedName) {
        return `export type { ${componentAliasedName} as ${componentName} } from './${componentName}';`;
      } else {
        return `export type { ${componentName} } from './${componentName}';`;
      }
    })
    .join('\n');

  const indexFilePath = resolve(componentOutputDir, 'index.ts');
  const signedIndexFileContent = createSignedArtifact(
    indexFileContent,
    'yarn workspace @atlaskit/forge-react-types codegen',
    {
      description: 'Index file for component prop types',
      dependencies: componentPropTypeSymbols.map(
        (symbol) => `${componentOutputDir}/${symbol.getName()}.tsx`,
      ),
      outputFolder: componentOutputDir,
    },
  );
  fs.writeFileSync(indexFilePath, signedIndexFileContent);
};

const updatePackageJsonWithADSComponentDependencies = (
  componentOutputDir: string,
) => {
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
    fs
      .readFileSync(require.resolve('@atlassian/forge-ui/package.json'))
      .toString(),
  );
  const packageJsonPath = resolve(__dirname, '..', '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // remove all existing @atlaskit dependencies from packageJson
  const updatedDependencies = Object.entries<string>(packageJson.dependencies)
    .filter(([key]) => !key.startsWith('@atlaskit/'))
    .concat(
      Object.entries<string>(forgeUIPackageJson.dependencies).filter(([key]) =>
        utilizedPackages.has(key),
      ),
    )
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  packageJson.dependencies = updatedDependencies;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};

const generateComponentPropTypes = (componentPropTypeFilter?: string) => {
  const componentOutputDir = resolve(
    __dirname,
    '..',
    '..',
    'src',
    'components',
    '__generated__',
  );
  const componentIndexSourceFile = forgeUIProject.addSourceFileAtPath(
    require.resolve('@atlassian/forge-ui/src/components/UIKit2-codegen'),
  );
  try {
    const componentPropTypeSymbols = componentIndexSourceFile
      .getExportSymbols()
      .filter((symbol) =>
        symbol.getName().endsWith(componentPropTypeFilter ?? 'Props'),
      )
      .sort((a, b) => a.getName().localeCompare(b.getName()));

    generateComponentPropTypeSourceFiles(
      componentOutputDir,
      componentPropTypeSymbols,
    );

    // only generate index file if componentPropTypeFilter is not provided
    // this is to avoid overwriting the index file when generating a single
    // component.
    if (!componentPropTypeFilter) {
      generateComponentIndexSourceFile(
        componentOutputDir,
        componentPropTypeSymbols,
      );
    }

    updatePackageJsonWithADSComponentDependencies(componentOutputDir);
  } finally {
    forgeUIProject.removeSourceFile(componentIndexSourceFile);
  }
};

export { generateComponentPropTypes };
