import React, { FC, memo, useState } from 'react';
import {
  ResourcedEmojiControl,
  getEmojiConfig,
  getRealEmojiProvider,
} from '../example-helpers/demo-resource-control';
import { emojiPickerHeight } from '../src/util/constants';
import { IntlProvider } from 'react-intl-next';
import { EmojiProvider, ResourcedEmoji } from '../src';

interface RenderRealEmojisProps {
  emailProvider: Promise<EmojiProvider>;
  hideWrongEmojis?: boolean;
  enableReMount?: boolean;
  count: number;
}

export const RenderRealResourcedEmojis = memo(
  (props: RenderRealEmojisProps) => {
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
          key={
            props.enableReMount
              ? `${grinEmoji.shortName}${props.count}`
              : undefined
          }
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
          key={
            props.enableReMount
              ? `${emojiTest.shortName}${props.count}`
              : undefined
          }
        />
        {!props.hideWrongEmojis && (
          <>
            <ResourcedEmoji
              emojiId={{
                id: emojiTest2.id,
                fallback: emojiTest2.fallback,
                shortName: emojiTest2.shortName,
              }}
              showTooltip={true}
              emojiProvider={props.emailProvider}
              fitToHeight={24}
              key={
                props.enableReMount
                  ? `${emojiTest2.shortName}${props.count}`
                  : undefined
              }
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
              key={
                props.enableReMount
                  ? `${wrongEmoji.shortName}${props.count}`
                  : undefined
              }
            />
          </>
        )}
      </>
    );
  },
);

interface ParentProps {
  count: number;
  reMountEnabled: boolean;
  onToggleReMount: (reMount: boolean) => void;
  onCount: (count: number) => void;
}
const Parent: FC<ParentProps> = ({
  children,
  count,
  onCount,
  reMountEnabled,
  onToggleReMount,
}) => {
  const reRender = () => {
    onCount(count);
  };

  const toggleReMount = () => {
    onToggleReMount(!reMountEnabled);
  };

  return (
    <div data-id={count}>
      {children}
      <button onClick={reRender}>re-render {count}</button>
      <button onClick={toggleReMount}>
        re-mount {reMountEnabled ? 'enabled' : 'disabled'}
      </button>
    </div>
  );
};

export default function Example() {
  const provider = getRealEmojiProvider();
  const [count, setCount] = useState(1);
  const [enableKey, setEnableKey] = useState(false);

  return (
    <IntlProvider locale="en">
      <ResourcedEmojiControl
        emojiConfig={getEmojiConfig()}
        customEmojiProvider={provider}
        customPadding={emojiPickerHeight}
      >
        <>
          <h3>emojis will have flicking issues in Safari on re-mount</h3>
          <Parent
            reMountEnabled={enableKey}
            count={count}
            onCount={() => {
              setCount(count + 1);
            }}
            onToggleReMount={() => {
              setEnableKey(!enableKey);
            }}
          >
            <RenderRealResourcedEmojis
              emailProvider={provider}
              enableReMount={enableKey}
              count={count}
              hideWrongEmojis
            />
          </Parent>
        </>
      </ResourcedEmojiControl>
    </IntlProvider>
  );
}
