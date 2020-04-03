import { CollabEditProvider } from '@atlaskit/editor-common';
import { sendTransaction } from '../../../events/send-transaction';
import collabEditPlugin from '../../../';

import { EditorState } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';

describe('collab-edit: send-transaction.ts', () => {
  const schema = new Schema({
    nodes: {
      doc: {
        content: 'block*',
      },

      text: {
        group: 'inline',
      },

      paragraph: {
        content: 'inline*',
        group: 'block',
      },
    },
  });
  const plugin = collabEditPlugin({});
  // @ts-ignore
  const pmPlugin = plugin.pmPlugins!()[0].plugin({
    dispatch: jest.fn(),
  });
  let oldEditorState = EditorState.create({
    schema,
    plugins: [pmPlugin!],
  });

  // @ts-ignore
  const providerMock = { send: jest.fn() } as CollabEditProvider;

  beforeEach(() => {
    const { tr } = oldEditorState;
    tr.setMeta('collabInitialised', true);

    oldEditorState = oldEditorState.apply(tr);
    // @ts-ignore
    providerMock.send.mockClear();
  });

  describe('when the transaction is not coming from scaleTable', () => {
    it('should call the provider send function', () => {
      const transaction = oldEditorState.tr.insertText('123');
      const newEditorState = oldEditorState.apply(transaction);

      sendTransaction({
        transaction,
        oldEditorState,
        newEditorState,
      })(providerMock);

      expect(providerMock.send).toHaveBeenCalled();
    });
  });

  describe('when the transaction is coming from scaleTable', () => {
    it('should not call the provider send function', () => {
      const transaction = oldEditorState.tr
        .insertText('123')
        .setMeta('scaleTable', true);
      const newEditorState = oldEditorState.apply(transaction);
      sendTransaction({
        transaction,
        oldEditorState,
        newEditorState,
      })(providerMock);

      expect(providerMock.send).not.toHaveBeenCalled();
    });
  });
});
