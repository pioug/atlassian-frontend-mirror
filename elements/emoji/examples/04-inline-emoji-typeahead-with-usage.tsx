import { layers } from '@atlaskit/theme/constants';
import React, { useRef, useState } from 'react';
import { lorem, onClose, onOpen } from '../example-helpers';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { getEmojiResourceUsageClear } from '@atlaskit/util-data-test/get-emoji-resource-usage-clear';
import {
  UsageShowAndClearComponent,
  UsagingShowingProps,
} from '../example-helpers/demo-emoji-usage-components';
import SearchTextInput from '../example-helpers/demo-search-text-input';
import type { TypeaheadProps } from '../example-helpers/typeahead-props';
import type { EmojiProvider } from '../src/resource';
import { EmojiTypeAhead } from '../src/typeahead';
import type { EmojiId, OptionalEmojiDescription } from '../src/types';
import debug from '../src/util/logger';
import { IntlProvider } from 'react-intl-next';

const tallPageStyle = {
  height: '1000px',
  padding: '30px',
};

const downPage: React.CSSProperties = {
  position: 'absolute',
  top: '400px',
};

const loremContent = (
  <div>
    <p style={{ width: '400px' }}>{lorem}</p>
    <p style={{ width: '400px' }}>{lorem}</p>
  </div>
);

export const EmojiTextInput = (
  props: React.PropsWithChildren<TypeaheadProps>,
) => {
  const emojiTypeAheadRef = useRef<EmojiTypeAhead | null>();
  const { onSelection, label, emojiProvider, position } = props;
  const target = position ? '#demo-input' : undefined;
  debug('demo-emoji-text-input.render', position);

  const [active, setActive] = useState(false);
  const [query, setQuery] = useState('');

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
    <div style={tallPageStyle}>
      <div style={downPage}>
        {loremContent}
        {searchInput}
        {emojiTypeAhead}
      </div>
    </div>
  );
};

class UsageShowingEmojiTypeAheadTextInput extends UsageShowAndClearComponent {
  constructor(props: UsagingShowingProps) {
    super(props);
  }

  getWrappedComponent() {
    const { emojiResource } = this.props;
    return (
      <EmojiTextInput
        label="Emoji search"
        onSelection={this.onSelection}
        emojiProvider={Promise.resolve(emojiResource as EmojiProvider)}
        position="above"
      />
    );
  }
}

export default function Example() {
  return (
    <IntlProvider locale="en">
      <UsageShowingEmojiTypeAheadTextInput
        emojiResource={getEmojiResourceUsageClear()}
      />
    </IntlProvider>
  );
}
