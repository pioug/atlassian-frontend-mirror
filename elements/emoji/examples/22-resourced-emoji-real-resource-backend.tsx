import React from 'react';
import ResourcedEmojiControl, {
  getEmojiConfig,
  getRealEmojiResource,
} from '../example-helpers/demo-resource-control';
import { emojiPickerHeight } from '../src/util/constants';
import { IntlProvider } from 'react-intl-next';
import { EmojiProvider, ResourcedEmoji } from '../src';
// import { getEmojiRepository } from '@atlaskit/util-data-test/get-emoji-repository';
// const emojiService = getEmojiRepository();

interface RenderRealEmojisProps {
  emailProvider: Promise<EmojiProvider>;
}

export const RenderRealResourcedEmojis = (props: RenderRealEmojisProps) => {
  const emojiTest = {
    id: '64ca858e-6ee7-40e2-832a-432a7422f144',
    fallback: ':emoji-test:',
    shortName: ':emoji-test:',
  };
  const emojiTest2 = {
    id: '8b768280-e2e0-433f-be7d-6acf687f9fc3',
    fallback: ':emoji:',
    shortName: ':emoji:',
  };
  const grinEmoji = {
    id: '1f600',
    fallback: ':grinning:',
    shortName: ':grinning:',
  };
  const wrongEmoji = {
    id: 'wrong-emoji',
    fallback: ':wrong-emoji:',
    shortName: ':wrong-emoji:',
  };

  return (
    <>
      <ResourcedEmoji
        emojiId={{
          id: grinEmoji.id,
          fallback: grinEmoji.fallback,
          shortName: grinEmoji.shortName,
        }}
        showTooltip={true}
        emojiProvider={props.emailProvider}
        fitToHeight={24}
      />
      <ResourcedEmoji
        emojiId={{
          id: emojiTest.id,
          fallback: emojiTest.fallback,
          shortName: emojiTest.shortName,
        }}
        showTooltip={true}
        emojiProvider={props.emailProvider}
        fitToHeight={24}
      />
      <ResourcedEmoji
        emojiId={{
          id: emojiTest2.id,
          fallback: emojiTest2.fallback,
          shortName: emojiTest2.shortName,
        }}
        showTooltip={true}
        emojiProvider={props.emailProvider}
        fitToHeight={24}
      />
      <ResourcedEmoji
        emojiId={{
          id: wrongEmoji.id,
          fallback: wrongEmoji.fallback,
          shortName: wrongEmoji.shortName,
        }}
        showTooltip={true}
        emojiProvider={props.emailProvider}
        fitToHeight={24}
      />
    </>
  );
};

export default function Example() {
  const provider = getRealEmojiResource();
  return (
    <IntlProvider locale="en">
      <ResourcedEmojiControl
        emojiConfig={getEmojiConfig()}
        customEmojiProvider={provider}
        customPadding={emojiPickerHeight}
      >
        <RenderRealResourcedEmojis emailProvider={provider} />
      </ResourcedEmojiControl>
    </IntlProvider>
  );
}
