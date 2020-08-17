import { name } from '../../../version.json';

import {
  doc,
  p,
  hr,
  date,
  text,
  li,
  mention,
  code_block,
  decisionList,
  decisionItem,
  hardBreak,
  mediaSingle,
  media,
} from '@atlaskit/editor-test-helpers/schema-builder';

import schema from '@atlaskit/editor-test-helpers/schema';
import {
  isNodeEmpty,
  isEmptyParagraph,
  isEmptyDocument,
  processRawValue,
  hasVisibleContent,
} from '../../../utils/document';

describe(name, () => {
  describe('Utils -> Document', () => {
    describe('isEmptyParagraph', () => {
      it('should return true if paragraph is empty', () => {
        expect(isEmptyParagraph(p('')(schema))).toBe(true);
      });

      it('should return false if paragraph is not empty', () => {
        expect(isEmptyParagraph(p('some text')(schema))).toBe(false);
      });
    });

    describe('isNodeEmpty', () => {
      it('should return true if node is empty', () => {
        expect(isNodeEmpty(p('')(schema))).toBe(true);
      });

      it('should return true if the only child of a node is an empty paragraph', () => {
        expect(isNodeEmpty(doc(p(''))(schema))).toBe(true);
      });

      it('should return true if node only contains empty block nodes', () => {
        expect(isNodeEmpty(doc(p(''), p(''), p(''))(schema))).toBe(true);
      });

      it('should return false if the only child of a node is not an empty paragraph', () => {
        expect(isNodeEmpty(doc(p('some text'))(schema))).toBe(false);
      });

      it('should return false if node contains non-empty block nodes', () => {
        expect(isNodeEmpty(doc(p(''), p('some text'), p(''))(schema))).toBe(
          false,
        );
      });
    });

    describe('hasVisibleContent', () => {
      const nodesWithVisibleContent = [
        p('', hardBreak(), date({ timestamp: Date.now() })),
        p(mention({ id: '123' })()),
        date({ timestamp: Date.now() }),
        mention({ id: '123' })(),
        mediaSingle({ layout: 'center' })(
          media({ id: 'id', type: 'file', collection: 'collection' })(),
        ),
      ];
      const nodesWithoutVisibleContent = [
        p(''),
        li(p('')),
        p('', hardBreak()),
        p(' ', hardBreak(), ' '),
        hardBreak(),
      ];

      nodesWithVisibleContent.forEach(nodeBuilder => {
        const node = nodeBuilder(schema);
        it(`should return true for none empty node: ${JSON.stringify(
          node.toJSON(),
        )}`, () => {
          expect(hasVisibleContent(node)).toBe(true);
        });
      });

      nodesWithoutVisibleContent.forEach(nodeBuilder => {
        const node = nodeBuilder(schema);
        it(`should return false for empty node: ${JSON.stringify(
          node.toJSON(),
        )}`, () => {
          expect(hasVisibleContent(node)).toBe(false);
        });
      });
    });

    describe('isEmptyDocument', () => {
      it('should return true if node looks like an empty document', () => {
        const node = doc(p(''))(schema);
        expect(isEmptyDocument(node)).toBe(true);
      });

      it('should return false if node has text content', () => {
        const node = doc(p('hello world'))(schema);
        expect(isEmptyDocument(node)).toBe(false);
      });

      it('should return false if node has multiple empty children', () => {
        const node = doc(p(''), p(''))(schema);
        expect(isEmptyDocument(node)).toBe(false);
      });

      it('should return false if node has block content', () => {
        const node = doc(decisionList({})(decisionItem({})()))(schema);
        expect(isEmptyDocument(node)).toBe(false);
      });

      it('should return false if node has hr', () => {
        expect(isEmptyDocument(doc(p(), hr())(schema))).toBe(false);
      });
    });
  });

  describe('processRawValue', () => {
    const successCases = [
      { name: 'doc', node: doc(p('some new content'))(schema) as any },
      { name: 'text', node: text('text', schema) as any },
      {
        name: 'block',
        node: code_block({ language: 'javascript' })('content')(schema) as any,
      },
      {
        name: 'inline',
        node: mention({ id: 'id', text: '@mention' })()(schema) as any,
      },
    ];

    successCases.forEach(({ name, node }) => {
      it(`Case: ${name} – should accept JSON version of a prosemirror node`, () => {
        const result = processRawValue(schema, node.toJSON());
        expect(result).toEqualDocument(node);
      });

      it(`Case: ${name} – should accept stringified JSON version of a prosemirror node`, () => {
        const result = processRawValue(schema, JSON.stringify(node.toJSON()));
        expect(result).toEqualDocument(node);
      });
    });

    describe('failure cases', () => {
      // Silence console.error
      // eslint-disable-next-line no-console
      const oldConsole = console.error;
      // eslint-disable-next-line no-console
      console.error = jest.fn();
      afterAll(() => {
        // eslint-disable-next-line no-console
        console.error = oldConsole;
      });

      it('should return undefined if value is empty', () => {
        expect(processRawValue(schema, '')).toBeUndefined();
      });

      it('should return undefined if value is not a valid json', () => {
        expect(processRawValue(schema, '{ broken }')).toBeUndefined();
      });

      it('should return undefined if value is an array', () => {
        expect(processRawValue(schema, [1, 2, 3, 4])).toBeUndefined();
      });

      it('should return undefined if json represents not valid PM Node', () => {
        expect(
          processRawValue(schema, {
            type: 'blockqoute',
            content: [{ type: 'text', text: 'text' }],
          }),
        ).toBeUndefined();
      });
    });

    describe('Unsupported', () => {
      it('should wrap unsupported block nodes and preserve contents', () => {
        const unsupportedBlockWithContents = {
          type: 'x',
          text: 'hello',
          attrs: { id: '4' },
          content: [
            {
              type: 'text',
              text: 'task',
              marks: [{ type: 'strong' }],
            },
          ],
        };

        const result = processRawValue(schema, {
          type: 'doc',
          content: [unsupportedBlockWithContents],
        });

        expect(result).toBeDefined();
        expect(result!.toJSON()).toEqual({
          type: 'doc',
          content: [
            {
              type: 'unsupportedBlock',
              attrs: {
                originalValue: unsupportedBlockWithContents,
              },
            },
          ],
        });
      });

      it('should wrap unsupported inline nodes and preserve contents', () => {
        const unsupportedInlineWithContents: any = {
          type: 'x',
          attrs: { id: '4', text: '@hey' },
        };
        const result = processRawValue(schema, {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'hello' },
                unsupportedInlineWithContents,
              ],
            },
          ],
        });

        expect(result).toBeDefined();
        expect(result!.toJSON()).toEqual({
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'hello' },
                {
                  type: 'unsupportedInline',
                  attrs: { originalValue: unsupportedInlineWithContents },
                },
              ],
            },
          ],
        });
      });

      it('should wrap unsupported mark for inline node', () => {
        const unsupportedMark = {
          type: 'dasdsad',
        };
        const expected = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Hello',
                  marks: [
                    {
                      type: 'unsupportedMark',
                      attrs: {
                        originalValue: unsupportedMark,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        const result = processRawValue(schema, {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Hello',
                  marks: [unsupportedMark],
                },
              ],
            },
          ],
        });

        expect(result).toBeDefined();

        expect(result!.toJSON()).toEqual(expected);
      });

      it('should wrap unsupported mark for inline node where no marks specified in spec', () => {
        const unsupportedMark = {
          type: 'dasdsad',
        };
        const expected = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'placeholder',
                  attrs: {
                    text: 'text',
                  },
                  marks: [
                    {
                      type: 'unsupportedMark',
                      attrs: {
                        originalValue: unsupportedMark,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        const result = processRawValue(schema, {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'placeholder',
                  attrs: {
                    text: 'text',
                  },
                  marks: [unsupportedMark],
                },
              ],
            },
          ],
        });

        expect(result).toBeDefined();

        expect(result!.toJSON()).toEqual(expected);
      });

      it('should wrap a known mark not supported by the node', () => {
        const unsupportedMark = {
          type: 'textColor',
          attrs: {
            color: '#6554c0',
          },
        };
        const expected = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'placeholder',
                  attrs: {
                    text: 'text',
                  },
                  marks: [
                    {
                      type: 'unsupportedMark',
                      attrs: {
                        originalValue: unsupportedMark,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        const result = processRawValue(schema, {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'placeholder',
                  attrs: {
                    text: 'text',
                  },
                  marks: [unsupportedMark],
                },
              ],
            },
          ],
        });

        expect(result).toBeDefined();

        expect(result!.toJSON()).toEqual(expected);
      });

      it('should wrap the node with an invalid mark and property as unsupported', () => {
        const result = processRawValue(schema, {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'panel',
              attrs: {
                panelType: 'success',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Hello',
                    },
                  ],
                },
              ],
              marks: [
                {
                  type: 'unknown',
                },
              ],
              unknownProp: true,
            },
          ],
        });
        const expected = {
          type: 'doc',
          content: [
            {
              type: 'unsupportedBlock',
              attrs: {
                originalValue: {
                  type: 'panel',
                  attrs: { panelType: 'success' },
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Hello' }],
                    },
                  ],
                  marks: [{ type: 'unknown' }],
                  unknownProp: true,
                },
              },
            },
          ],
        };
        expect(result).toBeDefined();
        expect(result!.toJSON()).toEqual(expected);
      });

      it('should drop a mark which is invalid for node and not wrapped as unsupported ', () => {
        const entity = {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: '. What are yours?',
                  marks: [
                    {
                      type: 'indentation',
                    },
                  ],
                },
              ],
            },
          ],
        };

        const result = processRawValue(schema, entity);
        const expected = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: '. What are yours?',
                },
              ],
            },
          ],
        };
        expect(result).toBeDefined();
        expect(result!.toJSON()).toEqual(expected);
      });

      it(
        'should invoke error callback with  erorr code as "REDUNDANT_ATTRIBUTES" ' +
          ' when we apply attribute to a mark which does not support any attributes' +
          'and the node has multiple specs with multiple marks',
        () => {
          const strongMarkWithAttribute = {
            type: 'strong',
            attrs: {
              bgStrong: 'red',
            },
          };
          const strikeMarkWithAttribute = {
            type: 'strike',
            attrs: {
              bg: 'red',
            },
          };
          const entity = {
            version: 1,
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Hello',
                    marks: [strongMarkWithAttribute, strikeMarkWithAttribute],
                  },
                ],
              },
            ],
          };

          const result = processRawValue(schema, entity);

          const expected = {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Hello',
                    marks: [
                      {
                        attrs: {
                          originalValue: {
                            attrs: {
                              bgStrong: 'red',
                            },
                            type: 'strong',
                          },
                        },
                        type: 'unsupportedMark',
                      },
                      {
                        attrs: {
                          originalValue: {
                            attrs: {
                              bg: 'red',
                            },
                            type: 'strike',
                          },
                        },
                        type: 'unsupportedMark',
                      },
                    ],
                  },
                ],
              },
            ],
          };

          expect(result).toBeDefined();
          expect(result!.toJSON()).toEqual(expected);
        },
      );
    });
  });
});
