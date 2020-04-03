import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import collabEditPlugin from '../../';

import { EditorState } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';

describe('collab-edit: index.ts', () => {
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
  const sendMock = jest.fn();
  const providerFactory = ProviderFactory.create({
    collabEditProvider: Promise.resolve({
      on() {
        return this;
      },
      initialize() {},
      unsubscribeAll() {},
      send: sendMock,
    }) as any,
  });
  const dispatch = jest.fn();

  describe('when sendDataOnViewUpdated is true', () => {
    describe('when onEditorViewStateUpdated is called', () => {
      it('should call collab send function', done => {
        const plugin = collabEditPlugin({
          sendDataOnViewUpdated: true,
        });
        // @ts-ignore
        const pmPlugin = plugin.pmPlugins!()[0].plugin({
          dispatch,
          providerFactory,
        });

        const oldEditorState = EditorState.create({
          schema,
          plugins: [pmPlugin!],
        });

        const transaction = oldEditorState.tr
          .insertText('123')
          .setMeta('collabInitialised', true);
        const newEditorState = oldEditorState.apply(transaction);

        sendMock.mockReset();

        plugin.onEditorViewStateUpdated!({
          transaction,
          newEditorState,
          oldEditorState,
        });

        process.nextTick(() => {
          expect(sendMock).toHaveBeenCalledTimes(1);
          done();
        });
      });
    });
  });
});
