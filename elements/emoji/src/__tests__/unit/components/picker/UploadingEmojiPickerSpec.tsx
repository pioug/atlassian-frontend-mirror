import { waitUntil } from '@atlaskit/elements-test-helpers';
import { MockEmojiResource } from '@atlaskit/util-data-test/mock-emoji-resource';
import { FormattedMessage } from 'react-intl';
import EmojiRepository from '../../../../api/EmojiRepository';
import Emoji from '../../../../components/common/Emoji';
import EmojiDeletePreview from '../../../../components/common/EmojiDeletePreview';
import EmojiErrorMessage from '../../../../components/common/EmojiErrorMessage';
import EmojiUploadPreview from '../../../../components/common/EmojiUploadPreview';
import { deleteButton as deleteButtonStyles } from '../../../../components/common/styles';
import { messages } from '../../../../components/i18n';
import EmojiPickerCategoryHeading from '../../../../components/picker/EmojiPickerCategoryHeading';
import EmojiPickerList from '../../../../components/picker/EmojiPickerList';
import {
  customCategory,
  customTitle,
  userCustomTitle,
} from '../../../../util/constants';
import { EmojiDescription } from '../../../../types';
import * as ImageUtil from '../../../../util/image';
import {
  createPngFile,
  getEmojiResourcePromise,
  getEmojiResourcePromiseFromRepository,
  getNonUploadingEmojiResourcePromise,
  mediaEmoji,
  pngDataURL,
  pngFileUploadData,
  siteEmojiFoo,
} from '../../_test-data';
import * as commonHelper from '../common/_common-test-helpers';
import * as helper from './_emoji-picker-test-helpers';
import { ReactWrapper } from 'enzyme';
import {
  deleteBeginEvent,
  deleteCancelEvent,
  deleteConfirmEvent,
  selectedFileEvent,
  uploadBeginButton,
  uploadCancelButton,
  uploadConfirmButton,
  uploadFailedEvent,
  uploadSucceededEvent,
} from '../../../../util/analytics';

describe('<UploadingEmojiPicker />', () => {
  let onEvent: jest.SpyInstance;

  const safeFindCustomEmojiButton = async (component: ReactWrapper) => {
    await waitUntil(() => commonHelper.customEmojiButtonVisible(component));
    return commonHelper.findCustomEmojiButton(component);
  };

  const uploadPreviewShown = (component: ReactWrapper) => {
    const uploadPreview = helper.findUploadPreview(component);
    expect(uploadPreview).toHaveLength(1);

    const uploadPreviewEmoji = uploadPreview.find(Emoji);
    // Should show two emoji in EmojiUploadPrevew
    expect(uploadPreviewEmoji).toHaveLength(2);
    const emoji: EmojiDescription = uploadPreviewEmoji.at(0).prop('emoji');
    expect(emoji.shortName).toEqual(':cheese_burger:');
    expect((emoji.representation as any).imagePath).toEqual(pngDataURL);
  };

  const typeEmojiName = (component: ReactWrapper) => {
    const nameInput = helper.findEmojiNameInput(component);
    nameInput.simulate('focus');
    nameInput.simulate('change', {
      target: {
        value: ':cheese burger:',
      },
    });
    expect(helper.findEmojiNameInput(component).prop('value')).toEqual(
      'cheese_burger',
    );
  };

  beforeEach(async () => {
    onEvent = jest.fn();
  });

  describe('upload', () => {
    let consoleError: jest.SpyInstance;
    let emojiProvider: Promise<any>;

    beforeEach(() => {
      consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

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

      emojiProvider = getEmojiResourcePromise({
        uploadSupported: true,
      });
    });

    afterEach(() => {
      consoleError.mockRestore();
    });

    const navigateToUploadPreview = async (
      providerPromise: Promise<any>,
      onEvent: any,
    ) => {
      const component = await helper.setupPicker(
        {
          emojiProvider: providerPromise,
          hideToneSelector: true,
        },
        undefined,
        onEvent,
      );

      await providerPromise;
      await helper.showCategory(customCategory, component, customTitle);
      await waitUntil(() => commonHelper.previewVisible(component));

      // save emoji initially shown in preview
      let preview = commonHelper.findPreview(component);
      expect(preview).toHaveLength(1);

      // click add
      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );
      const addEmoji = await safeFindCustomEmojiButton(component);
      addEmoji.simulate('click');
      await waitUntil(() => helper.emojiNameInputVisible(component));

      // type name
      typeEmojiName(component);

      // choose file
      helper.chooseFile(component, createPngFile());
      await waitUntil(() => helper.addEmojiButtonVisible(component));

      // upload preview shown
      uploadPreviewShown(component);

      return component;
    };

    it('Non-uploading EmojiResource - no upload UI', async () => {
      const emojiProvider = getNonUploadingEmojiResourcePromise();
      const component = await helper.setupPicker({ emojiProvider });

      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );

      const addEmoji = commonHelper.findCustomEmojiButton(component);
      expect(addEmoji).toHaveLength(0);
    });

    it('UploadingEmojiResource - "without media token" - no upload UI', async () => {
      const component = await helper.setupPicker();
      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );
      const addEmoji = commonHelper.findCustomEmojiButton(component);
      expect(addEmoji).toHaveLength(0);
    });

    it('UploadingEmojiResource - "with media token" - upload UI', async () => {
      const component = await helper.setupPicker({ emojiProvider });
      await helper.showCategory(customCategory, component, customTitle);
      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );

      const addEmoji = await safeFindCustomEmojiButton(component);
      expect(addEmoji.length).toEqual(1);
    });

    it('Upload main flow interaction', async () => {
      onEvent = jest.fn();
      const component = await helper.setupPicker(
        {
          emojiProvider,
          hideToneSelector: true,
        },
        undefined,
        onEvent,
      );
      const provider = await emojiProvider;
      await helper.showCategory(customCategory, component, customTitle);

      // click add
      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );
      const addEmoji = await safeFindCustomEmojiButton(component);
      addEmoji.simulate('click');
      await waitUntil(() => helper.emojiNameInputVisible(component));

      // type name
      typeEmojiName(component);

      // choose file
      helper.chooseFile(component, createPngFile());
      await waitUntil(() => helper.addEmojiButtonVisible(component));

      // upload preview shown
      uploadPreviewShown(component);

      // add emoji
      const addEmojiButton = helper.findAddEmojiButton(component);
      addEmojiButton.simulate('click');

      // wait for upload
      await waitUntil(() => provider.getUploads().length > 0);

      // upload called on provider
      const uploads = provider.getUploads();
      expect(uploads).toHaveLength(1);
      const upload = uploads[0];
      expect(upload.upload).toEqual({
        name: 'Cheese burger',
        shortName: ':cheese_burger:',
        ...pngFileUploadData,
        width: 30,
        height: 30,
      });
      await waitUntil(() =>
        helper.emojiWithIdVisible(component, upload.emoji.id),
      );

      // new emoji in view
      const newEmojiDescription = provider.getUploads()[0].emoji;
      const emoji = helper.findEmojiWithId(component, newEmojiDescription.id);
      expect(emoji).toHaveLength(1);

      let { name, shortName, fallback } = emoji.prop('emoji');
      expect(name).toEqual('Cheese burger');
      expect(shortName).toEqual(':cheese_burger:');
      expect(fallback).toEqual(':cheese_burger:');

      await waitUntil(() => commonHelper.previewVisible(component));

      // preview is back with new emoji shown by default
      const preview = commonHelper.findPreview(component);
      expect(preview).toHaveLength(1);

      // "add custom emoji" button should appear
      await safeFindCustomEmojiButton(component);

      expect(onEvent).toHaveBeenCalled();

      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: uploadBeginButton(),
        }),
        'fabric-elements',
      );
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
    });

    it('Upload failure with invalid file', async () => {
      jest
        .spyOn(ImageUtil, 'parseImage')
        .mockImplementation(() => Promise.reject(new Error('file error')));

      const component = await helper.setupPicker({
        emojiProvider,
        hideToneSelector: true,
      });
      await emojiProvider;
      await helper.showCategory(customCategory, component, customTitle);

      // click add
      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );
      const addEmoji = await safeFindCustomEmojiButton(component);
      addEmoji.simulate('click');
      await waitUntil(() => helper.emojiNameInputVisible(component));

      typeEmojiName(component);

      helper.chooseFile(component, createPngFile());
      expect(component.find('FileChooser')).toHaveLength(1);

      await waitUntil(() => helper.errorMessageVisible(component));

      expect(
        component.find(EmojiErrorMessage).find(FormattedMessage).props(),
      ).toMatchObject(messages.emojiInvalidImage);
    });

    it('Upload failure with file too big', async () => {
      jest
        .spyOn(ImageUtil, 'hasFileExceededSize')
        .mockImplementation(() => true);

      const component = await helper.setupPicker({
        emojiProvider,
        hideToneSelector: true,
      });
      await emojiProvider;
      await helper.showCategory(customCategory, component, customTitle);

      // click add
      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );
      const addEmoji = await safeFindCustomEmojiButton(component);
      addEmoji.simulate('click');
      await waitUntil(() => helper.emojiNameInputVisible(component));

      // type name
      typeEmojiName(component);

      helper.chooseFile(component, createPngFile());
      expect(component.find('FileChooser')).toHaveLength(1);

      await waitUntil(() => helper.errorMessageVisible(component));

      expect(
        component.find(EmojiErrorMessage).find(FormattedMessage).props(),
      ).toMatchObject(messages.emojiImageTooBig);
    });

    it('Upload after searching', async () => {
      const component = await helper.setupPicker({
        emojiProvider,
        hideToneSelector: true,
      });
      const provider = await emojiProvider;
      await waitUntil(() => helper.searchInputVisible(component));

      // click search
      const searchInput = helper.findSearchInput(component);
      searchInput.simulate('focus');
      // type "cheese burger"
      searchInput.simulate('change', {
        target: {
          value: 'cheese burger',
        },
      });
      // Wait for no matches
      await waitUntil(
        () => !helper.emojisVisible(component, component.find(EmojiPickerList)),
      );

      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );
      const addEmoji = await safeFindCustomEmojiButton(component);

      // click add
      addEmoji.simulate('click');
      await waitUntil(() => helper.emojiNameInputHasAValue(component));

      // name is "cheese_burger" (from search)
      const nameInput = helper.findEmojiNameInput(component);
      expect(nameInput.prop('value')).toEqual('cheese_burger');

      // choose file
      helper.chooseFile(component, createPngFile());
      await waitUntil(() => helper.addEmojiButtonVisible(component));

      // upload preview shown
      uploadPreviewShown(component);

      // add emoji
      const addEmojiButton = helper.findAddEmojiButton(component);
      addEmojiButton.simulate('click');

      // wait for upload
      await waitUntil(() => provider.getUploads().length > 0);

      // upload called on provider
      const uploads = provider.getUploads();
      expect(uploads).toHaveLength(1);
      const upload = uploads[0];
      expect(upload.upload).toEqual({
        name: 'Cheese burger',
        shortName: ':cheese_burger:',
        ...pngFileUploadData,
        width: 30,
        height: 30,
      });
      await waitUntil(() =>
        helper.emojiWithIdVisible(component, upload.emoji.id),
      );

      // new emoji in view
      const newEmojiDescription = provider.getUploads()[0].emoji;
      const emoji = helper.findEmojiWithId(component, newEmojiDescription.id);
      expect(emoji).toHaveLength(1);

      const { name, shortName, fallback } = emoji.prop('emoji');
      expect(name).toEqual('Cheese burger');
      expect(shortName).toEqual(':cheese_burger:');
      expect(fallback).toEqual(':cheese_burger:');

      await waitUntil(() => commonHelper.previewVisible(component));

      // preview is back with new emoji shown by default
      const preview = commonHelper.findPreview(component);
      expect(preview).toHaveLength(1);

      // "add custom emoji" button should appear
      await safeFindCustomEmojiButton(component);
    });

    it('Upload cancel interaction', async () => {
      const component = await helper.setupPicker(
        {
          emojiProvider,
          hideToneSelector: true,
        },
        undefined,
        onEvent,
      );
      const provider = await emojiProvider;
      await helper.showCategory(customCategory, component, customTitle);

      await waitUntil(() => commonHelper.previewVisible(component));

      // save emoji initially shown in preview
      let preview = commonHelper.findPreview(component);
      expect(preview).toHaveLength(1);

      // click add
      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );
      const addEmoji = await safeFindCustomEmojiButton(component);
      addEmoji.simulate('click');
      await waitUntil(() => helper.emojiNameInputVisible(component));

      // type name
      typeEmojiName(component);

      // choose file
      helper.chooseFile(component, createPngFile());
      await waitUntil(() => helper.addEmojiButtonVisible(component));

      // upload preview shown
      uploadPreviewShown(component);

      // cancel
      const cancelLink = helper.findCancelLink(component);
      cancelLink.simulate('click');
      await waitUntil(() => commonHelper.previewVisible(component));

      // preview is back with previous emoji shown by default
      preview = commonHelper.findPreview(component);
      expect(preview).toHaveLength(1);

      // "add custom emoji" button should appear
      await safeFindCustomEmojiButton(component);

      // No uploads occurred
      const uploads = provider.getUploads();
      expect(uploads).toHaveLength(0);

      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: uploadBeginButton(),
        }),
        'fabric-elements',
      );
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

    it('Upload error interaction', async () => {
      const spy = jest
        .spyOn(MockEmojiResource.prototype, 'uploadCustomEmoji')
        .mockImplementation(() => Promise.reject(new Error('upload error')));

      const component = await helper.setupPicker(
        {
          emojiProvider,
          hideToneSelector: true,
        },
        undefined,
        onEvent,
      );

      const provider = await emojiProvider;
      await helper.showCategory(customCategory, component, customTitle);
      await waitUntil(() => commonHelper.previewVisible(component));

      // save emoji initially shown in preview
      let preview = commonHelper.findPreview(component);
      expect(preview).toHaveLength(1);

      // click add
      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );
      const addEmoji = await safeFindCustomEmojiButton(component);
      addEmoji.simulate('click');
      await waitUntil(() => helper.emojiNameInputVisible(component));

      // type name
      typeEmojiName(component);

      // choose file
      helper.chooseFile(component, createPngFile());
      await waitUntil(() => helper.addEmojiButtonVisible(component));

      // upload preview shown
      uploadPreviewShown(component);

      // add emoji
      const addEmojiButton = helper.findAddEmojiButton(component);
      addEmojiButton.simulate('click');

      // wait for error
      await waitUntil(() => helper.errorMessageVisible(component));

      // Check error displayed
      helper.tooltipErrorMessageMatches(component, messages.emojiUploadFailed);

      const retryButton = component
        .find(EmojiUploadPreview)
        .find('button')
        .at(0);

      expect(retryButton.text()).toEqual('Retry');

      // upload not called on provider
      let uploads = provider.getUploads();
      expect(uploads).toHaveLength(0);

      // cancel
      const cancelLink = helper.findCancelLink(component);
      cancelLink.simulate('click');

      // wait for preview to return
      await waitUntil(() => commonHelper.previewVisible(component));

      // preview is back with previous emoji shown by default
      // "add custom emoji" button should appear
      await safeFindCustomEmojiButton(component);

      // No uploads occurred
      uploads = provider.getUploads();
      expect(uploads).toHaveLength(0);

      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: uploadBeginButton(),
        }),
        'fabric-elements',
      );
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
            reason: expect.any(String),
          }),
        }),
        'fabric-elements',
      );
      expect(onEvent).toHaveBeenLastCalledWith(
        expect.objectContaining({
          payload: uploadCancelButton(),
        }),
        'fabric-elements',
      );
      spy.mockReset();
    });

    it('Retry on upload error', async () => {
      const spy = jest
        .spyOn(MockEmojiResource.prototype, 'uploadCustomEmoji')
        .mockImplementation(() => Promise.reject(new Error('upload error')));

      const component = await navigateToUploadPreview(emojiProvider, onEvent);
      const provider = await emojiProvider;

      // add emoji
      const addEmojiButton = helper.findAddEmojiButton(component);
      addEmojiButton.simulate('click');

      // wait for error
      await waitUntil(() => helper.errorMessageVisible(component));

      // Check error displayed
      helper.tooltipErrorMessageMatches(component, messages.emojiUploadFailed);

      const retryButton = component
        .find(EmojiUploadPreview)
        .find('button')
        .at(0);

      expect(retryButton.text()).toEqual('Retry');
      expect(spy).toHaveBeenCalledTimes(1);

      // remove mock to make upload successful
      // @ts-ignore: prevent TS from complaining about mockRestore function
      spy.mockRestore();

      retryButton.simulate('click');
      // wait for upload
      await waitUntil(() => provider.getUploads().length > 0);
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
            reason: expect.any(String),
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
      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: uploadSucceededEvent({
            duration: expect.any(Number),
          }),
        }),
        'fabric-elements',
      );
    });
  });

  describe('delete', () => {
    let getUserProvider;
    let emojiProvider: Promise<any>;
    let component: ReactWrapper;
    let onEvent: jest.SpyInstance;
    beforeEach(async () => {
      onEvent = jest.fn();
      // Initialise repository with clone of siteEmojis
      const repository = new EmojiRepository(
        JSON.parse(JSON.stringify([mediaEmoji, siteEmojiFoo])),
      );
      getUserProvider = () =>
        getEmojiResourcePromiseFromRepository(repository, {
          currentUser: { id: 'hulk' },
        });
      emojiProvider = getUserProvider();
      component = await helper.setupPicker(
        { emojiProvider },
        undefined,
        onEvent,
      );
    });

    // Click delete button on user emoji in picker
    const openDeletePrompt = (component: ReactWrapper) =>
      component.find(`.${deleteButtonStyles} button`).simulate('click');
    // Click 'Remove' in delete preview
    const clickRemove = (component: ReactWrapper) =>
      component.find(EmojiDeletePreview).find('button').at(0).simulate('click');

    it('shows the emoji delete preview when the delete button is clicked', async () => {
      openDeletePrompt(component);
      expect(component.find(EmojiDeletePreview)).toHaveLength(1);
    });

    it('calls #deleteSiteEmoji with the emoji to delete when button is clicked', async () => {
      const spy = jest.spyOn(MockEmojiResource.prototype, 'deleteSiteEmoji');

      openDeletePrompt(component);
      clickRemove(component);
      // Delete called with user custom emoji
      expect(spy).toHaveBeenCalledWith(siteEmojiFoo);
    });

    it('fires analytics for confirmed deletion path', async () => {
      openDeletePrompt(component);
      expect(onEvent).toHaveBeenLastCalledWith(
        expect.objectContaining({
          payload: deleteBeginEvent({ emojiId: siteEmojiFoo.id }),
        }),
        'fabric-elements',
      );
      clickRemove(component);
      expect(onEvent).toHaveBeenLastCalledWith(
        expect.objectContaining({
          payload: deleteConfirmEvent({ emojiId: siteEmojiFoo.id }),
        }),
        'fabric-elements',
      );
    });

    it('fires analytics for deletion cancel', async () => {
      openDeletePrompt(component);
      component.find(EmojiDeletePreview).find('button').at(1).simulate('click');
      expect(onEvent).toHaveBeenLastCalledWith(
        expect.objectContaining({
          payload: deleteCancelEvent({ emojiId: siteEmojiFoo.id }),
        }),
        'fabric-elements',
      );
    });

    it('closes the delete preview onCancel', async () => {
      await helper.showCategory(customCategory, component, userCustomTitle);
      openDeletePrompt(component);
      const deletePreview = component.find(EmojiDeletePreview);
      // Click 'Cancel'
      deletePreview.find('button').at(1).simulate('click');
      expect(component.find(EmojiDeletePreview)).toHaveLength(0);
    });

    it('cannot find deleted emoji from provider', async () => {
      const provider = await emojiProvider;
      expect(await provider.findById('foo')).toEqual(siteEmojiFoo);
      openDeletePrompt(component);
      clickRemove(component);
      await waitUntil(() => helper.finishDelete(component));
      expect(await provider.findById('foo')).toBeUndefined();
    });

    it('deleting user emoji removes from both sections', async () => {
      expect(component.find(Emoji)).toHaveLength(3);
      openDeletePrompt(component);
      clickRemove(component);
      await waitUntil(() => helper.finishDelete(component));
      // Emoji removed from 'Your uploads' and 'All uploads'
      expect(component.find(Emoji)).toHaveLength(1);
    });

    it('removes Your Uploads if the only user emoji was deleted', async () => {
      // show 'Your uploads'
      expect(
        component.find(EmojiPickerCategoryHeading).at(0).props().title,
      ).toEqual(userCustomTitle);
      openDeletePrompt(component);
      clickRemove(component);
      // 'Your uploads' title no longer visible
      await waitUntil(() => helper.finishDelete(component));
      expect(
        component.find(EmojiPickerCategoryHeading).at(0).props().title,
      ).toEqual(customTitle);
    });

    it('does not remove emoji from list on failure', async () => {
      const spy = jest
        .spyOn(MockEmojiResource.prototype, 'deleteSiteEmoji')
        .mockImplementation(() => Promise.resolve(false));

      openDeletePrompt(component);
      // Emoji found for 3 in list + 1 in preview
      expect(component.find(Emoji)).toHaveLength(4);
      clickRemove(component);
      // Expect error to occur
      await waitUntil(() => helper.errorMessageVisible(component));
      // Same number of emoji
      expect(component.find(Emoji)).toHaveLength(4);
      spy.mockReset();
    });

    it('displays a retry button if call to #deleteSiteEmoji fails', async () => {
      const spy = jest
        .spyOn(MockEmojiResource.prototype, 'deleteSiteEmoji')
        .mockImplementation(() => Promise.resolve(false));

      openDeletePrompt(component);
      clickRemove(component);
      // Expect error to occur
      await waitUntil(() => helper.errorMessageVisible(component));
      const retryButton = component
        .find(EmojiDeletePreview)
        .find('button')
        .at(0);
      expect(retryButton.text()).toEqual('Retry');
      spy.mockReset();
    });

    it('calls #deleteSiteEmoji again on retry', async () => {
      const spy = jest
        .spyOn(MockEmojiResource.prototype, 'deleteSiteEmoji')
        .mockImplementation(() => Promise.resolve(false));

      openDeletePrompt(component);
      clickRemove(component);
      const deleteCalls = spy.mock.calls.length;
      // Expect error to occur
      await waitUntil(() => helper.errorMessageVisible(component));
      const retryButton = component
        .find(EmojiDeletePreview)
        .find('button')
        .at(0);
      retryButton.simulate('click');
      // Tries to call #deleteSiteEmoji again
      expect(spy).toHaveBeenCalledTimes(deleteCalls + 1);
      spy.mockReset();
    });
  });
});
