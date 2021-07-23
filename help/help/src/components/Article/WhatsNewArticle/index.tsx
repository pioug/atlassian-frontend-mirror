import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { BODY_FORMAT_TYPES } from '@atlaskit/help-article';
import HelpArticleContent from '@atlaskit/help-article';
import { gridSize } from '@atlaskit/theme/constants';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/custom-theme-button';

import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';
import { messages } from '../../../messages';

import { WhatsNewArticle as WhatsNewArticleType } from '../../../model/WhatsNew';
import { getTypeIcon, getTypeTitle } from '../../../util';
import { WhatsNewTypeIcon, DividerLine } from '../../../util/styled';

import Loading from './Loading';
import {
  WhatsNewTypeTitle,
  WhatsNewTitleText,
  WhatsNewIconContainer,
  RelatedLinkContainer,
  ExternalLinkIconContainer,
} from './styled';

const analyticsContextData = {
  componentName: 'ArticlesListItem',
  packageName,
  packageVersion,
};

interface Props {
  article?: WhatsNewArticleType;
  isLoading?: boolean;
}

export const WhatsNewArticle: React.FC<Props & InjectedIntlProps> = ({
  intl: { formatMessage },
  article,
  isLoading,
}) => {
  if (isLoading) {
    return <Loading />;
  }

  if (article) {
    const typeTitle = article.type
      ? formatMessage(getTypeTitle(article.type))
      : '';

    return (
      <>
        <WhatsNewIconContainer>
          <WhatsNewTypeIcon type={article.type}>
            {getTypeIcon(article.type)}
          </WhatsNewTypeIcon>
          <WhatsNewTypeTitle>{typeTitle}</WhatsNewTypeTitle>
        </WhatsNewIconContainer>
        <WhatsNewTitleText>{article.title}</WhatsNewTitleText>
        <HelpArticleContent
          body={article.description}
          bodyFormat={
            article.bodyFormat ? article.bodyFormat : BODY_FORMAT_TYPES.html
          }
        />
        {(article.relatedExternalLinks || article.communityUrl) && (
          <>
            <DividerLine
              style={{ marginTop: 0, marginBottom: gridSize() * 2 }}
            />
            <WhatsNewTitleText>RELATED LINKS</WhatsNewTitleText>
            <AnalyticsContext
              data={{
                componentName: 'searchExternalUrl',
              }}
            >
              {article.relatedExternalLinks && (
                <RelatedLinkContainer>
                  <Button
                    appearance="link"
                    spacing="none"
                    href={article.relatedExternalLinks}
                    target="_blank"
                  >
                    {formatMessage(
                      messages.help_whats_new_related_link_support,
                    )}
                  </Button>
                  <ExternalLinkIconContainer>
                    <ShortcutIcon size="small" label="" />
                  </ExternalLinkIconContainer>
                </RelatedLinkContainer>
              )}

              {article.communityUrl && (
                <RelatedLinkContainer>
                  <Button
                    appearance="link"
                    spacing="none"
                    href={article.communityUrl}
                    target="_blank"
                  >
                    {formatMessage(
                      messages.help_whats_new_related_link_community,
                    )}
                  </Button>
                  <ExternalLinkIconContainer>
                    <ShortcutIcon size="small" label="" />
                  </ExternalLinkIconContainer>
                </RelatedLinkContainer>
              )}
            </AnalyticsContext>
          </>
        )}
      </>
    );
  }

  return null;
};

const WhatsNewArticleWithContext: React.FC<Props & InjectedIntlProps> = (
  props,
) => {
  return (
    <AnalyticsContext data={analyticsContextData}>
      <WhatsNewArticle {...props} />
    </AnalyticsContext>
  );
};

export default injectIntl(WhatsNewArticleWithContext);
