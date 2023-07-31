import { changeImportEntryPoint } from '@atlaskit/codemod-utils';

const ENTRY_POINT_SUFFIX = 'utils';
const PACKAGE_NAME = 'prosemirror-utils';
const code: string[] = [
  'findParentNode',
  'findParentNodeClosestToPos',
  'findParentDomRef',
  'hasParentNode',
  'findParentNodeOfType',
  'findParentNodeOfTypeClosestToPos',
  'hasParentNodeOfType',
  'findParentDomRefOfType',
  'findSelectedNodeOfType',
  'isNodeSelection',
  'findPositionOfNodeBefore',
  'findDomRefAtPos',
  'flatten',
  'findChildren',
  'findTextNodes',
  'findInlineNodes',
  'findBlockNodes',
  'findChildrenByAttr',
  'findChildrenByType',
  'findChildrenByMark',
  'contains',
  'removeParentNodeOfType',
  'replaceParentNodeOfType',
  'removeSelectedNode',
  'replaceSelectedNode',
  'canInsert',
  'safeInsert',
  'setParentNodeMarkup',
  'selectParentNodeOfType',
  'removeNodeBefore',
  'setTextSelection',
];

export const migrateImports = code.map(name =>
  changeImportEntryPoint(
    PACKAGE_NAME,
    name,
    `@atlaskit/editor-prosemirror/${ENTRY_POINT_SUFFIX}`,
  ),
);

const types: string[] = [
  'Predicate',
  'DomAtPos',
  'ContentNodeWithPos',
  'NodeWithPos',
  'CellTransform',
  'MovementOptions',
];
export const migrateTypes = types.map(name =>
  changeImportEntryPoint(
    PACKAGE_NAME,
    name,
    `@atlaskit/editor-prosemirror/${ENTRY_POINT_SUFFIX}`,
    true,
  ),
);
