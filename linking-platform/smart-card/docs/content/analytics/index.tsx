import React from 'react';

import { code } from '@atlaskit/docs';
import Link from '@atlaskit/link';
import { Text } from '@atlaskit/primitives';
import SectionMessage from '@atlaskit/section-message';

import customMd from '../../utils/custom-md';

const WarningMessage = (): JSX.Element => (
	<SectionMessage appearance="information">
		All Linking events are currently fired on the <code>media</code> channel which we share with
		Media Platform, so we also share the Media Platform analytics listeners.
	</SectionMessage>
);

const SmartEventLinks = () => {
	const items: { event: string; link: string }[] = React.useMemo(() => {
		return [
			{
				event: 'smartLink renderSuccess',
				link: 'https://data-portal.internal.atlassian.com/analytics/registry/23038',
			},
			{
				event: 'hoverCard viewed',
				link: 'https://data-portal.internal.atlassian.com/analytics/registry/43610',
			},
			{
				event: 'hoverCard dismissed',
				link: 'https://data-portal.internal.atlassian.com/analytics/registry/43531',
			},
			{
				event: 'link clicked',
				link: 'https://data-portal.internal.atlassian.com/analytics/registry/50484',
			},
		];
	}, []);

	return (
		<table>
			<thead>
				<tr>
					<th>Event</th>
					<th>Data Portal</th>
				</tr>
			</thead>
			<tbody>
				{items.map((item) => {
					return (
						<tr>
							<td>
								<code>{item.event}</code>
							</td>
							<td>
								<Link href={item.link}>View in Data Portal</Link>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

const LinkLifeCycleTable = (): JSX.Element => {
	const items: { event: string; link: string }[] = React.useMemo(() => {
		return [
			{
				event: 'link created (client)',
				link: 'https://data-portal.internal.atlassian.com/analytics/registry/47016',
			},
			{
				event: 'link updated (client)',
				link: 'https://data-portal.internal.atlassian.com/analytics/registry/47017',
			},
			{
				event: 'link deleted (client)',
				link: 'https://data-portal.internal.atlassian.com/analytics/registry/47018',
			},
		];
	}, []);

	return (
		<table>
			<thead>
				<tr>
					<th>Event</th>
					<th>Data Portal</th>
				</tr>
			</thead>
			<tbody>
				{items.map((item) => {
					return (
						<tr>
							<td>
								<code>{item.event}</code>
							</td>
							<td>
								<Link href={item.link}>View in Data Portal</Link>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

const AllProductLocations = (): JSX.Element => {
	const items: { surface: JSX.Element; values: string[] }[] = React.useMemo(() => {
		return [
			{
				surface: (
					<Text>
						Editor (<code>@atlaskit/editor-core</code>)
					</Text>
				),
				values: [
					'editor_fixedWidth',
					'editor_fullWidth',
					'editor_chromeless',
					'editor_comment',
					'editor_mobile',
				],
			},
			{
				surface: (
					<span>
						Renderer (<code>@atlaskit/renderer</code>)
					</span>
				),
				values: ['renderer'],
			},
		];
	}, []);

	return (
		<table>
			<thead>
				<tr>
					<th>Surface</th>
					<th>Location Value(s)</th>
				</tr>
			</thead>
			<tbody>
				{items.map((item) => {
					return (
						<tr>
							<td>{item.surface}</td>
							<td>
								{item.values.map((x, index) => {
									return (
										<>
											<code>{x}</code>
											{index < item.values.length - 1 ? ', ' : ''}
										</>
									);
								})}
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

const ConfluenceLocations = (): JSX.Element => {
	const items: { surface: JSX.Element; values: string[] }[] = React.useMemo(() => {
		return [
			{
				surface: <Text>Confluence Shortcuts</Text>,
				values: ['confluenceShortcuts'],
			},
		];
	}, []);

	return (
		<table>
			<thead>
				<tr>
					<th>Surface</th>
					<th>Location Value(s)</th>
				</tr>
			</thead>
			<tbody>
				{items.map((item) => {
					return (
						<tr>
							<td>{item.surface}</td>
							<td>
								{item.values.map((x, index) => {
									return (
										<>
											<code>{x}</code>
											{index < item.values.length - 1 ? ', ' : ''}
										</>
									);
								})}
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

const JiraLocations = () => {
	const items: { surface: JSX.Element; values: string[] }[] = React.useMemo(() => {
		return [
			{
				surface: <Text>Jira Issue View — Web Links</Text>,
				values: ['jiraWebLinks'],
			},
			{
				surface: <Text>Jira Issue View — Confluence Page Links</Text>,
				values: ['jiraLinkedConfluencePages'],
			},
		];
	}, []);

	return (
		<table>
			<thead>
				<tr>
					<th>Surface</th>
					<th>Location Value(s)</th>
				</tr>
			</thead>
			<tbody>
				{items.map((item) => {
					return (
						<tr>
							<td>{item.surface}</td>
							<td>
								{item.values.map((x, index) => {
									return (
										<>
											<code>{x}</code>
											{index < item.values.length - 1 ? ', ' : ''}
										</>
									);
								})}
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export default customMd`
${(<WarningMessage />)}

## Smart Link Events

Analytics are generally fired when a UI interaction occurs with a SmartCard component or when the state of the SmartCard component changes (i.e., resolves).

Here are a few of our more important events fired from Smart Cards:

${(<SmartEventLinks />)}

## Link Lifecycle (Created / Updated / Deleted) Events

See the [@atlaskit/analytics-next](https://atlaskit.atlassian.com/packages/analytics/analytics-next) page for more information.

${(<LinkLifeCycleTable />)}

## Providing Context to Smart Links

We recommend Smart Link adopters provide an Analytics Context around surfaces where Smart Links are
integrated to help identify where Smart Link features are in play. This context should wrap all Smart
Link platform componentry including the \`<Card />\` component as well as any exposed hooks in use.

For the moment, we look for adopters to use analytics context to supply a \`location\` attribute, but
in future we may look to acquire additional context.

${code`
import { AnalyticsContext } from '@atlaskit/analytics-next';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { Card } from '@atlaskit/smart-card';

const Component = () => {
    return (
        <AnalyticsContext data={{ attributes: { location: 'jiraWebLinks' } }}>
            <SmartCardProvider>
                <Card url="https://atlassian.com" />
            </SmartCardProvider>
        </AnalyticsContext>
    )
}
`}

### Established Locations

Below are some known and established values for \`location\` (this is not exhaustive):

#### All Products

${(<AllProductLocations />)}

#### Confluence

${(<ConfluenceLocations />)}

#### Jira

${(<JiraLocations />)}
`;
