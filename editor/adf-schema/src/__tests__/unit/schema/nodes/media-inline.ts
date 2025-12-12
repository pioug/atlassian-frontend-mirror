import { fromHTML, toDOM, schema } from '@af/adf-test-helpers/src/adf-schema';
import { mediaInline } from '../../../..';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema mediaInline node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(mediaInline).toStrictEqual({
			attrs: {
				__contextId: {
					default: null,
				},
				__displayType: {
					default: null,
				},
				__external: {
					default: false,
				},
				__fileMimeType: {
					default: null,
				},
				__fileName: {
					default: null,
				},
				__fileSize: {
					default: null,
				},
				__mediaTraceId: {
					default: null,
				},
				alt: {
					default: '',
				},
				collection: {
					default: '',
				},
				height: {
					default: null,
				},
				id: {
					default: '',
				},
				occurrenceKey: {
					default: null,
				},
				type: {
					default: 'file',
				},
				url: {
					default: null,
				},
				width: {
					default: null,
				},
				localId: {
					default: null,
				},
			},
			group: 'inline',
			inline: true,
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'span[data-node-type="mediaInline"]',
				},
				{
					ignore: true,
					tag: 'img[src^="data:image"]',
				},
			],
			selectable: true,
			toDOM: expect.anything(),
		});
	});

	describe('parse html', () => {
		it('file type should parse', () => {
			const doc = fromHTML(
				`
        <span
          data-node-type="mediaInline"
          data-layout="wrap-right"
          data-type="file"
        />
        `,
				schema,
			);
			const media = doc.firstChild!;
			const mediaInlineNode = media.firstChild!;
			expect(mediaInlineNode.type).toEqual(schema.nodes.mediaInline);
			expect(mediaInlineNode.attrs.type).toEqual('file');
		});

		it('image type should parse with border', () => {
			const doc = fromHTML(
				`
        <div data-mark-type="border" data-color="#172b4d" data-size="3" style="--custom-palette-color: var(--ds-text, #172B4D)">
          <span
            data-node-type="mediaInline"
            data-layout="wrap-right"
            data-type="image"
          />
        </div>
        `,
				schema,
			);
			const media = doc.firstChild!;
			const mediaInlineNode = media.firstChild!;
			expect(mediaInlineNode.type).toEqual(schema.nodes.mediaInline);
			expect(mediaInlineNode.attrs.type).toEqual('image');
			expect(mediaInlineNode.marks[0].type.name).toEqual('border');
		});

		it('image type should parse with annotation', () => {
			const doc = fromHTML(
				`
        <span data-mark-type="annotation" data-mark-annotation-type="inlineComment" data-id="comment-id" >
          <span
            data-node-type="mediaInline"
            data-layout="wrap-right"
            data-type="image"
          />
        </span>
        `,
				schema,
			);
			const media = doc.firstChild!;
			const mediaInlineNode = media.firstChild!;
			expect(mediaInlineNode.type).toEqual(schema.nodes.mediaInline);
			expect(mediaInlineNode.attrs.type).toEqual('image');
			expect(mediaInlineNode.marks[0].type.name).toEqual('annotation');
		});
	});

	describe('encode node', () => {
		it('file type should convert to HTML', () => {
			const mediaInlineNode = schema.nodes.mediaInline.create({
				type: 'file',
			});
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const domNode = toDOM(mediaInlineNode, schema).firstChild as HTMLElement;
			const mediaType = domNode.getAttribute('data-type');
			expect(mediaType).toEqual('file');
		});

		it('image type should convert to HTML', () => {
			const mediaInlineNode = schema.nodes.mediaInline.create({
				type: 'image',
			});

			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const domMediaInlineNode = toDOM(mediaInlineNode, schema).firstChild as HTMLElement;
			const mediaInlineType = domMediaInlineNode.getAttribute('data-type');

			expect(mediaInlineType).toEqual('image');
		});
	});
});
