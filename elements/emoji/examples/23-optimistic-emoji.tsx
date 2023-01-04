import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import {
  ResourcedEmojiControl,
  getEmojiConfig,
  getRealEmojiProvider,
} from '../example-helpers/demo-resource-control';
import { EmojiId, EmojiProvider, ResourcedEmoji } from '../src';

const emojiIds: EmojiId[] = [
  { shortName: ':grimacing:', id: '1f603' },
  { shortName: ':animated-11:', id: 'd786f300-162b-411b-829d-40a2888b7fe1' },
  { shortName: ':z-index:', id: 'c81b4275-2e0b-4c5d-b6b1-230a332abebe' },
  { shortName: ':blue_book:', id: '1f4d8' },
];

const SHOW_EMOJI_AMOUNT = 3;

const EmojiWrapper: FC = ({ children }) => {
  return (
    <div
      style={{
        margin: '8px 0',
        padding: '8px',
        border: `1px ${token('color.skeleton', N30)} solid`,
      }}
    >
      {children}
    </div>
  );
};

export default function Example() {
  const [emojiCollection, setEmojiCollection] = useState<EmojiId[]>([]);

  const handlePickOfEmojis = useCallback(
    (emojiCollection: any[], sampleSize: number) => {
      const subset = emojiCollection
        .map((eid) => [eid, Math.random()])
        .sort((a, b) => {
          return a[1] < b[1] ? -1 : 1;
        })
        .slice(0, sampleSize)
        .map((eid) => eid[0]) as EmojiId[];
      setEmojiCollection(subset);
    },
    [],
  );

  useEffect(() => {
    handlePickOfEmojis(emojiIds, SHOW_EMOJI_AMOUNT);
  }, [handlePickOfEmojis]);

  const emojiProvider = useMemo(() => {
    return new Promise<EmojiProvider>((resolve) => {
      console.log('downloading emoji provider');
      setTimeout(() => {
        console.log('downloaded emoji provider');
        resolve(getRealEmojiProvider());
      }, 2500);
    });
  }, []);

  return (
    <IntlProvider locale="en">
      <ResourcedEmojiControl
        emojiConfig={getEmojiConfig()}
        customEmojiProvider={emojiProvider}
      >
        <>
          <h1>Optimistic Fetching of Resourced Emoji</h1>
          <p>
            Resourced Emoji can take in a optimistic prop that allow the emoji
            resource to fetch its own emoji meta data and fallback to the emoji
            provider collection if it fails.
          </p>
          <h2>Optimistic Emoji Rendering</h2>
          <p>
            First renders a static image url before rendering the hydrated
            component
          </p>
          <EmojiWrapper>
            <ResourcedEmoji
              emojiId={emojiIds[0]}
              emojiProvider={emojiProvider}
              optimistic
              optimisticImageURL="https://pf-emoji-service--cdn.us-east-1.staging.public.atl-paas.net/standard/caa27a19-fc09-4452-b2b4-a301552fd69c/64x64/1f603.png"
            />
            <ResourcedEmoji
              emojiId={emojiIds[3]}
              emojiProvider={emojiProvider}
              optimistic
              optimisticImageURL="https://pf-emoji-service--cdn.us-east-1.staging.public.atl-paas.net/standard/a51a7674-8d5d-4495-a2d2-a67c090f5c3b/64x64/1f4d8.png"
            />
          </EmojiWrapper>
          <h2>Optimistic Resource Emoji Rendering</h2>
          <p>Fetches a single emoji metadata</p>
          <EmojiWrapper>
            {emojiCollection.map((emojiId, index) => (
              <ResourcedEmoji
                key={`${emojiId.id}_${index}`}
                emojiId={emojiId}
                emojiProvider={emojiProvider}
                optimistic
              />
            ))}
          </EmojiWrapper>
          <h2>Provider Based Emoji Rendering</h2>
          <p>
            Requires the complete emoji collection provider to have downloaded
            before it renders
          </p>
          <EmojiWrapper>
            {emojiCollection.map((emojiId, index) => (
              <ResourcedEmoji
                key={`${emojiId.id}_${index}`}
                emojiId={emojiId}
                emojiProvider={emojiProvider}
              />
            ))}
          </EmojiWrapper>
          <h2>Fallback Based Emoji Rendering</h2>
          <p>Allows a custom fallback element if the emoji cannot be found</p>
          <EmojiWrapper>
            <ResourcedEmoji
              emojiId={{ shortName: ':fake:', id: 'fake' }}
              emojiProvider={emojiProvider}
              customFallback={<h1>this is crazy but works</h1>}
            />
          </EmojiWrapper>
          <button
            style={{ margin: '8px 0' }}
            onClick={() => handlePickOfEmojis(emojiIds, SHOW_EMOJI_AMOUNT)}
          >
            update another set
          </button>
        </>
      </ResourcedEmojiControl>
    </IntlProvider>
  );
}
