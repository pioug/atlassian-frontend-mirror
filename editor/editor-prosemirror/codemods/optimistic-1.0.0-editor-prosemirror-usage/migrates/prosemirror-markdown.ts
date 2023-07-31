import { changeImportEntryPoint } from '@atlaskit/codemod-utils';

const ENTRY_POINT_SUFFIX = 'markdown';
const PACKAGE_NAME = 'prosemirror-markdown';
const code: string[] = [
  'MarkdownParser',
  'MarkdownSerializer',
  'MarkdownSerializerState',
  'defaultMarkdownParser',
  'defaultMarkdownSerializer',
];

export const migrateImports = code.map(name =>
  changeImportEntryPoint(
    PACKAGE_NAME,
    name,
    `@atlaskit/editor-prosemirror/${ENTRY_POINT_SUFFIX}`,
  ),
);

const types: string[] = [
  'MarkSerializer',
  'MarkSerializerSpec',
  'NodeSerializerSpec',
  'NodeSerializer',
];
export const migrateTypes = types.map(name =>
  changeImportEntryPoint(
    PACKAGE_NAME,
    name,
    `@atlaskit/editor-prosemirror/${ENTRY_POINT_SUFFIX}`,
    true,
  ),
);
