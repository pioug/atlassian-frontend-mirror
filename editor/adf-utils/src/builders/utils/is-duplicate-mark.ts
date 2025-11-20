// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDuplicateMark(node: { marks?: Array<any> }, type: string): boolean {
	if (node.marks && node.marks.some((mark) => mark.type === type)) {
		return true;
	}
	return false;
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function duplicateMarkError(node: { marks?: Array<any> }, type: string) {
	return `Mark with the same name '${type}' already exists on a node: ${JSON.stringify(node)}`;
}
