import type { LabelStackTrieLookupTable } from './label-stack-registry';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function resolveLabelStackFromTrie(
	lookupTable: LabelStackTrieLookupTable,
	labelStackRef: number,
): string {
	const labels: string[] = [];
	let currentIndex = labelStackRef;

	while (currentIndex !== -1) {
		const node = lookupTable.n[currentIndex];

		if (!node) {
			return '';
		}

		labels.push(node.l);
		currentIndex = node.p;
	}

	return labels.reverse().join('/');
}
