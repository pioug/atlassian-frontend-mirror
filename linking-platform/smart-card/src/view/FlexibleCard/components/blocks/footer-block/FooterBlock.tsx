import React from 'react';

import { SmartLinkStatus } from '../../../../../constants';
import { useFlexibleCardContext } from '../../../../../state/flexible-ui-context/useFlexibleCardContext';
import FooterBlockResolvedView from './resolved';
import { type FooterBlockProps } from './types';

/**
 * Represents a FooterBlock, designed to contain elements and actions that should appear
 * at the bottom of a link card.
 * @public
 * @param {FooterBlockProps} FooterBlockProps
 * @see Block
 */
export const FooterBlock = ({
	testId = 'smart-footer-block',
	alwaysShow,
	...props
}: FooterBlockProps): React.JSX.Element | null => {
	const cardContext = useFlexibleCardContext();

	if (cardContext?.status !== SmartLinkStatus.Resolved && !alwaysShow) {
		return null;
	}

	return (
		<FooterBlockResolvedView
			{...props}
			size={props.size ?? cardContext?.ui?.size}
			testId={testId}
		/>
	);
};
