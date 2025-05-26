import React from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseTextElement, type BaseTextElementProps, toTextProps } from '../common';

export type TargetBranchElementProps = BaseTextElementProps;

const TargetBranchElement = (props: TargetBranchElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toTextProps(context.targetBranch) : null;

	return data ? <BaseTextElement {...data} {...props} name={ElementName.TargetBranch} /> : null;
};

export default TargetBranchElement;
