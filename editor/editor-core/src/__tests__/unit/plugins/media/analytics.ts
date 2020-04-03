import { ProviderFactory } from '@atlaskit/editor-common';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';

import {
  stateKey as mediaPluginKey,
  MediaProvider,
} from '../../../../plugins/media/pm-plugins/main';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import PickerFacade from '../../../../plugins/media/picker-facade';
import { MediaFile } from '@atlaskit/media-picker/types';
import {
  imagePreview,
  imageFile,
  getFreshMediaProvider,
  waitForAllPickersInitialised,
} from './_utils';
import { MediaPluginState } from '../../../../plugins/media/pm-plugins/types';

describe('Media Analytics', () => {
  const createEditor = createEditorFactory<MediaPluginState>();
  let mediaProvider: Promise<MediaProvider>;
  let providerFactory: ProviderFactory;
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  let pickers: PickerFacade[];

  const editor = (doc: any) => {
    const contextIdentifierProvider = storyContextIdentifierProviderFactory();
    mediaProvider = getFreshMediaProvider();
    providerFactory = ProviderFactory.create({
      mediaProvider,
      contextIdentifierProvider,
    });
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));

    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        media: {
          allowMediaSingle: true,
          customDropzoneContainer: document.body,
          provider: mediaProvider,
        },
        contextIdentifierProvider,
      },
      providerFactory,
      createAnalyticsEvent,
      pluginKey: mediaPluginKey,
    });
  };

  beforeEach(async () => {
    const { pluginState } = editor(doc(p('{<>}')));
    await waitForAllPickersInitialised(pluginState);
    pickers = pluginState.pickers;
  });

  afterEach(() => {
    providerFactory.destroy();
  });

  describe('insert media', () => {
    const insertMedia = (media: MediaFile, pickerType = 'popup') => {
      const picker = pickers.find(p => p.type === pickerType);
      if (picker) {
        (picker.mediaPicker as any).emit('upload-preview-update', {
          file: media,
          preview: imagePreview,
        });
      } else {
        throw Error(`No media picker found for ${pickerType}`);
      }
    };

    const mediaPickers = [{ picker: 'popup', inputMethod: 'cloudPicker' }];
    mediaPickers.forEach(mediaPicker => {
      it(`should fire analytics event when inserted via ${mediaPicker.picker}`, () => {
        insertMedia(imageFile, mediaPicker.picker);
        expect(createAnalyticsEvent).toBeCalledWith({
          action: 'inserted',
          actionSubject: 'document',
          actionSubjectId: 'media',
          attributes: expect.objectContaining({
            inputMethod: mediaPicker.inputMethod,
            fileExtension: 'jpg',
          }),
          eventType: 'track',
        });
      });
    });

    it('should use correct file extension in analytics event', () => {
      insertMedia(imageFile);
      expect(createAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: expect.objectContaining({
            fileExtension: 'jpg',
          }),
        }),
      );
      (createAnalyticsEvent as jest.Mock).mockClear();

      const imageFilePng: MediaFile = {
        ...imageFile,
        id: '2',
        type: 'image/png',
        name: 'bilby.png',
      };
      insertMedia(imageFilePng);
      expect(createAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: expect.objectContaining({
            fileExtension: 'png',
          }),
        }),
      );
    });

    it('should handle no file extension for inserted file in analytics event', () => {
      const imageNoExtension: MediaFile = {
        ...imageFile,
        id: '3',
        type: 'image/png',
        name: 'bettong',
      };
      insertMedia(imageNoExtension);
      expect(createAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: expect.objectContaining({
            fileExtension: undefined,
          }),
        }),
      );
    });
  });
});
