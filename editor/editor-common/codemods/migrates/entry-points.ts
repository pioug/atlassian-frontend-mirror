import { changeImportEntryPoint, type Collection, type JSCodeshift } from '@atlaskit/codemod-utils';

const PACKAGE_NAME = '@atlaskit/editor-common';

export const validatorExports: ((j: JSCodeshift, root: Collection<Node>) => void)[] = [
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
].map((name) => changeImportEntryPoint(`${PACKAGE_NAME}/utils`, name, `${PACKAGE_NAME}/validator`));

export const validatorTypes: ((j: JSCodeshift, root: Collection<Node>) => void)[] = [
	'ADDoc',
	'ADFStage',
	'ADMark',
	'ADMarkSimple',
	'ADNode',
].map((name) =>
	changeImportEntryPoint(`${PACKAGE_NAME}/utils`, name, `${PACKAGE_NAME}/validator`, true),
);
