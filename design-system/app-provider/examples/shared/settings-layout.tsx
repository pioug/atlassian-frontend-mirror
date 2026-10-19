/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { Checkbox } from '@atlaskit/checkbox/checkbox';
import { cssMap, jsx } from '@atlaskit/css';
import { Label } from '@atlaskit/form/label/default';
import Heading from '@atlaskit/heading/heading';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import Textfield from '@atlaskit/textfield/text-field';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: { maxWidth: '640px', marginInline: 'auto' },
	divider: {
		borderBlockStartWidth: token('border.width'),
		borderBlockStartStyle: 'solid',
		borderBlockStartColor: token('color.border'),
	},
});

export function SettingsLayout(): React.JSX.Element {
	return (
		<Stack space="space.gap.xxlarge" xcss={styles.root}>
			<Stack space="space.gap.medium">
				<Heading as="h1" size="large">
					Workspace settings
				</Heading>
				<Text color="color.text.subtle">
					Try the fields to see how spacing feels in a form. Changes stay in this preview.
				</Text>
			</Stack>
			<Stack space="space.gap.xlarge">
				<Heading as="h3" size="medium">
					Workspace details
				</Heading>
				<Stack space="space.gap.small">
					<Label htmlFor="gap-preview-workspace">Workspace name</Label>
					<Textfield id="gap-preview-workspace" defaultValue="Design studio" />
				</Stack>
				<Stack space="space.gap.small">
					<Label htmlFor="gap-preview-description">Description</Label>
					<Textfield
						id="gap-preview-description"
						defaultValue="A shared home for our team’s work"
					/>
					<Text size="small" color="color.text.subtle">
						Help teammates understand what this workspace is for.
					</Text>
				</Stack>
			</Stack>
			<Box paddingBlockStart="space.250" xcss={styles.divider}>
				<Stack space="space.gap.xlarge">
					<Stack space="space.gap.medium">
						<Heading as="h3" size="medium">
							Notifications
						</Heading>
						<Text color="color.text.subtle">Choose which updates you receive.</Text>
					</Stack>
					<Stack space="space.gap.large">
						<Checkbox label="Project updates" defaultChecked />
						<Checkbox label="Mentions and replies" defaultChecked />
						<Checkbox label="Weekly team digest" />
					</Stack>
				</Stack>
			</Box>
			<Box paddingBlockStart="space.250" xcss={styles.divider}>
				<Stack space="space.gap.xlarge">
					<Stack space="space.gap.medium">
						<Heading as="h3" size="medium">
							Collaboration
						</Heading>
						<Text color="color.text.subtle">Set the defaults for new projects.</Text>
					</Stack>
					<Stack space="space.gap.large">
						<Checkbox label="Allow teammates to create projects" defaultChecked />
						<Checkbox label="Share new projects with the workspace" />
					</Stack>
				</Stack>
			</Box>
		</Stack>
	);
}
