import { reduce } from '@atlaskit/adf-utils/traverse';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
