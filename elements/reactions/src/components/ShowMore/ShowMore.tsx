/** @jsx jsx */
import React from 'react';
import { jsx, SerializedStyles } from '@emotion/core';
import { FormattedMessage } from 'react-intl-next';
import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import Tooltip from '@atlaskit/tooltip';
import { i18n } from '../../shared';
import * as styles from './styles';

/**
 * Test id for wrapper button
 */
export const RENDER_SHOWMORE_TESTID = 'show-more-button';

interface CommonProps<T> {
  container?: T;
  button?: T;
}

export interface ShowMoreProps {
  /**
   * Optional mouse click DOM event on showing more emoji icon
   */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /**
   * Optional button css
   */
  buttonStyle?: SerializedStyles;
  /**
   * Optional custom styling for wrapper show more emoji button
   */
  style?: CommonProps<React.CSSProperties>;
  /**
   * Optional custom styling for wrapper show more emoji button
   */
  className?: CommonProps<string>;
}

/**
 * Show more custom emojis button
 */
export const ShowMore: React.FC<ShowMoreProps> = ({
  onClick,
  style = {},
  className = {},
  buttonStyle,
}) => {
  return (
    <div
      className={className.container}
      css={styles.moreEmojiContainerStyle}
      style={style.container}
    >
      <div css={styles.separatorStyle} />
      <FormattedMessage {...i18n.messages.moreEmoji}>
        {(message) => (
          <Tooltip content={message}>
            {/* TODO: Convert this to use Emotion css/classname instead of style prop (stylelint rule CSS inline styles should not be used, move styles to an external CSS file) */}
            <button
              className={className.button}
              css={[styles.moreButtonStyle, buttonStyle]}
              title={i18n.messages.moreEmoji.defaultMessage}
              type="button"
              style={style.button}
              onMouseDown={onClick}
              data-testid={RENDER_SHOWMORE_TESTID}
            >
              <EditorMoreIcon label="More" />
            </button>
          </Tooltip>
        )}
      </FormattedMessage>
    </div>
  );
};
