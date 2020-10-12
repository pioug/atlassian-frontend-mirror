import React from 'react';
import HelpArticle from '@atlaskit/help-article';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { messages } from '../../../messages';

import { LoadingRectangle } from '../styled';

// TODO: export @atlaskit/help-article interface and use that one instead of define an interface here
interface Props {
  isLoading?: boolean;
  title?: string;
  body?: string;
  titleLinkUrl?: string;
  onArticleRenderBegin?(): void;
  onArticleRenderDone?(): void;
}

export const ArticleContent: React.FC<InjectedIntlProps & Props> = ({
  isLoading = false,
  title = '',
  body = '',
  titleLinkUrl = '',
  onArticleRenderBegin,
  onArticleRenderDone,
  intl: { formatMessage },
}) =>
  isLoading ? (
    <div aria-label={formatMessage(messages.help_loading)} role="img">
      <LoadingRectangle contentHeight="20px" marginTop="0" />
      <LoadingRectangle contentWidth="90%" />
      <LoadingRectangle contentWidth="80%" />
      <LoadingRectangle contentWidth="80%" />
      <LoadingRectangle contentWidth="70%" />
    </div>
  ) : (
    <HelpArticle
      title={title}
      body={body}
      titleLinkUrl={titleLinkUrl}
      onArticleRenderBegin={onArticleRenderBegin}
      onArticleRenderDone={onArticleRenderDone}
    />
  );

export default injectIntl(ArticleContent);
