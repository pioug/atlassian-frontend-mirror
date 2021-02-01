import { waitUntil } from '@atlaskit/elements-test-helpers';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import React from 'react';
import { EmojiProvider } from '../../../../api/EmojiResource';
import { CachingMediaEmoji } from '../../../../components/common/CachingEmoji';
import Emoji from '../../../../components/common/Emoji';
import EmojiPreview from '../../../../components/common/EmojiPreview';
import ResourcedEmoji from '../../../../components/common/ResourcedEmoji';
import EmojiPicker from '../../../../components/picker/EmojiPicker';
import EmojiPickerList from '../../../../components/picker/EmojiPickerList';
import EmojiTypeAhead from '../../../../components/typeahead/EmojiTypeAhead';
import { hasSelector } from '../../_emoji-selectors';
import {
  getEmojiResourcePromiseFromRepository,
  mediaEmoji,
  mediaEmojiId,
  newSiteEmojiRepository,
} from '../../_test-data';
import {
  emojisVisible,
  setupPicker,
} from '../picker/_emoji-picker-test-helpers';

describe('Media Emoji Handling across components', () => {
  let emojiProvider: Promise<EmojiProvider>;

  beforeEach(() => {
    emojiProvider = getEmojiResourcePromiseFromRepository(
      newSiteEmojiRepository(),
    );
  });

  describe('<ResourcedEmoji/>', () => {
    it('ResourcedEmoji renders media emoji via CachingEmoji', () => {
      const component = mountWithIntl(
        <ResourcedEmoji emojiProvider={emojiProvider} emojiId={mediaEmojiId} />,
      );
      return waitUntil(() => hasSelector(component, Emoji)).then(() => {
        const emojiDescription = component.find(Emoji).prop('emoji');
        expect(emojiDescription).toEqual(mediaEmoji);
        expect(component.find(CachingMediaEmoji).length).toEqual(1);
      });
    });
  });

  describe('<EmojiPicker/>', () => {
    it('Media emoji rendered in picker', () => {
      const component = mountWithIntl<any, any>(
        <EmojiPicker emojiProvider={emojiProvider} />,
      );
      return waitUntil(() => hasSelector(component, EmojiPickerList)).then(
        () => {
          const list = component.find(EmojiPickerList);
          expect(list.length).toEqual(1);
          return waitUntil(() => emojisVisible(component, list)).then(() => {
            const emojiDescription = component.find(Emoji).prop('emoji');
            expect(emojiDescription).toEqual(mediaEmoji);
            expect(component.find(CachingMediaEmoji).length).toEqual(1);
          });
        },
      );
    });

    it('Media emoji rendered in picker preview', async () => {
      const component = await setupPicker({ emojiProvider });
      await waitUntil(() => hasSelector(component, EmojiPickerList));
      const list = component.find(EmojiPickerList);
      expect(list.length).toEqual(1);
      await waitUntil(() => emojisVisible(component, list));
      const emoji = component.find(Emoji);
      const emojiDescription = emoji.prop('emoji');
      expect(emojiDescription).toEqual(mediaEmoji);
      expect(list.find(CachingMediaEmoji).length).toEqual(1);
      let preview = component.find(EmojiPreview);
      expect(preview.length).toEqual(1);

      // Hover to force preview
      emoji.simulate('mousemove');

      await waitUntil(() =>
        hasSelector(component, Emoji, (preview = component.find(EmojiPreview))),
      );
      const previewEmojiDescription = preview.find(Emoji).prop('emoji');
      expect(previewEmojiDescription).toEqual(mediaEmoji);
      expect(preview.find(CachingMediaEmoji).length).toEqual(1);
    });
  });

  describe('<EmojiTypeAhead/>', () => {
    it('Media emoji rendered in type ahead', () => {
      const component = mountWithIntl(
        <EmojiTypeAhead emojiProvider={emojiProvider} />,
      );
      return waitUntil(() => hasSelector(component, Emoji)).then(() => {
        const emojiDescription = component.find(Emoji).prop('emoji');
        expect(emojiDescription).toEqual(mediaEmoji);
        expect(component.find(CachingMediaEmoji).length).toEqual(1);
      });
    });
  });
});
