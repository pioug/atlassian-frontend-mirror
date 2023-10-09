// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { MediaAttributes } from '@atlaskit/adf-schema/schema';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { media } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  getFreshMediaProvider,
  temporaryFileId,
  temporaryMedia,
  temporaryMediaAttrs,
  temporaryMediaGroup,
  temporaryMediaInline,
  testCollectionName,
} from '@atlaskit/editor-test-helpers/media-provider';

import { stateKey as mediaPluginKey } from '../../pm-plugins/plugin-key';
import type { MediaPluginState } from '../../pm-plugins/types';
import { insertMediaGroupNode } from '../../utils/media-files';

export {
  getFreshMediaProvider,
  temporaryMediaGroup,
  temporaryMediaInline,
  temporaryMediaAttrs,
  testCollectionName,
  temporaryFileId,
  temporaryMedia,
};

export const temporaryMediaWithDimensions = (
  width = 256,
  height = 128,
  customAttrs?: Partial<MediaAttributes>,
) => {
  return media({
    ...temporaryMediaAttrs,
    ...customAttrs,
    width,
    height,
  })();
};

export const temporaryMediaWithoutDimensions = () => {
  return media({
    ...temporaryMediaAttrs,
  })();
};

const createEditor = createEditorFactory<MediaPluginState>();
type EditorProps = Parameters<typeof createEditor>[0]['editorProps'];

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
export const insertMediaGroupItem = (
  view: EditorView,
  id: string,
  editorAnalyticsAPI: EditorAnalyticsAPI,
) => {
  insertMediaGroupNode(editorAnalyticsAPI)(view, [{ id }], testCollectionName);

  return media({
    id,
    type: 'file',
    collection: testCollectionName,
  })();
};
