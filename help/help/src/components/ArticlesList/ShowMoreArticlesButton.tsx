import React from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import Button from '@atlaskit/button/custom-theme-button';

import { messages } from '../../messages';

import { ToggleShowMoreArticlesContainer } from './styled';

export interface Props {
  minItemsToDisplay: number;
  maxItemsToDisplay: number;
  showMoreToggeled: boolean;
  onToggleArticlesList: (
    event: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
}

export const ShowMoreArticlesButton: React.FC<Props & InjectedIntlProps> = ({
  intl: { formatMessage },
  showMoreToggeled,
  onToggleArticlesList,
  minItemsToDisplay,
  maxItemsToDisplay,
}) =>
  showMoreToggeled ? (
    <ToggleShowMoreArticlesContainer>
      <Button
        appearance="link"
        spacing="compact"
        onClick={onToggleArticlesList}
      >
        <FormattedMessage
          {...messages.help_article_list_show_more}
          values={{
            numberOfRelatedArticlesLeft:
              maxItemsToDisplay > minItemsToDisplay
                ? maxItemsToDisplay - minItemsToDisplay
                : 0,
          }}
        />
      </Button>
    </ToggleShowMoreArticlesContainer>
  ) : (
    <ToggleShowMoreArticlesContainer>
      <Button
        appearance="link"
        spacing="compact"
        onClick={onToggleArticlesList}
      >
        {formatMessage(messages.help_article_list_show_less)}
      </Button>
    </ToggleShowMoreArticlesContainer>
  );

export default injectIntl(ShowMoreArticlesButton);
