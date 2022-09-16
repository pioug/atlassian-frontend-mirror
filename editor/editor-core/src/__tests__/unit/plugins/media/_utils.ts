import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  getFreshMediaProvider,
  temporaryMediaGroup,
  temporaryMediaInline,
  testCollectionName,
  temporaryFileId,
  temporaryMediaAttrs,
  temporaryMedia,
} from '@atlaskit/editor-test-helpers/media-provider';
import { media, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';

import { stateKey as mediaPluginKey } from '../../../../plugins/media/pm-plugins/plugin-key';
import { EditorProps } from '../../../../types';
import { EditorView } from 'prosemirror-view';
import { insertMediaGroupNode } from '../../../../plugins/media/utils/media-files';
import { ImagePreview, MediaFile } from '@atlaskit/media-picker/types';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { MediaPluginState } from '../../../../plugins/media/pm-plugins/types';
export {
  getFreshMediaProvider,
  temporaryMediaGroup,
  temporaryMediaInline,
  temporaryMediaAttrs,
  testCollectionName,
  temporaryFileId,
  temporaryMedia,
};

export const temporaryMediaWithDimensions = (width = 256, height = 128) => {
  return media({
    ...temporaryMediaAttrs,
    width,
    height,
  })();
};

export const imageFile: MediaFile = {
  id: '1',
  type: 'image/jpeg',
  name: 'quokka.jpg',
  size: 100,
  creationDate: 1553664168293,
};

export const imagePreview: ImagePreview = {
  dimensions: {
    height: 100,
    width: 100,
  },
  scaleFactor: 2,
};

const createEditor = createEditorFactory<MediaPluginState>();
export const mediaEditor = (
  doc: DocBuilder,
  additionalProps: Partial<EditorProps> = {},
  uploadErrorHandler?: () => void,
) => {
  const contextIdentifierProvider = storyContextIdentifierProviderFactory();
  const mediaProvider = getFreshMediaProvider();

  const providerFactory = ProviderFactory.create({
    mediaProvider,
    contextIdentifierProvider,
  });

  return createEditor({
    doc,
    editorProps: {
      uploadErrorHandler,
      media: {
        provider: mediaProvider,
        allowMediaSingle: true,
      },
      contextIdentifierProvider,
      ...additionalProps,
    },
    providerFactory,
    pluginKey: mediaPluginKey,
  });
};

/**
 * Inserts a media group node via `insertMediaGroupNode` with the
 * testing collection name.
 *
 * @param view The EditorView under test.
 * @param id The initially inserted id and __key for the media node.
 */
export const insertMediaGroupItem = (view: EditorView, id: string) => {
  insertMediaGroupNode(view, [{ id }], testCollectionName);

  return media({
    id,
    type: 'file',
    collection: testCollectionName,
  })();
};
