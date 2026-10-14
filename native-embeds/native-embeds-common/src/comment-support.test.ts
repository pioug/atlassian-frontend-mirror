import { Schema } from '@atlaskit/editor-prosemirror/model';

import { createNativeEmbedCommentSupport } from './comment-support';

const schema = new Schema({
	nodes: {
		doc: { content: 'block*' },
		text: {},
		paragraph: { group: 'block', content: 'text*' },
		extension: {
			group: 'block',
			attrs: {
				extensionKey: {},
				extensionType: {},
				parameters: { default: {} },
				localId: { default: 'same-id' },
			},
		},
	},
});
const node = (
	extensionKey = 'native-embed:maui',
	extensionType = 'com.atlassian.confluence.macro.core',
	parameters = {},
) => schema.nodes.extension.create({ extensionKey, extensionType, parameters });

it('only supports registered, opted-in native block embeds', () => {
	const supports = createNativeEmbedCommentSupport(
		new Map([
			['maui', true],
			['page', false],
		]),
	);
	expect(supports(node())).toBe(true);
	expect(supports(node('native-embed:page'))).toBe(false);
	expect(supports(node('native-embed:unknown'))).toBe(false);
	expect(supports(node('native-embed:maui', 'another-extension-type'))).toBe(false);
	expect(supports(node('prefix-native-embed:maui'))).toBe(false);
	expect(supports(node('native-embed'))).toBe(false);
	expect(supports(schema.nodes.paragraph.create())).toBe(false);
});

it('uses the current node identity, ignoring localId and legacy capability attrs', () => {
	const supports = createNativeEmbedCommentSupport(new Map([['maui', true]]));
	expect(supports(node('native-embed:maui', undefined, { commentsEnabled: false }))).toBe(true);
	expect(supports(node('native-embed:page', undefined, { commentsEnabled: true }))).toBe(false);
	const restored = schema.nodeFromJSON(JSON.parse(JSON.stringify(node().toJSON())));
	expect(supports(restored)).toBe(true);
});

it('owns an immutable snapshot of the capabilities', () => {
	const capabilities = new Map([['maui', true]]);
	const supports = createNativeEmbedCommentSupport(capabilities);
	capabilities.set('maui', false);
	expect(supports(node())).toBe(true);
});
