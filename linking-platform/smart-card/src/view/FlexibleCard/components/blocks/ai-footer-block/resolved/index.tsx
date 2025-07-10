import React from 'react';

import { InternalActionName } from '../../../../../../constants';
import { useFlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import { Provider } from '../../../elements';
import Block from '../../block';
import type { AIFooterBlockProps } from '../types';

import { AIFooterMetadata } from './ai-footer-metadata';

const AIFooterBlockResolvedView = (props: AIFooterBlockProps) => {
	const context = useFlexibleUiContext();

	const actionData = context?.actions?.[InternalActionName.AISummaryAction];

	const { testId } = props;

	return (
		<Block {...props} testId={`${testId}-resolved-view`}>
			<Provider appearance="subtle" testId={`${testId}-provider`} />

			{actionData ? <AIFooterMetadata {...actionData} testId={`${testId}-ai-metadata`} /> : null}
		</Block>
	);
};

export default AIFooterBlockResolvedView;
