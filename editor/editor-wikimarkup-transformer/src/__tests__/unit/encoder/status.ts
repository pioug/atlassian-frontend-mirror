import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import WikiMarkupTransformer from '../../../index';

import { doc, p, status } from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - Status', () => {
	const transformer = new WikiMarkupTransformer();

	const encode = (color: string) => {
		const stage0Schema = getSchemaBasedOnStage('stage0');
		const node = doc(p(status({ localId: 's-1', text: 'In progress', color })))(stage0Schema);
		return transformer.encode(node);
	};

	const GREY = '#97A0AF';

	const HEX_IDS = ['#B3F5FF', '#ABF5D1', '#D3F1A7', '#FFF0B3', '#FCE4A6', '#FDD0EC'];

	it.each([
		['neutral', GREY],
		['purple', '#6554C0'],
		['blue', '#00B8D9'],
		['red', '#FF5630'],
		['yellow', '#FF991F'],
		['green', '#36B37E'],
	])('should keep the legacy %s status encoding unchanged', (color, expected) => {
		expect(encode(color)).toBe(`{color:${expected}}*[ IN PROGRESS ]*{color}`);
	});

	it('should resolve every registered hex identifier to a colour of its own', () => {
		const fellBackToGrey = HEX_IDS.filter((color) => encode(color).includes(GREY));
		expect(fellBackToGrey).toEqual([]);
	});

	it('should normalise a lowercase hex identifier to its uppercase form', () => {
		expect(encode('#abf5d1')).toBe(encode('#ABF5D1'));
	});

	it.each([
		['a pattern-valid but unregistered colour', '#123ABC'],
		['an empty colour', ''],
	])('should encode %s as grey', (_label, color) => {
		expect(encode(color)).toBe(`{color:${GREY}}*[ IN PROGRESS ]*{color}`);
	});
});
