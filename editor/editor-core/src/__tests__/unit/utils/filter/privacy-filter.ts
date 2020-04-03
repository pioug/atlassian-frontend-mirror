import { name } from '../../../../version.json';
import { JSONDocNode } from '../../../../utils/index';
import { sanitizeNodeForPrivacy } from '../../../../utils/filter/privacy-filter';
import { ProviderFactory } from '@atlaskit/editor-common';
import { waitUntil } from '@atlaskit/media-test-helpers';
import { MentionProvider } from '@atlaskit/mention/types';

describe(name, () => {
  describe('Utils -> filter -> privacy-filter', () => {
    describe('sanitizeNodeForPrivacy()', () => {
      const jsonDoc = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'mention',
                attrs: {
                  text: '@abc',
                  id: '123',
                },
              },
              {
                type: 'text',
                text: ' Boo',
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
                        type: 'mention',
                        attrs: {
                          id: '555',
                          text: 'Elaine Mattia',
                        },
                      },
                      {
                        type: 'text',
                        text: ' is great and nested',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      } as JSONDocNode;

      it('should filter text attribute from all mention nodes from json document', () => {
        const sanitizedJSON = sanitizeNodeForPrivacy(jsonDoc);

        expect(sanitizedJSON).toEqual({
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'mention',
                  attrs: {
                    text: '',
                    id: '123',
                  },
                },
                {
                  type: 'text',
                  text: ' Boo',
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
                          type: 'mention',
                          attrs: {
                            id: '555',
                            text: '',
                          },
                        },
                        {
                          type: 'text',
                          text: ' is great and nested',
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

      it('should cache mention name (without @) fro all mention nodes from json document', async () => {
        // Just mock enough for test.
        const mockMentionProvider = {
          resolveMentionName: jest.fn(),
          cacheMentionName: jest.fn(),
          supportsMentionNameResolving: () => true,
        };
        const providerFactory = ProviderFactory.create({
          mentionProvider: Promise.resolve(
            (mockMentionProvider as any) as MentionProvider,
          ),
        });
        sanitizeNodeForPrivacy(jsonDoc, providerFactory);

        await waitUntil(
          () => mockMentionProvider.cacheMentionName.mock.calls.length === 2,
        );

        expect(mockMentionProvider.cacheMentionName).toHaveBeenCalledTimes(2);
        // @ should be removed from start
        expect(mockMentionProvider.cacheMentionName).toHaveBeenNthCalledWith(
          1,
          '123',
          'abc',
        );
        expect(mockMentionProvider.cacheMentionName).toHaveBeenNthCalledWith(
          2,
          '555',
          'Elaine Mattia',
        );
      });
    });
  });
});
