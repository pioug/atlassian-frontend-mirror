import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

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
	status,
	testId = 'smart-ai-summary-block',
	...props
}: AISummaryBlockProps) => {
	const cardContext = fg('platform-linking-flexible-card-context')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useFlexibleCardContext()
		: undefined;

	const context = useFlexibleUiContext();
	const actionData = context?.actions?.[InternalActionName.AISummaryAction];

	if (fg('platform-linking-flexible-card-context')) {
		if (cardContext?.status !== SmartLinkStatus.Resolved) {
			return null;
		}
	} else {
		if (status !== SmartLinkStatus.Resolved) {
			return null;
		}
	}

	if (!actionData?.url) {
		return null;
	}

	return (
		<AISummaryBlockResolvedView
			{...props}
			{...(fg('platform-linking-flexible-card-context')
				? { size: props.size ?? cardContext?.ui?.size }
				: undefined)}
			testId={testId}
			url={actionData.url}
		/>
	);
};

export default AISummaryBlock;
