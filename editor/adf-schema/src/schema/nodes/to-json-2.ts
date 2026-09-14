import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

/**
 * There's no concept of optional property in ProseMirror. It sets value as `null`
 * when there's no use of any property. We are filtering out all private & optional attrs here.
 */
const optionalAttributes = ['occurrenceKey', 'width', 'height', 'url', 'alt', 'localId'];

const externalOnlyAttributes = ['type', 'url', 'width', 'height', 'alt', 'localId'];

export const toJSON = (
	node: PMNode,
): {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs: Record<string, any>;
} => ({
	attrs: Object.keys(node.attrs)
		// Strip private attributes e.g. __fileName, __fileSize, __fileMimeType, etc.
		.filter((key) => !(key[0] === '_' && key[1] === '_'))
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.reduce<Record<string, any>>((obj, key) => {
			if (node.attrs.type === 'external' && externalOnlyAttributes.indexOf(key) === -1) {
				return obj;
			}
			if (
				optionalAttributes.indexOf(key) > -1 &&
				(node.attrs[key] === null || node.attrs[key] === '')
			) {
				return obj;
			}
			if (['width', 'height'].indexOf(key) !== -1) {
				obj[key] = Number(node.attrs[key]);
				return obj;
			}
			obj[key] = node.attrs[key];
			return obj;
		}, {}),
});
