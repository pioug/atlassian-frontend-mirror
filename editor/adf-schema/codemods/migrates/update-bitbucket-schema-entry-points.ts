import { changeImportEntryPoint, type JSCodeshift, type Collection } from '@atlaskit/codemod-utils';

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
