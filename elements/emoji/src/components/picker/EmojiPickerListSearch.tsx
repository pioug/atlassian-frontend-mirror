/** @jsx jsx */
import React, { useLayoutEffect, useRef } from 'react';
import { jsx } from '@emotion/react';
import TextField from '@atlaskit/textfield';
import SearchIcon from '@atlaskit/icon/glyph/search';
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
}

export const emojiPickerSearchTestId = 'emoji-picker-serach';

export const EmojiPickerListSearch = (props: Props) => {
  const { style, query, onChange } = props;
  const textRef = useRef<HTMLInputElement>(null);

  const { formatMessage } = useIntl();

  // Debounce callback
  const [debouncedSearch] = useDebouncedCallback(
    (value: string) => {
      onChange(value);
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
      <TextField
        aria-label={formatMessage(messages.searchLabel)}
        css={input}
        autoComplete="off"
        name="search"
        placeholder={`${formatMessage(messages.searchPlaceholder)}...`}
        defaultValue={query || ''}
        onChange={handleOnChange}
        isCompact
        elemBeforeInput={
          <span css={searchIcon}>
            <SearchIcon label="" />
          </span>
        }
        testId={emojiPickerSearchTestId}
        ref={textRef}
      />
    </div>
  );
};
