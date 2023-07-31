import { changeImportEntryPoint } from '@atlaskit/codemod-utils';

const ENTRY_POINT_SUFFIX = 'keymap';
const PACKAGE_NAME = 'prosemirror-keymap';
const code: string[] = ['keymap', 'keydownHandler'];

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
