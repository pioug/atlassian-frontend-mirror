import React from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseTextElement, type BaseTextElementProps, toTextProps } from '../common';

export type SourceBranchElementProps = BaseTextElementProps;

const SourceBranchElement = (props: SourceBranchElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toTextProps(context.sourceBranch) : null;

	return data ? <BaseTextElement {...data} {...props} name={ElementName.SourceBranch} /> : null;
};

export default SourceBranchElement;
