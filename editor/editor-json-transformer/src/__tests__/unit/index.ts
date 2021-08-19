import { Node as PMNode } from 'prosemirror-model';

import {
  bitbucketSchema,
  confluenceSchema,
  createJIRASchema,
  uuid,
} from '@atlaskit/adf-schema';
import { BitbucketTransformer } from '@atlaskit/editor-bitbucket-transformer';
import { ProviderFactory } from '@atlaskit/editor-common';
import { ConfluenceTransformer } from '@atlaskit/editor-confluence-transformer';
import { EditorProps } from '@atlaskit/editor-core';
import { JIRATransformer } from '@atlaskit/editor-jira-transformer';
import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  a,
  blockquote,
  br,
  code,
  code_block,
  dataConsumer,
  doc,
  DocBuilder,
  em,
  emoji,
  expand,
  extension,
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
import { WikiMarkupTransformer } from '@atlaskit/editor-wikimarkup-transformer';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';

import { JSONDocNode, JSONNode, JSONTransformer } from '../../index';
import * as markOverride from '../../markOverrideRules';
import { sanitizeNode } from '../../sanitize/sanitize-node';

jest.mock('../../sanitize/sanitize-node');

const transformer = new JSONTransformer();
const toJSON = (node: PMNode) => transformer.encode(node);
const parseJSON = (node: JSONDocNode) => transformer.parse(node);
const emojiProvider = getTestEmojiResource();
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

  describe('encode', () => {
    const editor = (
      doc: DocBuilder,
      options?: {
        editorProps: Partial<EditorProps>;
      },
    ) =>
      createEditor({
        doc,
        editorProps: {
          emojiProvider: new Promise(() => {}),
          mentionProvider: new Promise(() => {}),
          media: {},
          allowTextColor: true,
          allowPanel: true,
          allowRule: true,
          allowTables: true,
          allowExpand: true,
          ...(options?.editorProps || {}),
        },
        providerFactory: ProviderFactory.create({ emojiProvider }),
      });

    const standardEmptyAdf: JSONDocNode = {
      type: 'doc',
      version: 1,
      content: [],
    };

    it('should create a standard empty adf for empty Bitbucket', () => {
      const bitbucketTransformer = new BitbucketTransformer(bitbucketSchema);

      expect(toJSON(bitbucketTransformer.parse(''))).toEqual(standardEmptyAdf);
    });

    it('should create a standard empty adf for empty Confluence', () => {
      const confluenceTransformer = new ConfluenceTransformer(confluenceSchema);

      expect(toJSON(confluenceTransformer.parse('<p />'))).toEqual(
        standardEmptyAdf,
      );
    });

    it('should create a standard empty adf for empty JIRA', () => {
      const schema = createJIRASchema({
        allowBlockQuote: true,
        allowLists: true,
      });
      const jiraTransformer = new JIRATransformer(schema);

      expect(toJSON(jiraTransformer.parse(''))).toEqual(standardEmptyAdf);
    });

    it('should create a standard empty adf for empty Markdown', () => {
      const markdownTransformer = new MarkdownTransformer();

      expect(toJSON(markdownTransformer.parse(''))).toEqual(standardEmptyAdf);
    });

    it('should create a standard empty adf for empty WikiMarkup', () => {
      const wikiMarkupTransformer = new WikiMarkupTransformer();

      expect(toJSON(wikiMarkupTransformer.parse(''))).toEqual(standardEmptyAdf);
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
          p(
            strong('>'),
            ' Atlassian: ',
            br(),
            a({ href: 'https://atlassian.com' })('Atlassian'),
          ),
          p(
            em('hello'),
            underline('world'),
            code('!'),
            subsup({ type: 'sub' })('sub'),
            'plain text',
            strike('hey'),
            textColor({ color: 'red' })('Red :D'),
          ),
          ul(li(p('ichi')), li(p('ni')), li(p('san'))),
          ol(li(p('ek')), li(p('dui')), li(p('tin'))),
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
      const { editorView } = editor(
        doc(p(a({ href: 'https://atlassian.com' })('Atlassian'))),
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
              tr(
                schemaBuilder({ colspan: 1 })(p('b1')),
                schemaBuilder({ colspan: 1 })(p('b2')),
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
            const { editorView } = editor(
              doc(table()(tr(schemaBuilder({ colwidth })(p('foo'))))),
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
          doc(
            p(
              unsupportedMark({ originalValue: { type: 'em' } })(
                'Unsupported Text',
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
                  text: 'Unsupported Text',
                  marks: [{ type: 'em' }],
                },
              ],
            },
          ],
        };

        expect(toJSON(editorView.state.doc)).toEqual(expected);
      });

      it(
        'should drop unsupportedMark that has same type ' +
          'as one of its siblings',
        () => {
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
        },
      );

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
      it(`shouldn't drop data consumer mark with sources`, () => {
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
  });

  it('should throw an error if not ADF-like', () => {
    const badADF: any = {
      type: 'paragraph',
      content: [{ type: 'text', content: 'hello' }],
    };
    expect(() => parseJSON(badADF)).toThrowError(
      'Expected content format to be ADF',
    );
  });

  it('should throw an error if not a valid PM document', () => {
    const badADF: any = {
      type: 'doc',
      content: [{ type: 'fakeNode', content: 'hello' }],
    };
    expect(() => parseJSON(badADF)).toThrowError(
      /Invalid input for Fragment.fromJSON/,
    );
  });
});
