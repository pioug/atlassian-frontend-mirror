import React, { useState } from 'react';
import { getRealEmojiResource } from '../example-helpers/demo-resource-control';
import { IntlProvider } from 'react-intl-next';
import EmojiPicker, {
  type EmojiId,
  type EmojiProvider,
  EmojiCommonProvider,
  type OnEmojiEvent,
  ResourcedEmoji,
  useEmoji,
} from '../src';
import { EmojiTypeAheadTextInput } from './03-standard-emoji-typeahead';
import { Popup } from '@atlaskit/popup';
import { IconButton } from '@atlaskit/button/new';
import EmojiAddIcon from '@atlaskit/icon/glyph/emoji-add';
/**
 * Emoji Picker in Popup
 * @param emojiProvider
 * @constructor
 */
export const EmojiPickerPopup = ({
  emojiProvider,
  onSelected,
}: {
  emojiProvider: Promise<EmojiProvider>;
  onSelected?: OnEmojiEvent;
}) => {
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiId>();

  const onSelection: OnEmojiEvent = (emojiId, emoji) => {
    setSelectedEmoji(emojiId);
    setEmojiPickerOpen(false);
    onSelected && onSelected(emojiId, emoji);
  };

  return (
    <>
      <Popup
        isOpen={emojiPickerOpen}
        onClose={() => setEmojiPickerOpen(false)}
        trigger={(triggerProps) => (
          <IconButton
            label="Add reaction"
            {...triggerProps}
            onClick={() => setEmojiPickerOpen(true)}
            icon={(iconProps) => <EmojiAddIcon {...iconProps} size="small" />}
            spacing="compact"
          />
        )}
        content={() => (
          <EmojiPicker
            emojiProvider={emojiProvider}
            onSelection={onSelection}
          />
        )}
      />
      <p data-testid="selected-emoji">
        {selectedEmoji && (
          <ResourcedEmoji
            emojiId={selectedEmoji}
            showTooltip={true}
            emojiProvider={emojiProvider}
            fitToHeight={24}
          />
        )}
      </p>
    </>
  );
};

export const RealEmojiResourceProviderExample = () => {
  const emojiTest = {
    id: '64ca858e-6ee7-40e2-832a-432a7422f144',
    fallback: ':emoji-test:',
    shortName: ':emoji-test:',
  };
  const grinEmoji = {
    id: '1f600',
    fallback: ':grinning:',
    shortName: ':grinning:',
  };

  const { emojiProvider } = useEmoji();
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiId>();

  const onSelection: OnEmojiEvent = (emojiId, emoji) => {
    setSelectedEmoji(emojiId);
  };

  if (!emojiProvider) {
    return null;
  }

  // get promise version of emojiProvider
  const emojiProviderPromise = Promise.resolve(emojiProvider);

  return (
    <>
      <p>A resource emoji with a standard emoji</p>
      <ResourcedEmoji
        emojiId={{
          id: grinEmoji.id,
          fallback: grinEmoji.fallback,
          shortName: grinEmoji.shortName,
        }}
        showTooltip={true}
        emojiProvider={emojiProviderPromise}
        fitToHeight={24}
      />
      <p>A resource emoji with a custom emoji</p>
      <ResourcedEmoji
        emojiId={{
          id: emojiTest.id,
          fallback: emojiTest.fallback,
          shortName: emojiTest.shortName,
        }}
        showTooltip={true}
        emojiProvider={emojiProviderPromise}
        fitToHeight={24}
      />

      <p>Emoji Picker</p>
      <EmojiPickerPopup emojiProvider={emojiProviderPromise} />
      <p>Emoji Typeahead</p>
      <EmojiTypeAheadTextInput
        emojiProvider={emojiProviderPromise}
        label={'Emoji Typeahead'}
        position="below"
        onSelection={onSelection}
      />
      <p>
        {selectedEmoji && (
          <ResourcedEmoji
            emojiId={selectedEmoji}
            showTooltip={true}
            emojiProvider={emojiProviderPromise}
          />
        )}
      </p>
    </>
  );
};

export default function Example() {
  const emojiProvider = getRealEmojiResource();
  return (
    <IntlProvider locale="en">
      <EmojiCommonProvider emojiProvider={emojiProvider}>
        <RealEmojiResourceProviderExample />
      </EmojiCommonProvider>
    </IntlProvider>
  );
}
