import React from 'react';
import {
  ResourcedEmojiControl,
  getEmojiConfig,
  getRealEmojiProvider,
} from '../example-helpers/demo-resource-control';
import { emojiPickerHeight } from '../src/util/constants';
import { IntlProvider } from 'react-intl-next';
import { type EmojiProvider, ResourcedEmoji } from '../src';
import { token } from '@atlaskit/tokens';
import { B300, N0 } from '@atlaskit/theme/colors';

interface RenderRealEmojisProps {
  emailProvider: Promise<EmojiProvider>;
}

const CustomFallbackElement = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  return (
    <span
      style={{
        display: 'inline-block',
        borderRadius: '100%',
        height: '50px',
        width: '50px',
        backgroundColor: token('color.background.accent.blue.bolder', B300),
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          color: token('color.text.inverse', N0),
        }}
      >
        {children}
      </div>
    </span>
  );
};

export const RenderRealResourcedEmojis = (props: RenderRealEmojisProps) => {
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
  const wrongEmoji = {
    id: 'wrong-emoji',
    fallback: ':wrong-emoji:',
    shortName: ':wrong-emoji:',
  };

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
        emojiProvider={props.emailProvider}
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
        emojiProvider={props.emailProvider}
        fitToHeight={24}
      />
      <p>
        A resource emoji with a large fitToHeight rendering altRepresentation
      </p>
      <ResourcedEmoji
        emojiId={{
          id: emojiTest.id,
          fallback: emojiTest.fallback,
          shortName: emojiTest.shortName,
        }}
        showTooltip={true}
        emojiProvider={props.emailProvider}
        fitToHeight={80}
      />
      <p>A resource emoji with a default fallback</p>
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
      <p>A resource emoji with a custom fallback element.</p>
      <ResourcedEmoji
        emojiId={{
          id: wrongEmoji.id,
          fallback: wrongEmoji.fallback,
          shortName: wrongEmoji.shortName,
        }}
        showTooltip={true}
        emojiProvider={props.emailProvider}
        fitToHeight={50}
        customFallback={<CustomFallbackElement>FB</CustomFallbackElement>}
      />
    </>
  );
};

export default function Example() {
  const provider = getRealEmojiProvider();
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
