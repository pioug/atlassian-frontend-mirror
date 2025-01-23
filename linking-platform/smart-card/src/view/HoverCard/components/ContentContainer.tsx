/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';
import { di } from 'react-magnetic-di';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import useAISummaryAction from '../../../state/hooks/use-ai-summary-action';
import AIPrism from '../../common/ai-prism';
import type { ContentContainerProps } from '../types';

import ContentContainerOld from './ContentContainerOld';
import { hoverCardClassName } from './HoverCardContent';

const NEW_CARD_WIDTH_REM = 25;

const HoverCardContainerStyle = css({
	background: 'none',
	borderWidth: '0',
	boxSizing: 'border-box',
	width: `${NEW_CARD_WIDTH_REM}rem`,

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.smart-link-loading-placeholder': {
		display: 'none',
	},
});

const popupContainerStyles = css({
	borderRadius: token('border.radius.200', '8px'),
	backgroundColor: token('elevation.surface.overlay', 'white'),
	boxShadow: token(
		'elevation.shadow.overlay',
		'0px 8px 12px rgba(9, 30, 66, 0.15),0px 0px 1px rgba(9, 30, 66, 0.31)',
	),
});

const ConnectedAIPrismContainer = ({
	children,
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

	const container = (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={hoverCardClassName}
			css={[HoverCardContainerStyle, !isAIEnabled ? popupContainerStyles : undefined]}
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
	isAIEnabled = false,
	testId,
	url,
	...props
}: ContentContainerProps): JSX.Element => (
	<ConnectedAIPrismContainer isAIEnabled={isAIEnabled} url={url} testId={testId} {...props}>
		{children}
	</ConnectedAIPrismContainer>
);

const Exported = (props: ContentContainerProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <ContentContainer {...props} />;
	} else {
		return <ContentContainerOld {...props} />;
	}
};

export default Exported;
