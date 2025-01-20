/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';

import { CustomBlock } from '../../../../FlexibleCard/components/blocks';
import ActionGroup from '../../../../FlexibleCard/components/blocks/action-group';
import {
	LoadingSkeletonNew,
	LoadingSkeletonOld,
} from '../../../../FlexibleCard/components/common/loading-skeleton';
import Icon from '../../../../FlexibleCard/components/elements/icon';
import { CARD_WIDTH_REM } from '../../../styled';

import {
	getTitleStyles,
	loadingViewContainer,
	skeletonContainer,
	titleBlockStyles,
} from './styled';
import { type HoverCardLoadingViewProps } from './types';

const HoverCardLoadingView = ({ titleBlockProps }: HoverCardLoadingViewProps) => {
	const testId = 'hover-card-loading-view';
	const lineHeightRem = 1.25;
	const skeletonWidth = CARD_WIDTH_REM - 2;
	const { size, actions } = titleBlockProps;

	const actionGroup = actions?.length && actions?.length > 0 && (
		<ActionGroup items={actions} visibleButtonsNum={2} />
	);

	const LoadingSkeleton = fg('platform-smart-card-icon-migration')
		? LoadingSkeletonNew
		: LoadingSkeletonOld;

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={loadingViewContainer} data-testid={testId}>
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
			<div css={skeletonContainer}>
				<CustomBlock
					{...titleBlockProps}
					overrideCss={titleBlockStyles}
					testId={`${testId}-title-block`}
				>
					<Icon render={() => <LoadingSkeleton />} size={size} />
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
					<span css={getTitleStyles(lineHeightRem)} data-testid={`${testId}-title`}>
						{fg('platform-smart-card-icon-migration') ? (
							<LoadingSkeletonNew height={`${lineHeightRem}rem`} />
						) : (
							<LoadingSkeletonOld height={lineHeightRem} />
						)}
					</span>
					{actionGroup}
				</CustomBlock>
				{fg('platform-smart-card-icon-migration') ? (
					<React.Fragment>
						<LoadingSkeletonNew width={`${skeletonWidth}rem`} height={`${lineHeightRem}rem`} />
						<LoadingSkeletonNew width={`${skeletonWidth}rem`} height={`${lineHeightRem * 3}rem`} />
						<LoadingSkeletonNew width={`${skeletonWidth}rem`} height={`${lineHeightRem}rem`} />
					</React.Fragment>
				) : (
					<React.Fragment>
						<LoadingSkeletonOld width={skeletonWidth} height={lineHeightRem} />
						<LoadingSkeletonOld width={skeletonWidth} height={lineHeightRem * 3} />
						<LoadingSkeletonOld width={skeletonWidth} height={lineHeightRem} />
					</React.Fragment>
				)}
			</div>
		</div>
	);
};

export default HoverCardLoadingView;
