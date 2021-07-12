import React from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import Spinner from '@atlaskit/spinner';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import Button from '@atlaskit/button/custom-theme-button';

import { messages } from '../../messages';

import { ToggleShowMoreArticlesContainer } from '../ArticlesList/styled';

export interface Props {
  itemsType?: string;
  minItemsToDisplay: number;
  maxItemsToDisplay: number;
  showMoreToggeled: boolean;
  loading?: boolean;
  onToggle: (
    event: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
}

export const ShowMoreButton: React.FC<Props & InjectedIntlProps> = ({
  showMoreToggeled,
  onToggle,
  minItemsToDisplay,
  maxItemsToDisplay,
  itemsType,
  loading = false,
  intl: { formatMessage },
}) =>
  showMoreToggeled ? (
    <ToggleShowMoreArticlesContainer>
      <Button appearance="link" spacing="compact" onClick={onToggle}>
        {formatMessage(messages.help_show_more_button_label_more, {
          numberOfItemsLeft:
            maxItemsToDisplay > minItemsToDisplay
              ? maxItemsToDisplay - minItemsToDisplay
              : 0,

          itemsType: itemsType,
        })}
        {loading && (
          <span>
            {' '}
            <Spinner size="medium" />
          </span>
        )}
      </Button>
    </ToggleShowMoreArticlesContainer>
  ) : (
    <ToggleShowMoreArticlesContainer>
      <Button appearance="link" spacing="compact" onClick={onToggle}>
        {formatMessage(messages.help_show_more_button_label_less)}
      </Button>
    </ToggleShowMoreArticlesContainer>
  );

export default injectIntl(ShowMoreButton);
