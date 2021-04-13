import React, { ErrorInfo } from 'react';

interface TestErrorBoundaryProps {
  onError: (error: Error, errorInfo: ErrorInfo) => void;
}

interface TestErrorBoundaryState {
  isError: boolean;
}

export class TestErrorBoundary extends React.Component<
  TestErrorBoundaryProps,
  TestErrorBoundaryState
> {
  state = {
    isError: false,
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ isError: true }, () => {
      this.props.onError(error, errorInfo);
    });
  }

  render() {
    return (
      <span
        data-testid={this.state.isError ? 'error-boundary' : 'my-component'}
      >
        Has error: {this.state.isError}
        {this.state.isError ? null : this.props.children}
      </span>
    );
  }
}
