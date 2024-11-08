// eslint-disable no-duplicate-imports

import { uuid } from '@atlaskit/adf-schema';
import { confluenceSchema } from '@atlaskit/adf-schema/schema-confluence';
import * as AdfSchemaDefault from '@atlaskit/adf-schema/schema-default';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { highlightPlugin } from '@atlaskit/editor-plugin-highlight';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line no-duplicate-imports
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Options } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	a,
	backgroundColor,
	blockquote,
	border,
	br,
	code,
	code_block,
	dataConsumer,
	doc,
	em,
	emoji,
	expand,
	extension,
	fragmentMark,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	hr,
	li,
	media,
	mediaGroup,
	mediaInline,
	mediaSingle,
	mention,
	nestedExpand,
	ol,
	p,
	panel,
	panelNote,
	strike,
	strong,
	subsup,
	table,
	td,
	textColor,
	th,
	tr,
	ul,
	underline,
	unsupportedMark,
	unsupportedNodeAttribute,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line no-duplicate-imports

import { JSONTransformer, SchemaStage } from '../../index';
// eslint-disable-next-line no-duplicate-imports
import type { JSONDocNode, JSONNode } from '../../index';
import * as markOverride from '../../markOverrideRules';
import { sanitizeNode } from '../../sanitize/sanitize-node';

jest.mock('../../sanitize/sanitize-node');

const transformer = new JSONTransformer();
const toJSON = (node: PMNode) => transformer.encode(node);
const parseJSON = (node: JSONDocNode) => transformer.parse(node);
const TABLE_LOCAL_ID = 'test-table-local-id';

describe('JSONTransformer:', () => {
	const createEditor = createEditorFactory();

	beforeAll(() => {
		// @ts-ignore
		global['fetch'] = () => Promise.resolve();
		(sanitizeNode as jest.Mock).mockImplementation((node: JSONNode) => node);
		uuid.setStatic(TABLE_LOCAL_ID);
	});

	beforeEach(() => {
		(sanitizeNode as jest.Mock).mockClear();
	});

	afterAll(() => {
		uuid.setStatic(false);
	});

	afterEach(jest.clearAllMocks);

	describe('encode', () => {
		const editor = (doc: DocBuilder, options?: Pick<Options, 'editorProps'>) =>
			createEditor({
				doc,
				editorPlugins: [highlightPlugin({ config: undefined })],
				editorProps: {
					emojiProvider: new Promise(() => {}),
					mentionProvider: new Promise(() => {}),
					media: {
						allowMediaSingle: true,
						featureFlags: {
							mediaInline: true,
						},
					},
					allowBorderMark: true,
					allowTextColor: true,
					allowPanel: true,
					allowRule: true,
					allowTables: true,
					allowExpand: true,
					...(options?.editorProps || {}),
				},
			});

		it('should have an empty content attribute for a header with no content', () => {
			const { editorView } = editor(doc(h1()));

			expect(toJSON(editorView.state.doc)).toEqual({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'heading',
						content: [],
						attrs: {
							level: 1,
						},
					},
				],
			});
		});

		it('should sanitize node on encode', () => {
			const { editorView } = editor(doc(h1()));

			toJSON(editorView.state.doc);

			expect(sanitizeNode).toHaveBeenCalled();
		});

		it('should serialize common nodes/marks as ProseMirror does', () => {
			const { editorView } = editor(
				doc(
					p(strong('>'), ' Atlassian: ', br(), a({ href: 'https://atlassian.com' })('Atlassian')),
					p(
						em('hello'),
						underline('world'),
						code('!'),
						subsup({ type: 'sub' })('sub'),
						'plain text',
						strike('hey'),
						textColor({ color: 'red' })('Red :D'),
						backgroundColor({ color: 'red' })('Highlight Red'),
					),
					ul(li(p('ichi')), li(p('ni')), li(p('san'))),
					ol()(li(p('ek')), li(p('dui')), li(p('tin'))),
					blockquote(p('1')),
					h1('H1'),
					h2('H2'),
					h3('H3'),
					h4('H4'),
					h5('H5'),
					h6('H6'),
					p(emoji({ shortName: ':joy:' })()),
					panel()(p('hello from panel')),
					panelNote(p('hello from note panel')),
					hr(),
					ol({ order: 6 })(li(p('One')), li(p('Two')), li(p('Three'))),
				),
			);
			const pmDoc = editorView.state.doc;
			expect(toJSON(pmDoc)).toMatchSnapshot();
		});

		it('should serialize media nodes/marks as ProseMirror does', () => {
			const { editorView } = editor(
				doc(
					mediaSingle({ layout: 'center' })(
						border({ color: '#091e4224', size: 2 })(
							a({ href: 'https://atlassian.com' })(
								media({
									id: 'foo media single',
									type: 'file',
									collection: '',
									width: 256,
									height: 128,
									alt: 'Good day',
								})(),
							),
						),
					),
					mediaSingle({ layout: 'center', width: 321, widthType: 'pixel' })(
						border({ color: '#091e4224', size: 2 })(
							a({ href: 'https://atlassian.com' })(
								media({
									id: 'foo media single',
									type: 'file',
									collection: '',
									width: 256,
									height: 128,
									alt: 'Good day',
								})(),
							),
						),
					),
					p(
						border({ color: '#091e4224', size: 2 })(
							a({ href: 'https://atlassian.com' })(
								mediaInline({
									id: 'foo file',
									type: 'file',
									collection: '',
									width: 123,
									height: 456,
									alt: 'Good day',
								})(),
							),
						),
					),
					p(
						border({ color: '#091e4224', size: 3 })(
							a({ href: 'https://atlassian.com' })(
								mediaInline({
									id: 'foo image',
									type: 'image',
									collection: '',
									width: 123,
									height: 456,
									alt: 'Good day',
								})(),
							),
						),
					),
				),
			);
			const pmDoc = editorView.state.doc;
			expect(toJSON(pmDoc)).toMatchSnapshot();
		});

		it('should strip optional attrs from media node', () => {
			const { editorView } = editor(
				doc(
					mediaGroup(
						media({
							id: 'foo',
							type: 'file',
							collection: '',
							__fileName: 'foo.png',
							__displayType: 'thumbnail',
							__fileMimeType: 'image/png',
							__fileSize: 1234,
						})(),
					),
				),
			);
			expect(toJSON(editorView.state.doc)).toEqual({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'mediaGroup',
						content: [
							{
								type: 'media',
								attrs: {
									id: 'foo',
									type: 'file',
									collection: '',
								},
							},
						],
					},
				],
			});
		});

		it('should strip optional attrs from media inline node', () => {
			const { editorView } = editor(
				doc(
					p(
						mediaInline({
							id: 'foo',
							type: 'file',
							collection: '',
							__fileName: 'foo.png',
							__displayType: 'thumbnail',
							__fileMimeType: 'image/png',
							__fileSize: 1234,
						})(),
					),
				),
			);
			expect(toJSON(editorView.state.doc)).toEqual({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [
							{
								type: 'mediaInline',
								attrs: {
									id: 'foo',
									type: 'file',
									collection: '',
								},
							},
						],
					},
				],
			});
		});

		it('should strip optional attrs from media inline image node', () => {
			const { editorView } = editor(
				doc(
					p(
						mediaInline({
							id: 'foo',
							type: 'image',
							collection: '',
							__fileName: 'foo.png',
							__displayType: 'thumbnail',
							__fileMimeType: 'image/png',
							__fileSize: 1234,
						})(),
					),
				),
			);
			expect(toJSON(editorView.state.doc)).toEqual({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [
							{
								type: 'mediaInline',
								attrs: {
									id: 'foo',
									type: 'image',
									collection: '',
								},
							},
						],
					},
				],
			});
		});

		it('should strip optional attrs from expand node', () => {
			const { editorView } = editor(
				doc(
					expand({
						title: 'Click here to expand...',
						__expanded: true,
					})(p('hello')),
				),
			);
			expect(toJSON(editorView.state.doc)).toEqual({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'expand',
						attrs: {
							title: 'Click here to expand...',
						},
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'hello',
									},
								],
							},
						],
					},
				],
			});
		});

		it('should strip optional attrs from nestedExpand node', () => {
			const { editorView } = editor(
				doc(
					table()(
						tr(
							td({})(
								nestedExpand({
									title: 'Click here to expand...',
									__expanded: true,
								})(p('hello')),
							),
						),
					),
				),
			);
			expect(toJSON(editorView.state.doc)).toEqual({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'table',
						attrs: {
							isNumberColumnEnabled: false,
							layout: 'default',
							localId: TABLE_LOCAL_ID,
						},
						content: [
							{
								type: 'tableRow',
								content: [
									{
										type: 'tableCell',
										attrs: {},
										content: [
											{
												type: 'nestedExpand',
												attrs: {
													title: 'Click here to expand...',
												},
												content: [
													{
														type: 'paragraph',
														content: [
															{
																type: 'text',
																text: 'hello',
															},
														],
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			});
		});

		it('should strip unused optional attrs from mention node', () => {
			const { editorView } = editor(
				doc(
					p(
						mention({
							id: 'id-rick',
							text: '@Rick Sanchez',
						})(),
					),
				),
			);

			expect(toJSON(editorView.state.doc)).toEqual({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [
							{
								type: 'mention',
								attrs: {
									id: 'id-rick',
									text: '@Rick Sanchez',
									accessLevel: '',
								},
							},
						],
					},
				],
			});
		});

		it('should not strip accessLevel from mention node', () => {
			const { editorView } = editor(
				doc(
					p(
						mention({
							accessLevel: 'CONTAINER',
							id: 'foo',
							text: 'fallback',
							userType: 'APP',
						})(),
					),
				),
			);

			expect(toJSON(editorView.state.doc)).toEqual({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [
							{
								type: 'mention',
								attrs: {
									id: 'foo',
									text: 'fallback',
									userType: 'APP',
									accessLevel: 'CONTAINER',
								},
							},
						],
					},
				],
			});
		});

		it("should not override mention text if it's already defined", () => {
			const { editorView } = editor(
				doc(
					p(
						mention({
							id: 'id-rick',
							text: '@Rick Sanchez',
						})(),
					),
				),
			);

			expect(
				new JSONTransformer(AdfSchemaDefault.defaultSchema, {
					'id-rick': 'Pickle Rick',
				}).encode(editorView.state.doc),
			).toEqual({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [
							{
								type: 'mention',
								attrs: {
									id: 'id-rick',
									text: '@Rick Sanchez',
									accessLevel: '',
								},
							},
						],
					},
				],
			});
		});

		it('should set mention text using mention mapping if text is unset', () => {
			const { editorView } = editor(
				doc(
					p(
						mention({
							id: 'id-rick',
							text: '',
						})(),
					),
				),
			);

			expect(
				new JSONTransformer(AdfSchemaDefault.defaultSchema, {
					'id-rick': 'Pickle Rick',
				}).encode(editorView.state.doc),
			).toEqual({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [
							{
								type: 'mention',
								attrs: {
									id: 'id-rick',
									text: '@Pickle Rick',
									accessLevel: '',
								},
							},
						],
					},
				],
			});
		});

		it('should strip uniqueId from codeBlock node', () => {
			const { editorView } = editor(
				doc(
					code_block({
						language: 'javascript',
						uniqueId: 'foo',
					})('var foo = 2;'),
				),
			);

			expect(toJSON(editorView.state.doc)).toEqual({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'codeBlock',
						attrs: {
							language: 'javascript',
						},
						content: [
							{
								type: 'text',
								text: 'var foo = 2;',
							},
						],
					},
				],
			});
		});

		it('should strip optional attributes from link mark', () => {
			const { editorView } = editor(doc(p(a({ href: 'https://atlassian.com' })('Atlassian'))));

			expect(toJSON(editorView.state.doc)).toEqual({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [
							{
								type: 'text',
								text: 'Atlassian',
								marks: [
									{
										type: 'link',
										attrs: {
											href: 'https://atlassian.com',
										},
									},
								],
							},
						],
					},
				],
			});
		});

		it('should preserve optional attributes if they are !== null', () => {
			const { editorView } = editor(
				doc(
					p(
						a({
							href: 'https://atlassian.com',
							__confluenceMetadata: { linkType: '' },
						})('Atlassian'),
					),
				),
			);

			expect(toJSON(editorView.state.doc)).toEqual({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [
							{
								type: 'text',
								text: 'Atlassian',
								marks: [
									{
										type: 'link',
										attrs: {
											href: 'https://atlassian.com',
											__confluenceMetadata: { linkType: '' },
										},
									},
								],
							},
						],
					},
				],
			});
		});

		it('should strip language=null from codeBlock node', () => {
			const { editorView } = editor(doc(code_block()('var foo = 2;')));

			expect(toJSON(editorView.state.doc)).toEqual({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'codeBlock',
						attrs: {},
						content: [
							{
								type: 'text',
								text: 'var foo = 2;',
							},
						],
					},
				],
			});
		});

		[
			{ nodeName: 'tableCell', schemaBuilder: td },
			{ nodeName: 'tableHeader', schemaBuilder: th },
		].forEach(({ nodeName, schemaBuilder }) => {
			it(`should strip unused optional attrs from ${nodeName} node`, () => {
				const { editorView } = editor(
					doc(
						table()(
							tr(schemaBuilder({ colspan: 2 })(p('a1'))),
							tr(schemaBuilder({ colspan: 1 })(p('b1')), schemaBuilder({ colspan: 1 })(p('b2'))),
						),
					),
				);

				expect(toJSON(editorView.state.doc)).toEqual({
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'table',
							attrs: {
								isNumberColumnEnabled: false,
								layout: 'default',
								localId: TABLE_LOCAL_ID,
							},
							content: [
								{
									type: 'tableRow',
									content: [
										{
											type: nodeName,
											attrs: {
												colspan: 2,
											},
											content: [
												{
													type: 'paragraph',
													content: [
														{
															type: 'text',
															text: 'a1',
														},
													],
												},
											],
										},
									],
								},
								{
									type: 'tableRow',
									content: [
										{
											type: nodeName,
											attrs: {},
											content: [
												{
													type: 'paragraph',
													content: [
														{
															type: 'text',
															text: 'b1',
														},
													],
												},
											],
										},
										{
											type: nodeName,
											attrs: {},
											content: [
												{
													type: 'paragraph',
													content: [
														{
															type: 'text',
															text: 'b2',
														},
													],
												},
											],
										},
									],
								},
							],
						},
					],
				});
			});
			[[0], [200], [100, 200], [100, 0]].forEach((colwidth) => {
				describe(`when colwidth=${JSON.stringify(colwidth)}`, () => {
					it(`should preserve valid colwidth attributes as an array of widths`, () => {
						const { editorView } = editor(doc(table()(tr(schemaBuilder({ colwidth })(p('foo'))))));
						expect(toJSON(editorView.state.doc)).toEqual({
							version: 1,
							type: 'doc',
							content: [
								{
									type: 'table',
									attrs: {
										isNumberColumnEnabled: false,
										layout: 'default',
										localId: TABLE_LOCAL_ID,
									},
									content: [
										{
											type: 'tableRow',
											content: [
												{
													type: nodeName,
													attrs: {
														colwidth: colwidth.slice(0, 1),
													},
													content: [
														{
															type: 'paragraph',
															content: [
																{
																	type: 'text',
																	text: 'foo',
																},
															],
														},
													],
												},
											],
										},
									],
								},
							],
						});
					});
				});
			});
		});

		it('should encode text node without attrs', () => {
			const textNode = confluenceSchema.text('text');

			// ED-13997 there are text nodes without attrs in some prod issue
			// Emulating the case
			// @ts-ignore
			delete textNode.attrs;

			const expected = {
				type: 'text',
				text: 'text',
			};

			expect(transformer.encodeNode(textNode as PMNode)).toEqual(expected);
		});

		it('should encode hardBreak and remove redundant attrs', () => {
			const schema = AdfSchemaDefault.getSchemaBasedOnStage();
			const hardBreak = schema.nodes.hardBreak.createChecked();

			expect(transformer.encodeNode(hardBreak as PMNode).attrs).toBeUndefined();
		});

		describe('unsupported mark', () => {
			let markOverrideRuleFor: any;
			beforeEach(() => {
				markOverrideRuleFor = jest.spyOn(markOverride, 'markOverrideRuleFor');
			});

			afterEach(() => {
				markOverrideRuleFor.mockRestore();
			});

			it('should unwrap an unsupported mark with its originalValue', () => {
				const { editorView } = editor(
					doc(p(unsupportedMark({ originalValue: { type: 'em' } })('Unsupported Text'))),
				);

				const expected = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Unsupported Text',
									marks: [{ type: 'em' }],
								},
							],
						},
					],
				};

				expect(toJSON(editorView.state.doc)).toEqual(expected);
			});

			it('should drop unsupportedMark that has same type ' + 'as one of its siblings', () => {
				const { editorView } = editor(
					doc(
						p(
							textColor({ color: '#ff5630' })(
								unsupportedMark({
									originalValue: {
										type: 'textColor',
										attrs: {
											color: '#00b8d9',
										},
									},
								})('Some Text'),
							),
						),
					),
				);

				const expected = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Some Text',
									marks: [
										{
											type: 'textColor',
											attrs: {
												color: '#ff5630',
											},
										},
									],
								},
							],
						},
					],
				};
				expect(toJSON(editorView.state.doc)).toEqual(expected);
			});

			it(
				'should drop unsupportedMark that has same type as ' +
					'one of its siblings and has invalid attributes',
				() => {
					const { editorView } = editor(
						doc(
							p(
								textColor({ color: '#ff5630' })(
									unsupportedMark({
										originalValue: {
											type: 'textColor',
											attrs: {
												color: 'red',
												bgcolor: 'green',
											},
										},
									})('Some Text'),
								),
							),
						),
					);

					const expected = {
						version: 1,
						type: 'doc',
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Some Text',
										marks: [
											{
												type: 'textColor',
												attrs: {
													color: '#ff5630',
												},
											},
										],
									},
								],
							},
						],
					};
					expect(toJSON(editorView.state.doc)).toEqual(expected);
				},
			);

			it(
				'should drop unsupportedMark that has same type as ' +
					'one of its siblings and retain other marks that are valid',
				() => {
					const { editorView } = editor(
						doc(
							p(
								textColor({ color: '#ff5630' })(
									unsupportedMark({
										originalValue: {
											type: 'textColor',
											attrs: {
												color: 'red',
												bgcolor: 'green',
											},
										},
									})(em('Some Text')),
								),
							),
						),
					);

					const expected = {
						version: 1,
						type: 'doc',
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Some Text',
										marks: [
											{
												type: 'em',
											},
											{
												type: 'textColor',
												attrs: {
													color: '#ff5630',
												},
											},
										],
									},
								],
							},
						],
					};
					expect(toJSON(editorView.state.doc)).toEqual(expected);
				},
			);

			it(
				'should not drop unsupportedMark when its type is unique among siblings ' +
					'and should properly unwrap the value',
				() => {
					const { editorView } = editor(
						doc(
							p(
								unsupportedMark({
									originalValue: {
										type: 'textColor',
										attrs: {
											color: 'red',
											bgcolor: 'green',
										},
									},
								})('Some Text'),
							),
						),
					);

					const expected = {
						version: 1,
						type: 'doc',
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Some Text',
										marks: [
											{
												type: 'textColor',
												attrs: {
													color: 'red',
													bgcolor: 'green',
												},
											},
										],
									},
								],
							},
						],
					};
					expect(toJSON(editorView.state.doc)).toEqual(expected);
				},
			);

			it(
				'should drop unsupportedMark that has same type ' +
					'as one of its siblings and original value is allowed to be overriden',
				() => {
					markOverrideRuleFor.mockReturnValue({
						canOverrideUnsupportedMark: () => true,
					});
					const { editorView } = editor(
						doc(
							p(
								textColor({ color: '#ff5630' })(
									unsupportedMark({
										originalValue: {
											type: 'textColor',
											attrs: {
												color: '#00b8d9',
											},
										},
									})('Some Text'),
								),
							),
						),
					);

					const expected = {
						version: 1,
						type: 'doc',
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Some Text',
										marks: [
											{
												type: 'textColor',
												attrs: {
													color: '#ff5630',
												},
											},
										],
									},
								],
							},
						],
					};

					expect(toJSON(editorView.state.doc)).toEqual(expected);
					expect(markOverrideRuleFor).toHaveBeenCalledTimes(1);
				},
			);

			it(
				'should not drop unsupportedMark that has same type ' +
					'as one of its siblings and original value is not allowed to be overriden',
				() => {
					markOverrideRuleFor.mockReturnValue({
						canOverrideUnsupportedMark: () => false,
					});
					const { editorView } = editor(
						doc(
							p(
								textColor({ color: '#ff5630' })(
									unsupportedMark({
										originalValue: {
											type: 'textColor',
											attrs: {
												color: '#00b8d9',
											},
										},
									})('Some Text'),
								),
							),
						),
					);

					const expected = {
						version: 1,
						type: 'doc',
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Some Text',
										marks: [
											{
												type: 'textColor',
												attrs: {
													color: '#ff5630',
												},
											},
											{
												type: 'textColor',
												attrs: {
													color: '#00b8d9',
												},
											},
										],
									},
								],
							},
						],
					};

					expect(toJSON(editorView.state.doc)).toEqual(expected);
					expect(markOverrideRuleFor).toHaveBeenCalledTimes(1);
				},
			);

			it(
				'should not drop unsupportedMark that has different type ' +
					'as one of its siblings and original value is allowed to be overriden',
				() => {
					markOverrideRuleFor.mockReturnValue({
						canOverrideUnsupportedMark: () => true,
					});

					const adf: JSONDocNode = {
						version: 1,
						type: 'doc',
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Some Text',
										marks: [
											{ type: 'textColor', attrs: { color: '#6554c0' } },
											{
												type: 'unsupportedMark',
												attrs: {
													originalValue: {
														type: 'textColor',
														attrs: {
															color: '#6554c0',
															unknownAttribute: 'unknownValue',
														},
													},
												},
											},
											{
												type: 'unsupportedMark',
												attrs: {
													originalValue: {
														type: 'textColor1',
														attrs: {
															color: '#6554c0',
															unknownAttribute: 'unknownValue',
														},
													},
												},
											},
										],
									},
								],
							},
						],
					};

					const expected = {
						version: 1,
						type: 'doc',
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Some Text',
										marks: [
											{
												type: 'textColor',
												attrs: {
													color: '#6554c0',
												},
											},
											{
												type: 'textColor1',
												attrs: {
													color: '#6554c0',
													unknownAttribute: 'unknownValue',
												},
											},
										],
									},
								],
							},
						],
					};

					expect(toJSON(parseJSON(adf))).toEqual(expected);
					expect(markOverrideRuleFor).toHaveBeenCalledTimes(1);
				},
			);

			it(
				'should not drop unsupportedMark when its type is unique among siblings ' +
					'and should properly unwrap the value and allowed to be overriden',
				() => {
					markOverrideRuleFor.mockReturnValue({
						canOverrideUnsupportedMark: () => true,
					});
					const { editorView } = editor(
						doc(
							p(
								unsupportedMark({
									originalValue: {
										type: 'textColor',
										attrs: {
											color: 'red',
											bgcolor: 'green',
										},
									},
								})('Some Text'),
							),
						),
					);

					const expected = {
						version: 1,
						type: 'doc',
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Some Text',
										marks: [
											{
												type: 'textColor',
												attrs: {
													color: 'red',
													bgcolor: 'green',
												},
											},
										],
									},
								],
							},
						],
					};

					expect(toJSON(editorView.state.doc)).toEqual(expected);
					expect(markOverrideRuleFor).not.toHaveBeenCalled();
				},
			);
		});

		describe('unsupported Node Attribute', () => {
			it(`should unwrap an unsupported node attribute from unsupportedNodeAttribute mark
      along with no other marks and wrap inside node attributes`, () => {
				const { editorView } = editor(
					doc(
						p(
							unsupportedNodeAttribute({
								type: { nodeType: 'mention' },
								unsupported: { invalid: 'invalidValue' },
							})(
								mention({
									id: 'id-john',
									text: '@John Doe',
									accessLevel: '',
									userType: 'DEFAULT',
								})(),
							),
						),
					),
				);

				const expected = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'mention',
									attrs: {
										id: 'id-john',
										text: '@John Doe',
										accessLevel: '',
										userType: 'DEFAULT',
										invalid: 'invalidValue',
									},
								},
							],
						},
					],
				};

				expect(toJSON(editorView.state.doc)).toEqual(expected);
			});

			it(`should unwrap the unsupported node attributes from unsupportedNodeAttribute mark
      when there are more than one unsupported node attributes`, () => {
				const { editorView } = editor(
					doc(
						p(
							unsupportedNodeAttribute({
								type: { nodeType: 'mention' },
								unsupported: { invalid: 'invalidValue', accessLevel: 123 },
							})(
								mention({
									id: 'id-john',
									text: '@John Doe',
									accessLevel: '',
									userType: 'DEFAULT',
								})(),
							),
						),
					),
				);

				const expected = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'mention',
									attrs: {
										id: 'id-john',
										text: '@John Doe',
										accessLevel: 123,
										userType: 'DEFAULT',
										invalid: 'invalidValue',
									},
								},
							],
						},
					],
				};

				expect(toJSON(editorView.state.doc)).toEqual(expected);
			});

			it(`should unwrap an unsupported node attribute from unsupportedNodeAttribute mark
        along with other marks and wrap inside node attributes`, () => {
				const { editorView } = editor(
					doc(
						p(
							unsupportedMark({
								originalValue: {
									type: 'textColor',
									attrs: {
										color: 'red',
										bgcolor: 'green',
									},
								},
							})(
								unsupportedNodeAttribute({
									type: { nodeType: 'mention' },
									unsupported: { invalid: 'invalidValue' },
								})(
									mention({
										id: 'id-john',
										text: '@John Doe',
										accessLevel: '',
										userType: 'DEFAULT',
									})(),
								),
							),
						),
					),
				);

				const expected = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'mention',
									attrs: {
										id: 'id-john',
										text: '@John Doe',
										accessLevel: '',
										userType: 'DEFAULT',
										invalid: 'invalidValue',
									},
									marks: [
										{
											type: 'textColor',
											attrs: {
												color: 'red',
												bgcolor: 'green',
											},
										},
									],
								},
							],
						},
					],
				};

				expect(toJSON(editorView.state.doc)).toEqual(expected);
			});

			it(`should not unwrap a specific unsupported node attribute from unsupportedNodeAttribute mark
        when a valid attribute value is present in node`, () => {
				const { editorView } = editor(
					doc(
						p(
							unsupportedNodeAttribute({
								type: { nodeType: 'mention' },
								unsupported: { accessLevel: 'invalidValue' },
							})(
								mention({
									id: 'id-john',
									text: '@John Doe',
									accessLevel: 'newValue',
									userType: 'DEFAULT',
								})(),
							),
						),
					),
				);

				const expected = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'mention',
									attrs: {
										id: 'id-john',
										text: '@John Doe',
										accessLevel: 'newValue',
										userType: 'DEFAULT',
									},
								},
							],
						},
					],
				};

				expect(toJSON(editorView.state.doc)).toEqual(expected);
			});

			it(`should not unwrap the required node attribute value from unsupportedNodeAttribute mark
        when the required node attribute value is not same as default value`, () => {
				const { editorView } = editor(
					doc(
						unsupportedNodeAttribute({
							type: { nodeType: 'panel' },
							unsupported: { panelType: 'abc' },
						})(panelNote(p('hello from note panel'))),
					),
				);

				const expected = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'panel',
							attrs: {
								panelType: 'note',
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'hello from note panel',
										},
									],
								},
							],
						},
					],
				};

				expect(toJSON(editorView.state.doc)).toEqual(expected);
			});

			it(`should unwrap the required node attribute value from unsupportedNodeAttribute mark
        when the required node attribute value is same as default value`, () => {
				const { editorView } = editor(
					doc(
						unsupportedNodeAttribute({
							type: { nodeType: 'panel' },
							unsupported: { panelType: 'abc' },
						})(panel({ panelType: 'info' })(p('hello from info panel'))),
					),
				);

				const expected = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'panel',
							attrs: {
								panelType: 'abc',
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'hello from info panel',
										},
									],
								},
							],
						},
					],
				};

				expect(toJSON(editorView.state.doc)).toEqual(expected);
			});

			it(`should unwrap unsupported node attribute mark and should not restore the other attributes
        with default value`, () => {
				const { editorView } = editor(
					doc(
						p(
							unsupportedNodeAttribute({
								type: { nodeType: 'mention' },
								unsupported: { invalidAttr: 'invalidValue' },
							})(
								mention({
									id: 'id-john',
									text: '@John Doe',
									accessLevel: 'newValue',
								})(),
							),
						),
					),
				);

				const expected = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'mention',
									attrs: {
										id: 'id-john',
										text: '@John Doe',
										accessLevel: 'newValue',
										invalidAttr: 'invalidValue',
									},
								},
							],
						},
					],
				};

				expect(toJSON(editorView.state.doc)).toEqual(expected);
			});

			it(`should unwrap unsupported node attribute mark and should preserve the breakout
      mark for codeBlock`, () => {
				const entity: JSONDocNode = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'codeBlock',
							attrs: {
								language: 'javascript',
							},
							marks: [
								{
									type: 'breakout',
									attrs: {
										mode: 'wide',
										width: null,
									},
								},
								{
									type: 'unsupportedNodeAttribute',
									attrs: {
										type: { nodeType: 'codeBlock' },
										unsupported: {
											invalidAttr: 'invalidValue',
										},
									},
								},
							],
						},
					],
				};

				const expected = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'codeBlock',
							attrs: {
								language: 'javascript',
								invalidAttr: 'invalidValue',
							},
							marks: [
								{
									type: 'breakout',
									attrs: {
										mode: 'wide',
										width: null,
									},
								},
							],
						},
					],
				};

				let result = parseJSON(entity);
				expect(toJSON(result)).toEqual(expected);
			});

			it(`should unwrap unsupported node attribute mark and unsupported mark for codeBlock`, () => {
				const entity: JSONDocNode = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'codeBlock',
							attrs: {
								language: 'javascript',
							},
							marks: [
								{
									type: 'unsupportedMark',
									attrs: {
										originalValue: {
											type: 'breakoutInvalid',
											attrs: {
												mode: 'wide',
												width: null,
											},
										},
									},
								},
								{
									type: 'unsupportedNodeAttribute',
									attrs: {
										type: { nodeType: 'codeBlock' },
										unsupported: {
											invalidAttr: 'invalidValue',
										},
									},
								},
							],
						},
					],
				};

				const expected = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'codeBlock',
							attrs: {
								language: 'javascript',
								invalidAttr: 'invalidValue',
							},
							marks: [
								{
									type: 'breakoutInvalid',
									attrs: {
										mode: 'wide',
										width: null,
									},
								},
							],
						},
					],
				};

				let result = parseJSON(entity);
				expect(toJSON(result)).toEqual(expected);
			});

			it(`should not unwrap unsupported node attribute mark when nodeType in unsupportedNodeAttribute
       does not match the actual nodeType`, () => {
				const entity: JSONDocNode = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'codeBlock',
							attrs: {
								language: 'javascript',
							},
							marks: [
								{
									type: 'unsupportedMark',
									attrs: {
										originalValue: {
											type: 'breakoutInvalid',
											attrs: {
												mode: 'wide',
											},
										},
									},
								},
								{
									type: 'unsupportedNodeAttribute',
									attrs: {
										type: { nodeType: 'invalid' },
										unsupported: {
											invalidAttr: 'invalidValue',
										},
									},
								},
							],
						},
					],
				};

				const expected = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'codeBlock',
							attrs: {
								language: 'javascript',
							},
							marks: [
								{
									type: 'breakoutInvalid',
									attrs: {
										mode: 'wide',
									},
								},
							],
						},
					],
				};

				let result = parseJSON(entity);
				expect(toJSON(result)).toEqual(expected);
			});
		});

		describe('data consumer mark', () => {
			it("shouldn't drop data consumer mark with sources", () => {
				const { editorView } = editor(
					doc(
						dataConsumer({
							sources: ['someid', 'secondid'],
						})(
							extension({
								extensionKey: 'floof',
								extensionType: 'com.atlaskats.meow',
								layout: 'default',
							})(),
						),
					),
					{
						editorProps: {
							allowExtension: true,
						},
					},
				);

				const { marks } = toJSON(editorView.state.doc).content[0];

				expect(marks).toEqual([
					{
						type: 'dataConsumer',
						attrs: {
							sources: ['someid', 'secondid'],
						},
					},
				]);
			});

			it(`should drop an intermediary state of data consumer mark without sources`, () => {
				const { editorView } = editor(
					doc(
						dataConsumer({
							sources: [],
						})(
							extension({
								extensionKey: 'floof',
								extensionType: 'com.atlaskats.meow',
								layout: 'default',
							})(),
						),
					),
					{
						editorProps: {
							allowExtension: true,
						},
					},
				);

				const { marks } = toJSON(editorView.state.doc).content[0];

				expect(marks).toBeUndefined();
			});
		});

		describe('ProseMirror schema version', () => {
			it('should be able to encode a document with stage-0 features', () => {
				const stage0Schema = AdfSchemaDefault.getSchemaBasedOnStage('stage0');
				const pmDoc = doc(
					p(
						fragmentMark({
							localId: '6d9e04f9-7c77-4313-93a7-62c9612e94b1',
						})('lol'),
					),
				)(stage0Schema);
				const adf: JSONDocNode = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'lol',
									marks: [
										{
											type: 'fragment',
											attrs: {
												localId: '6d9e04f9-7c77-4313-93a7-62c9612e94b1',
											},
										},
									],
								},
							],
						},
					],
				};

				expect(toJSON(pmDoc)).toEqual(adf);
			});

			it('should be able to encode a document with final / default schema features', () => {
				const pmDoc = doc(p('lol'))(AdfSchemaDefault.defaultSchema);
				const adf: JSONDocNode = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'lol',
								},
							],
						},
					],
				};

				expect(toJSON(pmDoc)).toEqual(adf);
			});
		});
	});

	describe('parse', () => {
		it('should create standard prose mirror for empty content', () => {
			const adf: JSONDocNode = {
				version: 1,
				type: 'doc',
				content: [],
			};

			expect(parseJSON(adf)).toEqualDocument(doc(p()));
		});

		it('should create standard prose mirror for empty paragraph', () => {
			const adf: JSONDocNode = {
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [],
					},
				],
			};

			expect(parseJSON(adf)).toEqualDocument(doc(p()));
		});

		it('should convert ADF to PM representation', () => {
			const adf: JSONDocNode = {
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [
							{
								type: 'text',
								text: 'hello',
							},
						],
					},
				],
			};
			expect(parseJSON(adf)).toEqualDocument(doc(p('hello')));
		});

		describe('ProseMirror schema version', () => {
			let getSchemaBasedOnStageSpy: jest.SpyInstance;
			beforeEach(() => {
				getSchemaBasedOnStageSpy = jest.spyOn(AdfSchemaDefault, 'getSchemaBasedOnStage');
			});

			it('should use the stage-0 schema if passed', () => {
				const adf: JSONDocNode = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'lol',
									marks: [
										{
											type: 'fragment',
											attrs: {
												localId: '6d9e04f9-7c77-4313-93a7-62c9612e94b1',
											},
										},
									],
								},
							],
						},
					],
				};

				expect(transformer.parse(adf, SchemaStage.STAGE_0)).toEqualDocument(
					doc(p(fragmentMark({ localId: '6d9e04f9-7c77-4313-93a7-62c9612e94b1' })('lol'))),
				);
				expect(getSchemaBasedOnStageSpy).toBeCalledTimes(1);
				expect(getSchemaBasedOnStageSpy).toBeCalledWith('stage0');
			});

			it('should use the final / default schema if passed', () => {
				const adf: JSONDocNode = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'hello',
								},
							],
						},
					],
				};

				expect(transformer.parse(adf, SchemaStage.FINAL)).toEqualDocument(doc(p('hello')));
				expect(getSchemaBasedOnStageSpy).toBeCalledTimes(1);
				expect(getSchemaBasedOnStageSpy).toBeCalledWith('final');
			});

			it('should use the final / default schema when nothing is passed', () => {
				const adf: JSONDocNode = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'hello',
								},
							],
						},
					],
				};

				expect(transformer.parse(adf)).toEqualDocument(doc(p('hello')));
			});
		});
	});

	it('should throw an error if not ADF-like', () => {
		const badADF: any = {
			type: 'paragraph',
			content: [{ type: 'text', content: 'hello' }],
		};
		expect(() => parseJSON(badADF)).toThrowError('Expected content format to be ADF');
	});

	it('should throw an error if not a valid PM document', () => {
		const badADF: any = {
			type: 'doc',
			content: [{ type: 'fakeNode', content: 'hello' }],
		};
		expect(() => parseJSON(badADF)).toThrowError(/Invalid input for Fragment.fromJSON/);
	});
});
