import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import {
  useAnalyticsEvents,
  UIAnalyticsEvent,
  AnalyticsContext,
} from '@atlaskit/analytics-next';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button/custom-theme-button';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';

import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';
import { messages } from '../../messages';

import { CloseButtonContainer } from './styled';

interface Props {
  // Function executed when the user clicks the close button
  onClick(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent?: UIAnalyticsEvent,
  ): void;
}

/**
 * This function will return a CloseButton component only if the function
 * to be executed on the onClick event is passed as a parameter
 *
 * @param onClick - Function executed when the close btn is clicked
 */
export const CloseButton: React.FC<Props & InjectedIntlProps> = ({
  onClick,
  intl: { formatMessage },
}) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const handleOnClick = (
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
    <CloseButtonContainer>
      <Tooltip
        content={formatMessage(messages.help_panel_header_close)}
        position="left"
      >
        <Button
          onClick={handleOnClick}
          appearance="subtle"
          iconBefore={
            <EditorCloseIcon
              label={formatMessage(messages.help_panel_header_close)}
              size="medium"
            />
          }
        />
      </Tooltip>
    </CloseButtonContainer>
  );
};

const CloseButtonWithContext: React.FC<Props & InjectedIntlProps> = (props) => {
  return (
    <AnalyticsContext
      data={{
        componentName: 'closeButton',
        packageName,
        packageVersion,
      }}
    >
      <CloseButton {...props} />
    </AnalyticsContext>
  );
};

export default injectIntl(CloseButtonWithContext);
