import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { messages } from '../../messages';

import { DividerLine, LoadingRectangle } from '../../util/styled';

import {
  LoadignRelatedArticleList,
  LoadignRelatedArticleListItem,
} from './styled';

const RelatedArticlesLoading: React.FC<InjectedIntlProps> = ({
  intl: { formatMessage },
}) => {
  return (
    <>
      <LoadignRelatedArticleList
        aria-label={formatMessage(messages.help_loading)}
        role="img"
      >
        <LoadignRelatedArticleListItem>
          <LoadingRectangle
            contentHeight="11px"
            contentWidth="60px"
            marginTop="0"
          />
          <LoadingRectangle contentWidth="100%" marginTop="4px" />
          <LoadingRectangle contentWidth="100%" marginTop="8px" />
          <LoadingRectangle contentWidth="100%" marginTop="4px" />
          <LoadingRectangle contentWidth="100%" marginTop="4px" />
        </LoadignRelatedArticleListItem>

        <LoadignRelatedArticleListItem>
          <LoadingRectangle
            contentHeight="11px"
            contentWidth="60px"
            marginTop="0"
          />
          <LoadingRectangle contentWidth="100%" marginTop="4px" />
          <LoadingRectangle contentWidth="100%" marginTop="8px" />
          <LoadingRectangle contentWidth="100%" marginTop="4px" />
          <LoadingRectangle contentWidth="100%" marginTop="4px" />
        </LoadignRelatedArticleListItem>

        <LoadignRelatedArticleListItem>
          <LoadingRectangle
            contentHeight="11px"
            contentWidth="60px"
            marginTop="0"
          />
          <LoadingRectangle contentWidth="100%" marginTop="4px" />
          <LoadingRectangle contentWidth="100%" marginTop="8px" />
          <LoadingRectangle contentWidth="100%" marginTop="4px" />
          <LoadingRectangle contentWidth="100%" marginTop="4px" />
        </LoadignRelatedArticleListItem>
        <DividerLine />
      </LoadignRelatedArticleList>
    </>
  );
};

export default injectIntl(RelatedArticlesLoading);
