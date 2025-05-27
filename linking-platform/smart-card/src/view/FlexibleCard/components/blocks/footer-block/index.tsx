import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { SmartLinkStatus } from '../../../../../constants';
import { useFlexibleCardContext } from '../../../../../state/flexible-ui-context';

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
	const cardContext = fg('platform-linking-flexible-card-context')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useFlexibleCardContext()
		: undefined;

	if (fg('platform-linking-flexible-card-context')) {
		if (cardContext?.status !== SmartLinkStatus.Resolved && !alwaysShow) {
			return null;
		}
	} else {
		if (status !== SmartLinkStatus.Resolved && !alwaysShow) {
			return null;
		}
	}

	return (
		<FooterBlockResolvedView
			{...props}
			{...(fg('platform-linking-flexible-card-context')
				? { size: props.size ?? cardContext?.ui?.size }
				: undefined)}
			testId={testId}
		/>
	);
};

export default FooterBlock;
