import React from 'react';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { Box, Inline } from '@atlaskit/primitives';

import { Card, Client, Provider, type ResolveResponse } from '../src';
import { mocks } from '../src/utils/mocks';

import ExampleContainer from './utils/example-container';

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

class Example extends React.Component {
	state = {
		c1Event: null,
		c2Event: null,
	};
	render() {
		return (
			<ExampleContainer title="Analytics example">
				<Inline>
					<Box>
						<AnalyticsListener
							channel="media"
							onEvent={(evt: any) => this.setState({ c1Event: evt.payload })}
						>
							<h4>Resolved response</h4>
							<Provider client={resolvingClient}>
								<Card url="http://some.public.url" appearance="inline" />
							</Provider>
							<div>
								<h5>The event's payload:</h5>
								<pre>
									{this.state.c1Event
										? JSON.stringify(this.state.c1Event, null, 2)
										: 'nothing happened yet'}
								</pre>
							</div>
						</AnalyticsListener>
					</Box>

					<Box>
						<AnalyticsListener
							channel="media"
							onEvent={(evt: any) => this.setState({ c2Event: evt.payload })}
						>
							<h4>Unauth response</h4>
							<Provider client={unauthClient}>
								<Card url="http://some.unauth.url" appearance="inline" />
							</Provider>
							<div>
								<h5>The event's payload:</h5>
								<pre>
									{this.state.c2Event
										? JSON.stringify(this.state.c2Event, null, 2)
										: 'nothing happened yet'}
								</pre>
							</div>
						</AnalyticsListener>
					</Box>
				</Inline>
			</ExampleContainer>
		);
	}
}

export default () => <Example />;
