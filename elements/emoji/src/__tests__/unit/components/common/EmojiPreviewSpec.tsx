import {
  mountWithIntl,
  shallowWithIntl,
} from '@atlaskit/editor-test-helpers/enzyme';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import CachingEmoji from '../../../../components/common/CachingEmoji';
import Emoji from '../../../../components/common/Emoji';
import EmojiButton from '../../../../components/common/EmojiButton';
import EmojiPreview from '../../../../components/common/EmojiPreview';
import * as styles from '../../../../components/common/styles';
import ToneSelector from '../../../../components/common/ToneSelector';
import { EmojiDescriptionWithVariations } from '../../../../types';
import { generateSkinVariation, imageEmoji } from '../../_test-data';
import * as helper from './_common-test-helpers';

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

describe('<EmojiPreview />', () => {
  describe('preview', () => {
    it('should render an emoji preview if one is selected', () => {
      const wrapper = shallowWithIntl(<EmojiPreview emoji={emoji} />);

      expect(wrapper.find(`.${styles.preview}`)).toHaveLength(1);
    });

    it('should not render the emoji preview if one is not selected', () => {
      const wrapper = shallowWithIntl(<EmojiPreview />);

      expect(wrapper.find(`.${styles.preview}`)).toHaveLength(0);
    });
  });

  describe('tone', () => {
    it('should display tone selector after clicking on the tone button', () => {
      const wrapper = mountWithIntl(
        <EmojiPreview emoji={emoji} toneEmoji={toneEmoji} />,
      );

      wrapper.find(EmojiButton).simulate('mousedown', { button: 0 });
      expect(wrapper.state('selectingTone')).toEqual(true);
      expect(wrapper.find(ToneSelector)).toHaveLength(1);
    });

    it('button should show current selected tone if provided', () => {
      const wrapper = mountWithIntl(
        <EmojiPreview emoji={emoji} selectedTone={1} toneEmoji={toneEmoji} />,
      );

      expect(wrapper.find(Emoji)).toHaveLength(2);
      const first = wrapper.find(Emoji).first();
      const emoji1Prop = first.prop('emoji');
      expect(emoji1Prop).not.toEqual(undefined);
      expect(emoji1Prop.id).toEqual(emoji.id);
      expect(emoji1Prop.shortName).toEqual(emoji.shortName);

      const second = wrapper.find(Emoji).at(1);
      const selectedTone = toneEmoji!.skinVariations![0];
      const emoji2Prop = second.prop('emoji');
      expect(emoji2Prop).not.toEqual(undefined);
      expect(emoji2Prop.id).toEqual(selectedTone.id);
      expect(emoji2Prop.shortName).toEqual(selectedTone.shortName);
    });

    it('button should show default tone if selected tone is not specified', () => {
      const wrapper = mountWithIntl(
        <EmojiPreview emoji={emoji} toneEmoji={toneEmoji} />,
      );

      expect(wrapper.find(Emoji)).toHaveLength(2);
      const first = wrapper.find(Emoji).first();
      const emoji1Prop = first.prop('emoji');
      expect(emoji1Prop.shortName).toEqual(emoji.shortName);
      expect(emoji1Prop.representation).toEqual(emoji.representation as Object);
      const second = wrapper.find(Emoji).at(1);
      const emoji2Prop = second.prop('emoji');
      expect(emoji2Prop.shortName).toEqual(toneEmoji.shortName);
      expect(emoji2Prop.representation).toEqual(
        toneEmoji.representation as Object,
      );
    });

    it('should stop selecting tone when tone selected', () => {
      const wrapper = mountWithIntl(
        <EmojiPreview emoji={emoji} toneEmoji={toneEmoji} />,
      );

      const instance = wrapper.instance() as EmojiPreview;
      instance.onToneButtonClick();
      instance.onToneSelected(1);

      expect(wrapper.state('selectingTone')).toEqual(false);
    });

    it('should pass onToneSelected to tone selector', () => {
      const wrapper = mountWithIntl(
        <EmojiPreview emoji={emoji} toneEmoji={toneEmoji} />,
      );

      const instance = wrapper.instance() as EmojiPreview;
      instance.onToneButtonClick();
      wrapper.update();

      expect(wrapper.find(ToneSelector).prop('onToneSelected')).toEqual(
        instance.onToneSelected,
      );
    });

    it('should stop selecting tone on mouse leave', () => {
      const wrapper = mountWithIntl(
        <EmojiPreview emoji={emoji} toneEmoji={toneEmoji} />,
      );

      const instance = wrapper.instance() as EmojiPreview;
      instance.onToneButtonClick();

      wrapper.simulate('mouseLeave');
      expect(wrapper.state('selectingTone')).toEqual(false);
    });
  });

  describe('Add custom emoji', () => {
    const safeFindStartEmojiUpload = async (component: ReactWrapper) => {
      await waitUntil(() => helper.customEmojiButtonVisible(component));
      return helper.findCustomEmojiButton(component);
    };

    const waitUntilPreviewSectionIsVisible = async (
      component: ReactWrapper,
    ) => {
      await waitUntil(() => helper.findEmojiPreviewSection(component).exists());
      return helper.findEmojiPreviewSection(component);
    };

    describe('Upload not supported', () => {
      it('"Add custom emoji" button should not appear when uploadEnabled is false', async (done) => {
        const component = mountWithIntl(
          <EmojiPreview
            emoji={emoji}
            toneEmoji={toneEmoji}
            uploadEnabled={false}
          />,
        );
        await waitUntil(() => {
          component.update() && component.find(CachingEmoji).exists();
          expect(component.find(CachingEmoji).exists()).toBe(true);
          done();
        });
      });
    });

    describe('Upload supported', () => {
      let component: ReactWrapper;

      beforeEach(() => {
        component = mountWithIntl(
          <EmojiPreview
            emoji={emoji}
            toneEmoji={toneEmoji}
            uploadEnabled={true}
          />,
        );
      });

      const assertCustomEmojiButtonShown = async () => {
        const addCustomEmojiButton = await safeFindStartEmojiUpload(component);
        expect(addCustomEmojiButton).not.toEqual(undefined);
      };

      const performToneButtonClick = (component: ReactWrapper) => {
        const instance = component.instance() as EmojiPreview;
        instance.onToneButtonClick();
        component.update();
      };

      it('"Add custom emoji" button should appear as default', async () => {
        expect(true).toBe(true);
        await assertCustomEmojiButtonShown();
      });

      it('"Add custom emoji" button should not appear when Tone is clicked', async () => {
        await assertCustomEmojiButtonShown();

        performToneButtonClick(component);

        expect(helper.findCustomEmojiButton(component).length).toEqual(0);
      });

      it('"Add custom emoji" button should appear after Tone is skipped', async () => {
        const emojiPreviewSection = await waitUntilPreviewSectionIsVisible(
          component,
        );
        await assertCustomEmojiButtonShown();

        performToneButtonClick(component);

        expect(helper.findCustomEmojiButton(component).length).toEqual(0);

        // this should cancel the Tone selection
        emojiPreviewSection.simulate('mouseleave');

        // ensure upload button is shown after Tone is cancelled
        await assertCustomEmojiButtonShown();
      });
    });
  });
});
