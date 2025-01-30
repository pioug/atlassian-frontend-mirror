/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { CustomBlock } from '../../../../FlexibleCard/components/blocks';
import ActionGroup from '../../../../FlexibleCard/components/blocks/action-group';
import {
	LoadingSkeletonNew,
	LoadingSkeletonOld,
} from '../../../../FlexibleCard/components/common/loading-skeleton';
import Icon from '../../../../FlexibleCard/components/elements/icon';
import { CARD_WIDTH_REM } from '../../../styled';

import HoverCardLoadingViewOld from './HoverCardLoadingViewOld';
import { type HoverCardLoadingViewProps } from './types';

const loadingViewContainer = css({
	display: 'flex',
	flexDirection: 'column',
	paddingTop: token('space.200', '1rem'),
	paddingRight: token('space.200', '1rem'),
	paddingBottom: token('space.200', '1rem'),
	paddingLeft: token('space.200', '1rem'),
});

const skeletonContainer = css({
	display: 'flex',
	flexDirection: 'column',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space -- needs manual remediation
	gap: '0.625rem',
	alignItems: 'center',
});

const titleStyle = css({
	flex: '1 0 auto',
	height: '1.25rem',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	span: {
		width: '100%',
	},
});

const titleBlockStyles = css({
	width: '100%',
	gap: token('space.100', '0.5rem'),
});

const HoverCardLoadingViewNew = ({ titleBlockProps }: HoverCardLoadingViewProps) => {
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
		<div css={loadingViewContainer} data-testid={testId}>
			<div css={skeletonContainer}>
				<CustomBlock {...titleBlockProps} css={titleBlockStyles} testId={`${testId}-title-block`}>
					<Icon render={() => <LoadingSkeleton />} size={size} />
					<span css={titleStyle} data-testid={`${testId}-title`}>
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

const HoverCardLoadingView = (props: HoverCardLoadingViewProps): JSX.Element => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <HoverCardLoadingViewNew {...props} />;
	} else {
		return <HoverCardLoadingViewOld {...props} />;
	}
};

export default HoverCardLoadingView;
