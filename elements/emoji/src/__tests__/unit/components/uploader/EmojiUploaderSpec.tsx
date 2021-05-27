import React from 'react';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { MockEmojiResource } from '@atlaskit/util-data-test/mock-emoji-resource';

import { AnalyticsListener } from '@atlaskit/analytics-next';

import * as ImageUtil from '../../../../util/image';

import * as helper from '../picker/_emoji-picker-test-helpers';

import {
  getEmojiResourcePromise,
  createPngFile,
  pngDataURL,
  pngFileUploadData,
} from '../../_test-data';

import FileChooser from '../../../../components/common/FileChooser';
import AkFieldBase from '@atlaskit/field-base';

import Emoji from '../../../../components/common/Emoji';
import EmojiUploader, {
  Props,
} from '../../../../components/uploader/EmojiUploader';
import EmojiUploadComponent from '../../../../components/uploader/EmojiUploadComponent';
import EmojiUploadPreview from '../../../../components/common/EmojiUploadPreview';

import { ReactWrapper } from 'enzyme';
import {
  selectedFileEvent,
  uploadCancelButton,
  uploadConfirmButton,
  uploadFailedEvent,
  uploadSucceededEvent,
} from '../../../../util/analytics';
import { messages } from '../../../../components/i18n';

const sampleEmoji = {
  name: 'Sample',
  shortName: ':sample:',
  width: 30,
  height: 30,
};

export function setupUploader(
  props?: Props,
  onEvent?: () => void,
): Promise<ReactWrapper<any, any>> {
  const uploaderProps: Props = {
    ...props,
  } as Props;

  if (!props || !props.emojiProvider) {
    uploaderProps.emojiProvider = getEmojiResourcePromise();
  }

  const uploader = onEvent
    ? mountWithIntl(
        <AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
          <EmojiUploader {...uploaderProps} />
        </AnalyticsListener>,
      )
    : mountWithIntl(<EmojiUploader {...uploaderProps} />);

  return waitUntil(() => {
    uploader.update();
    return uploader.find(EmojiUploadComponent).length > 0;
  }).then(() => uploader);
}

describe('<EmojiUploader />', () => {
  const uploadPreviewShown = (component: ReactWrapper) => {
    const uploadPreview = helper.findUploadPreview(component);
    expect(uploadPreview).toHaveLength(1);
    const uploadPreviewEmoji = uploadPreview.find(Emoji);
    expect(uploadPreviewEmoji).toHaveLength(2);
    let emoji = uploadPreviewEmoji.at(0).prop('emoji');
    expect(emoji.shortName).toEqual(sampleEmoji.shortName);
    expect((emoji.representation as any).imagePath).toEqual(pngDataURL);
  };

  const typeEmojiName = async (component: ReactWrapper) => {
    await waitUntil(
      () => component.update() && component.find(AkFieldBase).length > 0,
    );
    const nameInput = component.find(AkFieldBase).find('input');
    nameInput.simulate('focus');
    nameInput.simulate('change', {
      target: {
        value: sampleEmoji.shortName,
      },
    });
  };

  describe('display', () => {
    it('should display disabled emoji file chooser initially', async () => {
      const uploader = await setupUploader();
      const fileChooser = uploader.update().find(FileChooser);
      expect(fileChooser).toHaveLength(1);
      expect(fileChooser.get(0).props.isDisabled).toBe(true);
    });

    it('should show text input', async () => {
      const uploader = await setupUploader();
      const input = uploader.update().find(AkFieldBase);
      expect(input).toHaveLength(1);
    });

    it('should have emoji upload component', async () => {
      const uploader = await setupUploader();
      const component = uploader.update().find(EmojiUploadComponent);
      expect(component).toHaveLength(1);
    });
  });

  describe('upload', () => {
    let onEvent: () => void;
    let emojiProvider: Promise<any>;
    let component: ReactWrapper;

    beforeEach(async () => {
      jest
        .spyOn(ImageUtil, 'parseImage')
        .mockImplementation(() => Promise.resolve(new Image()));

      jest
        .spyOn(ImageUtil, 'hasFileExceededSize')
        .mockImplementation(() => false);

      jest.spyOn(ImageUtil, 'getNaturalImageSize').mockImplementation(() =>
        Promise.resolve({
          width: 30,
          height: 30,
        }),
      );

      onEvent = jest.fn();
      emojiProvider = getEmojiResourcePromise({
        uploadSupported: true,
      });
      component = await setupUploader(
        {
          emojiProvider,
        },
        onEvent,
      );
    });

    it('Main upload flow', async () => {
      const provider = await emojiProvider;

      await typeEmojiName(component);

      helper.chooseFile(component, createPngFile());
      await waitUntil(() => helper.addEmojiButtonVisible(component));

      uploadPreviewShown(component);

      const addEmojiButton = helper.findAddEmojiButton(component);
      addEmojiButton.simulate('click');

      await waitUntil(() => provider.getUploads().length > 0);
      // Check uploaded emoji
      const uploads = provider.getUploads();
      expect(uploads).toHaveLength(1);
      const upload = uploads[0];
      expect(upload.upload).toEqual({
        ...sampleEmoji,
        ...pngFileUploadData,
      });
      expect(onEvent).toHaveBeenCalledTimes(3);

      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: selectedFileEvent(),
        }),
        'fabric-elements',
      );
      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: uploadConfirmButton({ retry: false }),
        }),
        'fabric-elements',
      );
      expect(onEvent).toHaveBeenLastCalledWith(
        expect.objectContaining({
          payload: uploadSucceededEvent({
            duration: expect.any(Number),
          }),
        }),
        'fabric-elements',
      );
      // Check display reset correctly
      await waitUntil(() => component.update().find(FileChooser).length > 0);
    });

    it('Upload failure with invalid file', async () => {
      jest
        .spyOn(ImageUtil, 'parseImage')
        .mockImplementation(() => Promise.reject(new Error('file error')));

      await emojiProvider;
      typeEmojiName(component);

      helper.chooseFile(component, createPngFile());

      await waitUntil(() => helper.errorMessageVisible(component));

      helper.tooltipErrorMessageMatches(component, messages.emojiInvalidImage);
    });

    it('should show error if file too big', async () => {
      jest
        .spyOn(ImageUtil, 'hasFileExceededSize')
        .mockImplementation(() => true);

      await emojiProvider;
      typeEmojiName(component);

      helper.chooseFile(component, createPngFile());
      expect(component.find(FileChooser)).toHaveLength(1);

      await waitUntil(() => helper.errorMessageVisible(component));

      helper.tooltipErrorMessageMatches(component, messages.emojiImageTooBig);
    });

    it('should go back when cancel clicked', async () => {
      typeEmojiName(component);

      helper.chooseFile(component, createPngFile());
      await waitUntil(() => helper.addEmojiButtonVisible(component));

      uploadPreviewShown(component);

      const cancelLink = helper.findCancelLink(component);
      cancelLink.simulate('click');
      // Should be back to initial screen
      await waitUntil(() => component.update().find(FileChooser).length > 0);
      expect(component.find(FileChooser)).toHaveLength(1);

      expect(onEvent).toHaveBeenCalledTimes(2);

      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: selectedFileEvent(),
        }),
        'fabric-elements',
      );
      expect(onEvent).toHaveBeenLastCalledWith(
        expect.objectContaining({
          payload: uploadCancelButton(),
        }),
        'fabric-elements',
      );
    });

    it('retry on upload error', async () => {
      // Silence error being internally logged by `uploadEmoji` on failure
      // eslint-disable-next-line no-console
      console.error = jest.fn();
      const spy = jest
        .spyOn(MockEmojiResource.prototype, 'uploadCustomEmoji')
        .mockImplementation(() => Promise.reject(new Error('upload error')));

      const provider = await emojiProvider;
      typeEmojiName(component);

      helper.chooseFile(component, createPngFile());
      await waitUntil(() => helper.addEmojiButtonVisible(component));

      // Try adding
      const addEmojiButton = helper.findAddEmojiButton(component);
      addEmojiButton.simulate('click');

      // Check for error message
      await waitUntil(() => helper.errorMessageVisible(component));
      helper.tooltipErrorMessageMatches(component, messages.emojiUploadFailed);

      const retryButton = component
        .find(EmojiUploadPreview)
        .find('button')
        .at(0);

      expect(retryButton.text()).toEqual(messages.retryLabel.defaultMessage);
      expect(spy).toHaveBeenCalledTimes(1);

      // Reset mocking to make upload successful
      spy.mockRestore();

      // Successfully upload this time
      retryButton.simulate('click');
      await waitUntil(() => provider.getUploads().length > 0);

      expect(onEvent).toHaveBeenCalledTimes(5);

      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: selectedFileEvent(),
        }),
        'fabric-elements',
      );
      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: uploadConfirmButton({ retry: false }),
        }),
        'fabric-elements',
      );
      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: uploadFailedEvent({
            duration: expect.any(Number),
            reason: 'Upload failed',
          }),
        }),
        'fabric-elements',
      );
      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: uploadConfirmButton({ retry: true }),
        }),
        'fabric-elements',
      );
      expect(onEvent).toHaveBeenLastCalledWith(
        expect.objectContaining({
          payload: uploadSucceededEvent({
            duration: expect.any(Number),
          }),
        }),
        'fabric-elements',
      );
    });
  });
});
