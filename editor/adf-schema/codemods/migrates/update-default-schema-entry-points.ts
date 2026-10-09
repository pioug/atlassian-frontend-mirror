import type { JSCodeshift, Collection } from '@atlaskit/codemod-utils';
import { changeImportEntryPoint } from '@atlaskit/codemod-utils/utils';

export const updateImportEntryPointsForDefaultSchema: ((
	j: JSCodeshift,
	root: Collection<Node>,
) => void)[] = [
	changeImportEntryPoint(
		'@atlaskit/adf-schema',
		'defaultSchema',
		'@atlaskit/adf-schema/schema-default',
	),
	changeImportEntryPoint(
		'@atlaskit/adf-schema',
		'getSchemaBasedOnStage',
		'@atlaskit/adf-schema/schema-default',
	),
	changeImportEntryPoint(
		'@atlaskit/adf-schema',
		'defaultSchemaConfig',
		'@atlaskit/adf-schema/schema-default',
	),
];
