import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { type Card } from '@atlaskit/smart-card';
import { CardSSR } from '@atlaskit/smart-card/ssr';

import type { MultiCardViewProps } from '../utils/card-view-props';


type CardViewActionPropsBase = {
	CardComponent?: typeof Card | typeof CardSSR;
	description?: string;
	fontSize?: React.CSSProperties['fontSize'];
	title: string;
};

type CardViewActionProps = CardViewActionPropsBase & MultiCardViewProps;

const defaultUrl = 'https://some.url';
const CardViewSection = ({
	description,
	title,
	// ProviderProps
	client,
	// CardProps
	platform = 'web',
	url,
	urls,
	fontSize,
	CardComponent = CardSSR,
	...props
}: CardViewActionProps): React.JSX.Element => (
	<React.Fragment>
		{title !== '' ? <h6>{title}</h6> : undefined}
		{description !== undefined && description !== '' ? <p>Context: {description}</p> : undefined}
		<SmartCardProvider client={client}>
			{ (urls || [url]).map((currentUrl = defaultUrl) => (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				<p style={{ fontSize }}>
					<CardComponent {...props} platform={platform} url={currentUrl} />
				</p>
			))}
		</SmartCardProvider>
	</React.Fragment>
);

export default CardViewSection;

