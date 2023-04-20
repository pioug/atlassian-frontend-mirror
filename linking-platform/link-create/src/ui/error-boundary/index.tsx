import React, { ReactNode } from 'react';

import { BaseErrorBoundary } from './error-boundary-base';
import { ErrorBoundaryUI } from './error-boundary-ui';

interface ErrorBoundaryProps {
  children: ReactNode;
}

export const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  // TODO: onError => Analytics
  return (
    <BaseErrorBoundary ErrorComponent={ErrorBoundaryUI}>
      {children}
    </BaseErrorBoundary>
  );
};
