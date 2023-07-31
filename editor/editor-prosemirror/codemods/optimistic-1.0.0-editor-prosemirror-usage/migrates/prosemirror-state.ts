import { changeImportEntryPoint } from '@atlaskit/codemod-utils';

const ENTRY_POINT_SUFFIX = 'state';
const PACKAGE_NAME = 'prosemirror-state';
const code: string[] = [
  'AllSelection',
  'EditorState',
  'NodeSelection',
  'Plugin',
  'PluginKey',
  'Selection',
  'SelectionRange',
  'TextSelection',
  'Transaction',
];

export const migrateImports = code.map(name =>
  changeImportEntryPoint(
    PACKAGE_NAME,
    name,
    `@atlaskit/editor-prosemirror/${ENTRY_POINT_SUFFIX}`,
  ),
);

const types: string[] = [
  'ReadonlyTransaction',
  'SafePluginSpec',
  'SafeStateField',
  'PluginSpec',
  'SelectionBookmark',
  'StateField',
];
export const migrateTypes = types.map(name =>
  changeImportEntryPoint(
    PACKAGE_NAME,
    name,
    `@atlaskit/editor-prosemirror/${ENTRY_POINT_SUFFIX}`,
    true,
  ),
);
