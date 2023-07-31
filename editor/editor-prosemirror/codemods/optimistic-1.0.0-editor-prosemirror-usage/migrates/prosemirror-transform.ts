import { changeImportEntryPoint } from '@atlaskit/codemod-utils';

const ENTRY_POINT_SUFFIX = 'transform';
const PACKAGE_NAME = 'prosemirror-transform';
const code: string[] = [
  'AddMarkStep',
  'MapResult',
  'Mapping',
  'RemoveMarkStep',
  'ReplaceAroundStep',
  'ReplaceStep',
  'Step',
  'StepMap',
  'StepResult',
  'Transform',
  'canJoin',
  'canSplit',
  'dropPoint',
  'findWrapping',
  'insertPoint',
  'joinPoint',
  'liftTarget',
  'replaceStep',
];

export const migrateImports = code.map(name =>
  changeImportEntryPoint(
    PACKAGE_NAME,
    name,
    `@atlaskit/editor-prosemirror/${ENTRY_POINT_SUFFIX}`,
  ),
);

const types: string[] = ['Mappable'];
export const migrateTypes = types.map(name =>
  changeImportEntryPoint(
    PACKAGE_NAME,
    name,
    `@atlaskit/editor-prosemirror/${ENTRY_POINT_SUFFIX}`,
    true,
  ),
);
