import React from 'react';

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
	testId = 'smart-ai-footer-block',
	...props
}: AIFooterBlockProps): React.JSX.Element | null => {
	const cardContext = useFlexibleCardContext();

	if (cardContext?.status !== SmartLinkStatus.Resolved) {
		return null;
	}

	return (
		<AIFooterBlockResolvedView
			{...props}
			size={props.size ?? cardContext?.ui?.size}
			testId={testId}
		/>
	);
};

export default AIFooterBlock;
