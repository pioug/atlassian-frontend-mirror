import { layers } from '@atlaskit/theme/constants';
import React, { FC, useRef, useState } from 'react';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

import { lorem, onClose, onOpen, onSelection } from '../example-helpers';
import SearchTextInput from '../example-helpers/demo-search-text-input';
import { TypeaheadProps } from '../example-helpers/typeahead-props';
import { EmojiTypeAhead } from '../src/typeahead';
import { EmojiId, OptionalEmojiDescription } from '../src/types';
import debug from '../src/util/logger';

const loremContent = (
  <div>
    <p style={{ width: '400px' }}>{lorem}</p>
  </div>
);

export const EmojiTypeAheadTextInput: FC<TypeaheadProps> = (props) => {
  const emojiTypeAheadRef = useRef<EmojiTypeAhead | null>();
  const [active, setActive] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');

  const { onSelection, label, emojiProvider, position } = props;
  debug('demo-emoji-text-input.render', position);
  const target = position ? '#demo-input' : undefined;

  const showEmojiPopup = () => {
    setActive(true);
  };

  const hideEmojiPopup = () => {
    setActive(false);
  };

  const handleSelection = (
    emojiId: EmojiId,
    emoji: OptionalEmojiDescription,
  ) => {
    hideEmojiPopup();
    onSelection(emojiId, emoji);
  };

  const updateSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (active) {
      setQuery(event.target.value || '');
    }
  };

  const handleSearchTextInputChange = (
    query: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateSearch(query);
  };

  const handleSearchTextInputUp = () => {
    emojiTypeAheadRef.current?.selectPrevious();
  };

  const handleSearchTextInputDown = () => {
    emojiTypeAheadRef.current?.selectNext();
  };

  const handleSearchTextInputEnter = () => {
    emojiTypeAheadRef.current?.chooseCurrentSelection();
  };

  const handleEmojiTypeAheadRef = (ref: EmojiTypeAhead | null) => {
    emojiTypeAheadRef.current = ref;
  };

  const handleEmojiTypeAheadSelection = (
    emojiId: EmojiId,
    emoji: OptionalEmojiDescription,
  ) => {
    handleSelection(emojiId, emoji);
  };

  const searchInput = (
    <SearchTextInput
      inputId="demo-input"
      label={label}
      onChange={handleSearchTextInputChange}
      onUp={handleSearchTextInputUp}
      onDown={handleSearchTextInputDown}
      onEnter={handleSearchTextInputEnter}
      onEscape={hideEmojiPopup}
      onFocus={showEmojiPopup}
      onBlur={hideEmojiPopup}
    />
  );

  let emojiTypeAhead;

  if (active) {
    emojiTypeAhead = (
      <EmojiTypeAhead
        target={target}
        position={position}
        onSelection={handleEmojiTypeAheadSelection}
        onOpen={onOpen}
        onClose={onClose}
        ref={handleEmojiTypeAheadRef}
        query={query}
        emojiProvider={emojiProvider}
        zIndex={layers.modal()}
      />
    );
  }

  return (
    <div style={{ padding: '10px' }}>
      {searchInput}
      {emojiTypeAhead}
      {loremContent}
    </div>
  );
};

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
