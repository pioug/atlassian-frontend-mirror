import React from 'react';

import { DecisionItem as AkDecisionItem } from '@atlaskit/task-decision';
import { NodeProps } from '../types';

export default function DecisionItem({ children, dataAttributes }: NodeProps) {
  return (
    <AkDecisionItem dataAttributes={dataAttributes}>{children}</AkDecisionItem>
  );
}
