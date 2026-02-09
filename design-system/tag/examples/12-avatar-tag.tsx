/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar';
import Heading from '@atlaskit/heading';
import { Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { AvatarTag } from '@atlaskit/tag';
import TeamAvatar from '@atlaskit/teams-avatar';
import { token } from '@atlaskit/tokens';

// Sample avatar images
const personImage1 = 'https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg';
const personImage2 =
	'https://pbs.twimg.com/profile_images/1673596394703265793/pLX-1Xil_400x400.jpg';
const personImage3 =
	'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png';
const agentImage = 'https://dummyimage.com/48x48/6554c0/ffffff&text=AI';

const tableStyles = css({
	width: '100%',
	borderCollapse: 'collapse',
});

const thStyles = css({
	backgroundColor: token('color.background.neutral.subtle'),
	borderBlockEndColor: token('color.border'),
	borderBlockEndStyle: 'solid',
	borderBlockEndWidth: token('border.width'),
	paddingBlockEnd: token('space.150'),
	paddingBlockStart: token('space.150'),
	paddingInlineEnd: token('space.150'),
	paddingInlineStart: token('space.150'),
	textAlign: 'left',
});

const tdStyles = css({
	borderBlockEndColor: token('color.border'),
	borderBlockEndStyle: 'solid',
	borderBlockEndWidth: token('border.width'),
	paddingBlockEnd: token('space.150'),
	paddingBlockStart: token('space.150'),
	paddingInlineEnd: token('space.150'),
	paddingInlineStart: token('space.150'),
	verticalAlign: 'middle',
});

const labelCellStyles = css({
	backgroundColor: token('color.background.neutral.subtle'),
	borderBlockEndColor: token('color.border'),
	borderBlockEndStyle: 'solid',
	borderBlockEndWidth: token('border.width'),
	fontWeight: token('font.weight.bold'),
	paddingBlockEnd: token('space.150'),
	paddingBlockStart: token('space.150'),
	paddingInlineEnd: token('space.150'),
	paddingInlineStart: token('space.150'),
	verticalAlign: 'middle',
});

export default function AvatarTagExample() {
	return (
		<Stack space="space.400">
			<Stack space="space.100">
				<Heading size="large">AvatarTag Examples</Heading>
				<Text>
					AvatarTag is a specialized tag for representing people/users, teams/other entities, or AI
					agents with an avatar and name. The visual appearance (round, square, or hexagonal) is
					determined by the type prop.
				</Text>
			</Stack>

			{/* Main comparison table */}
			<table css={tableStyles}>
				<thead>
					<tr>
						<th css={thStyles}>
							<Text weight="bold">Variant</Text>
						</th>
						<th css={thStyles}>
							<Text weight="bold">People (Circle)</Text>
						</th>
						<th css={thStyles}>
							<Text weight="bold">Other/Teams (Square)</Text>
						</th>
						<th css={thStyles}>
							<Text weight="bold">Agent (Hexagon)</Text>
						</th>
					</tr>
				</thead>
				<tbody>
					{/* Basic */}
					<tr>
						<td css={labelCellStyles}>Basic</td>
						<td css={tdStyles}>
							<Inline space="space.100" alignBlock="center">
								<AvatarTag
									type="user"
									text="John Doe"
									avatar={(props: any) => <Avatar {...props} src={personImage1} />}
									isRemovable={false}
									testId="avatar-tag-basic"
								/>
							</Inline>
						</td>
						<td css={tdStyles}>
							<Inline space="space.100" alignBlock="center">
								<AvatarTag
									type="other"
									text="Design Team"
									avatar={(props: any) => <TeamAvatar {...props} />}
									isRemovable={false}
									testId="avatar-tag-team-basic"
								/>
							</Inline>
						</td>
						<td css={tdStyles}>
							<Inline space="space.100" alignBlock="center">
								<AvatarTag
									type="agent"
									text="Rovo"
									avatar={(props: any) => <Avatar {...props} src={agentImage} />}
									isRemovable={false}
									testId="avatar-tag-agent-basic"
								/>
							</Inline>
						</td>
					</tr>

					{/* Removable */}
					<tr>
						<td css={labelCellStyles}>Removable</td>
						<td css={tdStyles}>
							<Inline space="space.100" alignBlock="center">
								<AvatarTag
									type="user"
									text="Jane Smith"
									avatar={(props: any) => <Avatar {...props} src={personImage2} />}
									removeButtonLabel="Remove"
									testId="avatar-tag-removable"
								/>
							</Inline>
						</td>
						<td css={tdStyles}>
							<Inline space="space.100" alignBlock="center">
								<AvatarTag
									type="other"
									text="Engineering"
									avatar={(props: any) => <TeamAvatar {...props} />}
									removeButtonLabel="Remove"
									testId="avatar-tag-team-removable"
								/>
							</Inline>
						</td>
						<td css={tdStyles}>
							<Inline space="space.100" alignBlock="center">
								<AvatarTag
									type="agent"
									text="AI Assistant"
									avatar={(props: any) => <Avatar {...props} src={agentImage} />}
									removeButtonLabel="Remove"
									testId="avatar-tag-agent-removable"
								/>
							</Inline>
						</td>
					</tr>

					{/* Linked */}
					<tr>
						<td css={labelCellStyles}>Linked</td>
						<td css={tdStyles}>
							<Inline space="space.100" alignBlock="center">
								<AvatarTag
									type="user"
									text="View Profile"
									avatar={(props: any) => <Avatar {...props} src={personImage3} />}
									href="https://atlassian.com"
									isRemovable={false}
									testId="avatar-tag-linked"
								/>
							</Inline>
						</td>
						<td css={tdStyles}>
							<Inline space="space.100" alignBlock="center">
								<AvatarTag
									type="other"
									text="View Team"
									avatar={(props: any) => <TeamAvatar {...props} />}
									href="https://atlassian.com"
									isRemovable={false}
									testId="avatar-tag-team-linked"
								/>
							</Inline>
						</td>
						<td css={tdStyles}>
							<Inline space="space.100" alignBlock="center">
								<AvatarTag
									type="agent"
									text="View Agent"
									avatar={(props: any) => <Avatar {...props} src={agentImage} />}
									href="https://atlassian.com"
									isRemovable={false}
									testId="avatar-tag-agent-linked"
								/>
							</Inline>
						</td>
					</tr>

					{/* Linked + Removable */}
					<tr>
						<td css={labelCellStyles}>Linked + Removable</td>
						<td css={tdStyles}>
							<Inline space="space.100" alignBlock="center">
								<AvatarTag
									type="user"
									text="Editable User"
									avatar={(props: any) => <Avatar {...props} src={personImage1} />}
									href="https://atlassian.com"
									removeButtonLabel="Remove"
									testId="avatar-tag-linked-removable"
								/>
							</Inline>
						</td>
						<td css={tdStyles}>
							<Inline space="space.100" alignBlock="center">
								<AvatarTag
									type="other"
									text="Editable Team"
									avatar={(props: any) => <TeamAvatar {...props} />}
									href="https://atlassian.com"
									removeButtonLabel="Remove"
									testId="avatar-tag-team-linked-removable"
								/>
							</Inline>
						</td>
						<td css={tdStyles}>
							<Inline space="space.100" alignBlock="center">
								<AvatarTag
									type="agent"
									text="Editable Agent"
									avatar={(props: any) => <Avatar {...props} src={agentImage} />}
									href="https://atlassian.com"
									removeButtonLabel="Remove"
									testId="avatar-tag-agent-linked-removable"
								/>
							</Inline>
						</td>
					</tr>

					{/* Verified (only for 'other' type) */}
					<tr>
						<td css={labelCellStyles}>Verified</td>
						<td css={tdStyles}>
							<Text size="small" color="color.text.subtlest">
								N/A (people type)
							</Text>
						</td>
						<td css={tdStyles}>
							<Inline space="space.100" alignBlock="center">
								<AvatarTag
									type="other"
									text="Verified Team"
									avatar={(props: any) => <TeamAvatar {...props} />}
									isVerified
									isRemovable={false}
									testId="avatar-tag-team-verified"
								/>
								<AvatarTag
									type="other"
									text="Verified + Removable"
									avatar={(props: any) => <TeamAvatar {...props} />}
									isVerified
									removeButtonLabel="Remove"
									testId="avatar-tag-team-verified-removable"
								/>
							</Inline>
						</td>
						<td css={tdStyles}>
							<Text size="small" color="color.text.subtlest">
								N/A (agent type)
							</Text>
						</td>
					</tr>

					{/* Long Names */}
					<tr>
						<td css={labelCellStyles}>Long Names (Truncation)</td>
						<td css={tdStyles}>
							<Inline space="space.100" alignBlock="center">
								<AvatarTag
									type="user"
									text="This is a very long name that will be truncated"
									avatar={(props: any) => <Avatar {...props} src={personImage2} />}
									isRemovable={false}
									testId="avatar-tag-long"
								/>
							</Inline>
						</td>
						<td css={tdStyles}>
							<Inline space="space.100" alignBlock="center">
								<AvatarTag
									type="other"
									text="This is a very long team name that will be truncated"
									avatar={(props: any) => <TeamAvatar {...props} />}
									isRemovable={false}
									testId="avatar-tag-team-long"
								/>
							</Inline>
						</td>
						<td css={tdStyles}>
							<Inline space="space.100" alignBlock="center">
								<AvatarTag
									type="agent"
									text="This is a very long agent name that will be truncated"
									avatar={(props: any) => <Avatar {...props} src={agentImage} />}
									isRemovable={false}
									testId="avatar-tag-agent-long"
								/>
							</Inline>
						</td>
					</tr>
				</tbody>
			</table>

			{/* Callbacks section */}
			<Stack space="space.200">
				<Heading size="medium">Callbacks</Heading>
				<Text size="small">
					AvatarTags support onBeforeRemoveAction and onAfterRemoveAction callbacks.
				</Text>
				<Inline space="space.100" alignBlock="center">
					<AvatarTag
						type="user"
						text="Click to Remove"
						avatar={(props: any) => <Avatar {...props} src={personImage1} />}
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
					<AvatarTag
						type="other"
						text="Click to Remove Team"
						avatar={(props: any) => <TeamAvatar {...props} />}
						removeButtonLabel="Remove"
						onBeforeRemoveAction={() => {
							// eslint-disable-next-line no-alert
							return window.confirm('Are you sure you want to remove this team tag?');
						}}
						onAfterRemoveAction={(text) => {
							// eslint-disable-next-line no-console
							console.log(`Removed team tag: ${text}`);
						}}
						testId="avatar-tag-team-callbacks"
					/>
				</Inline>
			</Stack>
		</Stack>
	);
}
