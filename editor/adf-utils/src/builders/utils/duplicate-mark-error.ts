// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function duplicateMarkError(node: { marks?: Array<any> }, type: string): any {
	return `Mark with the same name '${type}' already exists on a node: ${JSON.stringify(node)}`;
}
