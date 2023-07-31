import { changeImportEntryPoint } from '@atlaskit/codemod-utils';

export const migrateImports = [
  'Decoration',
  'DecorationSet',
  'EditorView',
  '__serializeForClipboard',
  '__parseFromClipboard',
].map(name =>
  changeImportEntryPoint(
    `prosemirror-view`,
    name,
    `@atlaskit/editor-prosemirror/view`,
  ),
);

export const migrateTypes = [
  'DecorationSource',
  'WidgetDecorationSpec',
  'InlineDecorationSpec',
  'DecorationAttrs',
  'EditorProps',
  'DirectEditorProps',
  'NodeView',
].map(name =>
  changeImportEntryPoint(
    `prosemirror-view`,
    name,
    `@atlaskit/editor-prosemirror/view`,
    true,
  ),
);
