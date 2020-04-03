/**
 * This HOC will eventually be a replacement for `withAnalyticsEvents` once we are ready
 * to make the major bump to solely use hooks and new React context API. For now it let's
 * us test the hook logic to make sure that it accomplishes the expected behavior.
 */
import React from 'react';

import { Omit } from '@atlaskit/type-helpers';
import { CreateUIAnalyticsEvent, CreateEventMap } from './types';
import { usePatchedProps } from './usePatchedProps';
import { useAnalyticsEvents } from './useAnalyticsEvents';

export interface WithAnalyticsHookProps {
  /**
   * You should not be accessing this prop under any circumstances.
   * It is provided by `@atlaskit/analytics-next` and integrated in the component
   */
  createAnalyticsEvent?: CreateUIAnalyticsEvent;

  ref?: React.Ref<any>;
}

const withAnalyticsHook = (createEventMap?: CreateEventMap) => <
  Props extends WithAnalyticsHookProps,
  Component
>(
  WrappedComponent: React.JSXElementConstructor<Props> & Component,
) => {
  type WrappedProps = JSX.LibraryManagedAttributes<
    Component,
    Omit<Props, keyof WithAnalyticsHookProps>
  >;

  const WithAnalyticsHook = React.forwardRef<any, WrappedProps>(
    (props, ref) => {
      const { patchedEventProps } = usePatchedProps<WrappedProps>(
        createEventMap,
        props,
      );
      const { createAnalyticsEvent } = useAnalyticsEvents();

      return (
        <WrappedComponent
          {...(props as any)}
          {...patchedEventProps}
          createAnalyticsEvent={createAnalyticsEvent}
          ref={ref}
        />
      );
    },
  );

  // @ts-ignore
  WithAnalyticsHook.displayName = `WithAnalyticsHook(${WrappedComponent.displayName ||
    WrappedComponent.name})`;

  return WithAnalyticsHook;
};

export default withAnalyticsHook;
