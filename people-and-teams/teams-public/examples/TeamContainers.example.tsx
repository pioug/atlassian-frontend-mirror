import React, { useMemo } from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { selectField, toggleField } from '@atlassian/teams-app-internal-playground/fields';
import { Playground } from '@atlassian/teams-app-internal-playground/playground';
import type { Config as PlaygroundConfig } from '@atlassian/teams-app-internal-playground/types';

import { TeamContainers } from '../src/ui/team-containers/main';
import { type ProductAccess, productPermissionHandlers } from './mocks/productPermissions';

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

const CONTAINER_EDGES_BY_PRESET = {
	'jira-and-confluence': [jiraProject, confluenceSpace],
	none: [],
} as const;

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
		selectField({
			id: 'containers',
			label: 'Linked containers',
			type: 'select',
			defaultValue: 'jira-and-confluence',
			group: 'Data',
			options: [
				{ value: 'jira-and-confluence', label: 'Jira project and Confluence space' },
				{ value: 'none', label: 'None' },
			],
		}),
		selectField({
			id: 'productAccess',
			label: 'Viewer product access',
			type: 'select',
			defaultValue: 'granted',
			group: 'Data',
			options: [
				{ value: 'granted', label: 'Jira, Confluence and Loom' },
				{ value: 'denied', label: 'None' },
			],
		}),
	],
} satisfies PlaygroundConfig;

/**
 * Team containers grid on mock data.
 *
 * 1. Mocks the linked containers, web links and the viewer's product permissions, which
 *    decide whether the Jira, Confluence and Loom add cards (or the no-access state) render.
 * 2. `defaults` presets the controls, so Workbench variants can open a specific state.
 */
export function TeamContainersPlayground({
	defaults,
}: {
	defaults?: { containers?: 'jira-and-confluence' | 'none'; productAccess?: ProductAccess };
}): React.JSX.Element {
	const playgroundConfig = useMemo(() => ({ ...config, defaults }), [defaults]);

	return (
		<Playground
			config={playgroundConfig}
			with={['fetch']}
			fetch={({ containers, productAccess }) => ({
				mockHandlers: [
					{
						match: (url: string) => url.includes('/gateway/api/graphql?q=TeamContainersQueryV2'),
						response: {
							data: {
								graphStore: {
									cypherQueryV2: { edges: CONTAINER_EDGES_BY_PRESET[containers] },
								},
							},
						},
					},
					{
						match: (url: string) =>
							url.includes('/gateway/api/v4/teams/') && url.includes('/links'),
						response: { entities: [] },
					},
					...productPermissionHandlers(productAccess),
				],
			})}
		>
			{({ width, isReadOnly, containers, productAccess }) => (
				<Box xcss={width === 'large' ? styles.wrapper : styles.wrapperSmall}>
					<TeamContainers
						// Remount so the containers and permission stores refetch for the new mocks.
						key={`${containers}-${productAccess}`}
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

export default function Example(): React.JSX.Element {
	return <TeamContainersPlayground />;
}
