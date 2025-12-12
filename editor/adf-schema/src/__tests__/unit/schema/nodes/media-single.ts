import { toDOM, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';

import { schema } from '@af/adf-test-helpers/src/adf-schema';
import {
	mediaSingle,
	mediaSingleWithCaption,
	mediaSingleWithWidthType,
	mediaSingleFull,
} from '../../../../schema';
import { normalizeNodeSpec } from '../../_utils';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema mediaSingle node`, () => {
	describe('node spec', () => {
		// The node spec will be generated from ADF DSL
		// this test would detect any changes if this node is updated from ADF DSL
		// @DSLCompatibilityException
		// marks is in different order comparing with original marks
		it('media single node spec', () => {
			expect(normalizeNodeSpec(mediaSingle)).toStrictEqual(
				normalizeNodeSpec({
					atom: true,
					attrs: {
						layout: {
							default: 'center',
						},
						width: {
							default: null,
						},
					},
					content: 'media|unsupportedBlock+|media unsupportedBlock+',
					group: 'block',
					marks: 'unsupportedMark unsupportedNodeAttribute annotation border link',
					parseDOM: [
						{
							getAttrs: expect.anything(),
							tag: 'div[data-node-type="mediaSingle"]',
						},
					],
					selectable: true,
					toDOM: expect.anything(),
				}),
			);
		});
		// The node spec will be generated from ADF DSL
		// this test would detect any changes if this node is updated from ADF DSL
		// @DSLCompatibilityException
		// marks is in different order comparing with original marks
		it('media single caption spec', () => {
			expect(normalizeNodeSpec(mediaSingleWithCaption)).toStrictEqual(
				normalizeNodeSpec({
					atom: false,
					attrs: {
						layout: {
							default: 'center',
						},
						width: {
							default: null,
						},
					},
					content: 'media|unsupportedBlock+|media (caption|unsupportedBlock) unsupportedBlock*',
					group: 'block',
					marks: 'unsupportedMark unsupportedNodeAttribute annotation border link',
					parseDOM: [
						{
							getAttrs: expect.anything(),
							tag: 'div[data-node-type="mediaSingle"]',
						},
					],
					selectable: true,
					toDOM: expect.anything(),
				}),
			);
		});
		// The node spec will be generated from ADF DSL
		// this test would detect any changes if this node is updated from ADF DSL
		// @DSLCompatibilityException
		// marks is in different order comparing with original marks
		it('media single full spec', () => {
			expect(normalizeNodeSpec(mediaSingleFull)).toStrictEqual(
				normalizeNodeSpec({
					atom: false,
					attrs: {
						layout: {
							default: 'center',
						},
						width: {
							default: null,
						},
						widthType: {
							default: null,
						},
						localId: {
							default: null,
						},
					},
					content: 'media|unsupportedBlock+|media (caption|unsupportedBlock) unsupportedBlock*',
					group: 'block',
					marks: 'unsupportedMark unsupportedNodeAttribute annotation border link',
					parseDOM: [
						{
							getAttrs: expect.anything(),
							tag: 'div[data-node-type="mediaSingle"]',
						},
					],
					selectable: true,
					toDOM: expect.anything(),
				}),
			);
		});
		// The node spec will be generated from ADF DSL
		// this test would detect any changes if this node is updated from ADF DSL
		// @DSLCompatibilityException
		// marks is in different order comparing with original marks
		it('media single with width type spec', () => {
			expect(normalizeNodeSpec(mediaSingleWithWidthType)).toStrictEqual(
				normalizeNodeSpec({
					atom: true,
					attrs: {
						layout: {
							default: 'center',
						},
						width: {
							default: null,
						},
						widthType: {
							default: null,
						},
						localId: {
							default: null,
						},
					},
					content: 'media|unsupportedBlock+|media unsupportedBlock+',
					group: 'block',
					marks: 'unsupportedMark unsupportedNodeAttribute annotation border link',
					parseDOM: [
						{
							getAttrs: expect.anything(),
							tag: 'div[data-node-type="mediaSingle"]',
						},
					],
					selectable: true,
					toDOM: expect.anything(),
				}),
			);
		});
	});

	describe('parse html', () => {
		it('gets attributes from html', () => {
			const doc = fromHTML(
				`
        <div
          data-node-type="mediaSingle"
          data-layout="wrap-right"
          data-width="32.3"
          data-width-type="percentage"
        />
        `,
				schema,
			);

			const mediaSingleNode = doc.firstChild!;

			expect(mediaSingleNode.type).toEqual(schema.nodes.mediaSingle);
			expect(mediaSingleNode.attrs.layout).toEqual('wrap-right');
			expect(mediaSingleNode.attrs.width).toEqual(32.3);
			expect(mediaSingleNode.attrs.widthType).toEqual('percentage');
		});

		it('defaults to align center', () => {
			const doc = fromHTML(
				`
        <div
          data-node-type="mediaSingle"
        />
        `,
				schema,
			);

			const mediaSingleNode = doc.firstChild!;

			expect(mediaSingleNode.type).toEqual(schema.nodes.mediaSingle);
			expect(mediaSingleNode.attrs.layout).toEqual('center');
			expect(mediaSingleNode.attrs.width).toBeNull();
			expect(mediaSingleNode.attrs.widthType).toBeNull();
		});

		it('auto creates a media node inside mediaSingle node', () => {
			const doc = fromHTML(
				`
        <div
          data-node-type="mediaSingle"
          data-alignment="left"
          data-display="block"
        />
        `,
				schema,
			);

			const mediaSingleNode = doc.firstChild!;

			expect(mediaSingleNode.childCount).toEqual(1);
			expect(mediaSingleNode.child(0)).toEqual(schema.nodes.media.create());
		});
	});

	describe('encode node', () => {
		it('converts layout and nodetype to html data attribute', () => {
			const mediaSingleNode = schema.nodes.mediaSingle.create({
				layout: 'center',
			});

			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const mediaSingleDom = toDOM(mediaSingleNode, schema).firstChild as HTMLElement;
			const layout = mediaSingleDom.getAttribute('data-layout');
			const nodeType = mediaSingleDom.getAttribute('data-node-type');

			expect(layout).toEqual('center');
			expect(nodeType).toEqual('mediaSingle');
		});
	});

	it('converts attributes to related data attribute in html with', () => {
		const mediaSingleNode = schema.nodes.mediaSingle.create({
			layout: 'center',
			width: 64.333333,
		});

		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		const mediaSingleDom = toDOM(mediaSingleNode, schema).firstChild as HTMLElement;
		const layout = mediaSingleDom.getAttribute('data-layout');
		const width = mediaSingleDom.getAttribute('data-width');

		expect(layout).toEqual('center');
		expect(width).toEqual('64.33');
	});

	it('converts attributes with integer width', () => {
		const mediaSingleNode = schema.nodes.mediaSingle.create({
			layout: 'center',
			width: 64,
		});

		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		const mediaSingleDom = toDOM(mediaSingleNode, schema).firstChild as HTMLElement;
		const layout = mediaSingleDom.getAttribute('data-layout');
		const width = mediaSingleDom.getAttribute('data-width');

		expect(layout).toEqual('center');
		expect(width).toEqual('64');
	});

	it('converts attributes with widthType', () => {
		const mediaSingleNode = schema.nodes.mediaSingle.create({
			layout: 'center',
			width: 640,
			widthType: 'pixel',
		});

		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		const mediaSingleDom = toDOM(mediaSingleNode, schema).firstChild as HTMLElement;
		const layout = mediaSingleDom.getAttribute('data-layout');
		const width = mediaSingleDom.getAttribute('data-width');
		const widthType = mediaSingleDom.getAttribute('data-width-type');

		expect(layout).toEqual('center');
		expect(width).toEqual('640');
		expect(widthType).toEqual('pixel');
	});

	it('encodes and decodes wide mediaSingle to the same node', () => {
		const { mediaSingle, media } = schema.nodes;
		const mediaSingleNode = mediaSingle.create(
			{
				layout: 'wide',
			},
			media.create(),
		);

		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		const mediaSingleDom = toDOM(mediaSingleNode, schema).firstChild as HTMLElement;

		const parsedMediaSingle = fromHTML(mediaSingleDom.outerHTML, schema).firstChild;

		expect(parsedMediaSingle).toEqual(mediaSingleNode);
	});

	it('encodes and decodes mediaSingle with width to the same node', () => {
		const { mediaSingle, media } = schema.nodes;
		const mediaSingleNode = mediaSingle.create(
			{
				layout: 'center',
				width: 32.5,
			},
			media.create(),
		);

		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		const mediaSingleDom = toDOM(mediaSingleNode, schema).firstChild as HTMLElement;

		const parsedMediaSingle = fromHTML(mediaSingleDom.outerHTML, schema).firstChild;

		expect(parsedMediaSingle).toEqual(mediaSingleNode);
	});
});
