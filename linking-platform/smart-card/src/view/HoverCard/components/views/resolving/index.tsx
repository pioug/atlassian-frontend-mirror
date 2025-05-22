/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { CustomBlock } from '../../../../FlexibleCard/components/blocks';
import ActionGroup from '../../../../FlexibleCard/components/blocks/action-group';
import { LoadingSkeleton } from '../../../../FlexibleCard/components/common/loading-skeleton';
import IconElement from '../../../../FlexibleCard/components/elements/icon-element';
import { CARD_WIDTH_REM } from '../../../styled';

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

const HoverCardLoadingView = ({ titleBlockProps }: HoverCardLoadingViewProps) => {
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
				<CustomBlock {...titleBlockProps} css={titleBlockStyles} testId={`${testId}-title-block`}>
					<IconElement render={() => <LoadingSkeleton />} size={size} />
					<span css={titleStyle} data-testid={`${testId}-title`}>
						<LoadingSkeleton height={`${lineHeightRem}rem`} />
					</span>
					{actionGroup}
				</CustomBlock>
				<React.Fragment>
					<LoadingSkeleton width={`${skeletonWidth}rem`} height={`${lineHeightRem}rem`} />
					<LoadingSkeleton width={`${skeletonWidth}rem`} height={`${lineHeightRem * 3}rem`} />
					<LoadingSkeleton width={`${skeletonWidth}rem`} height={`${lineHeightRem}rem`} />
				</React.Fragment>
			</div>
		</div>
	);
};

export default HoverCardLoadingView;
