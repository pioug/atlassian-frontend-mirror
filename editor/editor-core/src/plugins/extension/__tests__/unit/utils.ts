import * as pmUtils from 'prosemirror-utils';
import { Node as PMNode, Mark } from 'prosemirror-model';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';

import {
  getSelectedDomElement,
  getDataConsumerMark,
  getNodeTypesReferenced,
  findExtensionWithLocalId,
  findNodePosWithLocalId,
} from '../../utils';
import { EditorState, NodeSelection } from 'prosemirror-state';

import {
  doc,
  DocBuilder,
  p,
  table,
  td,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';

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

describe('findExtensionWithLocalId', () => {
  const testId = '7d2eda3a-d623-4560-bbe6-afac2da82112';
  const nodeJson = {
    type: 'doc',
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
      {
        type: 'bodiedExtension',
        attrs: {
          layout: 'default',
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'test',
          text: '',
          parameters: {},
          localId: testId,
        },
      },
    ],
  };
  const doc: PMNode = PMNode.fromJSON(defaultSchema, nodeJson);

  it('should return the extension with the correct localId when the extension node is selected', () => {
    const state: EditorState = EditorState.create({
      doc,
      selection: NodeSelection.create(doc, 13),
    });
    const extensionNode = findExtensionWithLocalId(state, testId);
    const selectedNode = state.selection as NodeSelection;

    expect(selectedNode.node.type.name).toBe('bodiedExtension');
    expect(extensionNode?.node.attrs.localId).toEqual(testId);
  });

  it('should return the extension with the correct localId when the extension node is not selected', () => {
    const state: EditorState = EditorState.create({
      doc,
      selection: NodeSelection.create(doc, 1),
    });
    const extensionNode = findExtensionWithLocalId(state, testId);
    const selectedNode = state.selection as NodeSelection;

    expect(selectedNode.node.type.name).not.toBe('bodiedExtension');
    expect(extensionNode?.node.attrs.localId).toEqual(testId);
  });
});

describe('findNodePosWithLocalId', () => {
  /**
   * Use `createEditorFactory` here when `allowReferentiliaty: true`, as
   * `createProsemirrorEditorFactory` has some issues with correctly mimicking
   * old state for the unique localId plugin
   */
  const createEditorFn = createEditorFactory<{}>();
  const createEditor = (doc: DocBuilder) => {
    const { editorView } = createEditorFn({
      doc,
      editorProps: {
        allowExtension: true,
        allowTables: true,
        allowLayouts: true,
        allowExpand: true,
      },
    });
    return editorView;
  };

  it('should return undefined when localId is not found', () => {
    const initDoc = doc(
      table({ localId: 'tableId' })(tr(td({})(p()), td({})(p()), td({})(p()))),
    );
    const { state } = createEditor(initDoc);
    const result = findNodePosWithLocalId(state, 'fakeId');

    expect(result).toBeUndefined();
  });

  it('should return NodePos when localId is found', () => {
    const initDoc = doc(
      table({ localId: 'tableId' })(tr(td({})(p()), td({})(p()), td({})(p()))),
    );
    const { state } = createEditor(initDoc);
    const result = findNodePosWithLocalId(state, 'tableId');

    expect(result).not.toBeUndefined();
    expect(result!.pos).toEqual(0);
    expect(result!.node.type.name).toEqual('table');
  });
});
