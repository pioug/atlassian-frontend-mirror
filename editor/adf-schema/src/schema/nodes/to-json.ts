import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export const toJSON = (
	node: PMNode,
): {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs: any;
} => ({
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs: Object.keys(node.attrs).reduce<any>((obj, key) => {
		if (node.attrs[key] !== null) {
			obj[key] = node.attrs[key];
		}
		return obj;
	}, {}),
});
