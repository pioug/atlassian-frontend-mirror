import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

export const copyPrivateAttributes = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	from: Record<string, any>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	to: Record<string, any>,
	attributes?: Partial<NodeSpec['attrs']>,
	map?: ((str: string) => string) | undefined,
): void => {
	const attrs: Partial<NodeSpec['attrs']> = attributes || {};
	Object.keys(attrs).forEach((key) => {
		if (key[0] === '_' && key[1] === '_' && from[key]) {
			to[map ? map(key) : key] = from[key];
		}
	});
};
