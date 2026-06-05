export function makeNodePlaceholderId(nodeType: string, pos: number): string {
	return `${nodeType}:${pos}`;
}
