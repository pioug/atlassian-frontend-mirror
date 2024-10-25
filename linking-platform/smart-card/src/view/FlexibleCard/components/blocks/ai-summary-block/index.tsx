import React from 'react';

import { InternalActionName, SmartLinkStatus } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';

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
	status,
	testId = 'smart-ai-summary-block',
	...props
}: AISummaryBlockProps) => {
	const context = useFlexibleUiContext();
	const actionData = context?.actions?.[InternalActionName.AISummaryAction];

	if (status !== SmartLinkStatus.Resolved) {
		return null;
	}

	if (!actionData?.url) {
		return null;
	}

	return <AISummaryBlockResolvedView {...props} testId={testId} url={actionData.url} />;
};

export default AISummaryBlock;
