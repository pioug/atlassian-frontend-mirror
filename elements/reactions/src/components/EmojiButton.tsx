/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { EmojiId, OnEmojiEvent } from '@atlaskit/emoji/types';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import { ResourcedEmoji } from '@atlaskit/emoji/element';
import React from 'react';
import { PureComponent } from 'react';
import { isLeftClick } from './utils';

const emojiButtonStyle = css({
  outline: 'none',
  display: 'flex',
  backgroundColor: 'transparent',
  border: 0,
  borderRadius: '5px',
  cursor: 'pointer',
  margin: '0',
  padding: '10px 8px',
  '&:hover > span': {
    transition: 'transform cubic-bezier(0.23, 1, 0.32, 1) 200ms',
    transform: 'scale(1.33)',
  },
});

export interface Props {
  /**
   * identifier info for a given emoji
   */
  emojiId: EmojiId;
  /**
   * Async provider to fetch the emoji
   */
  emojiProvider: Promise<EmojiProvider>;
  /**
   * Event handler when a new emoji is selected
   */
  onClick: OnEmojiEvent;
}

export class EmojiButton extends PureComponent<Props, {}> {
  private handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (this.props.onClick && isLeftClick(event)) {
      this.props.onClick(this.props.emojiId, undefined, event);
    }
  };

  render() {
    const { emojiId, emojiProvider } = this.props;

    return (
      <button onMouseUp={this.handleMouseDown} css={emojiButtonStyle}>
        <ResourcedEmoji emojiProvider={emojiProvider} emojiId={emojiId} />
      </button>
    );
  }
}
