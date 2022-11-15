import React, { ErrorInfo, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { EmbedModalProps } from '../../types';

const FallbackComponent = () => <span />;

const withErrorBoundary = (
  Component: React.ComponentType<EmbedModalProps>,
): React.FC<EmbedModalProps> => (props) => {
  const { onOpenFailed } = props;

  const onError = useCallback(
    (error: Error, errorInfo: ErrorInfo) => {
      if (onOpenFailed) {
        onOpenFailed(error, errorInfo);
      }
    },
    [onOpenFailed],
  );
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

export default withErrorBoundary;
