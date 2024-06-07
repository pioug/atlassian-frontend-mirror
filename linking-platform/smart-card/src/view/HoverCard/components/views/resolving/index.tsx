/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import LoadingSkeleton from '../../../../FlexibleCard/components/common/loading-skeleton';
import { type HoverCardLoadingViewProps } from './types';
import { CARD_WIDTH_REM } from '../../../styled';
import {
	getTitleStyles,
	loadingViewContainer,
	skeletonContainer,
	titleBlockStyles,
} from './styled';
import ActionGroup from '../../../../FlexibleCard/components/blocks/action-group';
import { CustomBlock } from '../../../../FlexibleCard/components/blocks';
import Icon from '../../../../FlexibleCard/components/elements/icon';

const HoverCardLoadingView: React.FC<HoverCardLoadingViewProps> = ({ titleBlockProps }) => {
	const testId = 'hover-card-loading-view';
	const lineHeightRem = 1.25;
	const skeletonWidth = CARD_WIDTH_REM - 2;
	const { size, actions } = titleBlockProps;

	const actionGroup = actions?.length && actions?.length > 0 && (
		<ActionGroup items={actions} visibleButtonsNum={2} />
	);

	return (
		<div css={loadingViewContainer} data-testid={testId}>
			<div css={skeletonContainer}>
				<CustomBlock
					{...titleBlockProps}
					overrideCss={titleBlockStyles}
					testId={`${testId}-title-block`}
				>
					<Icon render={() => <LoadingSkeleton />} size={size} />
					<span css={getTitleStyles(lineHeightRem)} data-testid={`${testId}-title`}>
						<LoadingSkeleton height={lineHeightRem} />
					</span>
					{actionGroup}
				</CustomBlock>
				<LoadingSkeleton width={skeletonWidth} height={lineHeightRem} />
				<LoadingSkeleton width={skeletonWidth} height={lineHeightRem * 3} />
				<LoadingSkeleton width={skeletonWidth} height={lineHeightRem} />
			</div>
		</div>
	);
};

export default HoverCardLoadingView;
