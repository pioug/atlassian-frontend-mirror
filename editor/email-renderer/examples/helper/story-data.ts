import {
  grinEmoji,
  evilburnsEmoji,
} from '@atlaskit/util-data-test/emoji-samples';

type EmojiAttrs = {
  id: string;
  shortName: string;
  fallback?: string;
  text?: string;
};

const toEmojiAttrs = (emoji: EmojiAttrs): EmojiAttrs => {
  const { shortName, id, fallback } = emoji;
  return {
    shortName,
    id,
    text: fallback || shortName,
  };
};

const toEmojiId = (emoji: EmojiAttrs): EmojiAttrs => {
  const { shortName, id, fallback } = emoji;
  return { shortName, id, fallback };
};

export const grinEmojiAttrs = toEmojiAttrs(grinEmoji());
export const evilburnsEmojiAttrs = toEmojiAttrs(evilburnsEmoji());

export const grinEmojiId = toEmojiId(grinEmoji());
export const evilburnsEmojiId = toEmojiId(evilburnsEmoji());

export const lorem = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tincidunt,
lorem eu vestibulum sollicitudin, erat nibh ornare purus, et sollicitudin lorem
felis nec erat. Quisque quis ligula nisi. Cras nec dui vestibulum, pretium massa ut,
egestas turpis. Quisque finibus eget justo a mollis. Mauris quis varius nisl. Donec
aliquet enim vel eros suscipit porta. Vivamus quis molestie leo. In feugiat felis mi,
ac varius odio accumsan ac. Pellentesque habitant morbi tristique senectus et netus et
malesuada fames ac turpis egestas. Mauris elementum mauris ac leo porta venenatis.
Integer hendrerit lacus vel faucibus sagittis. Mauris elit urna, tincidunt at aliquet
sit amet, convallis placerat diam. Mauris id aliquet elit, non posuere nibh. Curabitur
ullamcorper lectus mi, quis varius libero ultricies nec. Quisque tempus neque ligula,
a semper massa dignissim nec.
`;

export const document = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello, ',
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
          text: 'World!',
          marks: [
            {
              type: 'strong',
            },
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
          text: ' Look I can do ',
        },
        {
          type: 'text',
          text: 'italic ',
          marks: [
            {
              type: 'em',
            },
          ],
        },
        {
          type: 'text',
          text: ', strong ',
          marks: [
            {
              type: 'em',
            },
            {
              type: 'strong',
            },
          ],
        },
        {
          type: 'text',
          text: 'and underlined text!',
          marks: [
            {
              type: 'em',
            },
            {
              type: 'strong',
            },
            {
              type: 'underline',
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'My favourite emoji are ',
        },
        {
          type: 'emoji',
          attrs: {
            ...grinEmojiAttrs,
          },
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'emoji',
          attrs: {
            ...evilburnsEmojiAttrs,
          },
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'emoji',
          attrs: {
            shortName: ':not-an-emoji:',
          },
        },
        {
          type: 'text',
          text: '. What are yours?',
          marks: [],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'date',
          attrs: {
            timestamp: '1554163200000',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hi, my name is... My name is... My name is... My name is ',
        },
        {
          type: 'mention',
          attrs: {
            id: '1',
            text: '@Oscar Wallhult',
          },
        },
        {
          type: 'text',
          text: ' :D',
          marks: [],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is a ',
        },
        {
          type: 'mention',
          attrs: {
            text: '@mention',
            id: '2',
          },
        },
        {
          type: 'text',
          text: '. And this is a broken ',
        },
        {
          type: 'mention',
          attrs: {
            textxtx: '@mention',
            id: 'mention',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Mention with restricted access',
        },
        {
          type: 'mention',
          attrs: {
            id: '1',
            accessLevel: 'APPLICATION',
          },
          text: '@oscar',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Mentions with generic ids',
        },
        {
          type: 'mention',
          attrs: {
            id: 'here',
            accessLevel: 'CONTAINER',
          },
          text: '@here',
        },
        {
          type: 'mention',
          attrs: {
            id: 'all',
            accessLevel: 'CONTAINER',
          },
          text: '@all',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is  a   text    with	multiple		spaces 			and				tabs.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'italic',
          marks: [
            {
              type: 'em',
            },
          ],
        },
        {
          type: 'text',
          text: 'link',
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
          text: 'strike-through',
          marks: [
            {
              type: 'strike',
            },
          ],
        },
        {
          type: 'text',
          text: 'strong',
          marks: [
            {
              type: 'strong',
            },
          ],
        },
        {
          type: 'text',
          text: 'sub',
          marks: [
            {
              type: 'subsup',
              attrs: {
                type: 'sub',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'sup',
          marks: [
            {
              type: 'subsup',
              attrs: {
                type: 'sup',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'underline',
          marks: [
            {
              type: 'underline',
            },
          ],
        },
        {
          type: 'text',
          text: ' red text',
          marks: [
            {
              type: 'textColor',
              attrs: { color: '#ff0000' },
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'some inline code: ',
        },
        {
          type: 'text',
          text: 'const foo = bar();',
          marks: [
            {
              type: 'code',
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is a line with ',
        },
        {
          type: 'hardBreak',
        },
        {
          type: 'text',
          text: 'a hardbreak in it.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Showing a status: ',
        },
        {
          type: 'status',
          attrs: {
            text: 'In progress',
            color: 'blue',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      marks: [{ type: 'indentation', attrs: { level: 1 } }],
      content: [
        {
          type: 'text',
          text: 'Paragraph with 1 level of indentation',
        },
      ],
    },
    {
      type: 'paragraph',
      marks: [{ type: 'indentation', attrs: { level: 2 } }],
      content: [
        {
          type: 'text',
          text: 'Paragraph with 2 levels of indentation',
        },
      ],
    },
    {
      type: 'paragraph',
      marks: [{ type: 'indentation', attrs: { level: 3 } }],
      content: [
        {
          type: 'text',
          text: 'Paragraph with 3 levels of indentation',
        },
      ],
    },
    {
      type: 'paragraph',
      marks: [{ type: 'indentation', attrs: { level: 4 } }],
      content: [
        {
          type: 'text',
          text: 'Paragraph with 4 levels of indentation',
        },
      ],
    },
    {
      type: 'paragraph',
      marks: [{ type: 'indentation', attrs: { level: 5 } }],
      content: [
        {
          type: 'text',
          text: 'Paragraph with 5 levels of indentation',
        },
      ],
    },
    {
      type: 'paragraph',
      marks: [{ type: 'indentation', attrs: { level: 6 } }],
      content: [
        {
          type: 'text',
          text: 'Paragraph with 6 levels of indentation',
        },
      ],
    },
    {
      type: 'paragraph',
      marks: [{ type: 'alignment', attrs: { align: 'center' } }],
      content: [
        {
          type: 'text',
          text: 'Paragraph with center alignment',
        },
      ],
    },
    {
      type: 'paragraph',
      marks: [{ type: 'alignment', attrs: { align: 'end' } }],
      content: [
        {
          type: 'text',
          text: 'Paragraph with end alignment',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [
        {
          type: 'text',
          text: 'Heading 1',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [
        {
          type: 'text',
          text: 'Heading 2',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'www.atlassian.com',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [
        {
          type: 'text',
          text: 'Heading 3',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 4 },
      content: [
        {
          type: 'text',
          text: 'Heading 4',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 5 },
      content: [
        {
          type: 'text',
          text: 'Heading 5',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 6 },
      content: [
        {
          type: 'text',
          text: 'Heading 6',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 1 },
      marks: [{ type: 'indentation', attrs: { level: 1 } }],
      content: [
        {
          type: 'text',
          text: 'Heading 1 with 1 level of indentation',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      marks: [{ type: 'indentation', attrs: { level: 2 } }],
      content: [
        {
          type: 'text',
          text: 'Heading 2 with 2 levels of indentation',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'www.atlassian.com',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      marks: [{ type: 'indentation', attrs: { level: 3 } }],
      content: [
        {
          type: 'text',
          text: 'Heading 3 with 3 levels of indentation',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 4 },
      marks: [{ type: 'indentation', attrs: { level: 4 } }],
      content: [
        {
          type: 'text',
          text: 'Heading 4 with 4 levels of indentation',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 5 },
      marks: [{ type: 'indentation', attrs: { level: 5 } }],
      content: [
        {
          type: 'text',
          text: 'Heading 5 with 5 levels of indentation',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 6 },
      marks: [{ type: 'indentation', attrs: { level: 6 } }],
      content: [
        {
          type: 'text',
          text: 'Heading 6 with 6 levels of indentation',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      marks: [{ type: 'alignment', attrs: { align: 'center' } }],
      content: [
        {
          type: 'text',
          text: 'Heading 2 with center alignment',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      marks: [{ type: 'alignment', attrs: { align: 'end' } }],
      content: [
        {
          type: 'text',
          text: 'Heading 3 with end alignment',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is a paragraph with a text node',
        },
        {
          type: 'text',
          text: '\n',
        },
        {
          type: 'text',
          text: 'that contains a new line',
        },
      ],
    },
    {
      type: 'mediaSingle',
      attrs: {
        layout: 'full-width',
      },
      content: [
        {
          type: 'media',
          attrs: {
            id: '2aa22582-ca0e-4bd4-b1bc-9369d10a0719',
            type: 'file',
            collection: 'MediaServicesSample',
            width: 5845,
            height: 1243,
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Click me! ',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'javascript:alert("hello world")',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'www.atlassian.com',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'www.atlassian.com',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'codeBlock',
      content: [
        {
          type: 'text',
          text: `// Create a map.
final IntIntOpenHashMap map = new IntIntOpenHashMap();
map.put(1, 2);
map.put(2, 5);
map.put(3, 10);`,
        },
        {
          type: 'text',
          text: `
int count = map.forEach(new IntIntProcedure()
{
   int count;
   public void apply(int key, int value)
   {
       if (value >= 5) count++;
   }
}).count;
System.out.println("There are " + count + " values >= 5");`,
        },
      ],
      attrs: {
        language: 'javascript',
      },
    },
    {
      type: 'mediaGroup',
      content: [
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: 'media-type-image',
            collection: 'MediaServicesSample',
            width: 480,
            height: 320,
          },
        },
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: 'media-type-doc',
            collection: 'MediaServicesSample',
          },
        },
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: 'media-type-video',
            collection: 'MediaServicesSample',
          },
        },
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: 'media-type-audio',
            collection: 'MediaServicesSample',
          },
        },
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: 'media-type-archive',
            collection: 'MediaServicesSample',
          },
        },
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: 'media-type-unknown',
            collection: 'MediaServicesSample',
          },
        },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'First list item',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Second list item',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Third list item',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'codeBlock',
      marks: [{ type: 'breakout', attrs: { mode: 'wide' } }],
      content: [
        {
          type: 'text',
          text: `// Create a map.
final IntIntOpenHashMap map = new IntIntOpenHashMap();
map.put(1, 2);
map.put(2, 5);
map.put(3, 10);`,
        },
      ],
      attrs: {
        language: 'javascript',
      },
    },
    {
      type: 'orderedList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'First list item',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Second list item',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Third list item',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text:
                'All that is gold does not glitter, not all those who wander are lost; The old that is strong does not wither, deep roots are not reached by the frost.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text:
                'From the ashes a fire shall be woken, a light from the shadows shall spring; Renewed shall be blade that was broken, the crownless again shall be king.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'J.R.R. Tolkien, The Fellowship of the Ring.',
              marks: [
                {
                  type: 'em',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Embed',
        },
      ],
    },
    {
      type: 'embedCard',
      attrs: {
        url: 'https://www.dropbox.com/s/dour6e2io8mlyus/4.txt?dl=0',
        layout: 'center',
      },
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Card',
        },
      ],
    },
    {
      type: 'blockCard',
      attrs: {
        url: 'https://www.dropbox.com/s/dour6e2io8mlyus/4.txt?dl=0',
      },
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Inline',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'inlineCard',
          attrs: {
            url: 'https://www.dropbox.com/s/dour6e2io8mlyus/4.txt?dl=0',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'URL',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'https://www.dropbox.com/s/dour6e2io8mlyus/4.txt?dl=0',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://www.dropbox.com/s/dour6e2io8mlyus/4.txt?dl=0',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'panel',
      attrs: {
        panelType: 'info',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is an info panel with ',
            },
            {
              type: 'text',
              text: 'bold text',
              marks: [
                {
                  type: 'strong',
                },
              ],
            },
          ],
        },
      ],
    },
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
              text: 'This is a note panel with ',
            },
            {
              type: 'text',
              text: 'bold text',
              marks: [
                {
                  type: 'strong',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'panel',
      attrs: {
        panelType: 'tip',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is a tip panel with ',
            },
            {
              type: 'text',
              text: 'bold text',
              marks: [
                {
                  type: 'strong',
                },
              ],
            },
          ],
        },
      ],
    },
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
              text: 'This is a success panel with ',
            },
            {
              type: 'text',
              text: 'bold text',
              marks: [
                {
                  type: 'strong',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'panel',
      attrs: {
        panelType: 'warning',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is a warning panel with ',
            },
            {
              type: 'text',
              text: 'bold text',
              marks: [
                {
                  type: 'strong',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'panel',
      attrs: {
        panelType: 'error',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is a error panel with ',
            },
            {
              type: 'text',
              text: 'bold text',
              marks: [
                {
                  type: 'strong',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'rule',
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            'Do not use this image node; it may be removed at any time without notice.',
        },
        {
          type: 'image',
          attrs: {
            src:
              'https://www.google.com.au/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
            alt: 'Google Logo',
            title: 'Google!',
          },
        },
        {
          type: 'text',
          text:
            'Do not use this image node; it may be removed at any time without notice.',
        },
      ],
    },
    {
      type: 'decisionList',
      attrs: {
        localId: 'empty-list-should-not-render',
      },
      content: [
        {
          type: 'decisionItem',
          attrs: {
            localId: 'to-be-ignored-as-no-content',
            state: 'DECIDED',
          },
        },
      ],
    },
    {
      type: 'taskList',
      attrs: {
        localId: '638aece7-97ac-4acd-99ee-4c76bebcd6ba',
      },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: 'b5fc19b3-0742-4279-bccc-60ddd404a8e1',
            state: 'TODO',
          },
          content: [
            {
              type: 'text',
              text: 'just text',
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: 'c800bf19-e4dc-4e5b-9189-cc6673a4fe4c',
            state: 'TODO',
          },
          content: [
            {
              type: 'mention',
              attrs: {
                id: '0',
                text: '@Carolyn',
                accessLevel: '',
              },
            },
            {
              type: 'text',
              text: '  with mention',
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: '9f523424-081b-4bb8-8031-e4450acce7de',
            state: 'TODO',
          },
          content: [
            {
              type: 'date',
              attrs: {
                timestamp: '1554422400000',
              },
            },
            {
              type: 'text',
              text: ' with date',
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: 'f70222ac-4e36-41d4-a6df-ebe687a5e97f',
            state: 'TODO',
          },
          content: [
            {
              type: 'text',
              text: 'with emoji ',
            },
            {
              type: 'emoji',
              attrs: {
                shortName: ':slight_smile:',
                id: '1f642',
                text: '🙂',
              },
            },
            {
              type: 'text',
              text: ' ',
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: '29295813-3065-4cae-b125-0b51ac1ba79b',
            state: 'TODO',
          },
          content: [
            {
              type: 'text',
              text: 'multiline!',
            },
            {
              type: 'hardBreak',
            },
            {
              type: 'text',
              text: 'dfsfdad',
            },
          ],
        },
      ],
    },
    {
      type: 'taskList',
      attrs: {
        localId: 'e10bc6bd-ad20-426a-9d65-351907af90bf',
      },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: 'fd7f6239-17c3-4bf9-89a0-51291ab8474f',
            state: 'DONE',
          },
          content: [
            {
              type: 'text',
              text: 'ticked off plain text',
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: '22f227d1-6ff0-43da-8f76-9a57c5853a36',
            state: 'DONE',
          },
          content: [
            {
              type: 'mention',
              attrs: {
                id: '0',
                text: '@Carolyn',
                accessLevel: '',
              },
            },
            {
              type: 'text',
              text: ' ticked off mention',
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: '815c9ab3-2393-4041-8c82-4dcc1a31343a',
            state: 'DONE',
          },
          content: [
            {
              type: 'date',
              attrs: {
                timestamp: '1554422400000',
              },
            },
            {
              type: 'text',
              text: ' ticked off date',
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: '82f316ca-d334-4ea4-a377-400e687de75a',
            state: 'DONE',
          },
          content: [
            {
              type: 'text',
              text: 'with emoji ',
            },
            {
              type: 'emoji',
              attrs: {
                shortName: ':slight_smile:',
                id: '1f642',
                text: '🙂',
              },
            },
            {
              type: 'text',
              text: ' ',
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: 'ade6f17f-566b-422a-953d-50c00c63e2f1',
            state: 'DONE',
          },
          content: [
            {
              type: 'text',
              text: 'Multiline!',
            },
            {
              type: 'hardBreak',
            },
            {
              type: 'text',
              text: 'asd',
            },
          ],
        },
      ],
    },
    {
      type: 'decisionList',
      attrs: {
        localId: '68a15a03-12cd-4959-8502-67ba070a9cad',
      },
      content: [
        {
          type: 'decisionItem',
          attrs: {
            localId: '6dc81c6b-dbd6-460f-b54a-c9255815bcd5',
            state: 'DECIDED',
          },
          content: [
            {
              type: 'text',
              text: 'plain text',
            },
          ],
        },
        {
          type: 'decisionItem',
          attrs: {
            localId: '52439c36-138d-4aa9-bac3-711dfed600dc',
            state: 'DECIDED',
          },
          content: [
            {
              type: 'text',
              text: 'all the stuff ',
            },
            {
              type: 'emoji',
              attrs: {
                shortName: ':slight_smile:',
                id: '1f642',
                text: '🙂',
              },
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'status',
              attrs: {
                text: 'todo',
                color: 'neutral',
                localId: 'd1b227fa-26ab-419a-84a0-2a580551f75e',
              },
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'date',
              attrs: {
                timestamp: '1554422400000',
              },
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'mention',
              attrs: {
                id: '0',
                text: '@Carolyn',
                accessLevel: '',
              },
            },
            {
              type: 'text',
              text: ' ',
            },
          ],
        },
        {
          type: 'decisionItem',
          attrs: {
            localId: '863bd5e3-dc32-426e-a5bb-d53dd8069117',
            state: 'DECIDED',
          },
          content: [
            {
              type: 'text',
              text: 'multiline!',
            },
            {
              type: 'hardBreak',
            },
            {
              type: 'text',
              text: 'asdf',
            },
          ],
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
                background: '#deebff',
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
        {
          type: 'tableRow',
          content: [
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
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [
        {
          type: 'text',
          text: 'Media single without width defined',
        },
      ],
    },
    {
      type: 'mediaSingle',
      content: [
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
            collection: 'MediaServicesSample',
          },
        },
      ],
    },
    {
      type: 'bodiedExtension',
      attrs: {
        extensionType: 'com.atlassian.fabric',
        extensionKey: 'clock',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is the default content of the extension',
            },
          ],
        },
      ],
    },
    {
      type: 'layoutSection',
      content: [
        {
          type: 'layoutColumn',
          attrs: {
            width: 50,
          },
          content: [
            {
              type: 'table',
              attrs: {
                isNumberColumnEnabled: true,
                layout: 'default',
              },
              content: [
                {
                  type: 'tableRow',
                  content: [
                    {
                      type: 'tableHeader',
                      attrs: {
                        colwidth: [225],
                        defaultMarks: [
                          {
                            type: 'strong',
                          },
                        ],
                      },
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'text',
                              text: 'Extreme node nesting example',
                              marks: [
                                {
                                  type: 'strong',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'tableHeader',
                      attrs: {
                        colwidth: [57],
                        defaultMarks: [
                          {
                            type: 'strong',
                          },
                        ],
                      },
                      content: [
                        {
                          type: 'paragraph',
                          content: [],
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
                        colwidth: [225],
                      },
                      content: [
                        {
                          type: 'taskList',
                          attrs: {
                            localId: '68350926-57a5-42f6-9683-9305def1183f',
                          },
                          content: [
                            {
                              type: 'taskItem',
                              attrs: {
                                localId: '02b53fa4-8c20-478e-bb6b-fe0ea8920ba0',
                                state: 'TODO',
                              },
                              content: [
                                {
                                  type: 'mention',
                                  attrs: {
                                    id: '0',
                                    text: '@Carolyn',
                                    accessLevel: '',
                                  },
                                },
                                {
                                  type: 'text',
                                  text: ' ',
                                },
                                {
                                  type: 'date',
                                  attrs: {
                                    timestamp: '1554249600000',
                                  },
                                },
                                {
                                  type: 'text',
                                  text: ' ',
                                },
                                {
                                  type: 'emoji',
                                  attrs: {
                                    shortName: ':slight_smile:',
                                    id: '1f642',
                                    text: '🙂',
                                  },
                                },
                                {
                                  type: 'text',
                                  text: ' ',
                                },
                                {
                                  type: 'text',
                                  text: 'bold ',
                                  marks: [
                                    {
                                      type: 'em',
                                    },
                                    {
                                      type: 'strong',
                                    },
                                    {
                                      type: 'underline',
                                    },
                                  ],
                                },
                                {
                                  type: 'text',
                                  text: "FAB-1520 UI: Poor man's search",
                                  marks: [
                                    {
                                      type: 'link',
                                      attrs: {
                                        href:
                                          'https://product-fabric.atlassian.net/browse/FAB-1520',
                                      },
                                    },
                                    {
                                      type: 'em',
                                    },
                                    {
                                      type: 'strong',
                                    },
                                    {
                                      type: 'underline',
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'tableCell',
                      attrs: {
                        colwidth: [57],
                      },
                      content: [
                        {
                          type: 'paragraph',
                          content: [],
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
                        colwidth: [225],
                      },
                      content: [
                        {
                          type: 'panel',
                          attrs: {
                            panelType: 'info',
                          },
                          content: [
                            {
                              type: 'orderedList',
                              content: [
                                {
                                  type: 'listItem',
                                  content: [
                                    {
                                      type: 'paragraph',
                                      content: [
                                        {
                                          type: 'text',
                                          text: 'a',
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  type: 'listItem',
                                  content: [
                                    {
                                      type: 'paragraph',
                                      content: [
                                        {
                                          type: 'text',
                                          text: 'b',
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  type: 'listItem',
                                  content: [
                                    {
                                      type: 'paragraph',
                                      content: [
                                        {
                                          type: 'text',
                                          text: 'c',
                                        },
                                      ],
                                    },
                                    {
                                      type: 'orderedList',
                                      content: [
                                        {
                                          type: 'listItem',
                                          content: [
                                            {
                                              type: 'paragraph',
                                              content: [
                                                {
                                                  type: 'text',
                                                  text: 'd',
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                        {
                                          type: 'listItem',
                                          content: [
                                            {
                                              type: 'paragraph',
                                              content: [
                                                {
                                                  type: 'text',
                                                  text: 'e',
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                        {
                                          type: 'listItem',
                                          content: [
                                            {
                                              type: 'paragraph',
                                              content: [
                                                {
                                                  type: 'text',
                                                  text: 'g',
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                        {
                                          type: 'listItem',
                                          content: [
                                            {
                                              type: 'paragraph',
                                              content: [
                                                {
                                                  type: 'mention',
                                                  attrs: {
                                                    id: '0',
                                                    text: '@Carolyn',
                                                    accessLevel: '',
                                                  },
                                                },
                                                {
                                                  type: 'text',
                                                  text: ' ',
                                                },
                                                {
                                                  type: 'date',
                                                  attrs: {
                                                    timestamp: '1554422400000',
                                                  },
                                                },
                                                {
                                                  type: 'text',
                                                  text: ' ',
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
                        },
                      ],
                    },
                    {
                      type: 'tableCell',
                      attrs: {
                        colwidth: [57],
                      },
                      content: [
                        {
                          type: 'paragraph',
                          content: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'layoutColumn',
          attrs: {
            width: 50,
          },
          content: [
            {
              type: 'paragraph',
              content: [],
            },
          ],
        },
      ],
    },
  ],
};
