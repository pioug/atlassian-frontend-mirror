/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useState, useEffect } from 'react';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { HoverCardContainer, popupContainerStyles } from '../styled';
import AIPrism from '../../common/ai-prism';
import { hoverCardClassName } from './HoverCardContent';
import type { ContentContainerProps } from '../types';
import { useAISummary } from '../../../state/hooks/use-ai-summary';
import { useSmartCardState } from '../../../state/store';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { type JsonLd } from 'json-ld-types';
import { extractAri, extractLink } from '@atlaskit/link-extractors';
import { di } from 'react-magnetic-di';
import type { EnvironmentsKeys } from '@atlaskit/linking-common';

const ConnectedAIPrismContainer = ({
	children,
	isAIEnabled = false,
	testId,
	url,
	...props
}: ContentContainerProps) => {
	di(useAISummary, AIPrism);

	const cardState = useSmartCardState(url);
	const data = cardState?.details?.data as JsonLd.Data.BaseData;

	//The data is undefined while the link is resolving.
	const dataUrl = data ? extractLink(data) : null;
	const dataAri = data ? extractAri(data) : null;
	const { product, connections } = useSmartLinkContext();

	const {
		state: { status },
	} = useAISummary({
		url: dataUrl || '',
		ari: dataAri || '',
		product: product,
		envKey: connections.client.envKey as EnvironmentsKeys,
		baseUrl: connections.client.baseUrlOverride,
	});

	const [showPrism, setShowPrism] = useState(status === 'loading');

	useEffect(() => {
		setShowPrism(status === 'loading');
	}, [status]);

	const container = (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={hoverCardClassName}
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
			css={HoverCardContainer}
			data-testid={testId}
			{...props}
		>
			{children}
		</div>
	);
};

export default ContentContainer;
