import Button from '@atlaskit/button/custom-theme-button';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import { N500 } from '@atlaskit/theme/colors';
import Tooltip from '@atlaskit/tooltip';
import classNames from 'classnames';
import React from 'react';
import { MouseEvent, SyntheticEvent } from 'react';
import { shouldUseAltRepresentation } from '../../api/EmojiUtils';
import { deleteEmojiLabel } from '../../util/constants';
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
} from '../../types';
import { leftClick } from '../../util/mouse';
import * as styles from './styles';

export interface Props {
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
   *
   * CSS, fast, does not require a re-render, but selected state not
   * externally controlled via props.
   */
  selectOnHover?: boolean;

  /**
   * Called when an emoji is selected
   */
  onSelected?: OnEmojiEvent;

  /**
   * Called when the mouse moved over the emoji.
   */
  onMouseMove?: OnEmojiEvent;

  /**
   * Called when an emoji is deleted
   */
  onDelete?: OnEmojiEvent;

  /**
   * Callback for if an emoji image fails to load.
   */
  onLoadError?: OnEmojiEvent<HTMLImageElement>;

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

const handleMouseMove = (props: Props, event: MouseEvent<any>) => {
  const { emoji, onMouseMove } = props;
  if (onMouseMove) {
    onMouseMove(toEmojiId(emoji), emoji, event);
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
const renderAsSprite = (props: Props) => {
  const {
    emoji,
    fitToHeight,
    selected,
    selectOnHover,
    className,
    showTooltip,
  } = props;
  const representation = emoji.representation as SpriteRepresentation;
  const sprite = representation.sprite;
  const classes = {
    [styles.emojiContainer]: true,
    [styles.emojiNode]: true,
    [styles.selected]: selected,
    [styles.selectOnHover]: selectOnHover,
  };

  if (className) {
    classes[className] = true;
  }

  let sizing = {};
  if (fitToHeight) {
    sizing = {
      width: `${fitToHeight}px`,
      height: `${fitToHeight}px`,
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
  const emojiNode = (
    <span className={styles.emojiSprite} style={style}>
      &nbsp;
    </span>
  );

  return (
    <span
      className={classNames(classes)}
      onMouseDown={event => {
        handleMouseDown(props, event);
      }}
      onMouseMove={event => {
        handleMouseMove(props, event);
      }}
      aria-label={emoji.shortName}
    >
      {showTooltip ? (
        <Tooltip tag="span" content={emoji.shortName}>
          {emojiNode}
        </Tooltip>
      ) : (
        emojiNode
      )}
    </span>
  );
};

// Keep as pure functional component, see renderAsSprite.
const renderAsImage = (props: Props) => {
  const {
    emoji,
    fitToHeight,
    selected,
    selectOnHover,
    className,
    showTooltip,
    showDelete,
  } = props;

  const classes = {
    [styles.emoji]: true,
    [styles.emojiNode]: true,
    [styles.selected]: selected,
    [styles.selectOnHover]: selectOnHover,
    [styles.emojiImage]: true,
  };

  if (className) {
    classes[className] = true;
  }

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
      <span className={styles.deleteButton}>
        <Button
          iconBefore={
            <CrossCircleIcon
              label={deleteEmojiLabel}
              primaryColor={N500}
              size="small"
            />
          }
          onClick={(event: SyntheticEvent) => handleDelete(props, event)}
          appearance="subtle-link"
          spacing="none"
        />
      </span>
    );
  }

  let sizing = {};
  if (fitToHeight && width && height) {
    // Presize image, to prevent reflow due to size changes after loading
    sizing = {
      width: (fitToHeight / height) * width,
      height: fitToHeight,
    };
  }

  const onError = (event: SyntheticEvent<HTMLImageElement>) => {
    handleImageError(props, event);
  };

  // Pass src attribute as key to force React to rerender img node since browser does not
  // change preview image until loaded
  const emojiNode = (
    <img
      src={src}
      key={src}
      alt={emoji.shortName}
      data-emoji-short-name={emoji.shortName}
      data-emoji-id={emoji.id}
      data-emoji-text={emoji.fallback || emoji.shortName}
      className="emoji"
      style={{ visibility: 'visible' }}
      onError={onError}
      {...sizing}
    />
  );

  return (
    <span
      className={classNames(classes)}
      onMouseDown={event => {
        handleMouseDown(props, event);
      }}
      onMouseMove={event => {
        handleMouseMove(props, event);
      }}
      aria-label={emoji.shortName}
    >
      {deleteButton}
      {showTooltip ? (
        <Tooltip tag="span" content={emoji.shortName}>
          {emojiNode}
        </Tooltip>
      ) : (
        emojiNode
      )}
    </span>
  );
};

export const Emoji = (props: Props) => {
  const { emoji } = props;
  if (isSpriteRepresentation(emoji.representation)) {
    return renderAsSprite(props);
  }
  return renderAsImage(props);
};

export default Emoji;
