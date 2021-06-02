import classNames from 'classnames';
import React from 'react';
import { PureComponent } from 'react';
import { toEmojiId } from '../../util/type-helpers';
import { EmojiDescription, OnEmojiEvent } from '../../types';
import { leftClick } from '../../util/mouse';
import EmojiPreview from '../common/EmojiPreview';
import * as styles from './styles';

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
    const classes = classNames({
      'ak-emoji-typeahead-item': true,
      [styles.typeAheadItem]: true,
      [styles.selected]: selected,
    });

    return (
      <div
        className={classes}
        onMouseDown={this.onEmojiSelected}
        onMouseMove={this.onEmojiMenuItemMouseMove}
        data-emoji-id={emoji.shortName}
      >
        <div className={styles.typeAheadItemRow}>
          <EmojiPreview emoji={emoji} />
        </div>
      </div>
    );
  }
}
