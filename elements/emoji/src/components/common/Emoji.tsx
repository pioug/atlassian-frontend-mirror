/** @jsx jsx */
import React, { useEffect, useCallback } from 'react';
import { jsx } from '@emotion/react';
import { FocusEvent, MouseEvent, SyntheticEvent } from 'react';
import { shouldUseAltRepresentation } from '../../api/EmojiUtils';
import {
  deleteEmojiLabel,
  SAMPLING_RATE_EMOJI_RENDERED_EXP,
} from '../../util/constants';
import {
  isImageRepresentation,
  isMediaRepresentation,
  isSpriteRepresentation,
  toEmojiId,
} from '../../util/type-helpers';
import {
  EmojiDescription,
  OnEmojiEvent,
  SpriteRepresentation,
  UfoEmojiTimings,
} from '../../types';
import { leftClick } from '../../util/mouse';
import DeleteButton from './DeleteButton';
import {
  emojiContainer,
  emojiNodeStyles,
  commonSelectedStyles,
  selectOnHoverStyles,
  emojiSprite,
  emojiMainStyle,
  emojiStyles,
  emojiImage,
} from './styles';
import {
  sampledUfoRenderedEmoji,
  ufoExperiences,
  useSampledUFOComponentExperience,
} from '../../util/analytics';
import { isIntersectionObserverSupported } from '../../util/browser-support';
import { useInView } from '../../util/useInView';
import { hasUfoMarked } from '../../util/analytics/ufoExperiences';

export interface Props
  extends Omit<
    React.HTMLAttributes<HTMLSpanElement>,
    'onMouseMove' | 'onFocus'
  > {
  /**
   * The emoji to render
   */
  emoji: EmojiDescription;

  /**
   * Show the emoji as selected
   */
  selected?: boolean;

  /**
   * Automatically show the emoji as selected based on mouse hover.
   * CSS, fast, does not require a re-render, but selected state not
   * externally controlled via props.
   */
  selectOnHover?: boolean;

  /**
   * Called when an emoji is selected
   */
  onSelected?: OnEmojiEvent;

  /**
   * Called when the mouse moves over the emoji.
   */
  onMouseMove?: OnEmojiEvent;

  /**
   * Called when the mouse moves over the emoji.
   */
  onFocus?: OnEmojiEvent;

  /**
   * Called when an emoji is deleted
   */
  onDelete?: OnEmojiEvent;

  /**
   * Callback for if an emoji image fails to load.
   */
  onLoadError?: OnEmojiEvent<HTMLImageElement>;

  /**
   * Callback for if an emoji image succesfully loads.
   */
  onLoadSuccess?: (emoji: EmojiDescription) => void;

  /**
   * Additional css classes, if required.
   */
  className?: string;

  /**
   * Show a tooltip on mouse hover.
   */
  showTooltip?: boolean;

  /**
   * Show a delete button on mouse hover
   * Used only for custom emoji
   */
  showDelete?: boolean;

  /**
   * Fits emoji to height in pixels, keeping aspect ratio
   */
  fitToHeight?: number;

  /**
   * Indicates whether emoji is an interactive element (tab index and role) or just a view
   */
  shouldBeInteractive?: boolean;

  /**
   * Disables lazy load on images
   */
  disableLazyLoad?: boolean;

  /**
   * Auto Width takes the constraint of height and enables native scaling based on the emojis image.
   * This is primarily used when rendering emojis for SSR as the component does not know the width and height
   * at the time of the render. It overrides the emoji representations width with 'auto' on the images width attribute
   *
   * Used only for image based emojis
   */
  autoWidth?: boolean;
}

const handleMouseDown = (props: Props, event: MouseEvent<any>) => {
  // Clicked emoji delete button
  if (
    event.target instanceof Element &&
    event.target.getAttribute('aria-label') === deleteEmojiLabel
  ) {
    return;
  }
  const { emoji, onSelected } = props;
  event.preventDefault();
  if (onSelected && leftClick(event)) {
    onSelected(toEmojiId(emoji), emoji, event);
  }
};

const handleKeyPress = (
  props: Props,
  event: React.KeyboardEvent<HTMLElement>,
) => {
  // Clicked emoji delete button
  if (
    event.target instanceof Element &&
    event.target.getAttribute('aria-label') === deleteEmojiLabel
  ) {
    return;
  }
  const { emoji, onSelected } = props;
  event.preventDefault();
  if (onSelected && (event.key === 'Enter' || event.key === ' ')) {
    onSelected(toEmojiId(emoji), emoji, event);
  }
};

const handleMouseMove = (props: Props, event: MouseEvent<any>) => {
  const { emoji, onMouseMove } = props;
  if (onMouseMove) {
    onMouseMove(toEmojiId(emoji), emoji, event);
  }
};

const handleFocus = (props: Props, event: FocusEvent<any>) => {
  const { emoji, onFocus } = props;
  if (onFocus) {
    onFocus(toEmojiId(emoji), emoji, event);
  }
};

const handleDelete = (props: Props, event: SyntheticEvent) => {
  const { emoji, onDelete } = props;
  if (onDelete) {
    onDelete(toEmojiId(emoji), emoji, event);
  }
};

const handleImageError = (
  props: Props,
  event: SyntheticEvent<HTMLImageElement>,
) => {
  const { emoji, onLoadError } = props;

  // Hide error state (but keep space for it)
  if (event.target) {
    const target = event.target as HTMLElement;
    target.style.visibility = 'hidden';
  }
  if (onLoadError) {
    onLoadError(toEmojiId(emoji), emoji, event);
  }
};

// Pure functional components are used in favour of class based components, due to the performance!
// When rendering 1500+ emoji using class based components had a significant impact.
// TODO: add UFO tracking for sprite emoji
export const SpriteEmoji = (props: Props) => {
  const {
    emoji,
    fitToHeight,
    selected,
    selectOnHover,
    className,
    showTooltip,
    shouldBeInteractive = false,
    tabIndex,
    onSelected,
    onMouseMove,
    onFocus,
    onDelete,
    onLoadError,
    onLoadSuccess,
    showDelete,
    disableLazyLoad,
    autoWidth,
    ...other
  } = props;

  const representation = emoji.representation as SpriteRepresentation;
  const sprite = representation.sprite;

  const classes = `${emojiNodeStyles} ${selected ? commonSelectedStyles : ''} ${
    selectOnHover ? selectOnHoverStyles : ''
  } ${className ? className : ''}`;

  let sizing = {};
  if (fitToHeight) {
    sizing = {
      width: `${fitToHeight}px`,
      height: `${fitToHeight}px`,
      minHeight: `${fitToHeight}px`,
      minWidth: `${fitToHeight}px`,
    };
  }

  const xPositionInPercent =
    (100 / (sprite.column - 1)) * (representation.xIndex - 0);
  const yPositionInPercent =
    (100 / (sprite.row - 1)) * (representation.yIndex - 0);
  const style = {
    backgroundImage: `url(${sprite.url})`,
    backgroundPosition: `${xPositionInPercent}% ${yPositionInPercent}%`,
    backgroundSize: `${sprite.column * 100}% ${sprite.row * 100}%`,
    ...sizing,
  };

  return (
    <span
      data-testid={`sprite-emoji-${emoji.shortName}`}
      data-emoji-type="sprite"
      tabIndex={shouldBeInteractive ? tabIndex || 0 : undefined}
      role={shouldBeInteractive ? 'button' : 'img'}
      css={emojiContainer}
      className={classes}
      onKeyPress={(event) => handleKeyPress(props, event)}
      onMouseDown={(event) => {
        handleMouseDown(props, event);
      }}
      onMouseEnter={(event) => {
        handleMouseMove(props, event);
      }}
      onFocus={(event) => {
        handleFocus(props, event);
      }}
      aria-label={emoji.shortName}
      title={showTooltip ? emoji.shortName : ''}
      {...other}
    >
      <span className={emojiSprite} style={style}>
        &nbsp;
      </span>
    </span>
  );
};

// Keep as pure functional component, see renderAsSprite.
export const ImageEmoji = (props: Props) => {
  const {
    emoji,
    fitToHeight,
    selected,
    selectOnHover,
    className,
    showTooltip,
    showDelete,
    shouldBeInteractive = false,
    tabIndex,
    onSelected,
    onMouseMove,
    onFocus,
    onDelete,
    onLoadError,
    onLoadSuccess,
    disableLazyLoad,
    autoWidth,
    ...other
  } = props;

  const [ref, inView] = useInView({
    triggerOnce: true,
  });

  const ufoExp = sampledUfoRenderedEmoji(emoji);

  const classes = `${emojiMainStyle} ${emojiNodeStyles} ${
    selected ? commonSelectedStyles : ''
  } ${selectOnHover ? selectOnHoverStyles : ''} ${emojiImage} ${
    className ? className : ''
  }`;

  let width;
  let height;
  let src;

  const representation = shouldUseAltRepresentation(emoji, fitToHeight)
    ? emoji.altRepresentation
    : emoji.representation;
  if (isImageRepresentation(representation)) {
    src = representation.imagePath;
    width = representation.width;
    height = representation.height;
  } else if (isMediaRepresentation(representation)) {
    src = representation.mediaPath;
    width = representation.width;
    height = representation.height;
  }

  let deleteButton;
  if (showDelete) {
    deleteButton = (
      <DeleteButton
        onClick={(event: SyntheticEvent) => handleDelete(props, event)}
      />
    );
  }

  let sizing = {};
  if (fitToHeight && width && height) {
    // Presize image, to prevent reflow due to size changes after loading
    sizing = {
      width: autoWidth ? 'auto' : (fitToHeight / height) * width,
      height: fitToHeight,
    };
  }

  const onError = (event: SyntheticEvent<HTMLImageElement>) => {
    handleImageError(props, event);
  };

  const onLoad = () => {
    const mountedMark = ufoExp.metrics.marks.find(
      (mark) => mark.name === UfoEmojiTimings.MOUNTED_END,
    );
    // onload could trigger before onBeforeLoad when emojis in viewport at start, so we need to mark onload start manually.
    if (!hasUfoMarked(ufoExp, UfoEmojiTimings.ONLOAD_START)) {
      ufoExp.mark(UfoEmojiTimings.ONLOAD_START, mountedMark?.time);
    }
    const loadedStartMark = ufoExp.metrics.marks.find(
      (mark) => mark.name === UfoEmojiTimings.ONLOAD_START,
    );
    if (mountedMark && loadedStartMark) {
      ufoExp.addMetadata({
        lazyLoad: loadedStartMark.time > mountedMark.time,
      });
    }
    // onload_start
    if (!hasUfoMarked(ufoExp, UfoEmojiTimings.ONLOAD_END)) {
      ufoExp.mark(UfoEmojiTimings.ONLOAD_END);
    }
    ufoExp.success({
      metadata: {
        IBSupported: isIntersectionObserverSupported,
      },
    });

    if (onLoadSuccess) {
      onLoadSuccess(emoji);
    }
  };

  const onBeforeLoad = useCallback(() => {
    if (!hasUfoMarked(ufoExp, UfoEmojiTimings.ONLOAD_START)) {
      ufoExp.mark(UfoEmojiTimings.ONLOAD_START);
    }
  }, [ufoExp]);

  // because of the lack of browser support of on before load natively, used IntersectionObserver helper hook to mimic the before load time mark for UFO.
  useEffect(() => {
    if (inView) {
      onBeforeLoad();
    }
  }, [inView, onBeforeLoad]);

  const emojiNode = (
    <img
      //@ts-ignore
      loading={disableLazyLoad ? 'eager' : 'lazy'}
      src={src}
      key={src}
      alt={emoji.shortName}
      data-emoji-short-name={emoji.shortName}
      data-emoji-id={emoji.id}
      data-emoji-text={emoji.fallback || emoji.shortName}
      className="emoji"
      style={{ visibility: 'visible' }}
      onError={onError}
      onLoad={onLoad}
      {...sizing}
    />
  );

  return (
    <span
      data-testid={`image-emoji-${emoji.shortName}`}
      data-emoji-type="image"
      css={emojiStyles}
      tabIndex={shouldBeInteractive ? tabIndex || 0 : undefined}
      role={shouldBeInteractive ? 'button' : 'img'}
      className={classes}
      onKeyPress={(event) => handleKeyPress(props, event)}
      onMouseDown={(event) => {
        handleMouseDown(props, event);
      }}
      onMouseEnter={(event) => {
        handleMouseMove(props, event);
      }}
      onFocus={(event) => {
        handleFocus(props, event);
      }}
      aria-label={emoji.shortName}
      title={showTooltip ? emoji.shortName : ''}
      ref={ref}
      {...other}
    >
      {deleteButton}
      {emojiNode}
    </span>
  );
};

export const Emoji = (props: Props) => {
  const { emoji } = props;
  // start emoji rendered experience, it may have already started earlier in ResourcedEmoji or CachingEmoji
  useSampledUFOComponentExperience(
    ufoExperiences['emoji-rendered'].getInstance(emoji.id || emoji.shortName),
    SAMPLING_RATE_EMOJI_RENDERED_EXP,
    {
      source: 'Emoji',
      emojiId: emoji.id,
    },
  );

  useEffect(() => {
    const ufoExp = sampledUfoRenderedEmoji(emoji);
    if (!hasUfoMarked(ufoExp, 'fmp')) {
      ufoExp.markFMP();
    }
    if (!hasUfoMarked(ufoExp, UfoEmojiTimings.MOUNTED_END)) {
      ufoExp.mark(UfoEmojiTimings.MOUNTED_END);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // TODO: We always prefer render as image as having accessibility issues with sprite representation
  if (isSpriteRepresentation(emoji.representation)) {
    return <SpriteEmoji {...props} />;
  }
  return <ImageEmoji {...props} />;
};

export default Emoji;
