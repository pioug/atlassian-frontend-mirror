import React from 'react';
import { EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import { mount } from 'enzyme';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { EditorActions, MacroAttributes, MacroProvider } from '../../../index';
import Editor from '../../../editor';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { Transformer } from '@atlaskit/editor-common/types';

import {
  bodiedExtension,
  doc,
  expand,
  extension,
  fragmentMark,
  p,
  taskItem,
  taskList,
  table,
  tr,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('Editor Actions', () => {
  const transformer = new JSONTransformer();
  const mock: Transformer<any> = {
    encode: (node: any) => {
      return transformer.encode(node);
    },
    parse: (content: any) => {
      return transformer.parse(content);
    },
  };

  describe('getValue', () => {
    it('filters out invalid marks when a contentTransformer is present', async () => {
      const wrapper = mount(
        <Editor
          emojiProvider={getTestEmojiResource()}
          contentTransformerProvider={() => mock}
        />,
      );

      const editorActions: EditorActions = (wrapper
        .find(Editor)
        .instance() as any).editorActions;

      const view: EditorView = editorActions._privateGetEditorView()!;

      // populate the document with content that isnt valid ADF without sanitization.
      const content = view.state.schema.nodeFromJSON({
        type: 'paragraph',
        content: [
          { type: 'text', marks: [{ type: 'typeAheadQuery' }], text: ':smile' },
        ],
      });

      view.dispatch(
        view.state.tr.replaceWith(0, view.state.doc.nodeSize - 2, content),
      );

      const value = await editorActions.getValue();

      expect(value).toMatchInlineSnapshot(`
Object {
  "content": Array [
    Object {
      "content": Array [
        Object {
          "text": ":smile",
          "type": "text",
        },
      ],
      "type": "paragraph",
    },
  ],
  "type": "doc",
  "version": 1,
}
`);
    });
  });

  describe('getNodesByLocalIds()', () => {
    const { editorView, eventDispatcher } = createEditorFactory()({
      doc: doc(
        taskList({ localId: 'a56abded-2572-4cef-9734-f4fc99aabd87' })(
          taskItem({ localId: '0c71a160-36e8-455d-8ace-7f4e19e2eebb' })('1'),
          taskItem({ localId: 'de2b0dc1-f1f2-46a9-9ea5-4f3871751e13' })('2'),
        ),
      ),

      editorProps: {
        allowTasksAndDecisions: true,
      },
    });

    const editorAction = EditorActions.from(editorView, eventDispatcher);

    const item1 = {
      attrs: {
        localId: '0c71a160-36e8-455d-8ace-7f4e19e2eebb',
        state: 'TODO',
      },
      content: [{ text: '1', type: 'text' }],
      type: 'taskItem',
    };

    const item2 = {
      attrs: {
        localId: 'de2b0dc1-f1f2-46a9-9ea5-4f3871751e13',
        state: 'TODO',
      },
      content: [
        {
          text: '2',
          type: 'text',
        },
      ],
      type: 'taskItem',
    };

    it.each([
      ['query 1 item', '0c71a160-36e8-455d-8ace-7f4e19e2eebb', item1],
      ['query 2 items', 'de2b0dc1-f1f2-46a9-9ea5-4f3871751e13', item2],
      ['invalid id', 'invalid id', undefined],
    ])('%s', (_, id, expected) => {
      const result = editorAction.getNodeByLocalId(id);
      expect(result && result.toJSON()).toEqual(expected);
    });
  });

  describe('getNodesByFragmentLocalId()', () => {
    const { editorView, eventDispatcher } = createEditorFactory()({
      doc: doc(
        fragmentMark({ localId: 'fragment-local-id-1' })(
          table({ localId: 'table-local-id' })(tr(td()(p('11')))),
        ),
        fragmentMark({ localId: 'fragment-local-id-2' })(
          extension({
            localId: 'extension-local-id',
            extensionKey: 'key-1',
            extensionType: 'type-1',
          })(),
        ),
      ),

      editorProps: {
        allowFragmentMark: true,
        allowTables: true,
        allowExtension: true,
      },
    });

    const editorAction = EditorActions.from(editorView, eventDispatcher);

    const item1 = {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        __autoSize: false,
        localId: 'table-local-id',
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '11',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      marks: [
        {
          type: 'fragment',
          attrs: {
            localId: 'fragment-local-id-1',
            name: null,
          },
        },
      ],
    };

    const item2 = {
      type: 'extension',
      attrs: {
        extensionType: 'type-1',
        extensionKey: 'key-1',
        parameters: null,
        text: null,
        layout: 'default',
        localId: 'extension-local-id',
      },
      marks: [
        {
          type: 'fragment',
          attrs: {
            localId: 'fragment-local-id-2',
            name: null,
          },
        },
      ],
    };

    it.each([
      ['query 1 item', 'fragment-local-id-1', item1],
      ['query 2 items', 'fragment-local-id-2', item2],
      ['invalid id', 'invalid id', undefined],
    ])('%s', (_, id, expected) => {
      const result = editorAction.getNodeByFragmentLocalId(id);
      expect(result && result.toJSON()).toEqual(expected);
    });
  });

  describe('getSelectedNode', () => {
    const macroProvider: MacroProvider = {
      config: {},
      openMacroBrowser: () => {
        const attrs: MacroAttributes = {
          type: 'extension',
          attrs: {
            extensionKey: 'com.fake',
            extensionType: 'com.fake',
            layout: 'full-width',
          },
        };

        return Promise.resolve(attrs);
      },
      autoConvert: () => null,
    };
    it('resolves a node selection', () => {
      const { editorView, eventDispatcher } = createEditorFactory()({
        doc: doc(expand()(p('Line {<>} one'))),
        editorProps: {
          allowExpand: true,
        },
      });
      const editorAction = EditorActions.from(editorView, eventDispatcher);

      const node = editorAction.getSelectedNode() as Node;
      expect(node).toBeInstanceOf(Node);
      expect(node?.type?.name).toEqual('expand');
    });
    it('resolves a text selection to the parent node', () => {
      const { editorView, eventDispatcher } = createEditorFactory()({
        doc: doc(
          bodiedExtension({
            extensionKey: 'com.fake',
            extensionType: 'com.fake',
            layout: 'full-width',
          })(p('Line {<>} one')),
        ),
        editorProps: {
          allowExtension: true,
          macroProvider: Promise.resolve(macroProvider),
        },
      });
      const editorAction = EditorActions.from(editorView, eventDispatcher);

      const node = editorAction.getSelectedNode();
      expect(node).toBeInstanceOf(Node);
      expect(node?.type?.name).toEqual('bodiedExtension');
    });
    it('returns undefined for no selectable nodes', () => {
      const { editorView, eventDispatcher } = createEditorFactory()({
        doc: doc(p('123', '456')),
      });
      const editorAction = EditorActions.from(editorView, eventDispatcher);

      const node = editorAction.getSelectedNode();
      expect(node).toBeUndefined();
    });
  });
});
