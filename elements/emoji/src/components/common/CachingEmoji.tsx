import React, { FC, useEffect, useState } from 'react';
import { isMediaEmoji } from '../../util/type-helpers';
import {
  EmojiDescription,
  EmojiId,
  EmojiProvider,
  UfoEmojiTimings,
} from '../../types';
import debug from '../../util/logger';
import Emoji, { Props as EmojiProps } from './Emoji';
import EmojiPlaceholder from './EmojiPlaceholder';
import { UfoErrorBoundary } from './UfoErrorBoundary';
import {
  sampledUfoRenderedEmoji,
  ufoExperiences,
  useSampledUFOComponentExperience,
} from '../../util/analytics';
import { SAMPLING_RATE_EMOJI_RENDERED_EXP } from '../../util/constants';
import { hasUfoMarked } from '../../util/analytics/ufoExperiences';
import { useEmojiContext } from '../../hooks/useEmojiContext';
import { useCallback } from 'react';
export interface State {
  cachedEmoji?: EmojiDescription;
  invalidImage?: boolean;
}

export interface CachingEmojiProps extends EmojiProps {
  placeholderSize?: number;
}

/**
 * Renders an emoji from a cached image, if required.
 */
export const CachingEmoji: FC<CachingEmojiProps> = (props) => {
  // Optimisation to only render CachingMediaEmoji if necessary
  // slight performance hit, which accumulates for a large number of emoji.
  const { emoji } = props;
  // start emoji rendered experience, it may have already started earlier in ResourcedEmoji
  useSampledUFOComponentExperience(
    ufoExperiences['emoji-rendered'].getInstance(emoji.id || emoji.shortName),
    SAMPLING_RATE_EMOJI_RENDERED_EXP,
    { source: 'caching-emoji', emoji: emoji.shortName },
  );

  useEffect(() => {
    if (!hasUfoMarked(sampledUfoRenderedEmoji(emoji), 'fmp')) {
      sampledUfoRenderedEmoji(emoji).markFMP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emojiNode = () => {
    if (isMediaEmoji(emoji)) {
      return <CachingMediaEmoji {...props} />;
    }
    return <Emoji {...props} />;
  };

  return (
    <UfoErrorBoundary
      experiences={[
        ufoExperiences['emoji-rendered'].getInstance(
          props.emoji.id || props.emoji.shortName,
        ),
      ]}
    >
      {emojiNode()}
    </UfoErrorBoundary>
  );
};

/**
 * Rendering a media emoji image from a cache for media emoji, with different
 * rendering paths depending on caching strategy.
 */
export const CachingMediaEmoji: FC<CachingEmojiProps> = (props) => {
  const {
    emoji,
    placeholderSize,
    showTooltip,
    fitToHeight,
    children,
    ...restProps
  } = props;
  const { shortName, representation } = emoji;
  const [cachedEmoji, setCachedEmoji] = useState<EmojiDescription>();
  const [inValidImage, setInvalidImage] = useState(false);

  const context = useEmojiContext();

  const loadEmoji = useCallback(
    (emojiProvider: EmojiProvider) => {
      debug('Loading image via media cache', emoji.shortName);
      sampledUfoRenderedEmoji(emoji).mark(UfoEmojiTimings.MEDIA_START);
      emojiProvider
        .getMediaEmojiDescriptionURLWithInlineToken(emoji)
        .then((cachedEmoji) => {
          setCachedEmoji(cachedEmoji);
          setInvalidImage(false);
          sampledUfoRenderedEmoji(emoji).mark(UfoEmojiTimings.MEDIA_END);
        })
        .catch(() => {
          setCachedEmoji(undefined);
          setInvalidImage(true);
          sampledUfoRenderedEmoji(emoji).failure({
            metadata: {
              reason: 'failed to load media emoji',
              source: 'CachingMediaEmoji',
              data: {
                emoji: {
                  id: emoji.id,
                  shortName: emoji.shortName,
                  name: emoji.name,
                },
              },
            },
          });
        });
    },
    [emoji],
  );

  useEffect(() => {
    if (context && context.emoji.emojiProvider) {
      loadEmoji(context.emoji.emojiProvider);
    }
  }, [context, loadEmoji]);

  const handleLoadError = (_emojiId: EmojiId) => {
    sampledUfoRenderedEmoji(_emojiId).failure({
      metadata: {
        reason: 'load error',
        source: 'CachingMediaEmoji',
        emoji: { id: _emojiId.id, shortName: _emojiId.shortName },
      },
    });
    setInvalidImage(true);
  };

  if (cachedEmoji && !inValidImage) {
    return (
      <Emoji
        {...restProps}
        showTooltip={showTooltip}
        fitToHeight={fitToHeight}
        emoji={cachedEmoji}
        onLoadError={handleLoadError}
      />
    );
  }

  return (
    <EmojiPlaceholder
      size={fitToHeight || placeholderSize}
      shortName={shortName}
      showTooltip={showTooltip}
      representation={representation}
    />
  );
};

export default CachingEmoji;
