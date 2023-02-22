import React, { Component, ReactNode } from 'react';

import AnalyticsContext from './AnalyticsContext/LegacyAnalyticsContext';

type AnalyticsErrorBoundaryErrorInfo = {
  componentStack: string;
};

export interface AnalyticsErrorBoundaryProps {
  /** React component to be wrapped */
  children: ReactNode;
  channel: string;
  data: {};
  ErrorComponent?: React.ComponentType;
  onError?: (error: Error, info?: AnalyticsErrorBoundaryErrorInfo) => void;
}

type AnalyticsErrorBoundaryState = {
  hasError: boolean;
};

/**
 *  @deprecated
 */
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class AnalyticsErrorBoundary extends Component<
  AnalyticsErrorBoundaryProps,
  AnalyticsErrorBoundaryState
> {
  constructor(props: AnalyticsErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(
    error: Error,
    info?: AnalyticsErrorBoundaryErrorInfo,
  ): void {
    const { onError } = this.props;

    onError && onError(error, info);
    this.setState({ hasError: true });
  }

  render() {
    const { data, children, ErrorComponent } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return ErrorComponent ? (
        <AnalyticsContext data={data}>
          <ErrorComponent />
        </AnalyticsContext>
      ) : null;
    }

    return <AnalyticsContext data={data}>{children}</AnalyticsContext>;
  }
}
