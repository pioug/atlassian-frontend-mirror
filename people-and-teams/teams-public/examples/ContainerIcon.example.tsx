import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { selectField } from '@atlassian/teams-app-internal-playground/fields';
import {
	Playground,
	type PlaygroundConfig,
} from '@atlassian/teams-app-internal-playground/playground';

import { ConfluenceIcon, ContainerIcon, JiraIcon, LoomIcon } from '../src';

const styles = cssMap({
	iconRow: {
		alignItems: 'center',
	},
	label: {
		minWidth: '180px',
	},
});

const JIRA_AVATAR =
	'https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/default-avatar.png';
const CONFLUENCE_ICON =
	'https://hello.atlassian.net/wiki/s/-54935443/6452/b87d5ceba97fbbd70b57b6ed2bb35edcadf3a5f8/_/images/icons/product/confluence-128.png';

const config = {
	fields: [
		selectField({
			id: 'size',
			label: 'Size',
			type: 'select',
			defaultValue: 'medium',
			group: 'Props',
			options: [
				{ value: 'small', label: 'Small' },
				{ value: 'medium', label: 'Medium' },
			],
		}),
	],
} satisfies PlaygroundConfig;

export default function Example(): React.JSX.Element {
	return (
		<Playground config={config}>
			{({ size }) => (
				<Stack space="space.150">
					<Stack space="space.100">
						<Text weight="semibold">ContainerIcon</Text>
						<Stack space="space.075">
							{(
								[
									{
										containerType: 'JiraProject',
										title: 'Jira Project',
										containerIcon: JIRA_AVATAR,
									},
									{
										containerType: 'ConfluenceSpace',
										title: 'Confluence Space',
										containerIcon: CONFLUENCE_ICON,
									},
									{ containerType: 'LoomSpace', title: 'Loom Space', containerIcon: undefined },
									{
										containerType: 'WebLink',
										title: 'Web Link (no icon)',
										containerIcon: undefined,
									},
									{
										containerType: 'WebLink',
										title: 'Web Link (with icon)',
										containerIcon: 'https://www.google.com/favicon.ico',
									},
								] as const
							).map(({ containerType, title, containerIcon }) => (
								<Inline key={containerType + title} xcss={styles.iconRow} space="space.100">
									<Box xcss={styles.label}>
										<Text color="color.text.subtle" size="small">
											{title}
										</Text>
									</Box>
									<ContainerIcon
										containerType={containerType}
										title={title}
										containerIcon={containerIcon}
										size={size}
									/>
								</Inline>
							))}
						</Stack>
					</Stack>
					<Stack space="space.100">
						<Text weight="semibold">Product icons (SVG assets)</Text>
						<Inline space="space.200" alignBlock="center">
							<Inline space="space.100" alignBlock="center">
								<img src={ConfluenceIcon} alt="Confluence" height={24} width={24} />
								<Text size="small" color="color.text.subtle">
									ConfluenceIcon
								</Text>
							</Inline>
							<Inline space="space.100" alignBlock="center">
								<img src={JiraIcon} alt="Jira" height={24} width={24} />
								<Text size="small" color="color.text.subtle">
									JiraIcon
								</Text>
							</Inline>
							<Inline space="space.100" alignBlock="center">
								<img src={LoomIcon} alt="Loom" height={24} width={24} />
								<Text size="small" color="color.text.subtle">
									LoomIcon
								</Text>
							</Inline>
						</Inline>
					</Stack>
				</Stack>
			)}
		</Playground>
	);
}
