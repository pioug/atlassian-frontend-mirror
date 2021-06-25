import { mount } from 'enzyme';
import React from 'react';
import { EditorView } from 'prosemirror-view';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { Transformer } from '@atlaskit/editor-common';
import { EditorActions } from '../../../index';
import Editor from '../../../editor';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';

import {
  doc,
  taskList,
  taskItem,
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

      const editorActions: EditorActions = (wrapper.instance() as any)
        .editorActions;

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
});
