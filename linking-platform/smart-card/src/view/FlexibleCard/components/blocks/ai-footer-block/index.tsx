import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { SmartLinkStatus } from '../../../../../constants';
import { useFlexibleCardContext } from '../../../../../state/flexible-ui-context';

import AIFooterBlockResolvedView from './resolved';
import type { AIFooterBlockProps } from './types';

/**
 * Represents a AIFooterBlock, designed to show provider metadata in
 * addition to AI tooltip icons if AI is enabled
 * @param {AIFooterBlockProps} AIFooterBlockProps
 * @see Block
 */
const AIFooterBlock = ({
	status,
	testId = 'smart-ai-footer-block',
	...props
}: AIFooterBlockProps) => {
	const cardContext = fg('platform-linking-flexible-card-context')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useFlexibleCardContext()
		: undefined;

	if (fg('platform-linking-flexible-card-context')) {
		if (cardContext?.status !== SmartLinkStatus.Resolved) {
			return null;
		}
	} else {
		if (status !== SmartLinkStatus.Resolved) {
			return null;
		}
	}

	return (
		<AIFooterBlockResolvedView
			{...props}
			{...(fg('platform-linking-flexible-card-context')
				? { size: props.size ?? cardContext?.ui?.size }
				: undefined)}
			testId={testId}
		/>
	);
};

export default AIFooterBlock;
