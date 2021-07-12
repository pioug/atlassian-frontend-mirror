import React, { useRef, useCallback } from 'react';
import {
  useAnalyticsEvents,
  UIAnalyticsEvent,
  AnalyticsContext,
} from '@atlaskit/analytics-next';
import Textfield from '@atlaskit/textfield';
import Button from '@atlaskit/button/custom-theme-button';
import { gridSize } from '@atlaskit/theme/constants';
import Spinner from '@atlaskit/spinner';
import SearchIcon from '@atlaskit/icon/glyph/search';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';
import { REQUEST_STATE } from '../../../model/Requests';

import { useSearchContext } from '../../contexts/searchContext';
import { messages } from '../../../messages';

import {
  SearchInputContainer,
  SearchIconContainer,
  CloseButtonAndSpinnerContainer,
} from './styled';

const ANALYTICS_CONTEXT_DATA = {
  componentName: 'searchInput',
  packageName,
  packageVersion,
};

export const SearchInput: React.FC<InjectedIntlProps> = ({
  intl: { formatMessage },
}) => {
  const {
    searchValue,
    searchState,
    onSearch,
    onSearchInputChanged,
    onSearchInputCleared,
  } = useSearchContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const handleOnInputChange = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (onSearch) {
        const value = (event.target as any).value;
        onSearch(value);
        if (onSearchInputChanged) {
          const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
            action: 'inputChanged',
            attributes: {
              value,
            },
          });
          onSearchInputChanged(event, analyticsEvent, value);
        }
      }
    },
    [createAnalyticsEvent, onSearch, onSearchInputChanged],
  );

  const handleOnKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleOnInputChange(event);
    }
  };

  const handleOnClearButtonClick = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
      if (onSearch) {
        if (inputRef && inputRef.current) {
          inputRef.current.value = '';
          onSearch('');
        }

        if (onSearchInputCleared) {
          const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
            action: 'clicked',
          });
          onSearchInputCleared(event, analyticsEvent);
        }
      }
    },
    [createAnalyticsEvent, onSearch, onSearchInputCleared],
  );

  if (inputRef && inputRef.current) {
    inputRef.current.value = searchValue;
  }

  return (
    <SearchInputContainer>
      <Textfield
        autoComplete="off"
        ref={inputRef}
        name="help-search-input"
        elemBeforeInput={
          <SearchIconContainer>
            <SearchIcon label="" />
          </SearchIconContainer>
        }
        elemAfterInput={
          <CloseButtonAndSpinnerContainer>
            {searchState === REQUEST_STATE.loading && <Spinner size="small" />}
            {searchValue !== '' && (
              <Button
                css={{
                  width: `${gridSize() * 3}px`,
                  height: `${gridSize() * 3}px`,
                }}
                appearance="subtle"
                onClick={handleOnClearButtonClick}
                spacing="none"
              >
                <EditorCloseIcon label="" />
              </Button>
            )}
          </CloseButtonAndSpinnerContainer>
        }
        placeholder={formatMessage(messages.help_search_placeholder)}
        onChange={handleOnInputChange}
        onKeyPress={handleOnKeyPress}
        value={searchValue}
      />
    </SearchInputContainer>
  );
};

const SearchInputWithContext: React.FC<InjectedIntlProps> = (props) => {
  return (
    <AnalyticsContext data={ANALYTICS_CONTEXT_DATA}>
      <SearchInput {...props} />
    </AnalyticsContext>
  );
};

export default injectIntl(SearchInputWithContext);
