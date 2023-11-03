import { Component, ReactNode } from 'react';

export type ErrorBoundaryErrorInfo = {
  componentStack: string;
};

type BaseErrorBoundaryState = {
  hasError: boolean;
};

interface BaseErrorBoundaryProps {
  children: ReactNode;
  errorComponent?: JSX.Element;
  onError?: (error: Error, info?: ErrorBoundaryErrorInfo) => void;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export class BaseErrorBoundary extends Component<
  BaseErrorBoundaryProps,
  BaseErrorBoundaryState
> {
  constructor(props: BaseErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, info?: ErrorBoundaryErrorInfo): void {
    const { onError } = this.props;
    onError && onError(error, info);
    this.setState({ hasError: true });
  }

  render() {
    const { children, errorComponent } = this.props;
    const { hasError } = this.state;

    if (hasError && errorComponent) {
      return errorComponent;
    }

    return children;
  }
}
