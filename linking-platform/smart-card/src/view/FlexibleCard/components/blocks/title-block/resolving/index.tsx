/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { SmartLinkSize } from '../../../../../../constants';
import { LoadingSkeleton } from '../../../common/loading-skeleton';
import { LinkIcon } from '../../../elements';
import { getIconWidth } from '../../../utils';
import Block from '../../block';
import { type TitleBlockViewProps } from '../types';

/**
 * This represents a TitleBlock for a Smart Link that is currently waiting
 * for a request to finish.
 * This should render when a Smart Link has sent a request.
 * @see TitleBlock
 */
const TitleBlockResolvingView = ({
	actionGroup,
	icon,
	position,
	testId,
	title,
	hideIcon,
	...blockProps
}: TitleBlockViewProps): React.JSX.Element => {
	const { size = SmartLinkSize.Medium } = blockProps;

	const iconWidth = getIconWidth(size);

	return (
		<Block {...blockProps} testId={`${testId}-resolving-view`}>
			{!hideIcon && icon && fg('platform_initial_icon_for_title_block') && (
				<LinkIcon overrideIcon={icon} position={position} size={size} hideLoadingSkeleton={true} />
			)}
			{!hideIcon && (!icon || !fg('platform_initial_icon_for_title_block')) && (
				<span style={{ width: iconWidth, height: iconWidth }} data-testid={`${testId}-icon`}>
					<LoadingSkeleton width={iconWidth} height={iconWidth} testId={`${testId}-icon-loading`} />
				</span>
			)}
			{title}
			{actionGroup}
		</Block>
	);
};

export default TitleBlockResolvingView;
