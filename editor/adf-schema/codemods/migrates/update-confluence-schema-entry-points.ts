import type { JSCodeshift, Collection } from '@atlaskit/codemod-utils';
import { changeImportEntryPoint } from '@atlaskit/codemod-utils/utils';

export const updateImportEntryPointsForConfluenceSchema: ((
	j: JSCodeshift,
	root: Collection<Node>,
) => void)[] = [
	changeImportEntryPoint(
		'@atlaskit/adf-schema',
		'confluenceSchema',
		'@atlaskit/adf-schema/schema-confluence',
	),
	changeImportEntryPoint(
		'@atlaskit/adf-schema',
		'confluenceSchemaWithMediaSingle',
		'@atlaskit/adf-schema/schema-confluence',
	),
];
