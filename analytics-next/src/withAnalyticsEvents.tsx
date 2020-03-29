import React from 'react';

import { Omit } from '@atlaskit/type-helpers';
import { CreateUIAnalyticsEvent, CreateEventMap } from './types';
import AnalyticsContextConsumer from './AnalyticsContextConsumer';

export interface WithAnalyticsEventsProps {
  /**
   * You should not be accessing this prop under any circumstances.
   * It is provided by `@atlaskit/analytics-next` and integrated in the component
   */
  createAnalyticsEvent?: CreateUIAnalyticsEvent;

  ref?: React.Ref<any>;
}

const withAnalyticsEvents = (createEventMap?: CreateEventMap) => <
  Props extends WithAnalyticsEventsProps,
  Component
>(
  WrappedComponent: React.JSXElementConstructor<Props> & Component,
) => {
  type WrappedProps = JSX.LibraryManagedAttributes<
    Component,
    Omit<Props, keyof WithAnalyticsEventsProps>
  >;

  const WithAnalyticsEvents = React.forwardRef<any, WrappedProps>(
    (props, ref) => (
      <AnalyticsContextConsumer<WrappedProps>
        createEventMap={createEventMap}
        wrappedComponentProps={props}
      >
        {({ createAnalyticsEvent, patchedEventProps }) => (
          <WrappedComponent
            {...(props as any)}
            {...patchedEventProps}
            createAnalyticsEvent={createAnalyticsEvent}
            ref={ref}
          />
        )}
      </AnalyticsContextConsumer>
    ),
  );

  // @ts-ignore
  WithAnalyticsEvents.displayName = `WithAnalyticsEvents(${WrappedComponent.displayName ||
    WrappedComponent.name})`;

  return WithAnalyticsEvents;
};

export default withAnalyticsEvents;
