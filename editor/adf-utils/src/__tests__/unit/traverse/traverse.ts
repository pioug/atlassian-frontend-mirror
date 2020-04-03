import { traverse } from '../../../traverse/traverse';
import mentionsDoc from './__fixtures__/mentions.json';
import emojiDoc from './__fixtures__/emoji.json';

describe('Traverse', () => {
  it('should call a callback for all nodes of a given type', () => {
    const visitor = jest.fn();
    traverse(mentionsDoc, {
      mention: visitor,
    });

    expect(visitor).toHaveBeenCalledTimes(5);
    expect(visitor).toHaveBeenLastCalledWith(
      {
        type: 'mention',
        attrs: {
          id: 'all',
          text: '@all',
          accessLevel: 'CONTAINER',
        },
      },
      expect.objectContaining({}),
      expect.any(Number),
    );
  });

  it('should remove node when visitor returns false', () => {
    expect(
      traverse(emojiDoc, {
        emoji: () => false,
      }),
    ).toMatchSnapshot();
  });

  it('should replace a node when visitor returns a new adf node', () => {
    expect(
      traverse(mentionsDoc, {
        mention: node => ({
          ...node,
          attrs: { ...node.attrs, text: `${node.attrs!.text} – updated` },
        }),
      }),
    ).toMatchSnapshot();
  });

  it('should not process children nodes if parent node has been removed', () => {
    const visitor = jest.fn();
    traverse(emojiDoc, {
      paragraph: () => false,
      emoji: visitor,
    });
    expect(visitor).not.toHaveBeenCalled();
  });

  it('should support "any" as a type', () => {
    const visitor = jest.fn();
    traverse(emojiDoc, {
      any: visitor,
    });
    expect(visitor).toHaveBeenCalledTimes(5);
  });
});
