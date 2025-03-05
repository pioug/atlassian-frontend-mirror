import React from 'react';

import { type ProviderProps, SmartCardProvider } from '@atlaskit/link-provider';

import { Card, type CardProps } from '../../src';

const CardViewSection = ({
	description,
	title,
	// ProviderProps
	client,
	// CardProps
	platform = 'web',
	url = 'https://some.url',
	fontSize,
	...props
}: { description?: string; title: string; fontSize?: React.CSSProperties['fontSize'] } & Pick<
	ProviderProps,
	'client'
> &
	CardProps) => (
	<React.Fragment>
		<h6>{title}</h6>
		{description ? <p>Context: {description}</p> : undefined}
		<SmartCardProvider client={client}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop */}
			<p style={{ fontSize }}>
				<Card {...props} platform={platform} url={url} />
			</p>
		</SmartCardProvider>
	</React.Fragment>
);

export default CardViewSection;
