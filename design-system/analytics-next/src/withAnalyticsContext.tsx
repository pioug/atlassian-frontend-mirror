import React from 'react';

import AnalyticsContext from './AnalyticsContext';

export interface WithContextProps {
  analyticsContext?: Record<string, any>;
}

const withAnalyticsContext = (defaultData?: any) => <Props, Component>(
  WrappedComponent: React.JSXElementConstructor<Props> & Component,
) => {
  type WrappedProps = JSX.LibraryManagedAttributes<
    Component,
    Props & WithContextProps
  >;

  const WithAnalyticsContext = React.forwardRef<any, WrappedProps>(
    (props, ref) => {
      const { analyticsContext = {}, ...rest } = props;
      const analyticsData = {
        ...defaultData,
        ...analyticsContext,
      };

      return (
        <AnalyticsContext data={analyticsData}>
          <WrappedComponent {...(rest as any)} ref={ref} />
        </AnalyticsContext>
      );
    },
  );

  // @ts-ignore
  WithAnalyticsContext.displayName = `WithAnalyticsContext(${WrappedComponent.displayName ||
    WrappedComponent.name})`;

  return WithAnalyticsContext;
};

export default withAnalyticsContext;
