import nestedTableExtensionAdf from './__fixtures__/nested-table-extension-adf.json';
import nestedTableExtensionWithNoNestedContentAdf from './__fixtures__/nested-table-extension-with-no-nestedcontent-adf.json';
import nestedTableExtensionWithInvalidJsonAdf from './__fixtures__/nested-table-extension-with-invalid-json-adf.json';
import nestedTableInsideTableCellAdf from './__fixtures__/nested-table-inside-table-cell.json';
import nestedTableInsideTableHeaderAdf from './__fixtures__/nested-table-inside-table-header.json';

import {
	transformNestedTableNodeOutgoingDocument,
	transformNestedTablesIncomingDocument,
} from '../../../transforms';
import type { ADFEntity } from '@atlaskit/adf-utils/types';

describe('Nested table transformations', () => {
	describe('transform incoming document', () => {
		it('should transform nested table extension to nested table', () => {
			const result = transformNestedTablesIncomingDocument(nestedTableExtensionAdf);

			expect(result.isTransformed).toBe(true);
			expect(result.transformedAdf).toMatchInlineSnapshot(`
			{
			  "content": [
			    {
			      "content": [
			        {
			          "content": [
			            {
			              "content": [
			                {
			                  "content": [
			                    {
			                      "content": [
			                        {
			                          "text": "Header 1",
			                          "type": "text",
			                        },
			                      ],
			                      "type": "tableHeader",
			                    },
			                    {
			                      "content": [
			                        {
			                          "text": "Header 2",
			                          "type": "text",
			                        },
			                      ],
			                      "type": "tableHeader",
			                    },
			                  ],
			                  "type": "tableRow",
			                },
			                {
			                  "content": [
			                    {
			                      "content": [
			                        {
			                          "text": "Cell 1",
			                          "type": "text",
			                        },
			                      ],
			                      "type": "tableCell",
			                    },
			                    {
			                      "content": [
			                        {
			                          "text": "Cell 2",
			                          "type": "text",
			                        },
			                      ],
			                      "type": "tableCell",
			                    },
			                  ],
			                  "type": "tableRow",
			                },
			              ],
			              "type": "table",
			            },
			          ],
			          "type": "tableRow",
			        },
			      ],
			      "type": "table",
			    },
			  ],
			  "type": "doc",
			  "version": 1,
			}
		`);
		});

		it('should clear the node if nested table extension is missing nestedContent', () => {
			const result = transformNestedTablesIncomingDocument(
				nestedTableExtensionWithNoNestedContentAdf,
			);

			expect(result.isTransformed).toBe(true);
			expect(result.transformedAdf).toMatchInlineSnapshot(`
			{
			  "content": [
			    {
			      "content": [
			        {
			          "content": [],
			          "type": "tableRow",
			        },
			      ],
			      "type": "table",
			    },
			  ],
			  "type": "doc",
			  "version": 1,
			}
		`);
		});

		it('should throw an error if nested table extension nestedContent is not valid JSON', () => {
			expect(() => {
				transformNestedTablesIncomingDocument(nestedTableExtensionWithInvalidJsonAdf);
			}).toThrow('Failed to parse nested table content');
		});
	});

	describe('transform outgoing document', () => {
		it('should transform a nested table inside a table cell', () => {
			const transformedAdf = transformNestedTableNodeOutgoingDocument(
				nestedTableInsideTableCellAdf,
			);
			expect(transformedAdf).toMatchInlineSnapshot(`
			{
			  "attrs": {},
			  "content": [
			    {
			      "attrs": {
			        "extensionKey": "nested-table",
			        "extensionType": "com.atlassian.nesting",
			        "parameters": {
			          "macroParams": {
			            "nestedContent": {
			              "value": "{"type":"table","attrs":{"isNumberColumnEnabled":false,"layout":"default","localId":"58243e71-9906-4f0b-8a27-84973f7203f0","width":164},"content":[{"type":"tableRow","content":[{"type":"tableHeader","attrs":{},"content":[{"type":"paragraph","content":[{"type":"text","text":"a","marks":[{"type":"Nested table header content"}]}]}]}]},{"type":"tableRow","content":[{"type":"tableCell","attrs":{},"content":[{"type":"paragraph","content":[{"type":"text","text":"Nested table content"}]}]}]}]}",
			            },
			          },
			        },
			      },
			      "type": "extension",
			    },
			  ],
			  "type": "tableCell",
			}
		`);
		});

		it('should transform a nested table inside a table header', () => {
			const transformedAdf = transformNestedTableNodeOutgoingDocument(
				nestedTableInsideTableHeaderAdf,
			);
			expect(transformedAdf).toMatchInlineSnapshot(`
			{
			  "attrs": {},
			  "content": [
			    {
			      "attrs": {
			        "extensionKey": "nested-table",
			        "extensionType": "com.atlassian.nesting",
			        "parameters": {
			          "macroParams": {
			            "nestedContent": {
			              "value": "{"type":"table","attrs":{"isNumberColumnEnabled":false,"layout":"default","localId":"58243e71-9906-4f0b-8a27-84973f7203f0","width":164},"content":[{"type":"tableRow","content":[{"type":"tableHeader","attrs":{},"content":[{"type":"paragraph","content":[{"type":"text","text":"a","marks":[{"type":"Nested table header content"}]}]}]}]},{"type":"tableRow","content":[{"type":"tableCell","attrs":{},"content":[{"type":"paragraph","content":[{"type":"text","text":"Nested table content"}]}]}]}]}",
			            },
			          },
			        },
			      },
			      "type": "extension",
			    },
			  ],
			  "type": "tableHeader",
			}
		`);
		});

		it('should throw an error if nested table has invalid content', () => {
			expect(() => {
				const erroneousAdf: ADFEntity = {
					type: 'tableCell',
					attrs: {},
					content: [
						{
							type: 'table',
							attrs: {
								isNumberColumnEnabled: false,
								layout: 'default',
								localId: '58243e71-9906-4f0b-8a27-84973f7203f0',
								width: 164,
							},
							content: [
								{
									type: 'tableRow',
									content: [
										{
											type: 'tableCell',
											attrs: {
												// eslint-disable-next-line
												invalidAttr: BigInt(1),
											},
											content: [
												{
													type: 'paragraph',
													content: [
														{
															type: 'text',
															text: 'Nested table content',
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
				};

				transformNestedTableNodeOutgoingDocument(erroneousAdf);
			}).toThrow('Failed to encode nested table node');
		});
	});
});
