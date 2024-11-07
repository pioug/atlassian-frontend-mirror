import React from 'react';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import Heading from '@atlaskit/heading';
import { Box, Flex, xcss } from '@atlaskit/primitives';

import { Card, Client, Provider, type ResolveResponse } from '../../src';
import { mocks } from '../../src/utils/mocks';

class CustomClient extends Client {
	constructor(private resp: ResolveResponse) {
		super();
	}
	fetchData(): Promise<ResolveResponse> {
		return Promise.resolve(this.resp);
	}
}

const resolvingClient = new CustomClient(mocks.success);
const unauthClient = new CustomClient(mocks.unauthorized);

const linkBoxStyles = xcss({
	marginBottom: 'space.100',
	marginTop: 'space.100',
});

const exampleBoxStyles = xcss({
	marginBottom: 'space.250',
});

const Example = (): JSX.Element => {
	const [c1Event, setC1Event] = React.useState<null | string>(null);
	const [c2Event, setC2Event] = React.useState<null | string>(null);

	return (
		<Flex direction="column" justifyContent="center">
			<Box xcss={exampleBoxStyles}>
				<AnalyticsListener channel="media" onEvent={(evt: any) => setC1Event(evt.payload)}>
					<Heading size="large">Resolved response</Heading>
					<Box xcss={linkBoxStyles}>
						<Provider client={resolvingClient}>
							<Card url="http://some.public.url" appearance="inline" />
						</Provider>
					</Box>
					<Box>
						<Heading size="small">The event's payload:</Heading>
						<pre>
							{c1Event !== null ? JSON.stringify(c1Event, null, 2) : 'nothing happened yet'}
						</pre>
					</Box>
				</AnalyticsListener>
			</Box>

			<Box>
				<AnalyticsListener channel="media" onEvent={(evt: any) => setC2Event(evt.payload)}>
					<Heading size="large">Unauthorized response</Heading>
					<Box xcss={linkBoxStyles}>
						<Provider client={unauthClient}>
							<Card url="http://some.unauth.url" appearance="inline" />
						</Provider>
					</Box>
					<Box>
						<Heading size="small">The event's payload:</Heading>
						<pre>
							{c2Event !== null ? JSON.stringify(c2Event, null, 2) : 'nothing happened yet'}
						</pre>
					</Box>
				</AnalyticsListener>
			</Box>
		</Flex>
	);
};

export default Example;
