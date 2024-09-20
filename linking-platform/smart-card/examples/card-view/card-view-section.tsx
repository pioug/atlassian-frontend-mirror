import { type ProviderProps, SmartCardProvider } from '@atlaskit/link-provider';
import React from 'react';
import { Card, type CardProps } from '../../src';

const CardViewSection = ({
	description,
	title,
	// ProviderProps
	client,
	// CardProps
	platform = 'web',
	url = 'https://some.url',
	...props
}: { description?: string; title: string } & Pick<ProviderProps, 'client'> & CardProps) => (
	<React.Fragment>
		<h6>{title}</h6>
		{description ? <p>Context: {description}</p> : undefined}
		<SmartCardProvider client={client}>
			<Card {...props} platform={platform} url={url} />
		</SmartCardProvider>
	</React.Fragment>
);

export default CardViewSection;
