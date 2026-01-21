import type { NotificationLogProvider } from '@atlaskit/notification-log-client';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import NotificationIndicator, { type Props, type ValueUpdatedParams, type ValueUpdatingParams, type ValueUpdatingResult } from './NotificationIndicator';
import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

const NotificationIndicatorWithAnalytics: ForwardRefExoticComponent<Pick<Omit<Props, keyof WithAnalyticsEventsProps>, never> & {
    appearance?: "added" | "default" | "important" | "primary" | "primaryInverted" | "removed" | undefined;
    max?: number | undefined;
    notificationLogProvider?: Promise<NotificationLogProvider> | undefined;
    onCountUpdated?: ((param: ValueUpdatedParams) => void) | undefined;
    onCountUpdating?: ((param: ValueUpdatingParams) => ValueUpdatingResult) | undefined;
    refreshOnHidden?: boolean | undefined;
    refreshOnVisibilityChange?: boolean | undefined;
    refreshRate?: number | undefined;
    ssrInitialValue?: number | undefined;
} & {
    createAnalyticsEvent?: any;
} & RefAttributes<any>> = withAnalyticsEvents()(NotificationIndicator);
export { NotificationIndicatorWithAnalytics as NotificationIndicator };
