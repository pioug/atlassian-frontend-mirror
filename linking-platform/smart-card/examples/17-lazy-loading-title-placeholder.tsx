import React from 'react';
import { Provider, Client } from '../src';
import { type EnvironmentsKeys } from '@atlaskit/link-provider';
import { token } from '@atlaskit/tokens';
import { LoadingCardLink } from '../src/view/CardWithUrl/component-lazy/LoadingCardLink';
import { type AnalyticsPayload } from '../src/utils/types';

class BrokenClient extends Client {
	constructor(config: EnvironmentsKeys) {
		super(config);
	}
	fetchData(url: string): Promise<any> {
		return Promise.reject('error');
	}
}
export default () => (
	<Provider client={new BrokenClient('stg')}>
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: '680px',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				margin: '0 auto',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				marginTop: token('space.800', '64px'),
			}}
		>
			This is a placeholder for a Smart Link with the text override!
			<br />
			<LoadingCardLink
				url={'http://some.url'}
				placeholder={'spaghetti'}
				id={''}
				appearance={'inline'}
				dispatchAnalytics={function (event: AnalyticsPayload): void {
					throw new Error('Function not implemented.');
				}}
			/>
			<br />
			This is a placeholder for a Smart Link!
			<br />
			<LoadingCardLink
				url={'http://some.url'}
				id={''}
				appearance={'inline'}
				dispatchAnalytics={function (event: AnalyticsPayload): void {
					throw new Error('Function not implemented.');
				}}
			/>
		</div>
	</Provider>
);
