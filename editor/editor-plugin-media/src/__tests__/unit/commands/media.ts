import type { MediaAttributes } from '@atlaskit/adf-schema';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  media,
  mediaSingle,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { testMediaSingle } from '@atlaskit/editor-test-helpers/media-mock';

import {
  updateAllMediaSingleNodesAttrs,
  updateMediaSingleNodeAttrs,
} from '../../../commands/helpers';
import { stateKey as mediaPluginKey } from '../../../pm-plugins/main';
import type { MediaPluginState } from '../../../pm-plugins/types';
import { getFreshMediaProvider, testCollectionName } from '../_utils';

describe('Media plugin commands', () => {
  const createEditor = createEditorFactory<MediaPluginState>();
  const contextIdentifierProvider = storyContextIdentifierProviderFactory();
  const mediaProvider = getFreshMediaProvider();
  const providerFactory = ProviderFactory.create({
    mediaProvider,
    contextIdentifierProvider,
  });

  const mediaPluginOptions = (dropzoneContainer: HTMLElement) => ({
    provider: mediaProvider,
    allowMediaSingle: true,
    customDropzoneContainer: dropzoneContainer,
  });

  const editor = (
    doc: DocBuilder,
    editorProps = {},
    dropzoneContainer: HTMLElement = document.body,
  ) => {
    return createEditor({
      doc,
      editorProps: {
        ...editorProps,
        media: mediaPluginOptions(dropzoneContainer),
        contextIdentifierProvider,
        allowAnalyticsGASV3: true,
      },
      providerFactory,
      pluginKey: mediaPluginKey,
    });
  };

  describe('Update Media Node Attributes', () => {
    const createMediaNode = (attrs: Partial<MediaAttributes>) =>
      media({
        id: testMediaSingle.id,
        type: 'file',
        collection: testCollectionName,
        __fileName: 'foo.jpg',
        __fileSize: 100,
        __fileMimeType: 'image/jpeg',
        ...attrs,
      })();
    const originalDimensions = {
      height: 100,
      width: 100,
    };

    const newDimensions = {
      height: 200,
      width: 200,
    };
    it('should update media attributes for media single', () => {
      const { editorView } = editor(
        doc(
          mediaSingle({
            layout: 'center',
          })(createMediaNode(originalDimensions)),
        ),
      );

      updateMediaSingleNodeAttrs(testMediaSingle.id, newDimensions)(
        editorView.state,
        editorView.dispatch,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          mediaSingle({
            layout: 'center',
          })(createMediaNode(newDimensions)),
        ),
      );
    });

    it('should update media attributes for all media single nodes in the document with the same id', () => {
      const { editorView } = editor(
        doc(
          mediaSingle({
            layout: 'center',
          })(createMediaNode(originalDimensions)),
          mediaSingle({
            layout: 'center',
          })(createMediaNode(originalDimensions)),
          mediaSingle({
            layout: 'center',
          })(createMediaNode(originalDimensions)),
        ),
      );

      updateAllMediaSingleNodesAttrs(testMediaSingle.id, {
        height: 200,
        width: 200,
      })(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          mediaSingle({
            layout: 'center',
          })(createMediaNode(newDimensions)),
          mediaSingle({
            layout: 'center',
          })(createMediaNode(newDimensions)),
          mediaSingle({
            layout: 'center',
          })(createMediaNode(newDimensions)),
        ),
      );
    });
  });
});
