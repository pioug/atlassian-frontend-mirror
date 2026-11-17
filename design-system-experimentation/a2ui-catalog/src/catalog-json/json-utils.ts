export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;

/** Calls `visit` for every object node in a JSON tree (depth-first, parents first). */
export const walkJsonObjects = (node: JsonValue, visit: (object: JsonObject) => void): void => {
	if (Array.isArray(node)) {
		node.forEach((child) => walkJsonObjects(child, visit));
		return;
	}
	if (node !== null && typeof node === 'object') {
		visit(node);
		Object.values(node).forEach((child) => walkJsonObjects(child, visit));
	}
};
