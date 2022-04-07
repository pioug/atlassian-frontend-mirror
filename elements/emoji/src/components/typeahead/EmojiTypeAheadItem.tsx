/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { PureComponent } from 'react';
import { toEmojiId } from '../../util/type-helpers';
import { EmojiDescription, OnEmojiEvent } from '../../types';
import { leftClick } from '../../util/mouse';
import { EmojiPreviewComponent } from '../common/EmojiPreviewComponent';
import {
  typeAheadItem,
  selected as selectedStyles,
  typeAheadItemRow,
  typeaheadSelected,
} from './styles';
import LegacyEmojiContextProvider from '../../context/LegacyEmojiContextProvider';

export interface Props {
  onMouseMove: OnEmojiEvent;
  onSelection: OnEmojiEvent;
  selected: boolean;
  emoji: EmojiDescription;
}

export default class EmojiTypeAheadItem extends PureComponent<Props, {}> {
  // internal, used for callbacks
  onEmojiSelected: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const { emoji, onSelection } = this.props;
    if (leftClick(event) && onSelection) {
      event.preventDefault();
      onSelection(toEmojiId(emoji), emoji, event);
    }
  };

  onEmojiMenuItemMouseMove: React.MouseEventHandler<HTMLDivElement> = (
    event,
  ) => {
    const { emoji, onMouseMove } = this.props;
    if (onMouseMove) {
      onMouseMove(toEmojiId(emoji), emoji, event);
    }
  };

  render() {
    const { selected, emoji } = this.props;
    const classes = [typeAheadItem, selected && selectedStyles];

    return (
      <LegacyEmojiContextProvider>
        <div
          className={`ak-emoji-typeahead-item ${
            selected ? typeaheadSelected : ''
          }`}
          css={classes}
          onMouseDown={this.onEmojiSelected}
          onMouseMove={this.onEmojiMenuItemMouseMove}
          data-emoji-id={emoji.shortName}
        >
          <div css={typeAheadItemRow}>
            {emoji && <EmojiPreviewComponent emoji={emoji} />}
          </div>
        </div>
      </LegacyEmojiContextProvider>
    );
  }
}
