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
  let useNativePlugin = false;

  // @ts-ignore
  const providerMock = { send: jest.fn() } as CollabEditProvider;

  beforeEach(() => {
    const { tr } = oldEditorState;
    tr.setMeta('collabInitialised', true);
    useNativePlugin = true;

    oldEditorState = oldEditorState.apply(tr);
    // @ts-ignore
    providerMock.send.mockClear();
  });

  describe('when the transaction is not coming from scaleTable', () => {
    it('should call the provider send function', () => {
      const transaction = oldEditorState.tr.insertText('123');
      const {
        state: newEditorState,
        transactions,
      } = oldEditorState.applyTransaction(transaction);

      sendTransaction({
        originalTransaction: transaction,
        transactions,
        oldEditorState,
        newEditorState,
        useNativePlugin,
      })(providerMock);

      expect(providerMock.send).toHaveBeenCalled();
    });
  });

  describe('when the transaction is coming from scaleTable', () => {
    it('should not call the provider send function', () => {
      const transaction = oldEditorState.tr
        .insertText('123')
        .setMeta('scaleTable', true);
      const {
        state: newEditorState,
        transactions,
      } = oldEditorState.applyTransaction(transaction);
      useNativePlugin = false;

      sendTransaction({
        originalTransaction: transaction,
        transactions,
        oldEditorState,
        newEditorState,
        useNativePlugin,
      })(providerMock);

      expect(providerMock.send).not.toHaveBeenCalled();
    });
  });

  describe('when the transaction has an appendedTransaction', () => {
    it('should send if the appendedTransaction changes the doc', () => {
      const transaction = oldEditorState.tr;
      const {
        state: newEditorState,
        transactions,
      } = oldEditorState.applyTransaction(transaction);

      transactions.push(oldEditorState.tr.insertText('123'));

      sendTransaction({
        originalTransaction: transaction,
        transactions,
        oldEditorState,
        newEditorState,
        useNativePlugin,
      })(providerMock);

      expect(providerMock.send).toHaveBeenCalled();
    });
  });

  describe('when the native collab plugin is enabled', () => {
    it('should always send the current state as the last parameter to the send function', () => {
      const transaction = oldEditorState.tr;
      transaction.insertText('LOL');
      const {
        state: newEditorState,
        transactions,
      } = oldEditorState.applyTransaction(transaction);

      sendTransaction({
        originalTransaction: transaction,
        transactions,
        oldEditorState,
        newEditorState,
        useNativePlugin: true,
      })(providerMock);

      expect(providerMock.send).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        newEditorState,
      );
    });

    describe('and when the transaction is not changing the document', () => {
      it('should call the send function', () => {
        const transaction = oldEditorState.tr;
        const {
          state: newEditorState,
          transactions,
        } = oldEditorState.applyTransaction(transaction);

        sendTransaction({
          originalTransaction: transaction,
          transactions,
          oldEditorState,
          newEditorState,
          useNativePlugin: true,
        })(providerMock);

        expect(providerMock.send).toHaveBeenCalled();
      });
    });

    describe('and when isRemote is part of the transaction metadata', () => {
      it('should call the send function', () => {
        const transaction = oldEditorState.tr;
        transaction.setMeta('isRemote', true);
        const {
          state: newEditorState,
          transactions,
        } = oldEditorState.applyTransaction(transaction);

        sendTransaction({
          originalTransaction: transaction,
          transactions,
          oldEditorState,
          newEditorState,
          useNativePlugin: true,
        })(providerMock);

        expect(providerMock.send).toHaveBeenCalled();
      });
    });
  });
});
