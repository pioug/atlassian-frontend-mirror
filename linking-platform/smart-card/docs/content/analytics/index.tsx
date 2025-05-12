import React from 'react';

import { code } from '@atlaskit/docs';
import Link from '@atlaskit/link';
import { Text } from '@atlaskit/primitives/compiled';
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

### Analytics Next (@atlaskit/analytics-next) within smart-card

The smart-card package now uses the \`@atlaskit/analytics-next\` package to fire events which is statically generated by the \`@atlassian/analytics-tooling\` package.

### How to add a new analytics event

1. Add the new event to the \`analytics.spec.yaml\` file.
2. Run \`yarn workspace @atlaskit/smart-card analytics:codegen\` to regenerate the analytics types. Do not directly modify the generated files within \`src/common/analytics/generated\` directory.

The \`analytics.spec.yaml\` file follows the convention:

- \`context\`: used to define a context with common attributes for multiple events definitions. The context is automatically filled in by the React context \`SmartLinkAnalyticsContext\`. For more implementation details, see \`getSmartLinkAnalyticsContext\` within \`src/utils/analytics/SmartLinkAnalyticsContext.tsx\`
- \`attributes\`: used to define attributes that can be reused across multiple events definitions. These attributes must be provided as arguments with the \`fireEvent\` function invocation. Any overlap between attributes which are also defined in the context of the event will be overridden by \`SmartLinkAnalyticsContext\`
- \`events\`: used to define events with attributes, context and type that can be fired from the \`fireEvent\` function. There are 4 types of \`type\`: \`ui\`, \`track\`, \`operational\` and \`screen\`.

### How to fire an event

You can fire an event by importing \`useAnalyticsEvents\` hook and calling the \`fireEvent\` function. You should be importing the hook from the automatically generated \`use-analytics-events\` file.

${code`
import { useAnalyticsEvents } from 'some-path/.../common/analytics/generated/use-analytics-events';
const { fireEvent } = useAnalyticsEvents();

fireEvent('ui.smartLink.clicked', {
	id: 'some random id',
	display: CardDisplay.Flexible,
	definitionId: 'some-definition-id',
	isModifierKeyPressed: true,
});
`}

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
