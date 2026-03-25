import {
	a,
	blockquote,
	br,
	code,
	code_block,
	decisionItem,
	decisionList,
	doc,
	em,
	emoji,
	img,
	inlineCard,
	layoutColumn,
	layoutSection,
	li,
	media,
	mediaGroup,
	mediaInline,
	mediaSingle,
	mention,
	ol,
	p,
	panel,
	placeholder,
	status,
	strike,
	strong,
	subsup,
	table,
	tr,
	th,
	td,
	taskList,
	taskItem,
	typeAheadQuery,
	ul,
	underline,
	caption,
	backgroundColor,
	expand,
	nestedExpand,
	bodiedSyncBlock,
	syncBlock,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';

import { MarkdownSerializer, marks, nodes } from '../../serializer';

// @ts-expect-error - Our node definitions are not compatible with prosemirror-markdown types
const markdownSerializer = new MarkdownSerializer(nodes, marks);

describe('SlackTransformer: serializer', () => {
	const pre = code_block();

	it('should serialize paragraphs', () => {
		expect(markdownSerializer.serialize(doc(p('foo'))(defaultSchema))).toEqual('foo');
		expect(markdownSerializer.serialize(doc(p('foo'), p('bar'))(defaultSchema))).toEqual(
			'foo\n\nbar',
		);

		const longText = 'foo '.repeat(100);
		expect(markdownSerializer.serialize(doc(p(longText), p(longText))(defaultSchema))).toEqual(
			`${longText}\n\n${longText}`,
		);
	});

	it('should preserve multiple blank lines using zero-non-width', () => {
		expect(markdownSerializer.serialize(doc(p('foo'), p(), p('bar'))(defaultSchema))).toEqual(
			'foo\n\n\u200c\n\nbar',
		);

		expect(markdownSerializer.serialize(doc(p('foo'), p(), p(), p('bar'))(defaultSchema))).toEqual(
			'foo\n\n\u200c\n\n\u200c\n\nbar',
		);
	});

	it('should preserve leading and trailing blank lines using zero-non-width', () => {
		expect(markdownSerializer.serialize(doc(p(), p('bar'))(defaultSchema))).toEqual(
			'\u200c\n\nbar',
		);

		expect(markdownSerializer.serialize(doc(p(), p(), p('bar'))(defaultSchema))).toEqual(
			'\u200c\n\n\u200c\n\nbar',
		);

		expect(markdownSerializer.serialize(doc(p('foo'), p())(defaultSchema))).toEqual(
			'foo\n\n\u200c',
		);

		expect(markdownSerializer.serialize(doc(p('foo'), p(), p())(defaultSchema))).toEqual(
			'foo\n\n\u200c\n\n\u200c',
		);
	});

	it('should not escape lone pipe characters', () => {
		expect(markdownSerializer.serialize(doc(p(` | | `))(defaultSchema))).toEqual(` | | `);
	});

	describe('mentions', () => {
		it('should serialize mentions', () => {
			const node = doc(p(mention({ text: 'Rostyslav Synenko', id: 'rsynenko' })()))(defaultSchema);
			const test = markdownSerializer.serialize(node);
			expect(test).toEqual('@rsynenko');
		});

		it('should divide serialized mentions and text with one blank space', () => {
			const node = doc(p(mention({ text: 'Rostyslav Synenko', id: 'rsynenko' })(), 'text'))(
				defaultSchema,
			);
			const test = markdownSerializer.serialize(node);
			expect(test).toEqual('@rsynenko text');
		});

		it('should not add a blank space in the end of the string for mentions', () => {
			const node = doc(p('text ', mention({ text: 'Rostyslav Synenko', id: 'rsynenko' })()))(
				defaultSchema,
			);
			const test = markdownSerializer.serialize(node);
			expect(test).toEqual('text @rsynenko');
		});

		it('should not divide mention and text with additional space if text starts with the space', () => {
			const node = doc(p(mention({ text: 'Rostyslav Synenko', id: 'rsynenko' })(), ' text'))(
				defaultSchema,
			);
			const test = markdownSerializer.serialize(node);
			expect(test).toEqual('@rsynenko text');
		});

		it('should divide mention and text with only one additional space if text starts with the spaces', () => {
			const node = doc(p(mention({ text: 'Rostyslav Synenko', id: 'rsynenko' })(), '  text'))(
				defaultSchema,
			);
			const test = markdownSerializer.serialize(node);
			expect(test).toEqual('@rsynenko  text');
		});

		it('should not divide mention and italic text node with additional space if text starts with the space', () => {
			const node = doc(p(mention({ text: 'Rostyslav Synenko', id: 'rsynenko' })(), em(' text')))(
				defaultSchema,
			);
			const test = markdownSerializer.serialize(node);
			expect(test).toEqual('@rsynenko _text_');
		});
	});

	describe('emoji', () => {
		it('should serialize emoji (returns text)', () => {
			const node = doc(p(emoji({ text: '😁', shortName: ':grinning:' })()))(defaultSchema);
			const test = markdownSerializer.serialize(node);
			expect(test).toEqual('😁');
		});

		it('should serialize emoji (returns shortName if text is undefined)', () => {
			const node = doc(p(emoji({ shortName: ':grinning:' })()))(defaultSchema);
			const test = markdownSerializer.serialize(node);
			expect(test).toEqual(':grinning:');
		});
	});

	describe('captions', () => {
		it('should serialize captions', () => {
			expect(
				markdownSerializer.serialize(
					doc(
						mediaSingle()(
							media({ collection: 'test', id: 'media-id', type: 'file' })(),
							caption('foo'),
						),
					)(defaultSchema),
				),
			).toEqual('[media attached]\n\nfoo\n\n\n');
		});

		it('should serialize long captions', () => {
			const longText = 'foo '.repeat(100);
			expect(
				markdownSerializer.serialize(
					doc(
						mediaSingle()(
							media({ collection: 'test', id: 'media-id', type: 'file' })(),
							caption(longText),
						),
					)(defaultSchema),
				),
			).toEqual(`[media attached]\n\n${longText}\n\n\n`);
		});
	});

	describe('code block', () => {
		it('with simple text should be serialized', () => {
			expect(markdownSerializer.serialize(doc(pre('foo'))(defaultSchema))).toEqual('```\nfoo\n```');
		});

		it('with newlines preserves newlines in markdown', () => {
			expect(markdownSerializer.serialize(doc(pre('foo\nbar'))(defaultSchema))).toEqual(
				'```\nfoo\nbar\n```',
			);
		});

		it('with adjacent code block keeps empty space between', () => {
			expect(markdownSerializer.serialize(doc(pre('foo'), pre('bar'))(defaultSchema))).toEqual(
				'```\nfoo\n```\n\n```\nbar\n```',
			);
		});

		it('after a list should not disappear', () => {
			expect(
				markdownSerializer.serialize(doc(ul(li(p('para'))), pre('hello'))(defaultSchema)),
			).toEqual('• para\n\n```\nhello\n```');
		});

		it('with attributes uses backtick notation and does not preserve attributes', () => {
			const js = code_block({ language: 'js' });
			expect(markdownSerializer.serialize(doc(js('foo'))(defaultSchema))).toEqual('```\nfoo\n```');

			expect(markdownSerializer.serialize(doc(js('foo\nbar'))(defaultSchema))).toEqual(
				'```\nfoo\nbar\n```',
			);
		});

		it('with no text is preserved', () => {
			expect(markdownSerializer.serialize(doc(pre(''))(defaultSchema))).toEqual('```\n\u200c\n```');

			expect(markdownSerializer.serialize(doc(pre())(defaultSchema))).toEqual('```\n\u200c\n```');
		});
	});

	describe('bullet list', () => {
		it('with elements should serialize', () => {
			expect(
				markdownSerializer.serialize(
					doc(ul(li(p('foo')), li(p('bar')), li(p('baz'))))(defaultSchema),
				),
			).toEqual('• foo\n• bar\n• baz\n\n');
		});

		it('surrounded with other block elements keeps empty line between', () => {
			expect(
				markdownSerializer.serialize(
					doc(p('para'), ul(li(p('foo')), li(p('bar'))), p('baz'))(defaultSchema),
				),
			).toEqual('para\n\n• foo\n• bar\n\nbaz');
		});

		it('with one empty element is preserved', () => {
			expect(markdownSerializer.serialize(doc(ul(li(p(''))))(defaultSchema))).toEqual('• \n\n');
		});

		it('with nesting should serialize', () => {
			expect(
				markdownSerializer.serialize(
					doc(
						ul(
							li(
								p('foo 1'),
								ul(li(p('bar 1'), ul(li(p('baz 1')), li(p('baz 2')))), li(p('bar 2'))),
							),
							li(p('foo 2')),
						),
					)(defaultSchema),
				),
			).toEqual(
				'• foo 1\n' +
					'    • bar 1\n' +
					'        • baz 1\n' +
					'        • baz 2\n' +
					'    • bar 2\n' +
					'• foo 2\n' +
					'\n',
			);
		});

		it('with newline', () => {
			expect(
				markdownSerializer.serialize(
					doc(ul(li(p('item 1'), p('\n')), li(p('item 2'))))(defaultSchema),
				),
			).toEqual('• item 1\n' + '\n' + '    \n' + '    \n' + '\n' + '\n' + '• item 2\n' + '\n');
		});

		it('with list item containing two lines', () => {
			expect(
				markdownSerializer.serialize(
					doc(ul(li(p('item 1'), p('item 1 desc')), li(p('item 2'))))(defaultSchema),
				),
			).toEqual('• item 1\n' + '\n' + '    item 1 desc\n' + '\n' + '\n' + '• item 2\n' + '\n');
		});
	});

	describe('ordered list', () => {
		it('with elements should serialize', () => {
			expect(
				markdownSerializer.serialize(
					doc(ol()(li(p('foo')), li(p('bar')), li(p('baz'))))(defaultSchema),
				),
			).toEqual('1. foo\n2. bar\n3. baz\n\n');
		});

		it('surrounded with other block elements keeps empty line between', () => {
			expect(
				markdownSerializer.serialize(
					doc(p('para'), ol()(li(p('foo')), li(p('bar'))), p('baz'))(defaultSchema),
				),
			).toEqual('para\n\n1. foo\n2. bar\n\nbaz');
		});

		it('with 10+ elements aligns numbers to right', () => {
			expect(
				markdownSerializer.serialize(
					doc(
						ol()(
							li(p('item')),
							li(p('item')),
							li(p('item')),
							li(p('item')),
							li(p('item')),
							li(p('item')),
							li(p('item')),
							li(p('item')),
							li(p('item')),
							li(p('item')),
						),
					)(defaultSchema),
				),
			).toEqual(
				'1. item\n2. item\n3. item\n4. item\n5. item\n6. item\n7. item\n8. item\n9. item\n10. item\n\n',
			);
		});

		it('with one empty element is preserved', () => {
			expect(markdownSerializer.serialize(doc(ol()(li(p(''))))(defaultSchema))).toEqual('1. \n\n');
		});

		it('with nesting should serialize', () => {
			expect(
				markdownSerializer.serialize(
					doc(
						ol()(
							li(
								p('foo 1'),
								ol()(li(p('bar 1'), ol()(li(p('baz 1')), li(p('baz 2')))), li(p('bar 2'))),
							),
							li(p('foo 2')),
						),
					)(defaultSchema),
				),
			).toEqual(
				'1. foo 1\n' +
					'    1. bar 1\n' +
					'        1. baz 1\n' +
					'        2. baz 2\n' +
					'    2. bar 2\n' +
					'2. foo 2\n' +
					'\n',
			);
		});
	});

	describe('mixed lists', () => {
		it('of nested ordered and unordered should serialize', () => {
			expect(
				markdownSerializer.serialize(
					doc(
						ol()(
							li(
								p('foo 1'),
								ul(
									li(p('bar 1'), ol()(li(p('baz 1')), li(p('baz 2'), ul(li(p('banana')))))),
									li(p('bar 2')),
								),
							),
							li(p('foo 2')),
						),
					)(defaultSchema),
				),
			).toEqual(
				'1. foo 1\n' +
					'    • bar 1\n' +
					'        1. baz 1\n' +
					'        2. baz 2\n' +
					'            • banana\n' +
					'    • bar 2\n' +
					'2. foo 2\n' +
					'\n',
			);
		});

		it('of consecutive ordered and unordered should serialize', () => {
			expect(
				markdownSerializer.serialize(
					doc(
						ol()(li(p('foo 1')), li(p('foo 2'))),
						ul(li(p('bar 1')), li(p('bar 2'))),
						ol()(li(p('baz 1')), li(p('baz 2'))),
					)(defaultSchema),
				),
			).toEqual(
				'1. foo 1\n' +
					'2. foo 2\n' +
					'\n' +
					'• bar 1\n' +
					'• bar 2\n' +
					'\n' +
					'1. baz 1\n' +
					'2. baz 2\n' +
					'\n',
			);
		});
	});

	it('should serialize hardBreak to newline', () => {
		expect(markdownSerializer.serialize(doc(p('foo ', br(), 'bar'))(defaultSchema))).toEqual(
			'foo   \nbar',
		);
	});

	describe('image', () => {
		it('should serialize img', () => {
			expect(
				markdownSerializer.serialize(
					doc(
						p(
							img({
								src: 'http://example.com',
							})(),
						),
					)(defaultSchema),
				),
			).toEqual('[<http://example.com|image attached>]');
		});
	});

	describe('media', () => {
		it('should be serialized', () => {
			expect(
				markdownSerializer.serialize(
					doc(mediaSingle()(media({ collection: 'test', id: 'media-id', type: 'file' })()))(
						defaultSchema,
					),
				),
			).toEqual('[media attached]\n\n');
		});

		it('should be serialized to an inline file', () => {
			expect(
				markdownSerializer.serialize(
					doc(
						p(
							mediaInline({
								type: 'file',
								collection: 'test',
								id: 'media-id',
							})(),
						),
					)(defaultSchema),
				),
			).toEqual('[inline file attached]');
		});

		it('should be serialized to an inline image', () => {
			expect(
				markdownSerializer.serialize(
					doc(
						p(
							mediaInline({
								type: 'image',
								collection: 'test',
								id: 'media-id',
							})(),
						),
					)(defaultSchema),
				),
			).toEqual('[inline image attached]');
		});
	});

	describe('blockquotes', () => {
		it('should serialized', () => {
			expect(markdownSerializer.serialize(doc(blockquote(p('foo')))(defaultSchema))).toEqual(
				'> foo',
			);
			expect(
				markdownSerializer.serialize(
					doc(blockquote(p('foo')), blockquote(p('bar')))(defaultSchema),
				),
			).toEqual('> foo\n\n> bar');
		});

		it('should serialize list inside blockquote', () => {
			expect(
				markdownSerializer.serialize(
					doc(blockquote(ul(li(p('list item 1')), li(p('list item 2')))))(defaultSchema),
				),
			).toEqual('> • list item 1\n> • list item 2\n> \n');
		});

		it('should serialize a codeblock inside a blockquote', () => {
			expect(
				markdownSerializer.serialize(
					doc(
						blockquote(
							code_block({ language: 'esperanto' })('Mia kusenveturilo estas plena je angiloj'),
						),
					)(defaultSchema),
				),
			).toEqual('> ```\n> Mia kusenveturilo estas plena je angiloj\n> ```');
		});

		it('should serialize a media single inside a blockquote', () => {
			expect(
				markdownSerializer.serialize(
					doc(
						blockquote(
							mediaSingle({
								layout: 'center',
								width: 354,
								widthType: 'pixel',
							})(
								media({
									width: 1024,
									alt: '6b6a0fdc-3aba-41e5-9ccb-dade3165804a.png',
									id: '397edf6e-2d0f-4d78-a855-4158fcc594e7',
									collection: 'contentId-4113639891',
									type: 'file',
									height: 1024,
								})(),
								caption('Caption on media in quote'),
							),
						),
					)(defaultSchema),
				),
			).toEqual('> [media attached]\n> \n> Caption on media in quote\n>\n> \n');
		});

		it('should serialize a media group inside a blockquote', () => {
			expect(
				markdownSerializer.serialize(
					doc(
						blockquote(
							mediaGroup(
								media({
									id: 'a9dfeb96-18aa-4eca-8c95-c7c19be33650',
									collection: 'contentId-4113639891',
									type: 'file',
								})(),
							),
						),
					)(defaultSchema),
				),
			).toEqual('> [media attached]\n');
		});
	});

	describe('marks -', () => {
		it('should ignore typeAheadQuery mark', () => {
			expect(
				markdownSerializer.serialize(
					doc(p(typeAheadQuery({ trigger: '@' })('@rsynenko')))(defaultSchema),
				),
			).toEqual('@rsynenko');
		});

		it('should ignore backgroundColor mark', () => {
			expect(
				markdownSerializer.serialize(
					doc(p(backgroundColor({ color: 'red' })('Highlight Red')))(defaultSchema),
				),
			).toEqual('Highlight Red');
		});

		/**
		 * Slack markdown does not have specific syntax for (sub|super)script, underline.
		 */
		it('should serialize superscript as default text', () => {
			expect(
				markdownSerializer.serialize(doc(p(subsup({ type: 'sup' })('superscript')))(defaultSchema)),
			).toEqual('superscript');
		});

		it('should serialize subscript as default text', () => {
			expect(
				markdownSerializer.serialize(doc(p(subsup({ type: 'sup' })('subscript')))(defaultSchema)),
			).toEqual('subscript');
		});

		it('should serialize underline as default text', () => {
			expect(markdownSerializer.serialize(doc(p(underline('underline')))(defaultSchema))).toEqual(
				'underline',
			);
		});

		it('should serialize em', () => {
			expect(markdownSerializer.serialize(doc(p(em('foo')))(defaultSchema))).toEqual('_foo_');
			expect(
				markdownSerializer.serialize(doc(p('foo ', em('bar'), ' baz'))(defaultSchema)),
			).toEqual('foo _bar_ baz');
		});

		it('should serialize strong', () => {
			expect(markdownSerializer.serialize(doc(p(strong('foo')))(defaultSchema))).toEqual('*foo*');
			expect(
				markdownSerializer.serialize(doc(p('foo ', strong('bar bar'), ' baz'))(defaultSchema)),
			).toEqual('foo *bar bar* baz');
		});

		it('should serialize strikethrough', () => {
			expect(markdownSerializer.serialize(doc(p(strike('foo')))(defaultSchema))).toEqual('~foo~');
			expect(
				markdownSerializer.serialize(doc(p('foo ', strike('bar bar'), ' baz'))(defaultSchema)),
			).toEqual('foo ~bar bar~ baz');
		});

		it('should serialize code', () => {
			expect(markdownSerializer.serialize(doc(p(code('foo')))(defaultSchema))).toEqual('`foo`');
			expect(
				markdownSerializer.serialize(doc(p('foo ', code('bar baz'), ' foo'))(defaultSchema)),
			).toEqual('foo `bar baz` foo');
		});

		describe('code', () => {
			it('should convert code', () => {
				expect(
					markdownSerializer.serialize(doc(p('foo ', code('bar ` ` baz'), ' foo'))(defaultSchema)),
				).toEqual('foo `bar ` ` baz` foo');
			});
		});

		describe('links', () => {
			it('with no text to be ignored', () => {
				const link = a({ href: 'http://example.com' });

				expect(markdownSerializer.serialize(doc(p(link('')))(defaultSchema))).toEqual('');
			});

			it('with no title to serialize', () => {
				const link = a({ href: 'http://example.com' });

				expect(markdownSerializer.serialize(doc(p(link('foo')))(defaultSchema))).toEqual(
					'<http://example.com|foo>',
				);
			});
		});

		describe('emphasis -', () => {
			it('asterisk within strings should be escaped', () => {
				expect(markdownSerializer.serialize(doc(p('*foo bar*'))(defaultSchema))).toEqual(
					'\\*foo bar\\*',
				);

				expect(markdownSerializer.serialize(doc(p('**foo bar**'))(defaultSchema))).toEqual(
					'\\*\\*foo bar\\*\\*',
				);

				expect(markdownSerializer.serialize(doc(p('***foo bar***'))(defaultSchema))).toEqual(
					'\\*\\*\\*foo bar\\*\\*\\*',
				);
			});

			it('underscore within strings should be escaped', () => {
				expect(markdownSerializer.serialize(doc(p('_foo bar_'))(defaultSchema))).toEqual(
					'\\_foo bar\\_',
				);

				expect(markdownSerializer.serialize(doc(p('__foo bar__'))(defaultSchema))).toEqual(
					'\\_\\_foo bar\\_\\_',
				);

				expect(markdownSerializer.serialize(doc(p('___foo bar___'))(defaultSchema))).toEqual(
					'\\_\\_\\_foo bar\\_\\_\\_',
				);
			});

			it('"strong em" should be escaped in its entirety', () => {
				expect(markdownSerializer.serialize(doc(p('*strong*em*'))(defaultSchema))).toEqual(
					'\\*strong\\*em\\*',
				);
			});

			it('"smart em" should be escaped in its entirety', () => {
				expect(markdownSerializer.serialize(doc(p('_smart_emphasis_'))(defaultSchema))).toEqual(
					'\\_smart\\_emphasis\\_',
				);
			});

			it('should handle strong/em/strikethrough being next to each other', () => {
				expect(
					markdownSerializer.serialize(
						doc(p(strike('hello, '), em(' how are'), strong(' you')))(defaultSchema),
					),
				).toEqual('~hello,~  _how are_ *you*');
			});

			it('combinations should be properly serialized', () => {
				expect(markdownSerializer.serialize(doc(p(em('hi'), '*there*'))(defaultSchema))).toEqual(
					'_hi_\\*there\\*',
				);

				expect(
					markdownSerializer.serialize(doc(p(strike(strong('foo bar baz'))))(defaultSchema)),
				).toEqual('*~foo bar baz~*');

				expect(
					markdownSerializer.serialize(doc(p(strong(strike('foo bar'), ' baz')))(defaultSchema)),
				).toEqual('*~foo bar~ baz*');

				expect(
					markdownSerializer.serialize(doc(p(em(strike('foo bar'), ' baz')))(defaultSchema)),
				).toEqual('_~foo bar~ baz_');

				expect(markdownSerializer.serialize(doc(p(code('*bar baz*')))(defaultSchema))).toEqual(
					'`*bar baz*`',
				);

				expect(markdownSerializer.serialize(doc(p(code('__bar_baz__')))(defaultSchema))).toEqual(
					'`__bar_baz__`',
				);
			});
		});

		describe('tilde ~', () => {
			it('should escape tilde ~', () => {
				expect(markdownSerializer.serialize(doc(p('~'))(defaultSchema))).toEqual('\\~');
			});
		});
	});

	describe('New lines', () => {
		it('should serialize new line - 1', () => {
			expect(markdownSerializer.serialize(doc(p('foo\nbar'))(defaultSchema))).toEqual('foo\nbar');
		});

		it('should serialize new line - 2', () => {
			expect(markdownSerializer.serialize(doc(p('foo\nbar'))(defaultSchema))).toEqual('foo\nbar');
		});

		it('should serialize new line - 3', () => {
			expect(
				markdownSerializer.serialize(
					doc(p('pagh\nwa’\ncha’\nwej\nloS\nvagh\njav\nSoch\nchorgh\nHut\n'))(defaultSchema),
				),
			).toEqual('pagh\nwa’\ncha’\nwej\nloS\nvagh\njav\nSoch\nchorgh\nHut\n');
		});
	});
});

describe('inline card', () => {
	it('should serialize an inline card with url type attributes', () => {
		const url = 'https://product-fabric.atlassian.net/browse/EX-522#icft=EX-522';

		expect(markdownSerializer.serialize(doc(p(inlineCard({ url })()))(defaultSchema))).toEqual(
			`[<${url}|inline card>]`,
		);
	});

	it('should serialize an inline card with data type attributes', () => {
		expect(markdownSerializer.serialize(doc(p(inlineCard({ data: {} })()))(defaultSchema))).toEqual(
			'[inline card]',
		);
	});
});

describe('panel', () => {
	it('should convert an info panel node', () => {
		expect(
			markdownSerializer.serialize(
				doc(panel({ panelType: 'info' })(p('This is an info panel')))(defaultSchema),
			),
		).toEqual('This is an info panel');
	});
});

describe('placeholder', () => {
	it('should convert an placeholder', () => {
		expect(
			markdownSerializer.serialize(doc(p(placeholder({ text: 'Placeholder' })))(defaultSchema)),
		).toEqual('Placeholder');
	});
});

describe('status', () => {
	it('should serialize a status', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					p(
						status({
							text: 'status',
							color: 'neutral',
							localId: 'local-id',
						}),
					),
				)(defaultSchema),
			),
		).toEqual('*status*');
	});
});

describe('decision', () => {
	it('should serialize a decision list', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					decisionList({ localId: 'list-local-id' })(
						decisionItem({
							localId: 'item-local-id',
							state: 'DECIDED',
						})('Decision item 1'),
						decisionItem({
							localId: 'item-local-id',
							state: 'DECIDED',
						})('Decision item 2'),
					),
				)(defaultSchema),
			),
		).toEqual('<> Decision item 1\n<> Decision item 2\n\n');
	});
});

describe('layout', () => {
	it('should serialize layout', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					layoutSection(
						layoutColumn({ width: 50 })(p('Layout column 1')),
						layoutColumn({ width: 50 })(p('Layout column 2')),
					),
				)(defaultSchema),
			),
		).toEqual('Layout column 1\n\nLayout column 2');
	});
});

describe('tables', () => {
	it('should serialize a table', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					table()(
						tr(th({})(p('h1')), th({})(p('h2')), th({})(p('h3'))),
						tr(td({})(p('c11')), td({})(p('c12')), td({})(p('c13'))),
						tr(td({})(p('c21')), td({})(p('c22')), td({})(p('c23'))),
					),
				)(defaultSchema),
			),
		).toEqual('[table]');
	});
});

describe('expands', () => {
	it('should serialize an expand to an unsupported node indicator', () => {
		expect(
			markdownSerializer.serialize(doc(expand({ title: 'Title' })(p('Content')))(defaultSchema)),
		).toEqual('[expand]');
	});

	it('should serialize an expand with a nestedExpand to an unsupported node indicator', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					expand({ title: 'Parent title' })(
						p('Parent content'),
						nestedExpand({ title: 'Child title' })(p('Child content')),
					),
				)(defaultSchema),
			),
		).toEqual('[expand]');
	});
});

describe('bodiedSyncBlock', () => {
	it('should serialize a bodiedSyncBlock by just showing its content', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					bodiedSyncBlock({ resourceId: 'test-resource-id', localId: 'test-local-id' })(
						p('Introduction'),
						ul(li(p('Item 1')), li(p('Item 2'))),
						p('Conclusion'),
					),
				)(defaultSchema),
			),
		).toEqual('Introduction\n\n• Item 1\n• Item 2\n\nConclusion');
	});
});

describe('syncBlock', () => {
	it('should serialize a syncBlock to an unsupported node indicator', () => {
		expect(
			markdownSerializer.serialize(
				doc(syncBlock({ resourceId: 'test-resource-id', localId: 'test-local-id' })())(
					defaultSchema,
				),
			),
		).toEqual('[sync block]');
	});
});

describe('task list', () => {
	it('should serialize a basic task list with TODO items', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					taskList({ localId: 'list-1' })(
						taskItem({ localId: 'item-1', state: 'TODO' })('Task 1'),
						taskItem({ localId: 'item-2', state: 'TODO' })('Task 2'),
					),
				)(defaultSchema),
			),
		).toEqual('[ ] Task 1\n[ ] Task 2\n\n');
	});

	it('should serialize task items with DONE state', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					taskList({ localId: 'list-1' })(
						taskItem({ localId: 'item-1', state: 'DONE' })('Completed task'),
						taskItem({ localId: 'item-2', state: 'TODO' })('Pending task'),
					),
				)(defaultSchema),
			),
		).toEqual('[x] Completed task\n[ ] Pending task\n\n');
	});

	it('should serialize an empty task item', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					taskList({ localId: 'list-1' })(taskItem({ localId: 'item-1', state: 'TODO' })()),
				)(defaultSchema),
			),
		).toEqual('[ ] \n\n');
	});

	it('should serialize nested task lists (sibling-based nesting)', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					taskList({ localId: 'list-1' })(
						taskItem({ localId: 'item-1', state: 'TODO' })('Parent task'),
						taskList({ localId: 'list-2' })(
							taskItem({ localId: 'item-2', state: 'TODO' })('Child task 1'),
							taskItem({ localId: 'item-3', state: 'DONE' })('Child task 2'),
						),
					),
				)(defaultSchema),
			),
		).toEqual(
			'[ ] Parent task\n' + '  [ ] Child task 1\n' + '  [x] Child task 2\n\n',
		);
	});

	it('should serialize deeply nested task lists', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					taskList({ localId: 'list-1' })(
						taskItem({ localId: 'item-1', state: 'TODO' })('Level 1'),
						taskList({ localId: 'list-2' })(
							taskItem({ localId: 'item-2', state: 'TODO' })('Level 2'),
							taskList({ localId: 'list-3' })(
								taskItem({ localId: 'item-3', state: 'DONE' })('Level 3'),
							),
						),
					),
				)(defaultSchema),
			),
		).toEqual(
			'[ ] Level 1\n' +
				'  [ ] Level 2\n' +
				'    [x] Level 3\n\n',
		);
	});

	it('should serialize task list surrounded by other block elements', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					p('Before tasks'),
					taskList({ localId: 'list-1' })(
						taskItem({ localId: 'item-1', state: 'TODO' })('Task 1'),
						taskItem({ localId: 'item-2', state: 'DONE' })('Task 2'),
					),
					p('After tasks'),
				)(defaultSchema),
			),
		).toEqual('Before tasks\n\n[ ] Task 1\n[x] Task 2\n\nAfter tasks');
	});
});

describe('wrapper listItem (flexible list indentation)', () => {
	it('should serialize a wrapper listItem with nested bullet list', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					ul(
						li(p('Normal item')),
						li(ul(li(p('Indented item 1')), li(p('Indented item 2')))),
					),
				)(defaultSchema),
			),
		).toEqual('• Normal item\n    • Indented item 1\n    • Indented item 2\n');
	});

	it('should serialize a wrapper listItem with nested ordered list', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					ul(
						li(p('Bullet item')),
						li(ol()(li(p('Numbered 1')), li(p('Numbered 2')))),
					),
				)(defaultSchema),
			),
		).toEqual('• Bullet item\n    1. Numbered 1\n    2. Numbered 2\n');
	});

	it('should serialize a wrapper listItem inside an ordered list', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					ol()(
						li(p('First')),
						li(ul(li(p('Nested bullet 1')), li(p('Nested bullet 2')))),
					),
				)(defaultSchema),
			),
		).toEqual('1. First\n    • Nested bullet 1\n    • Nested bullet 2\n');
	});

	it('should serialize deeply nested wrapper listItems', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					ul(
						li(p('Level 1')),
						li(
							ul(
								li(p('Level 2')),
								li(ul(li(p('Level 3')))),
							),
						),
					),
				)(defaultSchema),
			),
		).toEqual('• Level 1\n    • Level 2\n        • Level 3\n');
	});

	it('should serialize wrapper listItem with mixed list types', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					ul(
						li(p('Bullet item')),
						li(
							taskList({ localId: 'list-1' })(
								taskItem({ localId: 'item-1', state: 'TODO' })('Task in bullet'),
							),
						),
					),
				)(defaultSchema),
			),
		).toEqual('• Bullet item\n    [ ] Task in bullet\n');
	});

	it('should serialize multi-level step up and down wrapper listItems (1→3→1)', () => {
		const stage0Schema = getSchemaBasedOnStage('stage0');
		expect(
			markdownSerializer.serialize(
				doc(
					ul(
						li(p('Level 1')),
						li(
							ul(
								li(
									ul(
										li(p('Level 3 (stepped down from 1)')),
									),
								),
							),
						),
						li(p('Level 1 (stepped up from 3)')),
					),
				)(stage0Schema),
			),
		).toEqual(
			'• Level 1\n        • Level 3 (stepped down from 1)\n• Level 1 (stepped up from 3)\n\n',
		);
	});

	it('should serialize wrapper listItem with ordered list inside ordered list', () => {
		const stage0Schema = getSchemaBasedOnStage('stage0');
		expect(
			markdownSerializer.serialize(
				doc(
					ol()(
						li(p('First')),
						li(
							ol()(
								li(p('Nested ordered 1')),
								li(p('Nested ordered 2')),
							),
						),
						li(p('Third')),
					),
				)(stage0Schema),
			),
		).toEqual('1. First\n    1. Nested ordered 1\n    2. Nested ordered 2\n3. Third\n\n');
	});

	it('should serialize task list deeply nested via wrappers (bullet > bullet > task)', () => {
		const stage0Schema = getSchemaBasedOnStage('stage0');
		expect(
			markdownSerializer.serialize(
				doc(
					ul(
						li(p('Bullet item')),
						li(
							ul(
								li(
									taskList({ localId: 'list-1' })(
										taskItem({ localId: 'item-1', state: 'TODO' })('Deep task 1'),
										taskItem({ localId: 'item-2', state: 'DONE' })('Deep task 2'),
									),
								),
							),
						),
						li(p('After nested tasks')),
					),
				)(stage0Schema),
			),
		).toEqual(
			'• Bullet item\n        [ ] Deep task 1\n        [x] Deep task 2\n• After nested tasks\n\n',
		);
	});

	it('should correctly indent wrapper children nested inside a standard listItem with content', () => {
		const stage0Schema = getSchemaBasedOnStage('stage0');
		expect(
			markdownSerializer.serialize(
				doc(
					ul(
						li(
							p('Level 1'),
							ul(
								li(
									ul(
										li(p('Level 3')),
									),
								),
							),
						),
					),
				)(stage0Schema),
			),
		).toEqual('• Level 1\n        • Level 3\n\n');
	});

});


describe('task list mixed states across nesting levels', () => {
	const stage0Schema = getSchemaBasedOnStage('stage0');

	it('should serialize mixed TODO and DONE states across nesting levels', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					taskList({ localId: 'list-1' })(
						taskItem({ localId: 'item-1', state: 'DONE' })('Level 1 done'),
						taskList({ localId: 'list-2' })(
							taskItem({ localId: 'item-2', state: 'TODO' })('Level 2 open'),
							taskItem({ localId: 'item-3', state: 'DONE' })('Level 2 done'),
							taskList({ localId: 'list-3' })(
								taskItem({ localId: 'item-4', state: 'DONE' })('Level 3 done'),
								taskItem({ localId: 'item-5', state: 'TODO' })('Level 3 open'),
							),
						),
						taskItem({ localId: 'item-6', state: 'TODO' })('Level 1 open'),
					),
				)(stage0Schema),
			),
		).toEqual(
			'[x] Level 1 done\n' +
				'  [ ] Level 2 open\n' +
				'  [x] Level 2 done\n' +
				'    [x] Level 3 done\n' +
				'    [ ] Level 3 open\n' +
				'[ ] Level 1 open\n\n',
		);
	});

	it('should serialize alternating task list depths (1→3→1→3→1)', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					taskList({ localId: 'list-1' })(
						taskItem({ localId: 'item-1', state: 'TODO' })('Level 1 first'),
						taskList({ localId: 'list-2' })(
							taskList({ localId: 'list-3' })(
								taskItem({ localId: 'item-2', state: 'DONE' })('Level 3'),
							),
						),
						taskItem({ localId: 'item-3', state: 'TODO' })('Level 1 again'),
						taskList({ localId: 'list-4' })(
							taskList({ localId: 'list-5' })(
								taskItem({ localId: 'item-4', state: 'DONE' })('Level 3 again'),
							),
						),
						taskItem({ localId: 'item-5', state: 'TODO' })('Level 1 last'),
					),
				)(stage0Schema),
			),
		).toEqual(
			'[ ] Level 1 first\n' +
				'    [x] Level 3\n' +
				'[ ] Level 1 again\n' +
				'    [x] Level 3 again\n' +
				'[ ] Level 1 last\n\n',
		);
	});

});
