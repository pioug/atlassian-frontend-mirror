import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import collabEditPlugin from '../../';

import { EditorState } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { PMPlugin, PMPluginFactoryParams } from '../../../../types/pm-plugin';

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

  describe('when onEditorViewStateUpdated is called', () => {
    it('should call collab send function', (done) => {
      const editorPlugin = collabEditPlugin({});
      const collabFactoryPlugin: PMPlugin = editorPlugin.pmPlugins!()[0];
      const props: PMPluginFactoryParams = {
        dispatch,
        providerFactory,
      } as any;

      const pmPlugin = collabFactoryPlugin.plugin(props);

      const oldEditorState = EditorState.create({
        schema,
        plugins: [pmPlugin!],
      });

      const transaction = oldEditorState.tr
        .insertText('123')
        .setMeta('collabInitialised', true);
      const newEditorState = oldEditorState.apply(transaction);

      sendMock.mockReset();

      editorPlugin.onEditorViewStateUpdated!({
        originalTransaction: transaction,
        transactions: [transaction],
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
