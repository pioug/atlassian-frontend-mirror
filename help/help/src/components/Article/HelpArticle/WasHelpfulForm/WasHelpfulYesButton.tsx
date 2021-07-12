import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import {
  useAnalyticsEvents,
  UIAnalyticsEvent,
  AnalyticsContext,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/custom-theme-button';

import {
  name as packageName,
  version as packageVersion,
} from '../../../../version.json';
import { messages } from '../../../../messages';

const ANALYTICS_CONTEXT_DATA = {
  componentName: 'ArticleWasHelpfulYesButton',
  packageName,
  packageVersion,
};

interface Props {
  // Function executed when user clicks this button
  onClick?(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent?: UIAnalyticsEvent,
  ): void;
  // Select state of the button
  isSelected?: boolean;
}

export const ArticleWasHelpfulYesButton: React.FC<
  Props & InjectedIntlProps
> = ({ isSelected = false, onClick, intl: { formatMessage } }) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const handleButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ): void => {
    if (onClick) {
      const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
        action: 'clicked',
      });
      onClick(event, analyticsEvent);
    }
  };

  return (
    <Button onClick={handleButtonClick} isSelected={isSelected}>
      {formatMessage(messages.help_article_rating_option_yes)}
    </Button>
  );
};

const ArticleWasHelpfulYesButtonWithContext: React.FC<
  Props & InjectedIntlProps
> = (props) => {
  return (
    <AnalyticsContext data={ANALYTICS_CONTEXT_DATA}>
      <ArticleWasHelpfulYesButton {...props} />
    </AnalyticsContext>
  );
};

export default injectIntl(ArticleWasHelpfulYesButtonWithContext);
