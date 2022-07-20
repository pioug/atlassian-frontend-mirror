import React, { FC, useEffect, useMemo, useState } from 'react';
import EmojiProvider from '../../api/EmojiResource';
import { defaultEmojiHeight } from '../../util/constants';
import { isPromise } from '../../util/type-helpers';
import {
  EmojiId,
  OptionalEmojiDescription,
  UfoEmojiTimings,
} from '../../types';
import Emoji from './Emoji';
import EmojiPlaceholder from './EmojiPlaceholder';
import { State as LoadingState } from './LoadingEmojiComponent';
import { sampledUfoRenderedEmoji } from '../../util/analytics';
import LegacyEmojiContextProvider from '../../context/LegacyEmojiContextProvider';
import { EmojiImage } from './EmojiImage';
import { hasUfoMarked } from '../../util/analytics/ufoExperiences';

export interface BaseResourcedEmojiProps {
  emojiId: EmojiId;
  showTooltip?: boolean;
  fitToHeight?: number;
  /**
   * Optimistic will call the fetch interface first and not wait for the entire emoji collection
   * to be available before rendering. This is useful for views or pages that show a select set of
   * emojis.
   */
  optimistic?: boolean;
  /**
   * Custom Fallback allows a custom element or string to be rendered if an emoji fails to be fetched or found.
   * By default it takes the fallback or shortName inside emojiId, but if this prop is set it override the internal
   * fallbacks
   *
   * customFallback<Element | string> else emojiId.fallback else emojiId.shortName
   */
  customFallback?: JSX.Element | string;
  /**
   * Will attempt to render a highly condensed version of the emoji with an image url before showing the meta version.
   * All it required to work is an emojiId, imageUrl and some sizing (with good defaults)
   */
  optimisticImageURL?: string;
}

export interface Props extends BaseResourcedEmojiProps {
  emojiProvider: EmojiProvider;
}

export interface State extends LoadingState {
  emoji: OptionalEmojiDescription;
  loaded: boolean;
}

enum ResourcedEmojiComponentRenderStatesEnum {
  INITIAL = 'INITIAL',
  OPTIMISTIC = 'OPTIMISTIC',
  FALLBACK = 'FALLBACK',
  EMOJI = 'EMOJI',
}

export const ResourcedEmojiComponent: FC<Props> = ({
  emojiProvider,
  emojiId,
  showTooltip,
  customFallback,
  fitToHeight = defaultEmojiHeight,
  optimistic = false,
  optimisticImageURL,
}) => {
  const { shortName, id, fallback } = emojiId;
  const emojiContextValue = {
    emoji: {
      emojiProvider,
    },
  };
  const [emoji, setEmoji] = useState<OptionalEmojiDescription>();
  const [loaded, setLoaded] = useState(false);

  const fetchOrGetEmoji = (
    emojiProvider: EmojiProvider,
    emojiId: EmojiId,
    optimisticFetch: boolean = false,
  ) => {
    // TODO: Pass in optimistic into findByEmojiId to allow a single emoji meta fetch
    const foundEmoji = emojiProvider.fetchByEmojiId(emojiId, optimisticFetch);
    sampledUfoRenderedEmoji(emojiId).mark(UfoEmojiTimings.METADATA_START);

    if (isPromise<OptionalEmojiDescription>(foundEmoji)) {
      setLoaded(false);
      foundEmoji
        .then((emoji) => {
          setEmoji(emoji);
          if (!emoji) {
            // emoji is undefined
            sampledUfoRenderedEmoji(emojiId).failure({
              metadata: {
                reason: 'failed to find',
                source: 'ResourcedEmojiComponent',
                data: {
                  emoji: { id: emojiId.id, shortName: emojiId.shortName },
                },
              },
            });
            sampledUfoRenderedEmoji(emojiId).mark(UfoEmojiTimings.METADATA_END);
            if (!emoji) {
              // emoji is undefined
              sampledUfoRenderedEmoji(emojiId).failure({
                metadata: {
                  reason: 'failed to find',
                  source: 'ResourcedEmojiComponent',
                  data: {
                    emoji: { id: emojiId.id, shortName: emojiId.shortName },
                  },
                },
              });
            }
          }
        })
        .catch(() => {
          setEmoji(undefined);
          sampledUfoRenderedEmoji(emojiId).failure({
            metadata: {
              reason: 'failed to load',
              source: 'ResourcedEmojiComponent',
              data: {
                emoji: { id: emojiId.id, shortName: emojiId.shortName },
              },
            },
          });
        })
        .finally(() => {
          setLoaded(true);
          sampledUfoRenderedEmoji(emojiId).mark(UfoEmojiTimings.METADATA_END);
        });
    } else {
      setEmoji(foundEmoji);
      setLoaded(true);
      sampledUfoRenderedEmoji(emojiId).mark(UfoEmojiTimings.METADATA_END);
    }
  };

  useEffect(() => {
    if (!emojiId) {
      return;
    }
    if (
      !hasUfoMarked(sampledUfoRenderedEmoji(emojiId), UfoEmojiTimings.FMP_END)
    ) {
      sampledUfoRenderedEmoji(emojiId).markFMP();
    }
  }, [emojiId]);

  useMemo(() => {
    if (!emojiProvider || !emojiId) {
      return;
    }
    fetchOrGetEmoji(emojiProvider, emojiId, optimistic);
  }, [emojiProvider, emojiId, optimistic]);

  const emojiRenderState = useMemo<
    ResourcedEmojiComponentRenderStatesEnum
  >(() => {
    if (!emoji && !loaded && !optimisticImageURL) {
      return ResourcedEmojiComponentRenderStatesEnum.INITIAL;
    } else if (!emoji && !loaded && optimisticImageURL) {
      return ResourcedEmojiComponentRenderStatesEnum.OPTIMISTIC;
    } else if (!emoji && loaded) {
      return ResourcedEmojiComponentRenderStatesEnum.FALLBACK;
    }
    return ResourcedEmojiComponentRenderStatesEnum.EMOJI;
  }, [emoji, loaded, optimisticImageURL]);

  const handleOnLoadError = (emojiId: EmojiId) => {
    sampledUfoRenderedEmoji(emojiId).failure({
      metadata: {
        reason: 'load error',
        source: 'ResourcedEmojiComponent',
        data: {
          emoji: { id: emojiId.id, shortName: emojiId.shortName },
        },
      },
    });
  };

  return (
    <LegacyEmojiContextProvider emojiContextValue={emojiContextValue}>
      <span
        data-emoji-id={id}
        data-emoji-short-name={shortName}
        data-emoji-text={fallback || shortName}
      >
        {emojiRenderState ===
          ResourcedEmojiComponentRenderStatesEnum.INITIAL && (
          <EmojiPlaceholder
            shortName={shortName}
            showTooltip={showTooltip}
            size={fitToHeight || defaultEmojiHeight}
            loading
          />
        )}
        {emojiRenderState ===
          ResourcedEmojiComponentRenderStatesEnum.OPTIMISTIC &&
          optimisticImageURL && (
            <EmojiImage
              emojiId={emojiId}
              imageUrl={optimisticImageURL}
              maxSize={fitToHeight || defaultEmojiHeight}
            />
          )}
        {emojiRenderState ===
          ResourcedEmojiComponentRenderStatesEnum.FALLBACK && (
          <>{customFallback || fallback || shortName}</>
        )}
        {emojiRenderState === ResourcedEmojiComponentRenderStatesEnum.EMOJI &&
          emoji && (
            <Emoji
              emoji={emoji}
              onLoadError={handleOnLoadError}
              showTooltip={showTooltip}
              fitToHeight={fitToHeight}
            />
          )}
      </span>
    </LegacyEmojiContextProvider>
  );
};
