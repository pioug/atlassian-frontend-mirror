import scrubAdf from '../../../scrub/scrub-adf';

describe('scrubAdf', () => {
  it('should replace text in nodes with dummy text of the same length', () => {
    const adf = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Boooo',
            },
          ],
        },
      ],
    };

    const scrubbedAdf = scrubAdf(adf);

    expect(scrubbedAdf).toEqual({
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Lorem',
            },
          ],
        },
      ],
    });
  });

  it('should replace link marks in nodes', () => {
    const adf = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'atlassian',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'https://www.atlassian.com',
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const scrubbedAdf = scrubAdf(adf);

    expect(scrubbedAdf).toEqual({
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'loremipsu',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href:
                      'https://hello.atlassian.net/wiki/spaces/ET/pages/968692273?3975379868',
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it('should replace href values with provided value replacer', () => {
    const adf = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'atlassian',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'https://www.atlassian.com',
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const href = jest.fn(() => 'https://lorem.ipsum');

    const scrubbedAdf = scrubAdf(adf, {
      valueReplacements: {
        href,
      },
    });

    expect(href).toHaveBeenCalledTimes(1);
    expect(href).toHaveBeenCalledWith('https://www.atlassian.com');

    expect(scrubbedAdf).toEqual({
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'loremipsu',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'https://lorem.ipsum',
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it('should replace attributes values in nodes with dummy values of the same length', () => {
    const adf = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'status',
              attrs: {
                text: 'DONE',
                localId: 'e6764f45-4d69-49f8-9e0a-3a83fb9c0db7',
              },
            },
          ],
        },
      ],
    };

    const scrubbedAdf = scrubAdf(adf);

    expect(scrubbedAdf).toEqual({
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'status',
              attrs: {
                text: 'LORE',
                localId: 'l7435o18-2r43-91e0-7m3i-1p02su3m9do0',
              },
            },
          ],
        },
      ],
    });
  });

  it('should replace unknown attributes values in nodes with dummy values of the same length', () => {
    const adf = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'unknown',
          content: [
            {
              type: 'unknown',
              attrs: {
                text: 'some text',
                unknownAttr: 'some value',
              },
            },
          ],
        },
      ],
    };

    const scrubbedAdf = scrubAdf(adf);

    expect(scrubbedAdf).toEqual({
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'unknown',
          content: [
            {
              type: 'unknown',
              attrs: {
                text: 'lore mips',
                unknownAttr: 'lore mipsu',
              },
            },
          ],
        },
      ],
    });
  });

  it('should replace array attributes', () => {
    const adf = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'status',
              attrs: ['abcd', 123, { attr: 'abc' }],
            },
          ],
        },
      ],
    };

    const scrubbedAdf = scrubAdf(adf);

    expect(scrubbedAdf).toEqual({
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'status',
              attrs: ['lore', 274, { attr: 'lor' }],
            },
          ],
        },
      ],
    });
  });

  it('should throw an error if attributes are not supported', () => {
    const adf = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'status',
              attrs: function () {},
            },
          ],
        },
      ],
    };

    expect(() => {
      scrubAdf(adf);
    }).toThrowError(/scrubAttrs: encountered unsupported attributes type/);
  });

  it('should replace nested attributes values in nodes with dummy values of the same length', () => {
    const adf = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'extension',
          attrs: {
            parameters: {
              extensionId: 'e6764f45-4d69-49f8-9e0a-3a83fb9c0db7',
              localId: '0',
              text: 'Extension',
              macroMetadata: {
                macroId: {
                  value: 1598252695991,
                },
                schemaVersion: {
                  value: '2',
                },
              },
            },
          },
        },
      ],
    };

    const scrubbedAdf = scrubAdf(adf);

    expect(scrubbedAdf).toEqual({
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'extension',
          attrs: {
            parameters: {
              extensionId: 'l7435o18-2r43-91e0-7m3i-1p02su3m9do0',
              localId: '2',
              text: 'Loremipsu',
              macroMetadata: {
                macroId: {
                  value: 2743591802743,
                },
                schemaVersion: {
                  value: '2',
                },
              },
            },
          },
        },
      ],
    });
  });

  it('should replace emoji nodes by default', () => {
    const adf = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'emoji',
          attrs: {
            shortName: ':rocket:',
            id: '1f680',
            text: '🚀',
          },
        },
      ],
    };

    const scrubbedAdf = scrubAdf(adf);

    expect(scrubbedAdf).toEqual({
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'emoji',
          attrs: {
            id: 'atlassian-blue_star',
            text: ':blue_star:',
            shortName: ':blue_star:',
          },
        },
      ],
    });
  });

  it('should replace mention nodes by default', () => {
    const adf = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'mention',
          attrs: {
            id: 0,
            text: '@Carolyn',
            accessLevel: 'CONTAINER',
          },
        },
      ],
    };

    const scrubbedAdf = scrubAdf(adf);

    expect(scrubbedAdf).toEqual({
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'mention',
          attrs: {
            id: 'error:NotFound',
            text: '@Nemo',
            accessLevel: 'CONTAINER',
          },
        },
      ],
    });
  });

  it('should replace date nodes by default', () => {
    const adf = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'date',
          attrs: {
            timestamp: new Date().getTime(),
          },
        },
      ],
    };

    const scrubbedAdf = scrubAdf(adf);

    expect(scrubbedAdf).toEqual({
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'date',
          attrs: {
            timestamp: new Date('2020-01-01').getTime(),
          },
        },
      ],
    });
  });

  it('should use provided replacement for emoji', () => {
    const input = {
      type: 'emoji',
      attrs: {
        shortName: ':rocket:',
        id: '1f680',
        text: '🚀',
      },
    };

    const output = {
      type: 'emoji',
      attrs: {
        shortName: ':slight_smile:',
        id: '1f642',
        text: '🙂',
      },
    };

    const adf = {
      version: 1,
      type: 'doc',
      content: [input],
    };

    const emoji = jest.fn(() => output);

    const scrubbedAdf = scrubAdf(adf, { nodeReplacements: { emoji } });
    expect(emoji).toHaveBeenCalledTimes(1);

    expect(scrubbedAdf).toEqual({
      version: 1,
      type: 'doc',
      content: [output],
    });
  });

  it('should not replace any attributes from the bypass list', () => {
    const adf = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'status',
              attrs: {
                color: 'green',
                style: 'bold',
              },
            },
          ],
        },
        {
          type: 'codeBlock',
          attrs: {
            language: 'javascript',
          },
        },
        {
          type: 'panel',
          attrs: {
            panelType: 'success',
          },
        },
        {
          type: 'heading',
          attrs: {
            level: 5,
          },
        },
        {
          type: 'embedCard',
          attrs: {
            originalHeight: 1874,
            originalWidth: 1078,
          },
        },
        {
          type: 'extension',
          attrs: {
            extensionType: 'confluence.macro',
            extensionKey: 'awesome:item',
            parameters: {},
          },
        },
        {
          type: 'orderedList',
          attrs: { order: 1 },
        },
        {
          type: 'decisionItem',
          attrs: {
            state: 'DECIDED',
          },
        },
        {
          type: 'mediaSingle',
          attrs: {
            layout: 'center',
          },
          content: [
            {
              type: 'media',
              attrs: {
                type: 'external',
                url: 'https://dummyimage.com/1874x1078/f4f5f7/a5adba',
                width: 1874,
                height: 1078,
                __fileSize: 123456,
                __fileMimeType: 'image/jpeg',
              },
            },
          ],
        },
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
                },
                {
                  type: 'tableHeader',
                  attrs: {
                    background: '#DEEBFF',
                  },
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
                },
                {
                  type: 'tableCell',
                },
                {
                  type: 'tableCell',
                },
              ],
            },
          ],
        },
      ],
    };

    const scrubbedAdf = scrubAdf(adf);

    expect(scrubbedAdf).toEqual(adf);
  });
});
