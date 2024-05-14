import React, { forwardRef, useMemo } from 'react';

import AnalyticsContext from '../components/AnalyticsContext';
export interface WithContextProps {
  analyticsContext?: Record<string, any>;
}

const withAnalyticsContext =
  (defaultData?: any) =>
  <Props, Component>(
    WrappedComponent: React.ComponentType<Props> & Component,
  ) => {
    type WrappedProps = JSX.LibraryManagedAttributes<
      Component,
      Props & WithContextProps
    >;

    const WithAnalyticsContext = forwardRef<any, WrappedProps>(
      ({ analyticsContext, ...rest }, ref) => {
        const analyticsData = useMemo<Object>(
          () => ({
            ...defaultData,
            ...analyticsContext,
          }),
          [analyticsContext],
        );

        return (
          <AnalyticsContext data={analyticsData}>
            <WrappedComponent {...(rest as any)} ref={ref} />
          </AnalyticsContext>
        );
      },
    );

    WithAnalyticsContext.displayName = `WithAnalyticsContext(${
      WrappedComponent.displayName || WrappedComponent.name
    })`;

    return WithAnalyticsContext;
  };

export default withAnalyticsContext;
