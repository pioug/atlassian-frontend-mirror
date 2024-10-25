import React from 'react';

import { type CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import type { CardAppearance } from '@atlaskit/linking-common';

import { Card } from '../../src';

import { ErroredClient, ForbiddenClient, NotFoundClient, UnAuthClient } from './custom-client';

export const renderCard = (client: CardClient, appearance: CardAppearance) => (
	<SmartCardProvider client={client}>
		<Card url="https://some.url" appearance={appearance} />
	</SmartCardProvider>
);

/**
 * Unresolved view used with deprecated vr tests (puppeteer)
 * @deprecated
 */
const UnresolvedViewTest = ({ appearance }: { appearance: CardAppearance }) => {
	return (
		<React.Fragment>
			<h4>Error</h4>
			{renderCard(new ErroredClient(), appearance)}

			<h4>Forbidden</h4>
			{renderCard(new ForbiddenClient(), appearance)}

			<h4>Not found</h4>
			{renderCard(new NotFoundClient(), appearance)}

			<h4>Unauthorised</h4>
			{renderCard(new UnAuthClient(), appearance)}
		</React.Fragment>
	);
};

export default UnresolvedViewTest;
