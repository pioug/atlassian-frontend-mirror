import { mount } from 'enzyme';
import React from 'react';
import { EditorView } from 'prosemirror-view';
import { emoji as emojiData } from '@atlaskit/util-data-test';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { Transformer } from '@atlaskit/editor-common';
import { EditorActions } from '../../../index';
import Editor from '../../../editor';

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
          emojiProvider={emojiData.testData.getEmojiResourcePromise()}
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
});
