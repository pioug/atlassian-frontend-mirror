import React from 'react';
import {
  useAnalyticsEvents,
  UIAnalyticsEvent,
  AnalyticsContext,
} from '@atlaskit/analytics-next';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';

import NotFoundImage from '../../../../assets/NotFoundImage';
import { messages } from '../../../../messages';

import {
  WhatsNewResultsEmptyMessageImage,
  WhatsNewResultsEmptyMessageText,
} from './styled';

export interface Props {
  onClearFilter: () => void;
}

export const WhatsNewResultsEmpty: React.FC<Props & WrappedComponentProps> = ({
  onClearFilter,
  intl: { formatMessage },
}) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const handleClearFilterLinkClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    event.preventDefault();
    const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
      action: 'clicked',
    });
    analyticsEvent.fire();
    onClearFilter();
  };

  return (
    <>
      <WhatsNewResultsEmptyMessageImage>
        <NotFoundImage />
      </WhatsNewResultsEmptyMessageImage>

      <WhatsNewResultsEmptyMessageText>
        <strong>{formatMessage(messages.help_whats_new_no_results)}</strong>
      </WhatsNewResultsEmptyMessageText>

      <WhatsNewResultsEmptyMessageText>
        <p>
          {formatMessage(messages.help_whats_new_no_results_info)}
          <br />
          <AnalyticsContext
            data={{
              componentName: 'WhatsNewResultsEmpty',
            }}
          >
            <a href="#" onClick={handleClearFilterLinkClick}>
              {formatMessage(
                messages.help_whats_new_no_results_clear_filter_button_label,
              )}
            </a>
            <span>
              {formatMessage(
                messages.help_whats_new_no_results_clear_filter_info,
              )}
            </span>
          </AnalyticsContext>
        </p>
      </WhatsNewResultsEmptyMessageText>
    </>
  );
};

export default injectIntl(WhatsNewResultsEmpty);
