import React, { forwardRef } from 'react';

import { useAnalyticsEvents } from '../hooks/useAnalyticsEvents';
import { usePatchedProps } from '../hooks/usePatchedProps';
import { type CreateEventMap, type CreateUIAnalyticsEvent } from '../types';

export interface WithAnalyticsEventsProps {
	/**
	 * You should not be accessing this prop under any circumstances.
	 * It is provided by `@atlaskit/analytics-next` and integrated in the component
	 */
	createAnalyticsEvent?: CreateUIAnalyticsEvent;

	ref?: React.Ref<any>;
}

const withAnalyticsEvents =
	(createEventMap: CreateEventMap = {}) =>
	<Props, Component>(
		WrappedComponent: React.ComponentType<WithAnalyticsEventsProps & Props> & Component,
	) => {
		type WrappedProps = JSX.LibraryManagedAttributes<
			Component,
			Omit<Props, keyof WithAnalyticsEventsProps>
		>;

		const WithAnalyticsEvents = forwardRef<any, WrappedProps>((props, ref) => {
			const { patchedEventProps } = usePatchedProps<WrappedProps>(createEventMap, props);
			const { createAnalyticsEvent } = useAnalyticsEvents();

			return (
				<WrappedComponent
					{...(props as any)}
					{...patchedEventProps}
					createAnalyticsEvent={createAnalyticsEvent}
					ref={ref}
				/>
			);
		});

		WithAnalyticsEvents.displayName = `WithAnalyticsEvents(${
			WrappedComponent.displayName || WrappedComponent.name
		})`;

		return WithAnalyticsEvents;
	};

export default withAnalyticsEvents;
