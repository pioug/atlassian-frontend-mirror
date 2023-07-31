import { changeImportEntryPoint } from '@atlaskit/codemod-utils';

const ENTRY_POINT_SUFFIX = 'commands';
const PACKAGE_NAME = 'prosemirror-commands';
const code: string[] = [
  'deleteSelection',
  'joinBackward',
  'selectNodeBackward',
  'joinForward',
  'selectNodeForward',
  'joinUp',
  'joinDown',
  'lift',
  'newlineInCode',
  'exitCode',
  'createParagraphNear',
  'liftEmptyBlock',
  'splitBlock',
  'splitBlockKeepMarks',
  'selectParentNode',
  'selectAll',
  'wrapIn',
  'setBlockType',
  'toggleMark',
  'autoJoin',
  'chainCommands',
  'pcBaseKeymap',
  'macBaseKeymap',
  'baseKeymap',
];

export const migrateImports = code.map(name =>
  changeImportEntryPoint(
    PACKAGE_NAME,
    name,
    `@atlaskit/editor-prosemirror/${ENTRY_POINT_SUFFIX}`,
  ),
);

const types: string[] = [];
export const migrateTypes = types.map(name =>
  changeImportEntryPoint(
    PACKAGE_NAME,
    name,
    `@atlaskit/editor-prosemirror/${ENTRY_POINT_SUFFIX}`,
    true,
  ),
);
