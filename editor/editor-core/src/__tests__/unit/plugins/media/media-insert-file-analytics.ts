import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import randomId from '@atlaskit/editor-test-helpers/random-id';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { stateKey as mediaPluginKey } from '../../../../plugins/media/pm-plugins/plugin-key';
import type { MediaPluginState } from '../../../../plugins/media/pm-plugins/types';

const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

const getFreshMediaProvider = () =>
  storyMediaProviderFactory({
    collectionName: testCollectionName,
    includeUploadMediaClientConfig: true,
  });

describe('Media plugin analytics', () => {
  const createEditor = createEditorFactory<MediaPluginState>();
  const mediaProvider = getFreshMediaProvider();
  const providerFactory = ProviderFactory.create({ mediaProvider });

  const editor = (doc: DocBuilder, editorProps = {}) =>
    createEditor({
      doc,
      editorProps: {
        ...editorProps,
        media: {
          provider: mediaProvider,
        },
        allowAnalyticsGASV3: true,
      },
      providerFactory,
      pluginKey: mediaPluginKey,
    });

  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  afterAll(() => {
    providerFactory.destroy();
  });

  describe('updateUploadState', () => {
    it('should attach analytics while inserting a file', async () => {
      const { pluginState, editorAPI } = editor(doc(p('')));
      const attachAnalyticsEventSpy = jest.spyOn(
        (editorAPI as any)?.analytics?.actions,
        'attachAnalyticsEvent',
      );
      await mediaProvider;

      pluginState.insertFile(
        {
          id: 'foo',
          fileMimeType: 'image/jpeg',
        },
        () => {},
      );
      jest.runOnlyPendingTimers();
      expect(pluginState.allUploadsFinished).toBe(false);
      expect(attachAnalyticsEventSpy).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'media',
        attributes: {
          fileExtension: 'image/jpeg',
          inputMethod: undefined,
          type: 'mediaGroup',
        },
        eventType: 'track',
      });
    });
  });
});
