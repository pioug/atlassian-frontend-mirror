import { EditorView } from 'prosemirror-view';
import {
  createEditorFactory,
  Options as CreateEditorOptions,
} from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  mediaSingle,
  media,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { nextTick } from '@atlaskit/media-test-helpers';

import { getFreshMediaProvider } from '../media/_utils';
import { pluginKey as mediaEditorPluginKey } from '../../../../plugins/media/pm-plugins/media-editor-plugin-factory';

import { MediaEditorState } from '../../../../plugins/media/types';
import {
  openMediaEditor,
  closeMediaEditor,
  uploadAnnotation,
} from '../../../../plugins/media/commands/media-editor';
import { ProviderFactory } from '@atlaskit/editor-common';
import { getPluginState } from '../../../../plugins/media/pm-plugins/media-editor-plugin-factory';

describe('media editor', () => {
  const createEditor = createEditorFactory<MediaEditorState>();

  const mediaProvider = getFreshMediaProvider();

  const editor = (
    doc: DocBuilder,
    createEditorOptions?: CreateEditorOptions,
  ) => {
    return createEditor({
      ...createEditorOptions,
      doc,
      editorProps: {
        media: {
          allowAnnotation: true,
          allowMediaSingle: true,
          provider: mediaProvider,
        },
      },
      pluginKey: mediaEditorPluginKey,
    });
  };

  let view: EditorView;
  const defaultDoc = doc(
    p('{<>}hello'),
    mediaSingle({
      layout: 'align-start',
    })(
      media({
        id: 'abc',
        type: 'file',
        collection: 'xyz',
      })(),
    ),
  );

  describe('actions', () => {
    beforeEach(() => {
      const { editorView } = editor(defaultDoc);
      view = editorView;
    });

    it('can open the media editor', () => {
      openMediaEditor(8, {
        id: 'abc',
        mediaItemType: 'file',
        collectionName: 'xyz',
      })(view.state, view.dispatch);

      expect(getPluginState(view.state).editor).toEqual({
        pos: 8,
        identifier: {
          id: 'abc',
          mediaItemType: 'file',
          collectionName: 'xyz',
        },
      });
    });

    it('can close the media editor after opening', () => {
      openMediaEditor(8, {
        id: 'abc',
        mediaItemType: 'file',
        collectionName: 'xyz',
      })(view.state, view.dispatch);

      closeMediaEditor()(view.state, view.dispatch);

      expect(getPluginState(view.state).editor).toBeUndefined();
    });

    it('replaces the currently editing media in the document', () => {
      openMediaEditor(8, {
        id: 'abc',
        mediaItemType: 'file',
        collectionName: 'xyz',
      })(view.state, view.dispatch);

      uploadAnnotation(
        {
          id: 'newId',
          mediaItemType: 'file',
          collectionName: 'newCollection',
        },
        {
          width: 1024,
          height: 2048,
        },
      )(view.state, view.dispatch);

      expect(view.state.doc).toEqualDocument(
        doc(
          p('hello'),
          mediaSingle({
            layout: 'align-start',
          })(
            media({
              id: 'newId',
              collection: 'newCollection',
              type: 'file',

              width: 1024,
              height: 2048,
            })(),
          ),
        ),
      );
    });
  });

  describe('doc', () => {
    beforeEach(() => {
      const { editorView } = editor(defaultDoc);
      view = editorView;
    });

    it('remaps the active editing position on doc changes', () => {
      openMediaEditor(8, {
        id: 'abc',
        mediaItemType: 'file',
        collectionName: 'xyz',
      })(view.state, view.dispatch);

      insertText(view, 'inserted text ');

      expect(getPluginState(view.state)).toEqual({
        editor: {
          pos: 22,
          identifier: {
            id: 'abc',
            mediaItemType: 'file',
            collectionName: 'xyz',
          },
        },
      });
    });
  });

  describe('view', () => {
    it('sets the mediaClientConfig from the media provider', async () => {
      const providerFactory = new ProviderFactory();
      const { editorView } = editor(defaultDoc, {
        providerFactory,
      });

      expect(getPluginState(editorView.state)).toEqual({});

      providerFactory.setProvider('mediaProvider', mediaProvider);

      const resolvedProvider = await mediaProvider;
      const resolvedMediaClientConfig = resolvedProvider.viewMediaClientConfig;

      await nextTick();

      expect(getPluginState(editorView.state)).toEqual({
        mediaClientConfig: resolvedMediaClientConfig,
      });
    });
  });
});
