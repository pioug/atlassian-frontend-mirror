/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { useState, useEffect } from 'react';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { HoverCardContainer, popupContainerStyles } from '../styled';
import AIPrism from '../../common/ai-prism';
import { hoverCardClassName } from './HoverCardContent';
import type { ContentContainerProps } from '../types';
import useAISummaryAction from '../../../state/hooks/use-ai-summary-action';
import { di } from 'react-magnetic-di';

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
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={[HoverCardContainer, !isAIEnabled ? popupContainerStyles : undefined]}
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
}: ContentContainerProps) => {
	if (getBooleanFF('platform.linking-platform.smart-card.hover-card-ai-summaries')) {
		return (
			<ConnectedAIPrismContainer isAIEnabled={isAIEnabled} url={url} testId={testId} {...props}>
				{children}
			</ConnectedAIPrismContainer>
		);
	}

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={hoverCardClassName}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={HoverCardContainer}
			data-testid={testId}
			{...props}
		>
			{children}
		</div>
	);
};

export default ContentContainer;
