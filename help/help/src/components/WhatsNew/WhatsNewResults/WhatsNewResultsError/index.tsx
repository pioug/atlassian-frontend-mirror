import React from 'react';
import Button from '@atlaskit/button/custom-theme-button';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { WHATS_NEW_ITEM_TYPES } from '../../../../model/WhatsNew';

import ErrorImage from '../../../../assets/ErrorImage';
import { messages } from '../../../../messages';

import {
  SearchResultEmptyMessageImage,
  SearchResultEmptyMessageText,
} from './styled';

export interface Props {
  onSearch?(
    filter?: WHATS_NEW_ITEM_TYPES | '',
    numberOfItems?: number,
    page?: string,
  ): Promise<void>;
}

export const WhatsNewResultsError: React.FC<Props & InjectedIntlProps> = ({
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
    <SearchResultEmptyMessageText>
      {onSearch && (
        <Button onClick={() => onSearch('')} appearance="primary">
          {formatMessage(messages.help_search_error_button_label)}
        </Button>
      )}
    </SearchResultEmptyMessageText>
  </>
);

export default injectIntl(WhatsNewResultsError);
