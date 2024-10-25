import React from 'react';

import { SmartLinkStatus } from '../../../../../constants';

import FooterBlockResolvedView from './resolved';
import { type FooterBlockProps } from './types';

/**
 * Represents a FooterBlock, designed to contain elements and actions that should appear
 * at the bottom of a link card.
 * @public
 * @param {FooterBlockProps} FooterBlockProps
 * @see Block
 */
const FooterBlock = ({
	status,
	testId = 'smart-footer-block',
	alwaysShow,
	...props
}: FooterBlockProps) => {
	if (status !== SmartLinkStatus.Resolved && !alwaysShow) {
		return null;
	}

	return <FooterBlockResolvedView {...props} testId={testId} />;
};

export default FooterBlock;
