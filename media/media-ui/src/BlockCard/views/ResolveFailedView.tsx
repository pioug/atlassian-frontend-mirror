/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ErroredView } from './ErroredView';

export interface ResolveFailedViewProps {
  onRetry: () => void;
  isSelected?: boolean;
  message?: string;
}

export const ResolveFailedView = ({
  onRetry,
  isSelected,
}: ResolveFailedViewProps) => (
  <ErroredView isSelected={isSelected} onRetry={onRetry} />
);
