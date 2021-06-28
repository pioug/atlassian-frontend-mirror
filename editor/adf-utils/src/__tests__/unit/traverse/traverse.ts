import { traverse } from '../../../traverse/traverse';
import mentionsDoc from './__fixtures__/mentions.json';
import emojiDoc from './__fixtures__/emoji.json';
import deepDoc from './__fixtures__/deep-adf.json';

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
      2,
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
        mention: (node) => ({
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

  it('should provide depth in visitor', () => {
    let maxDepth = 0;
    let listItemDepth = 0;
    traverse(deepDoc, {
      any: (_node, _parent, _index, depth) => {
        maxDepth = Math.max(depth, maxDepth);
      },
      listItem: (_node, _parent, _index, depth) => {
        listItemDepth = Math.max(depth, listItemDepth);
      },
    });
    expect(maxDepth).toEqual(21);
    expect(listItemDepth).toEqual(19);
  });

  it('should correctly pass reference to parent in visitor', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'fizz buzz',
            },
          ],
        },
      ],
    };
    expect.assertions(2);
    traverse(doc, {
      paragraph: (node, parent) => {
        expect(parent).toEqual({ node: doc, parent: { node: undefined } });
      },

      text: (node, parent) => {
        expect(parent).toEqual({
          node: doc.content[0],
          parent: { node: doc, parent: { node: undefined } },
        });
      },
    });
  });

  it('should allow node mutation outside of traversal using references', () => {
    const mentions: any = [];
    const doc = Object.assign({}, mentionsDoc);

    // collect all mentions
    traverse(doc, {
      mention: (node) => {
        mentions.push(node);
        return node;
      },
    });

    // mutate mentions
    mentions.forEach((node: any) => {
      node.attrs.text = 'modified';
    });

    // 'Expect' should be called for each mention node
    expect.assertions(mentions.length);
    // assert mutation
    traverse(doc, {
      mention: (node: any) => {
        expect(node.attrs.text).toEqual('modified');
        return node;
      },
    });
  });
});
