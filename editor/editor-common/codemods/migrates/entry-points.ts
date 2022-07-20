import { changeImportEntryPoint } from '@atlaskit/codemod-utils';

const PACKAGE_NAME = '@atlaskit/editor-common';

export const validatorExports = [
  'getMarksByOrder',
  'getValidContent',
  'getValidDocument',
  'getValidMark',
  'getValidNode',
  'getValidUnknownNode',
  'isSameMark',
  'isSubSupType',
  'markOrder',
  'ADFStages',
].map((name) =>
  changeImportEntryPoint(
    `${PACKAGE_NAME}/utils`,
    name,
    `${PACKAGE_NAME}/validator`,
  ),
);

export const validatorTypes = [
  'ADDoc',
  'ADFStage',
  'ADMark',
  'ADMarkSimple',
  'ADNode',
].map((name) =>
  changeImportEntryPoint(
    `${PACKAGE_NAME}/utils`,
    name,
    `${PACKAGE_NAME}/validator`,
    true,
  ),
);
