import React from 'react';
import { PureComponent } from 'react';
import { getEmojis } from '@atlaskit/util-data-test/get-emojis';
import { onSelection } from '../example-helpers';
import EmojiTypeAheadList from '../src/components/typeahead/EmojiTypeAheadList';
import { EmojiDescription } from '../src/types';

function randomEmojis(): EmojiDescription[] {
  return getEmojis()
    .filter(() => Math.random() < 0.02)
    .slice(0, 50);
}

export interface Props {}

export interface State {
  emojis: EmojiDescription[];
}

export default class RefreshableEmojiList extends PureComponent<Props, State> {
  private emojiList: EmojiTypeAheadList | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      emojis: randomEmojis(),
    };
  }

  updateData = () => {
    this.setState({
      emojis: randomEmojis(),
    });
  };

  moveUp = () => {
    if (this.emojiList) {
      this.emojiList.selectPrevious();
    }
  };

  moveDown = () => {
    if (this.emojiList) {
      this.emojiList.selectNext();
    }
  };

  private handleEmojiTypeAheadListRef = (ref: EmojiTypeAheadList | null) => {
    this.emojiList = ref;
  };

  render() {
    const emojiList = (
      <EmojiTypeAheadList
        emojis={this.state.emojis}
        onEmojiSelected={onSelection}
        ref={this.handleEmojiTypeAheadListRef}
      />
    );

    return (
      <div>
        <div style={{ paddingBottom: '10px' }}>
          <button
            onClick={this.updateData}
            style={{ height: '30px', marginRight: '10px' }}
          >
            Random refresh
          </button>
          <button
            onClick={this.moveUp}
            style={{ height: '30px', marginRight: '10px' }}
          >
            Up
          </button>
          <button
            onClick={this.moveDown}
            style={{ height: '30px', marginRight: '10px' }}
          >
            Down
          </button>
        </div>
        {emojiList}
      </div>
    );
  }
}
