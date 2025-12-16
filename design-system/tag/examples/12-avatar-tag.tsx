/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar';
import Heading from '@atlaskit/heading';
import { Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { AvatarTag } from '@atlaskit/tag';

export default function AvatarTagExample() {
	return (
		<Stack space="space.400">
			<Stack space="space.100">
				<Heading size="large">AvatarTag Examples</Heading>
				<Text>
					AvatarTag is a specialized tag for representing people/users with an avatar and name. It
					features a rounded pill design optimized for user representation.
				</Text>
			</Stack>

			{/* Basic Usage */}
			<Stack space="space.200">
				<Text weight="bold">Basic Usage</Text>
				<Text size="small">Simple AvatarTag with just text and avatar (shows initials).</Text>
				<Inline space="space.100" alignBlock="center">
					<AvatarTag
						text="John Doe"
						avatar={Avatar}
						isRemovable={false}
						testId="avatar-tag-basic"
					/>
					<AvatarTag text="Jane Smith" avatar={Avatar} isRemovable={false} />
					<AvatarTag text="Bob Johnson" avatar={Avatar} isRemovable={false} />
				</Inline>
			</Stack>

			{/* With Avatar Image */}
			<Stack space="space.200">
				<Text weight="bold">With Avatar Image</Text>
				<Text size="small">AvatarTags with custom avatar image</Text>
				<Inline space="space.100" alignBlock="center">
					<AvatarTag
						text="Scott Farquhar"
						avatar={(props) => (
							<Avatar
								{...props}
								src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
							/>
						)}
						isRemovable={false}
						testId="avatar-tag-with-image"
					/>
					<AvatarTag text="Mike Cannon-Brookes" avatar={Avatar} isRemovable={false} />
				</Inline>
			</Stack>

			{/* Removable */}
			<Stack space="space.200">
				<Text weight="bold">Removable AvatarTags</Text>
				<Text size="small">AvatarTags with a remove button (default behavior).</Text>
				<Inline space="space.100" alignBlock="center">
					<AvatarTag
						text="Alice Williams"
						avatar={Avatar}
						removeButtonLabel="Remove Alice"
						testId="avatar-tag-removable-1"
					/>
					<AvatarTag text="Charlie Brown" avatar={Avatar} removeButtonLabel="Remove Charlie" />
					<AvatarTag text="Diana Prince" avatar={Avatar} removeButtonLabel="Remove Diana" />
				</Inline>
			</Stack>

			{/* Linked */}
			<Stack space="space.200">
				<Text weight="bold">Linked AvatarTags</Text>
				<Text size="small">AvatarTags that link to a user profile or page.</Text>
				<Inline space="space.100" alignBlock="center">
					<AvatarTag
						text="View Profile"
						avatar={Avatar}
						href="https://atlassian.com/user/1"
						isRemovable={false}
						testId="avatar-tag-linked"
					/>
					<AvatarTag
						text="Team Member"
						avatar={Avatar}
						href="https://atlassian.com/user/2"
						isRemovable={false}
					/>
				</Inline>
			</Stack>

			{/* Linked + Removable */}
			<Stack space="space.200">
				<Text weight="bold">Linked + Removable AvatarTags</Text>
				<Text size="small">AvatarTags that are both clickable and removable.</Text>
				<Inline space="space.100" alignBlock="center">
					<AvatarTag
						text="Editable User"
						avatar={Avatar}
						href="https://atlassian.com/user/3"
						removeButtonLabel="Remove user"
						testId="avatar-tag-linked-removable"
					/>
					<AvatarTag
						text="Another User"
						avatar={Avatar}
						href="https://atlassian.com/user/4"
						removeButtonLabel="Remove"
					/>
				</Inline>
			</Stack>

			{/* Long Names */}
			<Stack space="space.200">
				<Text weight="bold">Long Names (Truncation)</Text>
				<Text size="small">
					AvatarTags with long names are truncated with an ellipsis at 180px max width.
				</Text>
				<Inline space="space.100" alignBlock="center">
					<AvatarTag
						text="This is a very long name that will be truncated"
						avatar={Avatar}
						isRemovable={false}
						testId="avatar-tag-long"
					/>
					<AvatarTag
						text="Another extremely long name for testing truncation behavior"
						avatar={Avatar}
						removeButtonLabel="Remove"
					/>
				</Inline>
			</Stack>

			{/* Callbacks */}
			<Stack space="space.200">
				<Text weight="bold">With Callbacks</Text>
				<Text size="small">
					AvatarTags support onBeforeRemoveAction and onAfterRemoveAction callbacks.
				</Text>
				<Inline space="space.100" alignBlock="center">
					<AvatarTag
						text="Click to Remove"
						avatar={Avatar}
						removeButtonLabel="Remove"
						onBeforeRemoveAction={() => {
							// eslint-disable-next-line no-alert
							return window.confirm('Are you sure you want to remove this tag?');
						}}
						onAfterRemoveAction={(text) => {
							// eslint-disable-next-line no-console
							console.log(`Removed tag: ${text}`);
						}}
						testId="avatar-tag-callbacks"
					/>
				</Inline>
			</Stack>
		</Stack>
	);
}
