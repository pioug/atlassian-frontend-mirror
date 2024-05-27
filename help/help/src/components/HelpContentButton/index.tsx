import React, { useCallback } from 'react';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import Tooltip from '@atlaskit/tooltip';
import { NotificationIndicator } from '@atlaskit/notification-indicator';
import { type NotificationLogProvider } from '@atlaskit/notification-log-client';
import {
  useAnalyticsEvents,
  type UIAnalyticsEvent,
  AnalyticsContext,
} from '@atlaskit/analytics-next';

import {
  HelpContentButtonContainer,
  HelpContentButtonIcon,
  HelpContentButtonText,
  HelpContentButtonExternalLinkIcon,
  HelpContentButtonExternalNotificationIcon,
} from './styled';

export type Props = {
  id?: string;
  href?: string;
  notificationMax?: number;
  notificationLogProvider?: Promise<NotificationLogProvider>;
  text: string;
  icon?: React.ReactChild;
  tooltipText?: string;
  onClick?: (
    id: string,
    analytics: UIAnalyticsEvent,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
};

const analitycsContextData = {
  componentName: 'HelpContentButton',
  packageName: process.env._PACKAGE_NAME_,
  packageVersion: process.env._PACKAGE_VERSION_,
};

const HelpContentButton = ({
  id = '',
  href,
  notificationMax = 3,
  notificationLogProvider,
  text,
  icon,
  onClick,
  tooltipText,
}: Props) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const handleOnClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (onClick) {
        const analyticsEvent = createAnalyticsEvent({
          action: 'clicked',
        });

        onClick(id, analyticsEvent, event);
      }
    },
    [createAnalyticsEvent, id, onClick],
  );

  const buttonContent = (
    <>
      <HelpContentButtonIcon>{icon}</HelpContentButtonIcon>
      <HelpContentButtonText>
        {text}
        {notificationLogProvider !== null && (
          <HelpContentButtonExternalNotificationIcon>
            <NotificationIndicator
              notificationLogProvider={notificationLogProvider}
              max={notificationMax}
              appearance="primary"
            />
          </HelpContentButtonExternalNotificationIcon>
        )}
        {href != null && (
          <HelpContentButtonExternalLinkIcon data-testid="shortcutIcon">
            <ShortcutIcon size="small" label="" />
          </HelpContentButtonExternalLinkIcon>
        )}
      </HelpContentButtonText>
    </>
  );

  return (
    <AnalyticsContext data={analitycsContextData}>
      <HelpContentButtonContainer
        onClick={handleOnClick}
        href={href}
        id={id}
        target={href && '_blank'}
      >
        {tooltipText ? (
          <Tooltip content={tooltipText} position="left">
            {buttonContent}
          </Tooltip>
        ) : (
          <>{buttonContent}</>
        )}
      </HelpContentButtonContainer>
    </AnalyticsContext>
  );
};

export default HelpContentButton;
