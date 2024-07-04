import { type ProviderProps, SmartCardProvider } from '@atlaskit/link-provider';
import { Card, type CardProps } from '@atlaskit/smart-card';
import React from 'react';

export type CardViewProps = {
	appearance: CardProps['appearance'];
	client: ProviderProps['client'];
	frameStyle?: CardProps['frameStyle'];
	isSelected?: CardProps['isSelected'];
	url?: CardProps['url'];
	useLegacyBlockCard?: boolean;
};

const CardView = ({
	appearance,
	client,
	frameStyle,
	isSelected,
	url = 'https://some.url',
	useLegacyBlockCard = false,
}: CardViewProps) => (
	<SmartCardProvider client={client} featureFlags={{ enableFlexibleBlockCard: true }}>
		<Card
			appearance={appearance}
			url={url}
			/* Embed-specific props */
			frameStyle={frameStyle}
			isSelected={isSelected}
			useLegacyBlockCard={useLegacyBlockCard}
		/>
	</SmartCardProvider>
);

export default CardView;
