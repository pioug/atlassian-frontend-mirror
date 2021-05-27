import { layers } from '@atlaskit/theme/constants';
import React from 'react';
import { Component } from 'react';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

import { lorem, onClose, onOpen, onSelection } from '../example-helpers';
import SearchTextInput from '../example-helpers/demo-search-text-input';
import {
  TypeaheadProps,
  TypeaheadState,
} from '../example-helpers/typeahead-props';
import { EmojiTypeAhead } from '../src/typeahead';
import { EmojiId, OptionalEmojiDescription } from '../src/types';
import debug from '../src/util/logger';

export class EmojiTypeAheadTextInput extends Component<
  TypeaheadProps,
  TypeaheadState
> {
  private emojiTypeAheadRef?: EmojiTypeAhead | null;

  static defaultProps = {
    onSelection: () => {},
  };

  constructor(props: TypeaheadProps) {
    super(props);
    this.state = {
      active: false,
      query: '',
    };
  }

  showEmojiPopup = () => {
    this.setState({
      active: true,
    });
  };

  hideEmojiPopup = () => {
    this.setState({
      active: false,
    });
  };

  handleSelection = (emojiId: EmojiId, emoji: OptionalEmojiDescription) => {
    this.hideEmojiPopup();
    this.props.onSelection(emojiId, emoji);
  };

  updateSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (this.state.active) {
      this.setState({
        query: event.target.value || '',
      } as TypeaheadState);
    }
  };

  private handleSearchTextInputChange = (
    query: React.ChangeEvent<HTMLInputElement>,
  ) => {
    this.updateSearch(query);
  };
  private handleSearchTextInputUp = () => {
    this.emojiTypeAheadRef && this.emojiTypeAheadRef.selectPrevious();
  };
  private handleSearchTextInputDown = () => {
    this.emojiTypeAheadRef && this.emojiTypeAheadRef.selectNext();
  };
  private handleSearchTextInputEnter = () => {
    this.emojiTypeAheadRef && this.emojiTypeAheadRef.chooseCurrentSelection();
  };
  private handleEmojiTypeAheadRef = (ref: EmojiTypeAhead | null) => {
    this.emojiTypeAheadRef = ref;
  };
  private handleEmojiTypeAheadSelection = (
    emojiId: EmojiId,
    emoji: OptionalEmojiDescription,
  ) => {
    this.handleSelection(emojiId, emoji);
  };

  render() {
    const { label, emojiProvider, position } = this.props;
    debug('demo-emoji-text-input.render', position);
    const target = position ? '#demo-input' : undefined;
    const searchInput = (
      <SearchTextInput
        inputId="demo-input"
        label={label}
        onChange={this.handleSearchTextInputChange}
        onUp={this.handleSearchTextInputUp}
        onDown={this.handleSearchTextInputDown}
        onEnter={this.handleSearchTextInputEnter}
        onEscape={this.hideEmojiPopup}
        onFocus={this.showEmojiPopup}
        onBlur={this.hideEmojiPopup}
      />
    );

    let emojiTypeAhead;

    if (this.state.active) {
      emojiTypeAhead = (
        <EmojiTypeAhead
          target={target}
          position={position}
          onSelection={this.handleEmojiTypeAheadSelection}
          onOpen={onOpen}
          onClose={onClose}
          ref={this.handleEmojiTypeAheadRef}
          query={this.state.query}
          emojiProvider={emojiProvider}
          zIndex={layers.modal()}
        />
      );
    }

    const loremContent = (
      <div>
        <p style={{ width: '400px' }}>{lorem}</p>
        <p style={{ width: '400px' }}>{lorem}</p>
      </div>
    );

    return (
      <div style={{ padding: '10px' }}>
        {searchInput}
        {emojiTypeAhead}
        {loremContent}
      </div>
    );
  }
}

export default function Example() {
  return (
    <EmojiTypeAheadTextInput
      label="Emoji search"
      onSelection={onSelection}
      emojiProvider={getEmojiResource()}
      position="below"
    />
  );
}
