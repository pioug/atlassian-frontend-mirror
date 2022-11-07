/** @jsx jsx */
import React, { MouseEvent, forwardRef } from 'react';
import { jsx } from '@emotion/react';
import { EmojiDescription } from '../../types';
import { leftClick } from '../../util/mouse';
import { emojiButton, hiddenToneButton } from './styles';
import Emoji from './Emoji';

export interface Props {
  emoji: EmojiDescription;
  onSelected?: () => void;
  selectOnHover?: boolean;
  ariaLabelText?: string;
  ariaExpanded?: boolean;
  shouldHideButton?: boolean;
}

const handleMouseDown = (props: Props, event: MouseEvent<any>) => {
  const { onSelected } = props;
  event.preventDefault();
  if (onSelected && leftClick(event)) {
    onSelected();
  }
};

const handleKeyPress = (
  props: Props,
  event: React.KeyboardEvent<HTMLButtonElement>,
) => {
  const { onSelected } = props;
  if (onSelected && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    onSelected();
  }
};

export const EmojiButton = forwardRef<HTMLButtonElement, Props>(
  (props: Props, ref) => {
    const {
      emoji,
      selectOnHover,
      ariaLabelText,
      ariaExpanded,
      shouldHideButton,
    } = props;

    return (
      <button
        ref={ref}
        aria-expanded={ariaExpanded}
        css={shouldHideButton ? hiddenToneButton : emojiButton}
        onMouseDown={(event) => {
          handleMouseDown(props, event);
        }}
        onKeyDown={(event) => {
          handleKeyPress(props, event);
        }}
        aria-label={ariaLabelText}
      >
        <Emoji emoji={emoji} selectOnHover={selectOnHover} />
      </button>
    );
  },
);

export default EmojiButton;
