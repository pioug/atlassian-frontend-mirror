/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { di } from 'react-magnetic-di';

import useAISummaryAction from '../../../state/hooks/use-ai-summary-action';
import AIPrism from '../../common/ai-prism';
import { HoverCardContainer, popupContainerStyles } from '../styled';
import type { ContentContainerProps } from '../types';

import { hoverCardClassName } from './HoverCardContent';

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

const ContentContainerOld = ({
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

export default ContentContainerOld;
