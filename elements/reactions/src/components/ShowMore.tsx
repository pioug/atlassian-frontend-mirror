/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';
import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import { borderRadius } from '@atlaskit/theme/constants';
import { N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import React from 'react';
import { messages } from './i18n';
import { FormattedMessage } from 'react-intl-next';
import { revealStyle } from './Selector';

const moreEmojiContainerStyle = css({ display: 'flex' });

const moreButtonStyle = css({
  opacity: 0,
  outline: 'none',
  backgroundColor: 'transparent',
  border: 0,
  borderRadius: `${borderRadius()}px`,
  cursor: 'pointer',
  margin: '4px 4px 4px 0',
  padding: '4px',
  width: '38px',
  verticalAlign: 'top',

  '&:hover': {
    backgroundColor: token('color.background.neutral.subtle.hovered', N30A),
  },
});

const separatorStyle = css({
  backgroundColor: token('color.border', N30A),
  margin: '8px 8px 8px 4px',
  width: '1px',
  height: '60%',
  display: 'inline-block',
});

export type CommonProps<T> = {
  container?: T;
  button?: T;
};

export type Props = {
  /**
   * Optional mouse click DOM event on showing more emoji icon
   */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /**
   * Optional button css
   */
  revealStyle?: SerializedStyles;
  /**
   * Optional custom styling for wrapper show more emoji button
   */
  style?: CommonProps<React.CSSProperties>;
  /**
   * Optional custom styling for wrapper show more emoji button
   */
  className?: CommonProps<string>;
};
export const showMoreTestId = 'show-more-button';
export class ShowMore extends React.PureComponent<Props> {
  static defaultProps = {
    className: {},
    style: {},
  };

  render() {
    const { style, onClick, className: classNameProp } = this.props;

    return (
      <div
        className={classNameProp!.container}
        css={moreEmojiContainerStyle}
        style={style!.container}
      >
        <div css={separatorStyle} />
        <FormattedMessage {...messages.moreEmoji}>
          {(text) => (
            <Tooltip content={text}>
              <button
                className={classNameProp!.button}
                css={[moreButtonStyle, revealStyle]}
                style={style!.button}
                onMouseDown={onClick}
                data-testid={showMoreTestId}
              >
                <EditorMoreIcon label="More" />
              </button>
            </Tooltip>
          )}
        </FormattedMessage>
      </div>
    );
  }
}
