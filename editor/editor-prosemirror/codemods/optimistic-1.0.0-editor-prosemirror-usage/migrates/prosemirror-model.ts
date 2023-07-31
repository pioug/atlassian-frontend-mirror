import { changeImportEntryPoint } from '@atlaskit/codemod-utils';

const ENTRY_POINT_SUFFIX = 'model';
const PACKAGE_NAME = 'prosemirror-model';
const code: string[] = [
  'ContentMatch',
  'DOMParser',
  'DOMSerializer',
  'Fragment',
  'Mark',
  'MarkType',
  'NodeRange',
  'NodeType',
  'ReplaceError',
  'ResolvedPos',
  'Schema',
  'Slice',
  'Node',
];

export const migrateImports = code.map(name =>
  changeImportEntryPoint(
    PACKAGE_NAME,
    name,
    `@atlaskit/editor-prosemirror/${ENTRY_POINT_SUFFIX}`,
  ),
);

const types: string[] = [
  'OrderedMap',
  'AttributeSpec',
  'DOMOutputSpecArray',
  'MarkSpec',
  'NodeSpec',
  'ParseOptions',
  'ParseRule',
  'SchemaSpec',
  'DOMOutputSpec',
];
export const migrateTypes = types.map(name =>
  changeImportEntryPoint(
    PACKAGE_NAME,
    name,
    `@atlaskit/editor-prosemirror/${ENTRY_POINT_SUFFIX}`,
    true,
  ),
);
