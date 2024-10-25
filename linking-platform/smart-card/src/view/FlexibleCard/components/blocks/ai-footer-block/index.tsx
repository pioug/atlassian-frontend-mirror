import React from 'react';

import { SmartLinkStatus } from '../../../../../constants';

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
	if (status !== SmartLinkStatus.Resolved) {
		return null;
	}

	return <AIFooterBlockResolvedView {...props} testId={testId} />;
};

export default AIFooterBlock;
