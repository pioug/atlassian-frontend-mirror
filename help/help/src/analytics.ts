import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';

import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';
import createAndFireEvent from '@atlaskit/analytics-next/createAndFireEvents';
import type { CreateEventMap, CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import withAnalyticsContextHoc, {
	type WithContextProps,
} from '@atlaskit/analytics-next/withAnalyticsContext';
import withAnalyticsEventsHoc, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';

export const withAnalyticsEvents: (
	createEventMap?: CreateEventMap,
) => <Props, Component>(
	WrappedComponent: (
		| React.ComponentType<WithAnalyticsEventsProps & Props>
		| React.ForwardRefExoticComponent<Omit<WithAnalyticsEventsProps, 'ref'> & Props>
	) &
		Component,
) => ForwardRefExoticComponent<
	PropsWithoutRef<
		JSX.LibraryManagedAttributes<Component, Omit<Props, keyof WithAnalyticsEventsProps>>
	> &
		RefAttributes<any>
> = withAnalyticsEventsHoc;
export const withAnalyticsContext: (
	defaultData?: any,
) => <Props, Component>(
	WrappedComponent: React.ComponentType<Props> & Component,
) => ForwardRefExoticComponent<
	PropsWithoutRef<JSX.LibraryManagedAttributes<Component, Props & WithContextProps>> &
		RefAttributes<any>
> = withAnalyticsContextHoc;
export const createAndFire: (
	payload: AnalyticsEventPayload,
) => (createAnalyticsEvent: CreateUIAnalyticsEvent) => UIAnalyticsEvent =
	createAndFireEvent('atlaskit');
export const defaultAnalyticsAttributes: {
	componentName: string;
	packageName: string;
	packageVersion: string;
} = {
	componentName: 'help',
	packageName: process.env._PACKAGE_NAME_,
	packageVersion: process.env._PACKAGE_VERSION_,
};
