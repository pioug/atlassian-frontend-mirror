/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';

import AIStateLoading from './ai-state-loading';
import AIStateDone from './ai-state-done';
import type { AIStateIndicatorProps } from './types';
import AIStateError from './ai-state-error';

const AIStateIndicator: React.FC<AIStateIndicatorProps> = ({
  state,
  appearance = 'default',
  testId = 'ai-state-indicator',
}) => {
  switch (state) {
    case 'error':
      return <AIStateError appearance={appearance} testId={testId} />;
    case 'loading':
      return <AIStateLoading appearance={appearance} testId={testId} />;
    case 'done':
      return <AIStateDone appearance={appearance} testId={testId} />;
    default:
      return null;
  }
};
export default AIStateIndicator;
