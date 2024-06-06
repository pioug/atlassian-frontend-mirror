import React from 'react';
import { Provider, Card, Client, type ResolveResponse } from '../src';
import { type EnvironmentsKeys } from '@atlaskit/link-provider';
import { token } from '@atlaskit/tokens';

class ConfluenceClient extends Client {
	constructor(config: EnvironmentsKeys) {
		super(config);
	}
	fetchData(url: string): Promise<any> {
		if (
			url ===
			"https://pug.jira-dev.com/wiki/spaces/~760391763/&undefinedLink=page that doesn't exist yet"
		) {
			return Promise.resolve({
				meta: {
					visibility: 'restricted',
					access: 'granted',
				},
				data: {
					'@type': ['Document', 'atlassian:UndefinedLink'],
					url: "https://pug.jira-dev.com/wiki/spaces/~760391763/&undefinedLink=page that doesn't exist yet",
					name: "page that doesn't exist yet",
				},
			} as any);
		} else {
			return Promise.resolve({
				meta: {
					visibility: 'restricted',
					access: 'granted',
				},
				data: {
					'@type': ['Document', 'schema:TextDigitalDocument'],
					url: 'https://pug.jira-dev.com/wiki/spaces/~760391763/pages/4619440736/test+1',
					name: 'test 1',
				},
			} as ResolveResponse);
		}
	}
}
export default () => (
	<Provider client={new ConfluenceClient('stg')}>
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
			<p>
				Normally, clicking a card would bring you to a page, or to a page create action.
				<br />
				Unfortunately this can't be emulated in this environment.
			</p>
			<br />
			<br />
			{/* Target title not found */}
			<Card
				appearance="inline"
				url="https://pug.jira-dev.com/wiki/spaces/~760391763/&undefinedLink=page that doesn't exist yet"
			/>
			<br />
			<br />
			{/* Target title found */}
			<Card
				appearance="inline"
				url="https://pug.jira-dev.com/wiki/spaces/~760391763/&undefinedLink=test 1"
			/>
		</div>
	</Provider>
);
