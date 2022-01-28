import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme-next';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import Emoji from '../../../../components/common/Emoji';
import EmojiButton from '../../../../components/common/EmojiButton';
import EmojiActionsWithIntl, {
  EmojiActions,
} from '../../../../components/common/EmojiActions';
import ToneSelector from '../../../../components/common/ToneSelector';
import { EmojiDescriptionWithVariations } from '../../../../types';
import { generateSkinVariation, imageEmoji } from '../../_test-data';
import * as helper from './_common-test-helpers';
import AkButton from '@atlaskit/button/standard-button';
import EmojiPickerListSearch from '../../../../components/picker/EmojiPickerListSearch';

const baseEmoji = imageEmoji;

const emoji: EmojiDescriptionWithVariations = {
  ...baseEmoji,
  skinVariations: [
    generateSkinVariation(imageEmoji, 1),
    generateSkinVariation(imageEmoji, 2),
    generateSkinVariation(imageEmoji, 3),
    generateSkinVariation(imageEmoji, 4),
    generateSkinVariation(imageEmoji, 5),
  ],
};

const baseToneEmoji = {
  ...imageEmoji,
  id: 'raised_back_of_hand',
  shortName: ':raised_back_of_hand:',
  name: 'Raised back of hand',
};

const toneEmoji: EmojiDescriptionWithVariations = {
  ...baseToneEmoji,
  skinVariations: [
    generateSkinVariation(baseToneEmoji, 1),
    generateSkinVariation(baseToneEmoji, 2),
    generateSkinVariation(baseToneEmoji, 3),
    generateSkinVariation(baseToneEmoji, 4),
    generateSkinVariation(baseToneEmoji, 5),
  ],
};

const props = {
  onUploadCancelled: jest.fn(),
  onUploadEmoji: jest.fn(),
  onCloseDelete: jest.fn(),
  onDeleteEmoji: jest.fn(),
  uploading: false,
  uploadEnabled: false,
  onOpenUpload: () => {},
  onChange: () => {},
};

describe('<EmojiActions />', () => {
  describe('tone', () => {
    it('should display tone selector after clicking on the tone button', () => {
      const wrapper = mountWithIntl(
        <EmojiActionsWithIntl {...props} toneEmoji={toneEmoji} />,
      );

      wrapper.find(EmojiButton).simulate('mousedown', { button: 0 });
      expect(wrapper.find(EmojiActions).state('selectingTone')).toEqual(true);
      expect(wrapper.find(ToneSelector)).toHaveLength(1);
    });

    it('button should show current selected tone if provided', () => {
      const wrapper = mountWithIntl(
        <EmojiActionsWithIntl
          {...props}
          selectedTone={1}
          toneEmoji={toneEmoji}
        />,
      );
      const selectedTone = wrapper.find(EmojiButton).find(Emoji).prop('emoji');
      expect(selectedTone.shortName).toEqual(
        toneEmoji!.skinVariations![0].shortName,
      );
    });

    it('button should show default tone if selected tone is not specified', () => {
      const wrapper = mountWithIntl(
        <EmojiActionsWithIntl {...props} toneEmoji={toneEmoji} />,
      );

      const selectedTone = wrapper.find(EmojiButton).find(Emoji).prop('emoji');
      expect(selectedTone.shortName).toEqual(toneEmoji.shortName);
      expect(selectedTone.representation).toEqual(
        emoji.representation as Object,
      );
    });

    it('should stop selecting tone when tone selected', () => {
      const wrapper = mountWithIntl(
        <EmojiActionsWithIntl {...props} toneEmoji={toneEmoji} />,
      ).find(EmojiActions);

      const instance = wrapper.instance() as EmojiActions;
      instance.onToneButtonClick();
      instance.onToneSelected(1);

      expect(wrapper.find(EmojiActions).state('selectingTone')).toEqual(false);
    });

    it('should pass onToneSelected to tone selector', () => {
      const wrapper = mountWithIntl(
        <EmojiActionsWithIntl {...props} toneEmoji={toneEmoji} />,
      );

      const instance = wrapper.find(EmojiActions).instance() as EmojiActions;
      instance.onToneButtonClick();
      wrapper.update();

      expect(wrapper.find(ToneSelector).prop('onToneSelected')).toEqual(
        instance.onToneSelected,
      );
    });

    it('should stop selecting tone on mouse leave', () => {
      const wrapper = mountWithIntl(
        <EmojiActionsWithIntl {...props} toneEmoji={toneEmoji} />,
      ).find(EmojiActions);

      const instance = wrapper.instance() as EmojiActions;
      instance.onToneButtonClick();

      wrapper.simulate('mouseLeave');
      expect(wrapper.find(EmojiActions).state('selectingTone')).toEqual(false);
    });
  });

  describe('Add custom emoji', () => {
    const safeFindStartEmojiUpload = async (component: ReactWrapper) => {
      await waitUntil(() => helper.customEmojiButtonVisible(component));
      return helper.findCustomEmojiButton(component);
    };
    describe('Upload not supported', () => {
      it('"Add custom emoji" button should not appear when uploadEnabled is false', () => {
        const component = mountWithIntl(
          <EmojiActionsWithIntl {...props} toneEmoji={toneEmoji} />,
        );
        const addCustomEmojiButton = component.find(AkButton);
        expect(addCustomEmojiButton.exists()).toBeFalsy();
      });
    });

    describe('Upload supported', () => {
      it('"Add custom emoji" button should appear as default', async () => {
        const component: ReactWrapper = mountWithIntl(
          <EmojiActionsWithIntl
            {...props}
            toneEmoji={toneEmoji}
            uploadEnabled={true}
          />,
        );
        expect(true).toBe(true);
        const addCustomEmojiButton = await safeFindStartEmojiUpload(component);
        expect(addCustomEmojiButton).not.toEqual(undefined);
      });
    });
  });

  describe('EmojiPickerListSearch', () => {
    it('should render EmojiPickerListSearch by default', () => {
      const component: ReactWrapper = mountWithIntl(
        <EmojiActionsWithIntl {...props} toneEmoji={toneEmoji} />,
      );
      const searchInput = component.find(EmojiPickerListSearch);
      expect(searchInput.exists()).toBe(true);
    });

    it('should hide EmojiPickerListSearch when ToneSelector is open', () => {
      const component = mountWithIntl(
        <EmojiActionsWithIntl {...props} toneEmoji={toneEmoji} />,
      );
      component.find(EmojiButton).simulate('mousedown', { button: 0 });
      expect(component.find(EmojiActions).state('selectingTone')).toEqual(true);

      const searchInput = component.find(EmojiPickerListSearch);
      expect(searchInput.exists()).toBe(false);
    });

    it('should stop selecting tone and show EmojiPickerListSearch on mouse leave', () => {
      const component = mountWithIntl(
        <EmojiActionsWithIntl {...props} toneEmoji={toneEmoji} />,
      ).find(EmojiActions);

      const instance = component.instance() as EmojiActions;
      instance.onToneButtonClick();

      component.simulate('mouseLeave');
      expect(component.find(EmojiActions).state('selectingTone')).toEqual(
        false,
      );
      const searchInput = component.find(EmojiPickerListSearch);
      expect(searchInput.exists()).toBe(true);
    });
  });
});
