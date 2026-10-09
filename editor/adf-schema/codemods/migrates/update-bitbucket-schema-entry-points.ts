import type { JSCodeshift, Collection } from '@atlaskit/codemod-utils';
import { changeImportEntryPoint } from '@atlaskit/codemod-utils/utils';

export const updateImportEntryPointsForBitbucketSchema: ((
	j: JSCodeshift,
	root: Collection<Node>,
) => void)[] = [
	changeImportEntryPoint(
		'@atlaskit/adf-schema',
		'bitbucketSchema',
		'@atlaskit/adf-schema/schema-bitbucket',
	),
];
