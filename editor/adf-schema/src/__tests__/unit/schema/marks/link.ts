import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML, textWithMarks } from '@af/adf-test-helpers/src/adf-schema';
import { Node } from '@atlaskit/editor-prosemirror/model';
import { link } from '../../../..';

const href = 'http://atlassian.com';
const href2 = 'http://atlassian.com/test';
const href3 = 'http://atlassian.com?test=123';
const unsafeHref = 'javascript:alert("hack")';
const content = 'foo';
const sampleLink = `<a href="${href}">${content}</a>`;
const sampleBlockLink = `<a href="${href}" data-block-link="true" class="blockLink"><p>${content}</p></a>`;
const emptyLink = `<a>${content}</a>`;
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema link mark`, () => {
	// The mark spec will be generated from ADF DSL
	// this test would detect any changes if this mark is updated from ADF DSL
	it('should return correct mark spec', () => {
		expect(link).toStrictEqual({
			attrs: {
				__confluenceMetadata: {
					default: null,
				},
				href: {},
			},
			excludes: 'link',
			group: 'link',
			inclusive: false,
			parseDOM: [
				{
					contentElement: expect.anything(),
					getAttrs: expect.anything(),
					tag: '[data-block-link]',
				},
				{
					getAttrs: expect.anything(),
					tag: 'a[href]',
				},
			],
			toDOM: expect.anything(),
		});
	});

	itMatches(`<p>${sampleLink}</p>`, href, content);
	itMatches(`<p><a href="${href}" title="test" alt="hello">${content}</a></p>`, href, content);
	itMatches(`<p><a href="${href2}">${content}</a></p>`, href2, content);
	itMatches(`<p><a href="${href3}">${content}</a></p>`, href3, content);

	describe('links with marks', () => {
		it('should not throw an error when a link has a text color', () => {
			const node = {
				type: 'text',
				text: 'Foo',
				marks: [
					{
						type: 'link',
						attrs: {
							href: 'http://example.com',
						},
					},

					{
						type: 'textColor',
						attrs: {
							color: '#ff5630',
						},
					},
				],
			};

			const textNode = Node.fromJSON(makeSchema(), node);
			expect(() => {
				textNode.check();
			}).not.toThrow();
		});

		it('should not throw an error when a link has a background color', () => {
			const node = {
				type: 'text',
				text: 'Foo',
				marks: [
					{
						type: 'link',
						attrs: {
							href: 'http://example.com',
						},
					},

					{
						type: 'backgroundColor',
						attrs: {
							color: '#fedec8',
						},
					},
				],
			};

			const textNode = Node.fromJSON(makeSchema(), node);
			expect(() => {
				textNode.check();
			}).not.toThrow();
		});
	});

	describe('whitelist URLs', () => {
		const schema = makeSchema();

		it(`should parse links starting from http://`, () => {
			const doc = fromHTML(`<p><a href="http://www.atlassian.com">Atlassian</a></p>`, schema);
			const textNode = doc.firstChild!.firstChild!;

			expect(textNode.marks).toHaveLength(1);
		});

		it(`should parse links starting from https://`, () => {
			const doc = fromHTML(`<p><a href="https://www.atlassian.com">Atlassian</a></p>`, schema);
			const textNode = doc.firstChild!.firstChild!;

			expect(textNode.marks).toHaveLength(1);
		});

		it(`should parse links starting from sourcetree://`, () => {
			const doc = fromHTML(
				`<p><a href="sourcetree://cloneRepo/ssh://user@bitbucket.org/owner/repo.git">Clone me</a></p>`,
				schema,
			);
			const textNode = doc.firstChild!.firstChild!;

			expect(textNode.marks).toHaveLength(1);
		});

		it(`should parse root relative links`, () => {
			const doc = fromHTML(`<p><a href="/TEST-100">TEST-100</a></p>`, schema);
			const textNode = doc.firstChild!.firstChild!;

			expect(textNode.marks).toHaveLength(1);
		});

		it(`should not parse links starting from javascript://`, () => {
			const doc = fromHTML(`<p><a href="javascript:alert(1)">Click me</a></p>`, schema);
			const textNode = doc.firstChild!.firstChild!;

			expect(textNode.marks).toHaveLength(0);
		});

		it(`should not parse links starting from view-source://`, () => {
			const doc = fromHTML(
				`<p><a href="view-source:https://bitbucket.org/atlassian/atlaskit/pull-requests/3196/fix-component-prevent-javascript-links-for/diff">View source</a></p>`,
				schema,
			);
			const textNode = doc.firstChild!.firstChild!;

			expect(textNode.marks).toHaveLength(0);
		});

		it(`should remove unsafe link when serialize`, () => {
			const schema = makeSchema();
			const node = schema.text(content, [schema.marks.link.create({ href: unsafeHref })]);
			const html: string = toHTML(node, schema);

			expect(html).toContain(`${emptyLink}`);
		});
	});

	describe('serialization', () => {
		it(`serializes to ${sampleLink}`, () => {
			const schema = makeSchema();
			const node = schema.text(content, [schema.marks.link.create({ href })]);
			const html: string = toHTML(node, schema);
			expect(html).toContain(`${sampleLink}`);
		});

		it(`serializes block marked links ${sampleLink}`, () => {
			const schema = makeSchema();
			const node = schema.nodes.paragraph.create(null, schema.text(content), [
				schema.marks.link.create({ href }),
			]);
			const html: string = toHTML(node, schema);
			expect(html).toContain(`${sampleBlockLink}`);
		});
	});

	describe('confluence metadata', () => {
		it('creates a PM node with attributes from ADF', () => {
			const doc = {
				type: 'text',
				text: 'Foo',
				marks: [
					{
						type: 'link',
						attrs: {
							href: 'http://example.com',
							__confluenceMetadata: {
								linkType: 'value',
							},
						},
					},
				],
			};

			const text = Node.fromJSON(makeSchema(), doc);
			expect(text.marks[0].attrs).toHaveProperty('__confluenceMetadata');
			expect(text.marks[0].attrs.__confluenceMetadata).toHaveProperty('linkType', 'value');
		});
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text'],
		marks: ['link', 'textColor', 'backgroundColor'],
	});
}

function itMatches(html: string, href: string, expectedText: string) {
	it(`matches ${html}`, () => {
		const schema = makeSchema();
		const doc = fromHTML(html, schema);
		const link = schema.marks.link.create({ href });
		expect(textWithMarks(doc, expectedText, [link])).toBe(true);
	});
}
