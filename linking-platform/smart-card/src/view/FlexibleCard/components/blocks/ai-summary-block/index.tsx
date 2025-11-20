import React from 'react';

import { InternalActionName, SmartLinkStatus } from '../../../../../constants';
import {
	useFlexibleCardContext,
	useFlexibleUiContext,
} from '../../../../../state/flexible-ui-context';

import AISummaryBlockResolvedView from './resolved';
import { type AISummaryBlockProps } from './types';

/**
 * Represents an AISummaryBlock, designed to summarising link resource
 * content using AI.
 * @public
 * @param {AISummaryBlockProps} AISummaryBlock
 * @see Block
 */
const AISummaryBlock = ({
	testId = 'smart-ai-summary-block',
	...props
}: AISummaryBlockProps): React.JSX.Element | null => {
	const cardContext = useFlexibleCardContext();

	const context = useFlexibleUiContext();
	const actionData = context?.actions?.[InternalActionName.AISummaryAction];

	if (cardContext?.status !== SmartLinkStatus.Resolved) {
		return null;
	}

	if (!actionData?.url) {
		return null;
	}

	return (
		<AISummaryBlockResolvedView
			{...props}
			size={props.size ?? cardContext?.ui?.size}
			testId={testId}
			url={actionData.url}
		/>
	);
};

export default AISummaryBlock;
