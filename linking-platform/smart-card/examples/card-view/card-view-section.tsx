import React from 'react';

import { type ProviderProps, SmartCardProvider } from '@atlaskit/link-provider';
import { Card } from '@atlaskit/smart-card';
import { CardSSR } from '@atlaskit/smart-card/ssr';

import type { CardProps } from '../../src/view/Card';

const CardViewSection = ({
	description,
	title,
	// ProviderProps
	client,
	// CardProps
	platform = 'web',
	url = 'https://some.url',
	fontSize,
	CardComponent = CardSSR,
	...props
}: {
	description?: string;
	title: string;
	fontSize?: React.CSSProperties['fontSize'];
	CardComponent?: typeof Card | typeof CardSSR;
} & Pick<ProviderProps, 'client'> &
	CardProps) => (
	<React.Fragment>
		{title !== '' ? <h6>{title}</h6> : undefined}
		{description !== undefined && description !== '' ? <p>Context: {description}</p> : undefined}
		<SmartCardProvider client={client}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop */}
			<p style={{ fontSize }}>
				<CardComponent {...props} platform={platform} url={url} />
			</p>
		</SmartCardProvider>
	</React.Fragment>
);

export default CardViewSection;
