import ErrorIcon from '@atlaskit/icon/glyph/error';
import React from 'react';
import { PureComponent } from 'react';
import { Message } from '../../types';
import Tooltip from '@atlaskit/tooltip';

export interface Props {
  message: Message;
  className: string;
  tooltip?: boolean;
}

export default class EmojiErrorMessage extends PureComponent<Props> {
  renderWithTooltip() {
    return (
      <div className={this.props.className}>
        <Tooltip content={this.props.message} position="top">
          <ErrorIcon label="Error" size="medium" />
        </Tooltip>
      </div>
    );
  }

  renderInline() {
    return (
      <div className={this.props.className}>
        <ErrorIcon label="Error" size="small" /> {this.props.message}
      </div>
    );
  }
  render() {
    return this.props.tooltip ? this.renderWithTooltip() : this.renderInline();
  }
}
