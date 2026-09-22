import schema from '@atlaskit/editor-test-helpers/schema';

import { toJSON } from '../../toJSON';

describe('toJSON annotation marks', () => {
	const annotation = schema.marks.annotation.create({
		id: 'comment-id',
		annotationType: 'inlineComment',
	});

	it('removes annotation marks from invalid block targets', () => {
		const paragraph = schema.nodes.paragraph.create(null, schema.text('text'), [annotation]);
		const panel = schema.nodes.panel.create(null, schema.nodes.paragraph.create(null), [
			annotation,
		]);
		const mediaSingle = schema.nodes.mediaSingle.create(
			{ layout: 'center' },
			schema.nodes.media.create({ type: 'file', id: 'media-id', collection: 'collection' }),
			[annotation],
		);
		const rule = schema.nodes.rule.create(null, undefined, [annotation]);
		const blockCard = schema.nodes.blockCard.create({ url: 'https://atlassian.com' }, undefined, [
			annotation,
		]);

		for (const node of [paragraph, panel, mediaSingle, rule, blockCard]) {
			expect(toJSON(node).marks).toBeUndefined();
		}
	});

	it('removes a paragraph annotation while preserving its annotated text', () => {
		const paragraph = schema.nodes.paragraph.create(null, schema.text('text', [annotation]), [
			annotation,
		]);

		const json = toJSON(paragraph);

		expect(json.marks).toBeUndefined();
		expect(json.content?.[0]?.marks).toEqual([
			{
				type: 'annotation',
				attrs: { id: 'comment-id', annotationType: 'inlineComment' },
			},
		]);
	});

	it('preserves annotation marks on valid leaf targets', () => {
		const text = schema.text('text', [annotation]);
		const media = schema.nodes.media.create(
			{ type: 'file', id: 'media-id', collection: 'collection' },
			undefined,
			[annotation],
		);
		const extension = schema.nodes.extension.create(
			{
				extensionType: 'com.atlassian.confluence.macro.core',
				extensionKey: 'native-embed:maui',
			},
			undefined,
			[annotation],
		);

		for (const node of [text, media, extension]) {
			expect(toJSON(node).marks).toEqual([
				{
					type: 'annotation',
					attrs: { id: 'comment-id', annotationType: 'inlineComment' },
				},
			]);
		}
	});
});
