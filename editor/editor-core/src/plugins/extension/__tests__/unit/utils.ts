import * as pmUtils from 'prosemirror-utils';
import { Node as PMNode, Mark } from 'prosemirror-model';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';

import {
  getSelectedDomElement,
  getDataConsumerMark,
  getNodeTypesReferenced,
} from '../../utils';
import { EditorState } from 'prosemirror-state';

describe('getSelectedDomElement', () => {
  const root = document.createElement('div');
  root.innerHTML = `
    <div id="bodiedExtension">
      <div>
        <div id="outerContainer" class="extension-container">
          <div id="insideBodiedExtension">
            <div id="extension">
              <div>
                <div id="innerContainer" class="extension-container">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <div>
  `;

  beforeAll(() => {
    root.id = 'root';
    // Need it for our custom closestElement
    document.body.append(root);
  });

  afterAll(() => {
    document.getElementById('#root')?.remove();
  });

  describe('extension', () => {
    it('should return inner extension-container when selected', () => {
      const container = root.querySelector('#innerContainer')!;
      jest
        .spyOn(pmUtils, 'findDomRefAtPos')
        .mockImplementation(() => root.querySelector('#extension')!);

      const sel = getSelectedDomElement(
        defaultSchema,
        {} as any,
        {
          node: defaultSchema.nodes.extension.createAndFill(),
        } as any,
      );

      expect(sel).toEqual(container);
    });

    it('should return outer extension-container when bodied extension is selected', () => {
      const container = root.querySelector('#outerContainer')!;
      jest
        .spyOn(pmUtils, 'findDomRefAtPos')
        .mockImplementation(
          () => root.querySelector('#insideBodiedExtension')!,
        );

      const sel = getSelectedDomElement(
        defaultSchema,
        {} as any,
        {
          node: { type: defaultSchema.nodes.bodiedExtension },
        } as any,
      );

      expect(sel).toEqual(container);
    });
  });

  describe('bodiedExtension', () => {
    it('should return outer extension-container when selected', () => {
      const container = root.querySelector('#outerContainer')!;
      jest
        .spyOn(pmUtils, 'findDomRefAtPos')
        .mockImplementation(() => root.querySelector('#bodiedExtension')!);

      const sel = getSelectedDomElement(
        defaultSchema,
        {} as any,
        {
          node: { type: defaultSchema.nodes.bodiedExtension },
        } as any,
      );

      expect(sel).toEqual(container);
    });
  });
});

describe('getDataConsumerMark', () => {
  it('should return undefined if node contains no marks', () => {
    const nodeJson = {
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.forge',
        extensionKey: 'awesome:list',
        parameters: {
          items: ['a', 'b', 'c', 'd'],
        },
      },
    };
    const node: PMNode = PMNode.fromJSON(defaultSchema, nodeJson);
    expect(getDataConsumerMark(node)).toBe(undefined);
  });

  it('should return undefined if node contains no dataConsumer marks', () => {
    const nodeJson = {
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.forge',
        extensionKey: 'awesome:list',
        parameters: {
          items: ['a', 'b', 'c', 'd'],
        },
      },
      marks: [
        {
          type: 'strong',
          attrs: {
            sources: ['123'],
          },
        },
      ],
    };
    const node: PMNode = PMNode.fromJSON(defaultSchema, nodeJson);
    expect(getDataConsumerMark(node)).toEqual(undefined);
  });

  it('should return a dataConsumer mark when found in node', () => {
    const nodeJson = {
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.forge',
        extensionKey: 'awesome:list',
        parameters: {
          items: ['a', 'b', 'c', 'd'],
        },
      },
      marks: [
        {
          type: 'dataConsumer',
          attrs: {
            sources: ['123'],
          },
        },
      ],
    };
    const markJson = {
      type: 'dataConsumer',
      attrs: {
        sources: ['123'],
      },
    };

    const node: PMNode = PMNode.fromJSON(defaultSchema, nodeJson);
    const expectedMark: Mark = Mark.fromJSON(defaultSchema, markJson);
    expect(getDataConsumerMark(node)).toEqual(expectedMark);
  });
});

describe('getNodeTypesReferenced', () => {
  it('should return empty array if no node with matching localId is found', () => {
    const nodeJson = {
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
              text: 'lorem ipsum',
            },
          ],
        },
      ],
    };

    const doc: PMNode = PMNode.fromJSON(defaultSchema, nodeJson);
    const state: EditorState = EditorState.create({ doc });
    const ids = ['hello', '123'];
    expect(getNodeTypesReferenced(ids, state)).toEqual([]);
  });

  it('should return an array of node type names if there are nodes with matching localId', () => {
    const nodeJson = {
      type: 'taskList',
      attrs: {
        localId: '0e9776e6-1257-4f97-bef3-521eb684b36b',
      },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: '165a69e2-64e1-4308-b486-2d5aadefcf9c',
            state: 'TODO',
          },
          content: [
            {
              type: 'text',
              text: 'Buy groceries',
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: 'd9845f11-c6bd-4882-98a4-c64db86063f7',
            state: 'TODO',
          },
          content: [
            {
              type: 'text',
              text: 'Clean house',
            },
          ],
        },
      ],
    };

    const doc: PMNode = PMNode.fromJSON(defaultSchema, nodeJson);
    const state: EditorState = EditorState.create({ doc });
    const ids = [
      '0e9776e6-1257-4f97-bef3-521eb684b36b',
      '165a69e2-64e1-4308-b486-2d5aadefcf9c',
      'd9845f11-c6bd-4882-98a4-c64db86063f7',
    ];
    expect(getNodeTypesReferenced(ids, state)).toEqual([
      'taskList',
      'taskItem',
      'taskItem',
    ]);
  });
});
