import {
	media,
	camelCaseToKebabCase,
	defaultAttrs,
	toJSON,
	createMediaSpec,
} from '../../../../schema/nodes/media';
import { image as ImageNodeSpec } from '../../../../schema/nodes/image';
import { fromHTML, toDOM, schema } from '@af/adf-test-helpers/src/adf-schema';
import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

// Note: We can't use dom.dataset in jest until it's upgraded to use latest version
//       of jsdom. In the meantime we can use this helper-method.
const getDataSet = (dom: HTMLElement) => {
	return Object.keys({
		...defaultAttrs,
		fileName: '',
		fileSize: '',
		fileMimeType: '',
		displayType: '',
		url: '',
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	}).reduce<Record<string, any>>((accum, k) => {
		const key = camelCaseToKebabCase(k).replace(/^__/u, '');
		const value = dom.getAttribute(`data-${key}`);
		if (value) {
			accum[k] = value;
		}

		return accum;
	}, {});
};
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema media node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(media).toStrictEqual({
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
				localId: {
					default: null,
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
			},
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'div[data-node-type="media"]',
				},
				{
					ignore: true,
					tag: 'img[src^="data:image"]',
				},
				{
					getAttrs: expect.anything(),
					tag: 'img:not(.smart-link-icon)',
				},
			],
			selectable: true,
			toDOM: expect.anything(),
		});
	});

	it('should parse html', () => {
		const doc = fromHTML(
			`
    <div
      data-node-type="media"
      data-id="id"
      data-type="file"
      data-collection="collection"
      data-file-name="file.jpg"
      data-file-size="123456"
      data-file-mime-type="image/jpeg"
    />
    `,
			schema,
		);
		const mediaGroup = doc.firstChild!;
		const mediaNode = mediaGroup.firstChild!;

		expect(mediaNode.type.spec).toEqual(media);
		expect(mediaNode.attrs.id).toEqual('id');
		expect(mediaNode.attrs.type).toEqual('file');
		expect(mediaNode.attrs.collection).toEqual('collection');
		expect(mediaNode.attrs.__fileName).toEqual('file.jpg');
		expect(mediaNode.attrs.__fileSize).toEqual(123456);
		expect(mediaNode.attrs.__fileMimeType).toEqual('image/jpeg');
		expect(mediaNode.attrs.__displayType).toEqual(null);
	});

	it('should parse width/height as number', () => {
		const doc = fromHTML(
			`
    <div
      data-node-type="media"
      data-width="456"
      data-height="956"
    />
    `,
			schema,
		);
		const mediaGroup = doc.firstChild!;
		const mediaNode = mediaGroup.firstChild!;

		expect(mediaNode.attrs.width).toEqual(456);
		expect(mediaNode.attrs.height).toEqual(956);
	});

	it('should parse html (with occurrenceKey)', () => {
		const doc = fromHTML(
			`
    <div
      data-node-type="media"
      data-id="id"
      data-type="file"
      data-collection="collection"
      data-occurrence-key="key"
    />
    `,
			schema,
		);
		const mediaGroup = doc.firstChild!;
		const mediaNode = mediaGroup.firstChild!;

		expect(mediaNode.type.spec).toEqual(media);
		expect(mediaNode.attrs.id).toEqual('id');
		expect(mediaNode.attrs.type).toEqual('file');
		expect(mediaNode.attrs.collection).toEqual('collection');
		expect(mediaNode.attrs.occurrenceKey).toEqual('key');
	});

	it('should encode to html', () => {
		const mediaNode = schema.nodes.media.create({
			id: 'id',
			type: 'file',
			collection: 'collection',
			__fileName: 'file.jpg',
			__fileSize: 123456,
			__fileMimeType: 'image/jpeg',
			__displayType: 'thumbnail',
		});

		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		const domNode = toDOM(mediaNode, schema).firstChild as HTMLElement;
		const { id, type, collection, occurrenceKey, fileName, fileSize, fileMimeType, displayType } =
			getDataSet(domNode);

		expect(id).toEqual('id');
		expect(type).toEqual('file');
		expect(collection).toEqual('collection');
		expect(occurrenceKey).toEqual(undefined);
		expect(fileName).toEqual('file.jpg');
		expect(fileSize).toEqual('123456');
		expect(fileMimeType).toEqual('image/jpeg');
		expect(displayType).toEqual('thumbnail');
	});

	it('should encode to html (with occurrenceKey)', () => {
		const mediaNode = schema.nodes.media.create({
			id: 'id',
			type: 'file',
			collection: 'collection',
			occurrenceKey: 'key',
		});

		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		const domNode = toDOM(mediaNode, schema).firstChild as HTMLElement;
		const { id, type, collection, occurrenceKey } = getDataSet(domNode);
		expect(id).toEqual('id');
		expect(type).toEqual('file');
		expect(collection).toEqual('collection');
		expect(occurrenceKey).toEqual('key');
	});

	it('should strip optional attrs during JSON serialization', () => {
		const mediaNode = schema.nodes.media.create({
			id: 'id',
			type: 'file',
			collection: 'collection',
			__fileName: 'file.jpg',
			__fileSize: 123456,
			__fileMimeType: 'image/jpeg',
			__displayType: 'thumbnail',
			localId: 'localId',
		});

		expect(toJSON(mediaNode)).toEqual({
			attrs: {
				collection: 'collection',
				id: 'id',
				localId: 'localId',
				type: 'file',
			},
		});
	});

	it('should strip optional attrs during JSON serialization for inline media', () => {
		const mediaInlineNode = schema.nodes.mediaInline.create({
			id: 'id',
			type: 'file',
			collection: 'collection',
			alt: '',
			__fileName: 'file.jpg',
			__fileSize: 123456,
			__fileMimeType: 'image/jpeg',
			__displayType: 'thumbnail',
			localId: 'localId',
		});

		expect(toJSON(mediaInlineNode)).toEqual({
			attrs: {
				collection: 'collection',
				id: 'id',
				localId: 'localId',
				type: 'file',
			},
		});
	});

	describe.each<['alt' | 'occurrenceKey']>([['alt'], ['occurrenceKey']])(
		'%s attribute',
		(attributeKey: string) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			let mediaNodeConfig: { [key: string]: any };
			beforeEach(() => {
				mediaNodeConfig = {
					id: 'id',
					type: 'file',
					collection: 'collection',
					localId: 'localId',
				};
			});

			it(`should serialize ${attributeKey} when available`, () => {
				mediaNodeConfig[attributeKey] = 'key_value';
				const mediaNode = schema.nodes.media.create(mediaNodeConfig);

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const expectedObj: any = {
					attrs: {
						collection: 'collection',
						id: 'id',
						localId: 'localId',
						type: 'file',
					},
				};
				expectedObj.attrs[attributeKey] = 'key_value';

				expect(toJSON(mediaNode)).toEqual(expectedObj);
			});

			it(`should not serialize optional ${attributeKey} with null value`, () => {
				mediaNodeConfig[attributeKey] = null;
				const mediaNode = schema.nodes.media.create(mediaNodeConfig);

				expect(toJSON(mediaNode)).toEqual({
					attrs: {
						collection: 'collection',
						id: 'id',
						localId: 'localId',
						type: 'file',
					},
				});
			});

			it(`should not serialize optional ${attributeKey} with empty string`, () => {
				mediaNodeConfig[attributeKey] = '';
				const mediaNode = schema.nodes.media.create(mediaNodeConfig);

				expect(toJSON(mediaNode)).toEqual({
					attrs: {
						collection: 'collection',
						id: 'id',
						localId: 'localId',
						type: 'file',
					},
				});
			});
		},
	);

	it('should serialize optional number keys with value 0', () => {
		const mediaNode = schema.nodes.media.create({
			id: 'id',
			type: 'file',
			collection: 'collection',
			localId: 'localId',
			width: 0,
		});

		expect(toJSON(mediaNode)).toEqual({
			attrs: {
				collection: 'collection',
				id: 'id',
				localId: 'localId',
				type: 'file',
				width: 0,
			},
		});
	});

	it('should serialize width/height as number', () => {
		const mediaNode = schema.nodes.media.create({
			id: 'id',
			type: 'file',
			collection: 'collection',
			localId: 'localId',
			width: 100,
			height: 150,
		});

		expect(toJSON(mediaNode)).toEqual({
			attrs: {
				collection: 'collection',
				id: 'id',
				localId: 'localId',
				type: 'file',
				width: 100,
				height: 150,
			},
		});
	});

	describe('external images', () => {
		it('should parse html for external images', () => {
			const doc = fromHTML(
				`
      <div
        data-node-type="media"
        data-type="external"
        data-url="http://image.jpg"
      />
      `,
				schema,
			);
			const mediaGroup = doc.firstChild!;
			const mediaNode = mediaGroup.firstChild!;

			expect(mediaNode.type.spec).toEqual(media);
			expect(mediaNode.attrs.type).toEqual('external');
			expect(mediaNode.attrs.url).toEqual('http://image.jpg');
		});

		it('should encode to html', () => {
			const mediaNode = schema.nodes.media.create({
				type: 'external',
				alt: 'alt text',
				url: 'http://image.jpg',
			});

			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const domNode = toDOM(mediaNode, schema).firstChild as HTMLElement;
			const { type, url, alt } = getDataSet(domNode);
			expect(type).toEqual('external');
			expect(alt).toEqual('alt text');
			expect(url).toEqual('http://image.jpg');
		});

		it('should strip optional attrs during JSON serialization', () => {
			const mediaNode = schema.nodes.media.create({
				type: 'external',
				url: 'http://image.jpg',
				alt: 'alt text',
			});

			expect(toJSON(mediaNode)).toEqual({
				attrs: {
					alt: 'alt text',
					type: 'external',
					url: 'http://image.jpg',
				},
			});
		});

		it('should parse html for images with alt text', () => {
			const doc = fromHTML(
				`<img src="https://image.jpg" alt="Summer Rolls are the best" />`,
				schema,
			);
			const paragraph = doc.firstChild!;
			const imageNode = paragraph.firstChild!;

			expect(imageNode.type.spec).toEqual(ImageNodeSpec);
			expect(imageNode.attrs.src).toEqual('https://image.jpg');
			expect(imageNode.attrs.alt).toEqual('Summer Rolls are the best');
		});

		it('should parse html for images without alt text', () => {
			const doc = fromHTML(`<img src="https://no.ch/ocolate.jpg" />`, schema);
			const paragraph = doc.firstChild!;
			const imageNode = paragraph.firstChild!;

			expect(imageNode.type.spec).toEqual(ImageNodeSpec);
			expect(imageNode.attrs.src).toEqual('https://no.ch/ocolate.jpg');
			expect(imageNode.attrs.alt).toEqual(null);
		});
	});

	describe('createMediaSpec', () => {
		it('should return a media node spec supporting attributes provided', () => {
			const el = document.createElement('div');
			el.setAttribute('data-alt', 'test');

			const attributes: Partial<NodeSpec['attrs']> = defaultAttrs;

			const mediaNodeSpec = createMediaSpec(attributes);
			expect(mediaNodeSpec.attrs).toEqual(attributes);

			const parseRule =
				mediaNodeSpec.parseDOM && mediaNodeSpec.parseDOM.find(() => 'div[data-node-type="media"]');
			expect(parseRule && parseRule.getAttrs && parseRule.getAttrs(el)).toEqual({
				alt: 'test',
			});
		});
	});
});
