import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';
import type { SchemaConfig } from '../../../../schema/create-schema';
import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { extendedPanel, extendedPanelC1, extendedPanelC1WithLocalId } from '../../../../schema/nodes/panel';
import { panel, panelC1 } from '../../../../next-schema';

const schema = makeSchema();
const schemaWithAllowCustomPanel = makeSchema({
	panel: extendedPanel(true),
});

const schemaWithoutCustomPanel = makeSchema({
	panel: extendedPanel(false),
});
const packageName = process.env.npm_package_name as string;

function expectHtmlWithData(html: string, expectedData: object) {
	const parser = new DOMParser();
	const dom = parser.parseFromString(html, 'text/html');
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	const htmlNode = dom.body?.firstChild as HTMLElement;
	expect(htmlNode).toBeTruthy();
	expect(htmlNode.dataset).toEqual(expect.objectContaining(expectedData));
}

describe(`${packageName}/schema panel node `, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec for extendedPanel with allowCustomPanel=true', () => {
		expect(extendedPanel(true)).toStrictEqual({
			attrs: {
				panelColor: {
					default: null,
				},
				panelIcon: {
					default: null,
				},
				panelIconId: {
					default: null,
				},
				panelIconText: {
					default: null,
				},
				panelType: {
					default: 'info',
				},
				localId: {
					default: null,
				},
			},
			content:
				'(paragraph | heading | bulletList | orderedList | blockCard | mediaGroup | mediaSingle | codeBlock | taskList | rule | decisionList | unsupportedBlock | extension)+',
			group: 'block',
			marks: 'fontSize unsupportedMark unsupportedNodeAttribute dataConsumer fragment',
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'div[data-panel-type]',
				},
			],
			selectable: true,
			toDOM: expect.anything(),
		});
	});

	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec for extendedPanel', () => {
		expect(extendedPanel(false)).toStrictEqual({
			attrs: {
				panelColor: {
					default: null,
				},
				panelIcon: {
					default: null,
				},
				panelIconId: {
					default: null,
				},
				panelIconText: {
					default: null,
				},
				panelType: {
					default: 'info',
				},
				localId: {
					default: null,
				},
			},
			content:
				'(paragraph | heading | bulletList | orderedList | blockCard | mediaGroup | mediaSingle | codeBlock | taskList | rule | decisionList | unsupportedBlock | extension)+',
			group: 'block',
			marks: 'fontSize unsupportedMark unsupportedNodeAttribute dataConsumer fragment',
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'div[data-panel-type]',
				},
			],
			selectable: true,
			toDOM: expect.anything(),
		});
	});

	describe('With default panel NodeSpec ', () => {
		it('should have data-panel-type when serializing to DOM', () => {
			const html = toHTML(schema.nodes.panel.create({ panelType: 'info' }), schema);
			expectHtmlWithData(html, {
				panelType: 'info',
			});
		});

		it('should have info panel type by default', () => {
			const html = toHTML(schema.nodes.panel.create(), schema);
			expectHtmlWithData(html, {
				panelType: 'info',
			});
		});
	});

	describe('With CustomPanel NodeSpec FF On ', () => {
		it('should have data-panel-icon, data-panel-color, data-panel-icon-id and data-panel-icon-text when serializing to DOM', () => {
			const html = toHTML(
				schemaWithAllowCustomPanel.nodes.panel.create({
					panelType: 'custom',
					panelIcon: ':smiley:',
					panelColor: '#33FF33',
					panelIconId: '1f603',
					panelIconText: '😃',
				}),
				schemaWithAllowCustomPanel,
			);

			expectHtmlWithData(html, {
				panelType: 'custom',
				panelIcon: ':smiley:',
				panelColor: '#33FF33',
				panelIconId: '1f603',
				panelIconText: '😃',
			});
		});

		describe.each([
			{
				subject: 'panelType',
				html: '<div data-panel-type="tip"><p>testing</p></div>',
				expected: {
					panelType: 'tip',
					panelColor: null,
					panelIcon: null,
					panelIconId: null,
					panelIconText: null,
					localId: null,
				},
			},
			{
				subject: 'icon and color',
				html: '<div data-panel-type="custom" data-panel-icon=":smiley:" data-panel-color="#33FF33" data-panel-icon-id="1f603" data-panel-icon-text="😃"><p>testing</p></div>',
				expected: {
					panelType: 'custom',
					panelColor: '#33FF33',
					panelIcon: ':smiley:',
					panelIconId: '1f603',
					panelIconText: '😃',
					localId: null,
				},
			},
		])('extract correct values', ({ html, subject, expected }) => {
			it(`for ${subject}`, () => {
				const doc = fromHTML(html, schemaWithAllowCustomPanel);
				const panel = doc.firstChild!;
				expect(panel.type.name).toContain('panel');
				expect(panel.attrs).toEqual(expected);
			});
		});

		it('should extract the correct attributes of panelType', () => {
			const doc = fromHTML(
				"<div data-panel-type='tip' data-panel-icon=':smiley:' data-panel-color='#33FF33' data-panel-icon-id='1f603' data-panel-icon-text='😃'><p>testing</p></div>",
				schemaWithAllowCustomPanel,
			);
			const panel = doc.firstChild;
			expect(panel?.type?.name).toContain('panel');
			expect(panel?.attrs).toEqual(
				expect.objectContaining({
					panelIcon: ':smiley:',
					panelColor: '#33FF33',
					panelIconId: '1f603',
					panelIconText: '😃',
				}),
			);
		});
	});

	describe('With CustomPanel NodeSpec FF Off ', () => {
		describe.each([
			{
				subject: 'panelType',
				html: '<div data-panel-type="info"><p>testing</p></div>',
				expected: {
					panelType: 'info',
					panelColor: null,
					panelIcon: null,
					panelIconId: null,
					panelIconText: null,
					localId: null,
				},
			},
			{
				subject: 'icon and color',
				html: '<div data-panel-type="custom" data-panel-icon=":smiley:" data-panel-color="#33FF33"><p>testing</p></div>',
				expected: {
					panelType: 'info',
					panelColor: null,
					panelIcon: null,
					panelIconId: null,
					panelIconText: null,
					localId: null,
				},
			},
		])('extract correct values', ({ html, subject, expected }) => {
			it(`for ${subject}`, () => {
				const doc = fromHTML(html, schemaWithoutCustomPanel);
				const panel = doc.firstChild!;
				expect(panel.type.name).toContain('panel');
				expect(panel.attrs).toEqual(expected);
			});
		});

		it('should have data-panel-type when serializing to DOM', () => {
			const html = toHTML(
				schemaWithoutCustomPanel.nodes.panel.create({
					panelType: 'info',
				}),
				schemaWithoutCustomPanel,
			);

			expectHtmlWithData(html, {
				panelType: 'info',
			});
		});
	});

	describe('fontSize mark support in panel', () => {
		it('paragraph with fontSize is valid inside panel node', () => {
			const fontSizeMark = schema.marks.fontSize.create({ fontSize: 'small' });
			const paragraph = schema.nodes.paragraph.create(
				{},
				[schema.text('Small text in panel')],
				[fontSizeMark],
			);
			const panel = schema.nodes.panel.create({ panelType: 'info' }, [paragraph]);

			expect(panel.type.name).toBe('panel');
			expect(panel.firstChild).toBeTruthy();
			expect(panel.firstChild!.type.name).toBe('paragraph');
			expect(panel.firstChild!.marks).toHaveLength(1);
			expect(panel.firstChild!.marks[0].type.name).toBe('fontSize');
			expect(panel.firstChild!.marks[0].attrs.fontSize).toBe('small');
		});

		it('panel can contain multiple paragraphs with different fontSize values', () => {
			const fontSizeMark = schema.marks.fontSize.create({ fontSize: 'small' });
			const paragraph1 = schema.nodes.paragraph.create(
				{},
				[schema.text('Small text')],
				[fontSizeMark],
			);
			const paragraph2 = schema.nodes.paragraph.create({}, [schema.text('Normal text')], []);
			const panel = schema.nodes.panel.create({ panelType: 'info' }, [paragraph1, paragraph2]);

			expect(panel.childCount).toBe(2);
			expect(panel.firstChild!.marks).toHaveLength(1);
			expect(panel.firstChild!.marks[0].type.name).toBe('fontSize');
			expect(panel.lastChild!.marks).toHaveLength(0);
		});

		it('panel with fontSize paragraph validates correctly in JSON schema', () => {
			const fontSizeMark = schema.marks.fontSize.create({ fontSize: 'small' });
			const paragraph = schema.nodes.paragraph.create(
				{},
				[schema.text('Small text')],
				[fontSizeMark],
			);
			const panel = schema.nodes.panel.create({ panelType: 'info' }, [paragraph]);

			const html = toHTML(panel, schema);
			const parsedDoc = fromHTML(html, schema);
			const parsedPanel = parsedDoc.firstChild!;

			expect(parsedPanel.type.name).toBe('panel');
			expect(parsedPanel.firstChild).toBeTruthy();
			expect(parsedPanel.firstChild!.marks).toHaveLength(1);
			expect(parsedPanel.firstChild!.marks[0].type.name).toBe('fontSize');
			expect(parsedPanel.firstChild!.marks[0].attrs.fontSize).toBe('small');
		});
	});
});

describe('panel_c1 variant (next-schema)', () => {
	// PMNodeSpecFactoryInstance is a curried function — call it with {} to get the NodeSpec
	const panelC1Spec = panelC1({});
	const panelSpec = panel({});

	it('should include table in content string but not in base panel', () => {
		// Validates the generated nodeTypes.ts output — table is baked into
		// panelC1's content string by the schema generator, not by addContent() at runtime.
		expect(panelSpec.content).not.toContain('table');
		expect(panelC1Spec.content).toContain('table');
	});

	it('should have the correct content expression including table', () => {
		expect(panelC1Spec.content).toBe(
			'(paragraph | heading | bulletList | orderedList | blockCard | mediaGroup | mediaSingle | codeBlock | taskList | rule | decisionList | unsupportedBlock | extension | table)+',
		);
	});

	it('should have the same attrs as the base panel', () => {
		expect(panelC1Spec.attrs).toStrictEqual(panelSpec.attrs);
	});

	it('should be in the block group', () => {
		expect(panelC1Spec.group).toBe('block');
	});

	it('should be selectable', () => {
		expect(panelC1Spec.selectable).toBe(true);
	});
});

describe('extendedPanelC1 factory wrappers', () => {
	describe('extendedPanelC1', () => {
		it('should include table in the content expression', () => {
			const spec = extendedPanelC1(false);
			expect(spec.content).toContain('table');
		});

		it('should have the same attrs as extendedPanel', () => {
			expect(extendedPanelC1(false).attrs).toStrictEqual(extendedPanel(false).attrs);
		});

		it('should be in the block group', () => {
			expect(extendedPanelC1(false).group).toBe('block');
		});

		it('should be selectable', () => {
			expect(extendedPanelC1(false).selectable).toBe(true);
		});

		it('should have parseDOM and toDOM entries', () => {
			const spec = extendedPanelC1(false);
			expect(spec.parseDOM).toHaveLength(1);
			expect(spec.toDOM).toBeInstanceOf(Function);
		});

		describe('allowCustomPanel: false', () => {
			it('should strip custom panel attrs when parsing from DOM', () => {
				const spec = extendedPanelC1(false);
				const parser = new DOMParser();
				const dom = parser.parseFromString(
				'<div data-panel-type="custom" data-panel-icon=":smiley:" data-panel-color="#33FF33"><p>test</p></div>',
				'text/html',
			);
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const el = dom.body.firstChild as HTMLElement;
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const attrs = (spec.parseDOM![0] as { getAttrs: (el: HTMLElement) => object }).getAttrs(el);
				expect(attrs).not.toHaveProperty('panelIcon');
				expect(attrs).not.toHaveProperty('panelColor');
				// custom panelType should be coerced to info
				expect((attrs as { panelType: string }).panelType).toBe('info');
			});
		});

		describe('allowCustomPanel: true', () => {
			it('should preserve custom panel attrs when parsing from DOM', () => {
				const spec = extendedPanelC1(true);
				const parser = new DOMParser();
				const dom = parser.parseFromString(
				'<div data-panel-type="custom" data-panel-icon=":smiley:" data-panel-color="#33FF33" data-panel-icon-id="1f603" data-panel-icon-text="😃"><p>test</p></div>',
				'text/html',
			);
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const el = dom.body.firstChild as HTMLElement;
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const attrs = (spec.parseDOM![0] as { getAttrs: (el: HTMLElement) => object }).getAttrs(el);
				expect((attrs as { panelType: string }).panelType).toBe('custom');
				expect((attrs as { panelIcon: string }).panelIcon).toBe(':smiley:');
				expect((attrs as { panelColor: string }).panelColor).toBe('#33FF33');
				expect((attrs as { panelIconId: string }).panelIconId).toBe('1f603');
				expect((attrs as { panelIconText: string }).panelIconText).toBe('😃');
			});
		});
	});

	describe('extendedPanelC1WithLocalId', () => {
		it('should include table in the content expression', () => {
			const spec = extendedPanelC1WithLocalId(false);
			expect(spec.content).toContain('table');
		});

		it('should generate a localId when parsing from DOM', () => {
			const spec = extendedPanelC1WithLocalId(false);
			const parser = new DOMParser();
			const dom = parser.parseFromString(
				'<div data-panel-type="info"><p>test</p></div>',
				'text/html',
			);
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const el = dom.body.firstChild as HTMLElement;
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const attrs = (spec.parseDOM![0] as { getAttrs: (el: HTMLElement) => object }).getAttrs(el);
			expect((attrs as { localId: string }).localId).toBeTruthy();
			expect(typeof (attrs as { localId: string }).localId).toBe('string');
		});

		it('should NOT generate a localId when using extendedPanelC1 (no localId)', () => {
			const spec = extendedPanelC1(false);
			const parser = new DOMParser();
			const dom = parser.parseFromString(
				'<div data-panel-type="info"><p>test</p></div>',
				'text/html',
			);
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const el = dom.body.firstChild as HTMLElement;
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const attrs = (spec.parseDOM![0] as { getAttrs: (el: HTMLElement) => object }).getAttrs(el);
			expect((attrs as { localId: string | undefined }).localId).toBeUndefined();
		});
	});
});

function makeSchema(customNodeSpecs?: { [key: string]: NodeSpec }) {
	const config: SchemaConfig = {
		nodes: [
			'doc',
			'paragraph',
			'heading',
			'text',
			'panel',
			'orderedList',
			'bulletList',
			'listItem',
		],
		marks: ['fontSize'],
	};
	return customNodeSpecs ? createSchema({ ...config, customNodeSpecs }) : createSchema(config);
}
