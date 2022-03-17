/** @jsx jsx */
import { jsx } from '@emotion/core';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { PureComponent } from 'react';
import { Message } from '../../types';
import Tooltip from '@atlaskit/tooltip';
import { SerializedStyles } from '@emotion/core';

export interface Props {
  message: Message;
  tooltip?: boolean;
  messageStyles: SerializedStyles;
}

export default class EmojiErrorMessage extends PureComponent<Props> {
  renderWithTooltip() {
    return (
      <div css={this.props.messageStyles}>
        <Tooltip content={this.props.message} position="top">
          <ErrorIcon label="Error" size="medium" />
        </Tooltip>
      </div>
    );
  }

  renderInline() {
    return (
      <div css={this.props.messageStyles}>
        <ErrorIcon label="Error" size="small" /> {this.props.message}
      </div>
    );
  }
  render() {
    return this.props.tooltip ? this.renderWithTooltip() : this.renderInline();
  }
}
