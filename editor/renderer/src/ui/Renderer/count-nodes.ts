import { reduce } from '@atlaskit/adf-utils/traverse';

export function countNodes(adfDocument: any) {
	return reduce<Record<string, number>>(
		adfDocument,
		(acc, node) => {
			acc[node.type] = (acc[node.type] || 0) + 1;
			return acc;
		},
		{},
	);
}
