import React, { ContextType } from 'react';
import { PureComponent } from 'react';
import { isMediaEmoji } from '../../util/type-helpers';
import { EmojiDescription, EmojiId } from '../../types';
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
    { source: 'caching-emoji' },
  );

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

  componentDidMount() {
    sampledUfoRenderedEmoji(this.props.emoji).markFMP();
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
    emojiProvider
      .getMediaEmojiDescriptionURLWithInlineToken(emoji)
      .then((cachedEmoji) => {
        this.setState({
          cachedEmoji,
          invalidImage: false,
        });
      })
      .catch(() => {
        this.setState({
          cachedEmoji: undefined,
          invalidImage: true,
        });
        sampledUfoRenderedEmoji(emoji).failure({
          metadata: { reason: 'failed to load media emoji' },
        });
      });
  }

  private handleLoadError = (_emojiId: EmojiId) => {
    sampledUfoRenderedEmoji(_emojiId).failure({
      metadata: { reason: 'load error' },
    });
    this.setState({
      invalidImage: true,
    });
  };

  render() {
    const { cachedEmoji, invalidImage } = this.state;
    const { children, placeholderSize, ...otherProps } = this.props;

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
