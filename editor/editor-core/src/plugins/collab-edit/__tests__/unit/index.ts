import type { Plugin } from '@atlaskit/editor-prosemirror/state';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import collabEditPlugin from '../../';

import { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Schema } from '@atlaskit/editor-prosemirror/model';
import type {
  PMPlugin,
  PMPluginFactoryParams,
} from '../../../../types/pm-plugin';
import { EditorView } from '@atlaskit/editor-prosemirror/view';

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
        toDOM: () => ['p', 0],
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
      const editorPlugin = collabEditPlugin({ config: {} });
      const collabFactoryPlugin: PMPlugin = editorPlugin.pmPlugins!()[0];
      const props: PMPluginFactoryParams = {
        dispatch,
        providerFactory,
      } as any;

      const pmPlugin = collabFactoryPlugin.plugin(props);

      const oldEditorState = EditorState.create({
        schema,
        plugins: [pmPlugin! as Plugin],
      });
      const editorView = new EditorView(document.createElement('div'), {
        state: oldEditorState,
      });

      const transaction = oldEditorState.tr
        .insertText('123')
        .setMeta('collabInitialised', true);
      const newEditorState = editorView.state.apply(transaction);
      editorView.updateState(newEditorState);

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
