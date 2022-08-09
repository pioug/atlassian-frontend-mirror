import { NodePath } from 'ast-types/lib/node-path';
import core, { FileInfo, JSXElement } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  addToImport,
  changeImportFor,
  hasImportDeclaration,
  removeImport,
  tryCreateImport,
} from './helpers-generic';

export function convertButtonType({
  j,
  base,
  elements,
  name,
  newPackageName,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  elements: NodePath<JSXElement, JSXElement>[];
  name: string;
  newPackageName: string;
}) {
  // Don't need to do anything if there are no elements of this type
  if (!elements.length) {
    return;
  }

  tryCreateImport({
    j,
    base,
    relativeToPackage: '@atlaskit/button',
    packageName: newPackageName,
  });

  addToImport({
    j,
    base,
    importSpecifier: j.importDefaultSpecifier(j.identifier(name)),
    packageName: newPackageName,
  });

  elements.forEach((path: NodePath<JSXElement, JSXElement>) => {
    path.replace(
      j.jsxElement(
        j.jsxOpeningElement(
          // name: new!
          j.jsxIdentifier(name),
          // keep the old attributes
          path.value.openingElement.attributes,
          // self closing
          path.value.openingElement.selfClosing,
        ),
        // Only create a closing element if the original had one
        // <Button /> => <Button /> (rather than <Button></Button>)
        path.value.closingElement
          ? j.jsxClosingElement(j.jsxIdentifier(name))
          : null,
        path.value.children,
      ),
    );
  });
}

export function changeType({
  j,
  base,
  oldName,
  newName,
  fallbackNameAlias,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  oldName: string;
  newName: string;
  fallbackNameAlias: string;
}) {
  changeImportFor({
    j,
    base,
    option: {
      type: 'change-name',
      oldName,
      newName,
      fallbackNameAlias,
    },
    oldPackagePath: '@atlaskit/button',
    newPackagePath: '@atlaskit/button/types',
  });
  changeImportFor({
    j,
    base,
    option: {
      type: 'change-name',
      oldName,
      newName,
      fallbackNameAlias,
    },
    oldPackagePath: '@atlaskit/button/types',
    newPackagePath: '@atlaskit/button/types',
  });
}

export function transformButton({
  j,
  file,
  custom: fn,
}: {
  j: core.JSCodeshift;
  file: FileInfo;
  custom: (base: Collection<any>) => void;
}) {
  const base: Collection<any> = j(file.source);

  // Exit early if not relevant
  // We are doing this so we don't touch the formatting of unrelated files
  const willChange: boolean =
    hasImportDeclaration(j, file.source, '@atlaskit/button') ||
    hasImportDeclaration(j, file.source, '@atlaskit/button/types');

  if (!willChange) {
    return file.source;
  }

  changeType({
    j,
    base,
    oldName: 'ButtonAppearances',
    newName: 'Appearance',
    fallbackNameAlias: 'DSButtonAppearance',
  });

  changeImportFor({
    j,
    base,
    // Not changing the name
    option: {
      type: 'keep-name',
      name: 'Theme',
      behaviour: 'keep-as-named-import',
    },
    oldPackagePath: '@atlaskit/button',
    newPackagePath: '@atlaskit/button/custom-theme-button',
  });

  changeImportFor({
    j,
    base,
    option: {
      type: 'keep-name',
      name: 'ButtonGroup',
      behaviour: 'move-to-default-import',
    },
    oldPackagePath: '@atlaskit/button',
    newPackagePath: '@atlaskit/button/button-group',
  });

  fn(base);

  removeImport({
    j,
    base,
    packageName: '@atlaskit/button',
  });

  return base.toSource({ quote: 'single' });
}
