import * as sinon from 'sinon';
import { Fragment } from 'prosemirror-model';
import {
  mergeTextNodes,
  isText,
  isTextWrapper,
  isEmojiDoc,
} from '../../../../react/nodes';
import { grinEmoji } from '@atlaskit/util-data-test/emoji-samples';

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
export const grinEmojiId = toEmojiId(grinEmoji());

const createMockFragment = (fragment: any) => {
  const mock = sinon.createStubInstance(Fragment);
  if (fragment.content) {
    mock.content = createMockFragment(fragment.content);
    mock.forEach = (fn: Function) => mock.content.forEach(fn);
  }
  Object.keys(fragment).forEach((key) => (mock[key] = fragment[key]));
  return mock;
};

describe('Renderer - React/Nodes', () => {
  describe('mergeTextNodes', () => {
    it('should wrap adjacent text nodes in a textWrapper', () => {
      const input = [
        {
          type: {
            name: 'text',
          },
          text: 'hello ',
          nodeSize: 6,
        },
        {
          type: {
            name: 'text',
          },
          text: 'world! ',
          nodeSize: 7,
        },
        {
          type: {
            name: 'mention',
          },
          attrs: {
            id: 'abcd-abcd-abcd',
            text: '@Oscar Wallhult',
          },
          nodeSize: 1,
        },
        {
          type: {
            name: 'text',
          },
          text: ' is my name!',
          nodeSize: 12,
        },
      ];

      expect(mergeTextNodes(input)).toEqual([
        {
          type: {
            name: 'textWrapper',
          },
          nodeSize: 13,
          content: [
            {
              type: {
                name: 'text',
              },
              text: 'hello ',
              nodeSize: 6,
            },
            {
              type: {
                name: 'text',
              },
              text: 'world! ',
              nodeSize: 7,
            },
          ],
        },
        {
          type: {
            name: 'mention',
          },
          attrs: {
            id: 'abcd-abcd-abcd',
            text: '@Oscar Wallhult',
          },
          nodeSize: 1,
        },
        {
          nodeSize: 12,
          type: {
            name: 'textWrapper',
          },
          content: [
            {
              type: {
                name: 'text',
              },
              text: ' is my name!',
              nodeSize: 12,
            },
          ],
        },
      ]);
    });
  });

  describe('isEmojiDoc', () => {
    const grinEmoji = {
      type: {
        name: 'emoji',
      },
      attrs: {
        ...grinEmojiAttrs,
      },
    };

    it('should return true for a single emoji', () => {
      const content = createMockFragment({
        type: {
          name: 'doc',
        },
        version: 1,
        content: [
          {
            type: {
              name: 'paragraph',
            },
            content: [grinEmoji],
          },
        ],
      });

      expect(isEmojiDoc(content)).toEqual(true);
    });

    it('should return true for up to three emojis', () => {
      const content = createMockFragment({
        type: {
          name: 'doc',
        },
        version: 1,
        content: [
          {
            type: {
              name: 'paragraph',
            },
            content: [grinEmoji, grinEmoji, grinEmoji],
          },
        ],
      });

      expect(isEmojiDoc(content)).toEqual(true);
    });

    it('should return false for more than three emojis', () => {
      const content = createMockFragment({
        type: {
          name: 'doc',
        },
        version: 1,
        content: [
          {
            type: {
              name: 'paragraph',
            },
            content: [grinEmoji, grinEmoji, grinEmoji, grinEmoji],
          },
        ],
      });

      expect(isEmojiDoc(content)).toEqual(false);
    });

    it('should return false if no emojis', () => {
      const content = createMockFragment({
        type: {
          name: 'doc',
        },
        version: 1,
        content: [
          {
            type: {
              name: 'paragraph',
            },
            content: [
              {
                type: {
                  name: 'text',
                },
                text: ' ',
              },
            ],
          },
        ],
      });

      expect(isEmojiDoc(content)).toEqual(false);
    });

    it('should ignore surrounding whitespace when determining whether the paragraph is any emoji block', () => {
      const content = createMockFragment({
        type: {
          name: 'doc',
        },
        version: 1,
        content: [
          {
            type: {
              name: 'paragraph',
            },
            content: [
              {
                type: {
                  name: 'text',
                },
                text: '	         ',
              },
              grinEmoji,
              {
                type: {
                  name: 'text',
                },
                text: '	                         ',
              },
              grinEmoji,
              {
                type: {
                  name: 'text',
                },
                text: '		',
              },
              grinEmoji,
              {
                type: {
                  name: 'text',
                },
                text: '	',
              },
            ],
          },
        ],
      });

      expect(isEmojiDoc(content)).toEqual(true);
    });

    it('should return false if the block contains non-whitespace text', () => {
      const content = createMockFragment({
        type: {
          name: 'doc',
        },
        version: 1,
        content: [
          {
            type: {
              name: 'paragraph',
            },
            content: [
              {
                type: {
                  name: 'text',
                },
                text: 'This is text',
              },
              grinEmoji,
            ],
          },
        ],
      });

      expect(isEmojiDoc(content)).toEqual(false);
    });

    it('should return false if there is a non-text or non-emoji node', () => {
      const content = createMockFragment({
        type: {
          name: 'doc',
        },
        version: 1,
        content: [
          {
            type: {
              name: 'paragraph',
            },
            content: [
              grinEmoji,
              {
                type: {
                  name: 'mention',
                },
                attrs: {
                  id: 'here',
                  accessLevel: 'CONTAINER',
                },
                text: '@here',
              },
            ],
          },
        ],
      });

      expect(isEmojiDoc(content)).toEqual(false);
    });

    it('should return false if there are multiple paragraphs in the doc', () => {
      const content = createMockFragment({
        type: {
          name: 'doc',
        },
        version: 1,
        content: [
          {
            type: {
              name: 'paragraph',
            },
            content: [grinEmoji],
          },
          {
            type: {
              name: 'paragraph',
            },
            content: [grinEmoji],
          },
        ],
      });

      expect(isEmojiDoc(content)).toEqual(false);
    });

    it('should return false if parent block is not of type paragraph', () => {
      const content = createMockFragment({
        type: {
          name: 'doc',
        },
        version: 1,
        content: [
          {
            type: 'decisionItem',
            attrs: {
              localId: '',
              state: 'DECIDED',
            },
            content: [grinEmoji],
          },
        ],
      });

      expect(isEmojiDoc(content)).toEqual(false);
    });

    it('should return false at nested level if no fitToHeight prop', () => {
      const content = createMockFragment({
        type: {
          name: 'paragraph',
        },
        content: [grinEmoji],
      });

      expect(isEmojiDoc(content)).toEqual(false);
    });
  });

  describe('isTextWrapper', () => {
    it('should return true if type equals "textWrapper"', () => {
      expect(isTextWrapper({ type: { name: 'textWrapper' } } as any)).toEqual(
        true,
      );
    });

    it('should return false if type does not equal "textWrapper"', () => {
      expect(isTextWrapper({ type: { name: 'mention' } } as any)).toEqual(
        false,
      );
    });
  });

  describe('isText', () => {
    it('should return true if type equals "text"', () => {
      expect(isText('text')).toEqual(true);
    });

    it('should return false if type does not equal "text"', () => {
      expect(isText('mention')).toEqual(false);
    });
  });
});
