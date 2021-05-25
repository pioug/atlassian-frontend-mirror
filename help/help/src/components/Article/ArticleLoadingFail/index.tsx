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
import SomethingWrongImageFile from '../../../assets/SomethingWrong';

import { LoadingErrorMessage, LoadingErrorButtonContainer } from './styled';

interface Props {
  // Function executed when the user click "try again"
  onTryAgainButtonClick(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ): void;
}

export const ArticleLoadingFail: React.FC<InjectedIntlProps & Props> = ({
  onTryAgainButtonClick,
  intl: { formatMessage },
}) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const handleOnTryAgainButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ): void => {
    if (onTryAgainButtonClick) {
      const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
        action: 'clicked',
      });

      onTryAgainButtonClick(event, analyticsEvent);
    }
  };

  return (
    <LoadingErrorMessage>
      <div
        dangerouslySetInnerHTML={{
          __html: SomethingWrongImageFile,
        }}
      />
      <h2>{formatMessage(messages.help_article_error_title)}</h2>
      <p>{formatMessage(messages.help_article_error_text)}</p>
      <LoadingErrorButtonContainer>
        <Button onClick={handleOnTryAgainButtonClick}>
          {formatMessage(messages.help_article_error_button_label)}
        </Button>
      </LoadingErrorButtonContainer>
    </LoadingErrorMessage>
  );
};

const ArticleLoadingFailWithContext: React.FC<Props & InjectedIntlProps> = (
  props,
) => {
  return (
    <AnalyticsContext
      data={{
        componentName: 'ArticleLoadingFail',
        packageName,
        packageVersion,
      }}
    >
      <ArticleLoadingFail {...props} />
    </AnalyticsContext>
  );
};

export default injectIntl(ArticleLoadingFailWithContext);
