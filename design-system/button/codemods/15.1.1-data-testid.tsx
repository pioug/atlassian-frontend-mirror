import core, { API, FileInfo, Options } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  addCommentToStartOfFile,
  getDefaultSpecifierName,
  getJSXAttributesByName,
  hasImportDeclaration,
  Nullable,
} from './helpers/helpers-generic';
const relevantEntryPoints = [
  '@atlaskit/button',
  '@atlaskit/button/standard-button',
  '@atlaskit/button/loading-button',
  '@atlaskit/button/custom-theme-button',
];

function isRelevant(j: core.JSCodeshift, source: string): boolean {
  return relevantEntryPoints.some((entryPoint) =>
    hasImportDeclaration(j, source, entryPoint),
  );
}

function renameProp({
  j,
  base,
  component,
  attributeFrom,
  attributeTo,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  component: string;
  attributeFrom: string;
  attributeTo: string;
}) {
  base.findJSXElements(component).forEach((element) => {
    const first = getJSXAttributesByName({
      j,
      element: element.value,
      attributeName: attributeFrom,
    });

    // not using attribute
    if (!first.length) {
      return;
    }

    // let's check to see if they are using the to attribute
    const second = getJSXAttributesByName({
      j,
      element: element.value,
      attributeName: attributeTo,
    });

    // if the attribute we are moving to already exists we are in trouble
    if (second.length) {
      addCommentToStartOfFile({
        j,
        base,
        message: `
        Cannot rename ${attributeFrom} to ${attributeTo} on ${component}.
        A ${component} was detected with both ${attributeFrom} and ${attributeTo} props.
        Please remove the ${attributeFrom} prop and check your tests`,
      });
      return;
    }

    first.find(j.JSXIdentifier).replaceWith(j.jsxIdentifier(attributeTo));
  });
}

export function getNamedImportName({
  j,
  base,
  importPath,
  originalName,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  originalName: string;
  importPath: string;
}): Nullable<string> {
  const name: Nullable<string> =
    base
      .find(j.ImportDeclaration)
      .filter((path) => path.node.source.value === importPath)
      .find(j.ImportSpecifier)
      .nodes()
      .map(
        (specifier): Nullable<string> => {
          if (specifier.imported.name === originalName) {
            // aliased
            if (specifier.local) {
              return specifier.local.name;
            }
            // not aliased
            return originalName;
          }

          return null;
        },
      )
      .filter(Boolean)[0] || null;
  return name;
}

export default function transformer(
  file: FileInfo,
  { jscodeshift: j }: API,
  options: Options,
) {
  if (!isRelevant(j, file.source)) {
    return file.source;
  }

  const base: Collection<any> = j(file.source);

  // renaming default imports for entry points
  relevantEntryPoints.forEach((importPath) => {
    const defaultName: Nullable<string> = getDefaultSpecifierName({
      j,
      base,
      packageName: importPath,
    });

    if (defaultName != null) {
      renameProp({
        j,
        base,
        component: defaultName,
        attributeFrom: 'data-testid',
        attributeTo: 'testId',
      });
    }
  });

  // named imports
  const standard = getNamedImportName({
    j,
    base,
    importPath: '@atlaskit/button',
    originalName: 'StandardButton',
  });
  const loading = getNamedImportName({
    j,
    base,
    importPath: '@atlaskit/button',
    originalName: 'LoadingButton',
  });
  const customTheme = getNamedImportName({
    j,
    base,
    importPath: '@atlaskit/button',
    originalName: 'CustomThemeButton',
  });
  [standard, loading, customTheme].forEach((name) => {
    if (name != null) {
      renameProp({
        j,
        base,
        component: name,
        attributeFrom: 'data-testid',
        attributeTo: 'testId',
      });
    }
  });

  return base.toSource({ quote: 'single' });
}

// Note: not exporting a 'parser' because doing so
// will prevent consumers overriding it
