import { ComponentType } from 'react';

import { BaseIconButtonProps } from '../IconButton/types';

export type HelpProps = BaseIconButtonProps & {
  /**
   * Component to be used for the badge.
   * Generally you'll want to use `NotificationIndicator` from [`@atlaskit/notification-indicator`](/packages/notifications/notification-indicator).
   */
  badge?: ComponentType<{}>;
};
