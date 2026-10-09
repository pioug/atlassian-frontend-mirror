import React from 'react';

import AkDecisionItem from '@atlaskit/task-decision/decision-item';

import type { NodeProps } from '../types';

export default function DecisionItem({ children, dataAttributes }: NodeProps): React.JSX.Element {
	return <AkDecisionItem dataAttributes={dataAttributes}>{children}</AkDecisionItem>;
}
