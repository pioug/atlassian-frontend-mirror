import React from 'react';

// eslint-disable-next-line @repo/internal/react/no-class-components
export class TestErrorBoundary extends React.Component<
  any,
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? (
      <div>Bad things have happened</div>
    ) : (
      this.props.children
    );
  }
}
