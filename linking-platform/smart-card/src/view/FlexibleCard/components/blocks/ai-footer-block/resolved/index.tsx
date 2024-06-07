import React from 'react';

import Block from '../../block';
import { Provider } from '../../../elements';
import { InternalActionName } from '../../../../../../constants';
import { AIFooterMetadata } from './ai-footer-metadata';
import { useFlexibleUiContext } from '../../../../../../state/flexible-ui-context';

import type { AIFooterBlockProps } from '../types';

const AIFooterBlockResolvedView = (props: AIFooterBlockProps) => {
	const context = useFlexibleUiContext();

	const actionData = context?.actions?.[InternalActionName.AISummaryAction];

	const { testId } = props;

	return (
		<Block {...props} testId={`${testId}-resolved-view`}>
			<Provider testId={`${testId}-provider`} />

			{actionData ? <AIFooterMetadata {...actionData} testId={`${testId}-ai-metadata`} /> : null}
		</Block>
	);
};

export default AIFooterBlockResolvedView;
