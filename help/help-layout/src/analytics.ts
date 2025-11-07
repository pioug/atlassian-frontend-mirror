import * as x from '@atlaskit/analytics-next';
import type { CreateEventMap } from '@atlaskit/analytics-next/types';
import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';

export const withAnalyticsEvents: (
	createEventMap?: CreateEventMap,
) => <Props, Component>(
	WrappedComponent: (
		| React.ComponentType<x.WithAnalyticsEventsProps & Props>
		| React.ForwardRefExoticComponent<Omit<x.WithAnalyticsEventsProps, 'ref'> & Props>
	) &
		Component,
) => ForwardRefExoticComponent<
	PropsWithoutRef<
		JSX.LibraryManagedAttributes<Component, Omit<Props, keyof x.WithAnalyticsEventsProps>>
	> &
		RefAttributes<any>
> = x.withAnalyticsEvents;
export const withAnalyticsContext: (
	defaultData?: any,
) => <Props, Component>(
	WrappedComponent: React.ComponentType<Props> & Component,
) => ForwardRefExoticComponent<
	PropsWithoutRef<JSX.LibraryManagedAttributes<Component, Props & x.WithContextProps>> &
		RefAttributes<any>
> = x.withAnalyticsContext;
export const createAndFire: (
	payload: x.AnalyticsEventPayload,
) => (createAnalyticsEvent: x.CreateUIAnalyticsEvent) => x.UIAnalyticsEvent =
	x.createAndFireEvent('atlaskit');
export const defaultAnalyticsAttributes: {
	componentName: string;
	packageName: string | undefined;
	packageVersion: string | undefined;
} = {
	componentName: 'helpPanel',
	packageName: process.env._PACKAGE_NAME_,
	packageVersion: process.env._PACKAGE_VERSION_,
};
