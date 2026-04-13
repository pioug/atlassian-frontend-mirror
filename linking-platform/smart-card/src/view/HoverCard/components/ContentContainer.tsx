/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';
import { di } from 'react-magnetic-di';

import { token } from '@atlaskit/tokens';

import useAISummaryAction from '../../../state/hooks/use-ai-summary-action';
import AIPrism from '../../common/ai-prism';
import type { ContentContainerProps } from '../types';

import { hoverCardClassName } from './HoverCardContent';

const HoverCardContainerStyle = css({
	background: 'none',
	borderWidth: '0',
	boxSizing: 'border-box',
});

const hoverCardShellWidthDefault = css({
	width: '25rem',
});

const hoverCardShellWidthSlim = css({
	width: '20rem',
});

const hoverCardShellHideLoadingPlaceholder = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- hide smart-link placeholder inside hover shell (descendant)
	'.smart-link-loading-placeholder': {
		display: 'none',
	},
});

const popupContainerStyles = css({
	borderRadius: token('radius.large', '8px'),
	backgroundColor: token('elevation.surface.overlay'),
	boxShadow: token('elevation.shadow.overlay'),
});

const ConnectedAIPrismContainer = ({
	children,
	widthAppearance,
	isAIEnabled = false,
	testId,
	url,
	...props
}: ContentContainerProps) => {
	di(useAISummaryAction, AIPrism);

	const {
		state: { status },
	} = useAISummaryAction(url);

	const [showPrism, setShowPrism] = useState(status === 'loading');

	useEffect(() => {
		setShowPrism(status === 'loading');
	}, [status]);

	const resolvedWidthAppearance = widthAppearance ?? 'default';

	const container = (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={hoverCardClassName}
			css={[
				HoverCardContainerStyle,
				resolvedWidthAppearance === 'slim' ? hoverCardShellWidthSlim : hoverCardShellWidthDefault,
				hoverCardShellHideLoadingPlaceholder,
				!isAIEnabled ? popupContainerStyles : undefined,
			]}
			data-testid={testId}
			{...props}
		>
			{children}
		</div>
	);

	return isAIEnabled ? (
		<AIPrism isVisible={showPrism} testId={`${testId}-prism`}>
			{container}
		</AIPrism>
	) : (
		container
	);
};

const ContentContainer = ({
	children,
	widthAppearance,
	isAIEnabled = false,
	testId,
	url,
	...props
}: ContentContainerProps): JSX.Element => (
	<ConnectedAIPrismContainer
		widthAppearance={widthAppearance}
		isAIEnabled={isAIEnabled}
		url={url}
		testId={testId}
		{...props}
	>
		{children}
	</ConnectedAIPrismContainer>
);

export default ContentContainer;
