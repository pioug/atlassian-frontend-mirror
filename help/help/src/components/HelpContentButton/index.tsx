import React, { useCallback } from 'react';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { NotificationIndicator } from '@atlaskit/notification-indicator';
import { NotificationLogProvider } from '@atlaskit/notification-log-client';
import {
  useAnalyticsEvents,
  UIAnalyticsEvent,
  AnalyticsContext,
} from '@atlaskit/analytics-next';

import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';

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
  onClick?: (
    id: string,
    analytics: UIAnalyticsEvent,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
};

const analitycsContextData = {
  componentName: 'HelpContentButton',
  packageName,
  packageVersion,
};

const HelpContentButton = ({
  id = '',
  href,
  notificationMax = 3,
  notificationLogProvider,
  text,
  icon,
  onClick,
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

  return (
    <AnalyticsContext data={analitycsContextData}>
      <HelpContentButtonContainer
        onClick={handleOnClick}
        href={href}
        id={id}
        target={href && '_blank'}
      >
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
      </HelpContentButtonContainer>
    </AnalyticsContext>
  );
};

export default HelpContentButton;
