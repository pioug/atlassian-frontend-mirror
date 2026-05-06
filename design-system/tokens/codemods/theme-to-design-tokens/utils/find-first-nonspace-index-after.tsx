export function findFirstNonspaceIndexAfter(text: string, index: number): number {
	const rest = text.slice(index + 1);
	const indexInRest = rest.search(/\S/);
	if (indexInRest === -1) {
		return text.length;
	} else {
		return index + 1 + indexInRest;
	}
}
