import React, { useRef } from 'react';
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

import { useHelpContext } from '../../HelpContext';
import { messages } from '../../../messages';

import {
  SearchInputContainer,
  SearchIconContainer,
  CloseButtonAndSpinnerContainer,
} from './styled';

export const SearchInput: React.FC<InjectedIntlProps> = ({
  intl: { formatMessage },
}) => {
  const { help } = useHelpContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const onInputChange = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    const value = (event.target as any).value;
    help.onSearch(value);
    if (help.onSearchInputChanged) {
      const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
        action: 'inputChanged',
        attributes: {
          value,
        },
      });
      help.onSearchInputChanged(event, analyticsEvent, value);
    }
  };

  const handleOnKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onInputChange(event);
    }
  };

  const onClearButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ): void => {
    if (inputRef && inputRef.current) {
      inputRef.current.value = '';
      help.onSearch('');
    }

    if (help.onSearchInputCleared) {
      const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
        action: 'clicked',
      });
      help.onSearchInputCleared(event, analyticsEvent);
    }
  };

  if (inputRef && inputRef.current) {
    inputRef.current.value = help.searchValue;
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
            {help.searchState === REQUEST_STATE.loading && (
              <Spinner size="small" />
            )}
            {help.searchValue !== '' && (
              <Button
                css={{
                  width: `${gridSize() * 3}px`,
                  height: `${gridSize() * 3}px`,
                }}
                appearance="subtle"
                onClick={onClearButtonClick}
                spacing="none"
              >
                <EditorCloseIcon label="" />
              </Button>
            )}
          </CloseButtonAndSpinnerContainer>
        }
        placeholder={formatMessage(messages.help_search_placeholder)}
        onChange={onInputChange}
        onKeyPress={handleOnKeyPress}
        value={help.searchValue}
      />
    </SearchInputContainer>
  );
};

const SearchInputWithContext: React.FC<InjectedIntlProps> = (props) => {
  return (
    <AnalyticsContext
      data={{
        componentName: 'searchInput',
        packageName,
        packageVersion,
      }}
    >
      <SearchInput {...props} />
    </AnalyticsContext>
  );
};

export default injectIntl(SearchInputWithContext);
