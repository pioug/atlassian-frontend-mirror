import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { EmojiProvider } from '../../api/EmojiResource';
import { defaultEmojiHeight } from '../../util/constants';
import {
  isImageRepresentation,
  isMediaRepresentation,
  isPromise,
} from '../../util/type-helpers';
import {
  EmojiId,
  OptionalEmojiDescription,
  UfoEmojiTimings,
} from '../../types';
import Emoji from './Emoji';
import EmojiPlaceholder from './EmojiPlaceholder';
import { sampledUfoRenderedEmoji } from '../../util/analytics';
import { EmojiCommonProvider } from '../../context/EmojiCommonProvider';
import { hasUfoMarked } from '../../util/analytics/ufoExperiences';

export interface BaseResourcedEmojiProps {
  /**
   * Emoji to display
   */
  emojiId: EmojiId;
  /**
   * Allows to show the tooltip.
   * Defaults to `false`.
   */
  showTooltip?: boolean;
  /**
   * Scales the emoji proportionally to provided hight.
   * Defaults to `undefined`.
   */
  fitToHeight?: number;
  /**
   * Optimistic will call the fetch interface first and not wait for the entire emoji collection
   * to be available before rendering. This is useful for views or pages that show a select set of
   * emojis.
   * Defaults to `false`.
   */
  optimistic?: boolean;
  /**
   * Custom Fallback allows a custom element or string to be rendered if an emoji fails to be fetched or found.
   * By default it takes the fallback or shortName inside emojiId, but if this prop is set it override the internal
   * fallbacks
   * customFallback<Element | string> else emojiId.fallback else emojiId.shortName.
   * Defaults to `undefined`.
   */
  customFallback?: JSX.Element | string;
  /**
   * Will attempt to render a highly condensed version of the emoji with an image url before showing the meta version.
   * All that is required for optimistic images to render is an emojiId, imageUrl and sizing props.
   * Defaults to `undefined`.
   */
  optimisticImageURL?: string;
}

export interface Props extends BaseResourcedEmojiProps {
  /**
   * EmojiResource instance that handles fetching of emoji data.
   */
  emojiProvider: Promise<EmojiProvider>;
}

enum ResourcedEmojiComponentRenderStatesEnum {
  INITIAL = 'INITIAL',
  FALLBACK = 'FALLBACK',
  EMOJI = 'EMOJI',
}

export const ResourcedEmojiComponent: FC<Props> = (props) => {
  const {
    emojiProvider,
    emojiId,
    showTooltip = false,
    customFallback = undefined,
    fitToHeight = defaultEmojiHeight,
    optimistic = false,
    optimisticImageURL = undefined,
  } = props;
  const { shortName, id, fallback } = emojiId;
  const [emoji, setEmoji] = useState<OptionalEmojiDescription>();
  const [loaded, setLoaded] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [resolvedEmojiProvider, setResolvedEmojiProvider] =
    useState<EmojiProvider>();

  const fetchOrGetEmoji = useCallback(
    async (
      _emojiProvider: EmojiProvider,
      emojiId: EmojiId,
      optimisticFetch: boolean = false,
    ) => {
      if (!_emojiProvider.fetchByEmojiId) {
        setEmoji(undefined);
        sampledUfoRenderedEmoji(emojiId).failure({
          metadata: {
            reason: 'missing fetchByEmojiId interface',
            source: 'ResourcedEmojiComponent',
          },
        });
      }

      const foundEmoji = _emojiProvider.fetchByEmojiId(
        emojiId,
        optimisticFetch,
      );
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
    },
    [],
  );

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
    if (!resolvedEmojiProvider || !emojiId) {
      return;
    }
    fetchOrGetEmoji(resolvedEmojiProvider, emojiId, optimistic);
  }, [resolvedEmojiProvider, emojiId, optimistic, fetchOrGetEmoji]);

  useEffect(() => {
    Promise.resolve(emojiProvider).then((emojiProvider) => {
      setResolvedEmojiProvider(emojiProvider);
    });
  }, [emojiProvider]);

  const emojiRenderState =
    useMemo<ResourcedEmojiComponentRenderStatesEnum>(() => {
      if (!emoji && !loaded && !optimisticImageURL) {
        return ResourcedEmojiComponentRenderStatesEnum.INITIAL;
      } else if ((!emoji && loaded) || imageLoadError) {
        return ResourcedEmojiComponentRenderStatesEnum.FALLBACK;
      }

      return ResourcedEmojiComponentRenderStatesEnum.EMOJI;
    }, [emoji, loaded, optimisticImageURL, imageLoadError]);

  const optimisticEmojiDescription = useMemo(() => {
    if (optimisticImageURL) {
      if (
        emoji &&
        (isImageRepresentation(emoji.representation) ||
          isMediaRepresentation(emoji?.representation))
      ) {
        const { width, height } = emoji.representation;
        return {
          ...emoji,
          representation: {
            width,
            height,
            imagePath: optimisticImageURL,
          },
        };
      } else {
        return {
          id,
          shortName,
          fallback,
          type: '',
          category: '',
          representation: {
            height: fitToHeight || defaultEmojiHeight,
            width: fitToHeight || defaultEmojiHeight,
            imagePath: optimisticImageURL,
          },
          searchable: true,
        };
      }
    }

    return emoji;
  }, [emoji, optimisticImageURL, fallback, fitToHeight, id, shortName]);

  const handleOnLoadError = (emojiId: EmojiId) => {
    setImageLoadError(true);
    sampledUfoRenderedEmoji(emojiId).failure({
      metadata: {
        reason: 'load error',
        source: 'ResourcedEmojiComponent',
        emojiId: emojiId.id,
      },
    });
  };

  return (
    <EmojiCommonProvider emojiProvider={resolvedEmojiProvider}>
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
          ResourcedEmojiComponentRenderStatesEnum.FALLBACK && (
          <>{customFallback || fallback || shortName}</>
        )}
        {emojiRenderState === ResourcedEmojiComponentRenderStatesEnum.EMOJI &&
          optimisticEmojiDescription && (
            <Emoji
              emoji={optimisticEmojiDescription}
              onLoadError={handleOnLoadError}
              showTooltip={showTooltip}
              fitToHeight={fitToHeight}
              autoWidth={!!emoji ? false : true}
            />
          )}
      </span>
    </EmojiCommonProvider>
  );
};

export default ResourcedEmojiComponent;
