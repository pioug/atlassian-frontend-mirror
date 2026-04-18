import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { selectField, toggleField } from '@atlassian/teams-app-internal-playground/fields';
import {
	Playground,
	type PlaygroundConfig,
} from '@atlassian/teams-app-internal-playground/playground';

import { TeamContainers } from '../src';

const jiraProject = {
	node: {
		columns: [
			{
				key: 'container',
				value: {
					data: {
						__typename: 'JiraProject',
						id: '4',
						jiraProjectName: 'Jira Project',
						webUrl: 'https://example.com/jira',
						created: '2021-01-01',
						avatar: {
							medium:
								'https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/712020:2981defd-17f1-440e-a377-8c7657b72a6f/4b5b0d55-614b-4e75-858f-9da3d0c7e3f8/128',
						},
						projectType: 'software',
						projectTypeName: 'Software Project',
					},
				},
			},
		],
	},
};

const confluenceSpace = {
	node: {
		columns: [
			{
				key: 'container',
				value: {
					data: {
						__typename: 'ConfluenceSpace',
						id: '3',
						confluenceSpaceName: 'Confluence Space',
						type: 'confluence',
						createdDate: '2021-01-01',
						links: { base: 'https://example.com', webUi: '/confluence' },
						icon: { path: '/wiki/icon.png' },
					},
				},
			},
		],
	},
};

const styles = cssMap({
	wrapper: {
		width: '600px',
	},
	wrapperSmall: {
		width: '300px',
	},
});

const config = {
	fields: [
		selectField({
			id: 'width',
			label: 'Container width',
			type: 'select',
			defaultValue: 'large',
			group: 'Layout',
			options: [
				{ value: 'large', label: 'Large (600px)' },
				{ value: 'small', label: 'Small (300px)' },
			],
		}),
		toggleField({
			id: 'isReadOnly',
			label: 'Read only',
			type: 'toggle',
			defaultValue: false,
			group: 'Layout',
		}),
	],
} satisfies PlaygroundConfig;

export default function Example(): React.JSX.Element {
	return (
		<Playground
			config={config}
			with={['fetch']}
			fetch={() => ({
				mockHandlers: [
					{
						match: (url: string) => url.includes('/gateway/api/graphql?q=TeamContainersQueryV2'),
						response: {
							data: {
								graphStore: {
									cypherQueryV2: { edges: [jiraProject, confluenceSpace] },
								},
							},
						},
					},
					{
						match: (url: string) =>
							url.includes('/gateway/api/v4/teams/') && url.includes('/links'),
						response: { entities: [] },
					},
				],
			})}
		>
			{({ width, isReadOnly }) => (
				<Box xcss={width === 'large' ? styles.wrapper : styles.wrapperSmall}>
					<TeamContainers
						teamId="team-id"
						onAddAContainerClick={() => {}}
						userId="user-id"
						cloudId="cloud-id"
						isReadOnly={isReadOnly}
					/>
				</Box>
			)}
		</Playground>
	);
}
