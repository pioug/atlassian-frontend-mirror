import { fromHTML, toDOM } from '@af/adf-test-helpers/src/adf-schema/html-helpers';

import { schema } from '@af/adf-test-helpers/src/adf-schema';
import { mediaGroup } from '../../../..';
import { normalizeNodeSpec } from '../../_utils';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema mediaGroup node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	// @DSLCompatibilityException
	// marks is in different order comparing with original marks
	it('should return correct node spec', () => {
		expect(normalizeNodeSpec(mediaGroup)).toStrictEqual(
			normalizeNodeSpec({
				attrs: {},
				content: '(media | unsupportedBlock)+',
				group: 'block',
				marks: 'unsupportedMark unsupportedNodeAttribute annotation border link',
				parseDOM: [
					{
						tag: 'div[data-node-type="mediaGroup"]',
					},
					{
						tag: 'div[class="MediaGroup"]',
					},
				],
				selectable: false,
				toDOM: expect.anything(),
			}),
		);
	});

	describe('parse html', () => {
		it('gets attributes from html', () => {
			const doc = fromHTML(
				`
        <div
          data-node-type="mediaGroup"
        />
        `,
				schema,
			);

			const mediaGroupNode = doc.firstChild!;

			expect(mediaGroupNode.type).toEqual(schema.nodes.mediaGroup);
		});

		it('auto creates a media node inside mediaSingle node', () => {
			const doc = fromHTML(
				`
        <div
          data-node-type="mediaGroup"
        />
        `,
				schema,
			);

			const mediaGroupNode = doc.firstChild!;

			expect(mediaGroupNode.childCount).toEqual(1);
			expect(mediaGroupNode.child(0)).toEqual(schema.nodes.media.create());
		});
	});

	describe('encode node', () => {
		it('converts attributes to related data attribute in html', () => {
			const mediaGroupNode = schema.nodes.mediaGroup.create();

			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const mediaGroupDom = toDOM(mediaGroupNode, schema).firstChild as HTMLElement;
			const nodeType = mediaGroupDom.getAttribute('data-node-type');

			expect(nodeType).toEqual('mediaGroup');
		});
	});

	it('encodes and decodes to the same node', () => {
		const { mediaGroup, media } = schema.nodes;
		const mediaGroupNode = mediaGroup.create({}, media.create());

		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		const mediaGroupDom = toDOM(mediaGroupNode, schema).firstChild as HTMLElement;

		const parsedMediaGroup = fromHTML(mediaGroupDom.outerHTML, schema).firstChild;

		expect(parsedMediaGroup).toEqual(mediaGroupNode);
	});
});
