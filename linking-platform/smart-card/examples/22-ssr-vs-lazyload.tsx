import { type CardProviderStoreOpts } from '@atlaskit/link-provider';
import { Box, xcss } from '@atlaskit/primitives';
import SectionMessage from '@atlaskit/section-message';
import React from 'react';
import { Card, Client, Provider, SmartLinkPosition, TitleBlock } from '../src';
import { CardSSR } from '../src/ssr';
import ExampleContainer from './utils/example-container';
import { cardState, url } from './utils/smart-card-ssr-state';

const gapStyles = xcss({ height: '3000px' });

const storeOptions: CardProviderStoreOpts = {
	initialState: { [url]: cardState },
};

export default () => (
	<Provider storeOptions={storeOptions} client={new Client('stg')}>
		<ExampleContainer title="CardSSR">
			<SectionMessage title="Support: Inline" appearance="warning">
				<p>
					CardSSR has only been fully tested with inline appearance. To extend the support to other
					card appearance, please contact us at{' '}
					<a
						href="https://atlassian.enterprise.slack.com/archives/CFKGAQZRV"
						title="#help-linking-platform"
					>
						#help-linking-platform
					</a>
					.
				</p>
			</SectionMessage>
			<h4>Inline:</h4>
			<CardSSR appearance="inline" url={url} />
			<h4>Flexible:</h4>
			<CardSSR appearance="block" url={url}>
				<TitleBlock maxLines={1} position={SmartLinkPosition.Center} />
			</CardSSR>
		</ExampleContainer>
		<ExampleContainer title="Card">
			<Box xcss={gapStyles}>
				<p>Scroll ⇣ to find a lazily loaded smart card 👇</p>
			</Box>
			<Card url="https://trello.com/b/8B5zyiSn/test-smart-card-board" appearance="block" />
		</ExampleContainer>
	</Provider>
);
