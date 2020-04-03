import {
  bitbucketSchema,
  confluenceSchema,
  createJIRASchema,
} from '@atlaskit/adf-schema';
import {
  createEditorFactory,
  doc,
  // Node
  blockquote,
  ul,
  ol,
  li,
  code_block,
  emoji,
  expand,
  nestedExpand,
  br,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  mediaGroup,
  media,
  mention,
  panel,
  panelNote,
  p,
  hr,
  table,
  th,
  tr,
  td,
  // Marks
  code,
  em,
  a,
  strike,
  strong,
  subsup,
  textColor,
  underline,
} from '@atlaskit/editor-test-helpers';
import { ProviderFactory } from '@atlaskit/editor-common';
import { BitbucketTransformer } from '@atlaskit/editor-bitbucket-transformer';
import { ConfluenceTransformer } from '@atlaskit/editor-confluence-transformer';
import { JIRATransformer } from '@atlaskit/editor-jira-transformer';
import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
import { WikiMarkupTransformer } from '@atlaskit/editor-wikimarkup-transformer';
import { emoji as emojiData } from '@atlaskit/util-data-test';
import { Node as PMNode } from 'prosemirror-model';

import { JSONTransformer, JSONDocNode } from '../../index';

const transformer = new JSONTransformer();
const toJSON = (node: PMNode) => transformer.encode(node);
const parseJSON = (node: JSONDocNode) => transformer.parse(node);
const emojiProvider = emojiData.testData.getEmojiResourcePromise();

describe('JSONTransformer:', () => {
  const createEditor = createEditorFactory();

  beforeAll(() => {
    // @ts-ignore
    global['fetch'] = () => Promise.resolve();
  });

  describe('encode', () => {
    const editor = (doc: any) =>
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
      [[0], [200], [100, 200], [100, 0]].forEach(colwidth => {
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
