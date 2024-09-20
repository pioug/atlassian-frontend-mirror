import { type EnvironmentsKeys } from '@atlaskit/link-provider';
import { Stack } from '@atlaskit/primitives';
import React from 'react';
import { Client, Provider } from '../src';
import { type AnalyticsPayload } from '../src/utils/types';
import { LoadingCardLink } from '../src/view/CardWithUrl/component-lazy/LoadingCardLink';
import ExampleContainer from './utils/example-container';
import InternalMessage from './utils/internal-message';

class BrokenClient extends Client {
	constructor(config: EnvironmentsKeys) {
		super(config);
	}
	fetchData(): Promise<any> {
		return Promise.reject('error');
	}
}
export default () => (
	<ExampleContainer title="Lazy loading placeholder">
		<Provider client={new BrokenClient('stg')}>
			<Stack space="space.200">
				<InternalMessage />
				<p>This is a default placeholder for a Smart Link.</p>
				<LoadingCardLink
					url="http://some.url"
					id=""
					appearance="inline"
					dispatchAnalytics={function (event: AnalyticsPayload): void {
						throw new Error('Function not implemented.');
					}}
				/>
				<p>This is a placeholder for a Smart Link with the text override!</p>
				<LoadingCardLink
					url="http://some.url"
					placeholder="spaghetti"
					id=""
					appearance="inline"
					dispatchAnalytics={function (event: AnalyticsPayload): void {
						throw new Error('Function not implemented.');
					}}
				/>
			</Stack>
		</Provider>
	</ExampleContainer>
);
