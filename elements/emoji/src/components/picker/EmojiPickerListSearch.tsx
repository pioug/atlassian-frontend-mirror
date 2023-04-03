/** @jsx jsx */
import React, { useLayoutEffect, useRef, useState } from 'react';
import { jsx } from '@emotion/react';
import TextField from '@atlaskit/textfield';
import SearchIcon from '@atlaskit/icon/glyph/search';
import VisuallyHidden from '@atlaskit/visually-hidden';
import { useIntl } from 'react-intl-next';
import { Styles } from '../../types';
import { messages } from '../i18n';
import { input, pickerSearch, searchIcon } from './styles';
import { EMOJI_SEARCH_DEBOUNCE } from '../../util/constants';
import { useDebouncedCallback } from 'use-debounce';

export interface Props {
  style?: Styles;
  query?: string;
  onChange: (value: string) => void;
  resultsCount: number;
}

export const emojiPickerSearchTestId = 'emoji-picker-serach';

export const EmojiPickerListSearch = (props: Props) => {
  const { style, query, resultsCount, onChange } = props;
  const textRef = useRef<HTMLInputElement>(null);
  const [dirty, setDirty] = useState(false);

  const { formatMessage } = useIntl();

  // Debounce callback
  const [debouncedSearch] = useDebouncedCallback(
    (value: string) => {
      onChange(value);
      setDirty(true);
    },
    // delay in ms
    EMOJI_SEARCH_DEBOUNCE,
  );

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      if (textRef) {
        textRef.current?.focus();
      }
    });
  }, []);

  return (
    <div css={pickerSearch} style={style}>
      <VisuallyHidden id="emoji-search-results-status" role="status">
        {dirty &&
          query === '' &&
          formatMessage(messages.searchResultsStatusSeeAll)}
        {query !== '' &&
          formatMessage(messages.searchResultsStatus, {
            count: resultsCount,
          })}
      </VisuallyHidden>
      <TextField
        role="searchbox"
        aria-label={formatMessage(messages.searchLabel)}
        css={input}
        autoComplete="off"
        name="search"
        placeholder={`${formatMessage(messages.searchPlaceholder)}...`}
        defaultValue={query || ''}
        onChange={handleOnChange}
        elemBeforeInput={
          <span css={searchIcon}>
            <SearchIcon label="" />
          </span>
        }
        testId={emojiPickerSearchTestId}
        ref={textRef}
        isCompact
      />
    </div>
  );
};
