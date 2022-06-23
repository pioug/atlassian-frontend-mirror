import React, { ContextType, useEffect } from 'react';
import { PureComponent } from 'react';
import { isMediaEmoji } from '../../util/type-helpers';
import { EmojiDescription, EmojiId, UfoEmojiTimings } from '../../types';
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
import { EmojiContext, EmojiContextType } from '../../context/EmojiContext';
import { hasUfoMarked } from '../../util/analytics/ufoExperiences';

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
export const CachingEmoji = (props: CachingEmojiProps) => {
  // Optimisation to only render the class based CachingMediaEmoji if necessary
  // slight performance hit, which accumulates for a large number of emoji.
  const { placeholderSize, ...emojiProps } = props;
  // start emoji rendered experience, it may have already started earlier in ResourcedEmoji
  useSampledUFOComponentExperience(
    ufoExperiences['emoji-rendered'].getInstance(
      emojiProps.emoji.id || emojiProps.emoji.shortName,
    ),
    SAMPLING_RATE_EMOJI_RENDERED_EXP,
    { source: 'caching-emoji', emoji: emojiProps.emoji.shortName },
  );

  useEffect(() => {
    if (!hasUfoMarked(sampledUfoRenderedEmoji(emojiProps.emoji), 'fmp')) {
      sampledUfoRenderedEmoji(emojiProps.emoji).markFMP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emojiNode = () => {
    if (isMediaEmoji(props.emoji)) {
      return <CachingMediaEmoji {...props} />;
    }
    return <Emoji {...emojiProps} />;
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
export class CachingMediaEmoji extends PureComponent<CachingEmojiProps, State> {
  static contextType = EmojiContext;
  context!: ContextType<typeof EmojiContext>;

  constructor(props: EmojiProps, context: ContextType<typeof EmojiContext>) {
    super(props);
    this.state = {
      cachedEmoji: undefined,
    };
    this.loadEmoji(props.emoji, context);
  }

  componentDidUpdate() {
    if (this.props.emoji.shortName !== this.state.cachedEmoji?.shortName) {
      this.loadEmoji(this.props.emoji, this.context);
    }
  }

  private loadEmoji(
    emoji: EmojiDescription,
    context: EmojiContextType,
  ): EmojiDescription | undefined {
    if (!context) {
      return;
    }
    if (!context.emoji) {
      return undefined;
    }
    const { emojiProvider } = context.emoji;
    if (!emojiProvider) {
      return undefined;
    }

    debug('Loading image via media cache', emoji.shortName);
    sampledUfoRenderedEmoji(emoji).mark(UfoEmojiTimings.MEDIA_START);
    emojiProvider
      .getMediaEmojiDescriptionURLWithInlineToken(emoji)
      .then((cachedEmoji) => {
        this.setState({
          cachedEmoji,
          invalidImage: false,
        });
        sampledUfoRenderedEmoji(emoji).mark(UfoEmojiTimings.MEDIA_END);
      })
      .catch(() => {
        this.setState({
          cachedEmoji: undefined,
          invalidImage: true,
        });
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
  }

  private handleLoadError = (_emojiId: EmojiId) => {
    sampledUfoRenderedEmoji(_emojiId).failure({
      metadata: {
        reason: 'load error',
        source: 'CachingMediaEmoji',
        emoji: { id: _emojiId.id, shortName: _emojiId.shortName },
      },
    });
    this.setState({
      invalidImage: true,
    });
  };

  render() {
    const { cachedEmoji, invalidImage } = this.state;
    const { children, ...otherProps } = this.props;

    let emojiComponent;
    if (cachedEmoji && !invalidImage) {
      emojiComponent = (
        <Emoji
          {...otherProps}
          emoji={cachedEmoji}
          onLoadError={this.handleLoadError}
        />
      );
    } else {
      const { emoji, placeholderSize, showTooltip, fitToHeight } = this.props;
      const { shortName, representation } = emoji;
      emojiComponent = (
        <EmojiPlaceholder
          size={fitToHeight || placeholderSize}
          shortName={shortName}
          showTooltip={showTooltip}
          representation={representation}
        />
      );
    }

    return emojiComponent;
  }
}

export default CachingEmoji;
