import type { API, Collection } from 'jscodeshift';

import { NEW_BUTTON_ENTRY_POINT } from './constants';
export const checkIfVariantAlreadyImported = (
  variant: string,
  fileSource: Collection<any>,
  j: API['jscodeshift'],
): boolean => {
  return (
    fileSource
      .find(j.ImportDeclaration)
      .filter((path) => path.node.source.value === NEW_BUTTON_ENTRY_POINT)
      .find(j.ImportSpecifier)
      .filter((path) => path.node.imported.name === variant).length > 0
  );
};
