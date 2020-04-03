import { TextSerializer } from '../../../index';
import { defaultSchema as schema } from '@atlaskit/adf-schema';

const serializer = TextSerializer.fromSchema(schema);

const render = (doc: any) => {
  const docFromSchema = schema.nodeFromJSON(doc);
  return serializer.serializeFragment(docFromSchema.content);
};

describe('Renderer - TextSerializer', () => {
  it('should render hardBreak as a new line', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'foo' },
            { type: 'hardBreak' },
            { type: 'text', text: 'bar' },
          ],
        },
      ],
    };

    expect(render(doc)).toEqual('foo\nbar');
  });

  it('should render multiple hardBreaks as one line', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'foo' },
            { type: 'hardBreak' },
            { type: 'hardBreak' },
            { type: 'hardBreak' },
            { type: 'text', text: 'bar' },
          ],
        },
      ],
    };

    expect(render(doc)).toEqual('foo\nbar');
  });

  it('should render unicode emoji', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: '🦄' },
            { type: 'text', text: 'is a unicorn' },
          ],
        },
      ],
    };

    expect(render(doc)).toEqual('🦄is a unicorn');
  });

  it('should render colon key for emoticon emoji', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'My favourite emoji are' },
            {
              type: 'emoji',
              attrs: {
                shortName: ':grin:',
                id: '1f601',
                text: '😁',
              },
            },
            {
              type: 'emoji',
              attrs: {
                shortName: ':evilburns:',
                id: 'atlassian-evilburns',
                text: ':evilburns:',
              },
            },
          ],
        },
      ],
    };

    expect(render(doc)).toEqual('My favourite emoji are😁:evilburns:');
  });

  it('should render mention user with at-symbol', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'mention',
              attrs: {
                id: '1',
                accessLevel: 'CONTAINER',
                text: '@user',
              },
            },
            { type: 'text', text: ' is awesome' },
          ],
        },
      ],
    };

    expect(render(doc)).toEqual('@user is awesome');
  });

  it('should render mention null-text attr with at-symbol-unknown', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'mention',
              attrs: {
                id: '1',
                accessLevel: 'CONTAINER',
              },
            },
            { type: 'text', text: ' is awesome' },
          ],
        },
      ],
    };

    expect(render(doc)).toEqual('@unknown is awesome');
  });

  it('should render mention with id-attr all or here with at-symbol here or all', () => {
    const mentiondoc = (id: string, text?: string) => {
      return {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'mention',
                attrs: {
                  id: id,
                  accessLevel: 'CONTAINER',
                  text: text,
                },
              },
              { type: 'text', text: ' is awesome' },
            ],
          },
        ],
      };
    };
    expect(render(mentiondoc('here', '@abcd'))).toEqual('@here is awesome');
    expect(render(mentiondoc('all', '@abcd'))).toEqual('@all is awesome');
    expect(render(mentiondoc('all-here-id', '@abcd'))).toEqual(
      '@abcd is awesome',
    );
    expect(render(mentiondoc('all-here-id', undefined))).toEqual(
      '@unknown is awesome',
    );
  });

  it('should render media items prefixed with attachment unicode emoji', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'mediaGroup',
          content: [
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: 'id',
                collection: 'collection',
              },
            },
          ],
        },
      ],
    };

    expect(render(doc).indexOf('📎 ')).toEqual(0);
  });

  it('should render media items as NUMBER files (one file)', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'mediaGroup',
          content: [
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: 'id',
                collection: 'collection',
              },
            },
          ],
        },
      ],
    };

    expect(render(doc)).toContain('1 File');
  });

  it('should render media items as NUMBER files (multiple files)', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'mediaGroup',
          content: [
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: 'id1',
                collection: 'collection',
              },
            },
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: 'id2',
                collection: 'collection',
              },
            },
          ],
        },
      ],
    };

    expect(render(doc)).toContain('2 Files');
  });

  it('should render media items as NUMBER files + ignore media card links', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'mediaGroup',
          content: [
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: 'id1',
                collection: 'collection',
              },
            },
            {
              type: 'media',
              attrs: {
                type: 'link',
                id: 'id1',
                collection: 'collection',
              },
            },
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: 'id2',
                collection: 'collection',
              },
            },
          ],
        },
      ],
    };

    expect(render(doc)).toContain('2 Files');
  });

  it('should render URL if it is the same as text', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'https://www.atlassian.com',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'https://www.atlassian.com',
                  },
                },
              ],
            },
            {
              type: 'text',
              text: ' is for TEAM',
            },
          ],
        },
      ],
    };

    expect(render(doc)).toEqual('https://www.atlassian.com is for TEAM');
  });

  it('should render text if URL is different from text', () => {
    const doc = {
      type: 'doc',
      version: 1,
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
                    href: 'https://www.atlassian.com',
                  },
                },
              ],
            },
            {
              type: 'text',
              text: ' is for TEAM',
            },
          ],
        },
      ],
    };

    expect(render(doc)).toEqual('Atlassian is for TEAM');
  });

  it('should render blockquote text prefixed with "> "', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'some quote' }],
            },
          ],
        },
      ],
    };

    expect(render(doc)).toEqual('> some quote');
  });

  it('should render codeBlock contents as a simple text', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'codeBlock',
          content: [
            {
              type: 'text',
              text: 'foo',
            },
            {
              type: 'text',
              text: 'bar',
            },
          ],
        },
      ],
    };

    expect(render(doc)).toEqual('foobar');
  });

  it('should divide block elements with a new line', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'foo' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'bar' }],
        },
      ],
    };

    expect(render(doc)).toEqual('foo\nbar');
  });

  it('should ignore card links', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'foo' }],
        },
        {
          type: 'mediaGroup',
          content: [
            {
              type: 'media',
              attrs: {
                type: 'link',
                id: '1',
                collection: '2',
              },
            },
          ],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'bar' }],
        },
      ],
    };

    expect(render(doc)).toEqual('foo\nbar');
  });

  it('should render bullet lists', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'a' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'b' }],
                },
              ],
            },
          ],
        },
      ],
    };

    expect(render(doc)).toEqual('* a\n* b');
  });

  it('should render ordered lists', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '1' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '2' }],
                },
              ],
            },
          ],
        },
      ],
    };

    expect(render(doc)).toEqual('1. 1\n2. 2');
  });

  [1, 2, 3, 4, 5, 6].forEach(level => {
    it(`should render heading level ${level}`, () => {
      const doc = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'heading',
            attrs: { level },
            content: [{ type: 'text', text: 'heading' }],
          },
        ],
      };

      expect(render(doc)).toEqual('heading');
    });
  });

  it('should ignore horizontal lines', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'foo' }],
        },
        {
          type: 'rule',
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'bar' }],
        },
      ],
    };

    expect(render(doc)).toEqual('foo\nbar');
  });

  it('should render panels', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'panel',
          attrs: {
            panelType: 'info',
          },
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'information' }],
            },
          ],
        },
      ],
    };

    expect(render(doc)).toEqual('information');
  });

  it('should render content in the table', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableHeader',
                  attrs: {
                    colspan: 2,
                    colwidth: [233, 100],
                  },
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'header',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  attrs: {
                    background: '#DEEBFF',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'header',
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
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    background: null,
                  },
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'cell',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'cell',
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

    expect(render(doc)).toEqual('|header|header|\n|cell|cell|');
  });

  it('should ignore empty paragraphs', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'foo' }],
        },
        {
          type: 'paragraph',
          content: [],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'bar' }],
        },
      ],
    };

    expect(render(doc)).toEqual('foo\nbar');
  });

  it('should render unsupported node with the node type', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'bodiedExtension',
        },
      ],
    };

    expect(render(doc)).toEqual('[bodiedExtension]');
  });

  it('should add a space between mention and text', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'mention',
              attrs: {
                id: '1',
                accessLevel: 'CONTAINER',
                text: '@this',
              },
            },
            {
              type: 'text',
              text: 'is Sparta',
            },
          ],
        },
      ],
    };

    expect(render(doc)).toEqual('@this is Sparta');
  });

  it('should not add a space between text nodes', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This',
            },
            {
              type: 'text',
              text: 'is Sparta',
            },
          ],
        },
      ],
    };

    expect(render(doc)).toEqual('Thisis Sparta');
  });

  it('should render task', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'taskList',
          attrs: {
            localId: 'empty-list-should-not-render',
          },
          content: [
            {
              type: 'taskItem',
              attrs: {
                localId: 'task-1',
                state: 'TODO',
              },
              content: [
                {
                  type: 'text',
                  text: 'Could you please do this ',
                },
                {
                  type: 'mention',
                  attrs: {
                    id: '0',
                    text: '@Carolyn',
                    accessLevel: 'CONTAINER',
                  },
                },
                {
                  type: 'text',
                  text: ' ',
                },
                {
                  type: 'emoji',
                  attrs: {
                    shortName: ':wink:',
                    id: '1f609',
                    text: '😉',
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    expect(render(doc)).toEqual('[] Could you please do this @Carolyn 😉');
  });

  it('should render decision', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'decisionList',
          attrs: {
            localId: '',
          },
          content: [
            {
              type: 'decisionItem',
              attrs: {
                localId: '',
                state: 'DECIDED',
              },
              content: [
                {
                  type: 'text',
                  text: 'This is a decision ',
                },
              ],
            },
          ],
        },
      ],
    };

    expect(render(doc)).toEqual('<> This is a decision');
  });
});
