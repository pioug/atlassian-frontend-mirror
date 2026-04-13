/**
 * Recursively searches an ADF node tree for a node with the given localId.
 * Works with plain JSON ADF (no ProseMirror dependency).
 * Returns the node if found, or undefined if not found.
 */
export function findNodeByLocalId(
	node: Record<string, unknown>,
	localId: string,
): Record<string, unknown> | undefined {
	if (
		node.attrs &&
		typeof node.attrs === 'object' &&
		(node.attrs as Record<string, unknown>).localId === localId
	) {
		return node;
	}

	if (Array.isArray(node.content)) {
		for (const child of node.content) {
			const found = findNodeByLocalId(child as Record<string, unknown>, localId);
			if (found) {
				return found;
			}
		}
	}

	return undefined;
}
