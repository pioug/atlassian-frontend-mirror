import React from 'react';
import Button from '@atlaskit/button/custom-theme-button';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import ErrorImage from '../../../assets/ErrorImage';
import { messages } from '../../../messages';

import {
  SearchResultEmptyMessageImage,
  SearchResultEmptyMessageText,
} from './styled';

export interface Props {
  onSearch?(value?: string): void;
}

export const SearchResultsError: React.FC<Props & InjectedIntlProps> = ({
  onSearch,
  intl: { formatMessage },
}) => (
  <>
    <SearchResultEmptyMessageImage>
      <ErrorImage />
    </SearchResultEmptyMessageImage>

    <SearchResultEmptyMessageText>
      <strong>{formatMessage(messages.help_search_error)}</strong>
    </SearchResultEmptyMessageText>
    <SearchResultEmptyMessageText>
      <p>{formatMessage(messages.help_search_error_line_two)}</p>
    </SearchResultEmptyMessageText>
    {onSearch && (
      <SearchResultEmptyMessageText>
        <Button onClick={() => onSearch()} appearance="primary">
          {formatMessage(messages.help_search_error_button_label)}
        </Button>
      </SearchResultEmptyMessageText>
    )}
  </>
);

export default injectIntl(SearchResultsError);
