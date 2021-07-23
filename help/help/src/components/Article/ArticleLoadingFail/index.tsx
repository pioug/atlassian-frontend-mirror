import React from 'react';
import Button from '@atlaskit/button/custom-theme-button';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import {
  useAnalyticsEvents,
  UIAnalyticsEvent,
  AnalyticsContext,
} from '@atlaskit/analytics-next';

import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';
import { messages } from '../../../messages';
import SomethingWrongImage from '../../../assets/SomethingWrongImage';

import { LoadingErrorMessage, LoadingErrorButtonContainer } from './styled';

const ANALYTICS_CONTEXT_DATA = {
  componentName: 'ArticleLoadingFail',
  packageName,
  packageVersion,
};

interface Props {
  // Function executed when the user click "try again"
  onTryAgainButtonClick?(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ): void;
}

export const ArticleLoadingFail: React.FC<InjectedIntlProps & Props> = ({
  onTryAgainButtonClick,
  intl: { formatMessage },
}) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const handleOnTryAgainButtonClick =
    onTryAgainButtonClick &&
    ((event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
      const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
        action: 'clicked',
      });

      onTryAgainButtonClick(event, analyticsEvent);
    });

  return (
    <LoadingErrorMessage>
      <SomethingWrongImage />
      <h2>{formatMessage(messages.help_article_error_title)}</h2>
      <p>{formatMessage(messages.help_article_error_text)}</p>
      <LoadingErrorButtonContainer>
        {handleOnTryAgainButtonClick && (
          <Button onClick={handleOnTryAgainButtonClick}>
            {formatMessage(messages.help_article_error_button_label)}
          </Button>
        )}
      </LoadingErrorButtonContainer>
    </LoadingErrorMessage>
  );
};

const ArticleLoadingFailWithContext: React.FC<Props & InjectedIntlProps> = (
  props,
) => {
  return (
    <AnalyticsContext data={ANALYTICS_CONTEXT_DATA}>
      <ArticleLoadingFail {...props} />
    </AnalyticsContext>
  );
};

export default injectIntl(ArticleLoadingFailWithContext);
