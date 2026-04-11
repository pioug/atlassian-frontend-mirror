/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar';
import { Code } from '@atlaskit/code';
import Heading from '@atlaskit/heading';
import { Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import Tag, { AvatarTag, RemovableTag, SimpleTag } from '@atlaskit/tag';
import TeamAvatar from '@atlaskit/teams-avatar';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import TagNew from '../src/tag-new/tag-new';

const containerStyles = css({
	display: 'flex',
	padding: 'var(--ds-space-200, 16px)',
	gap: 'var(--ds-space-200, 16px)',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	flexDirection: 'column' as const,
});

const sectionStyles = css({
	padding: 'var(--ds-space-200, 16px)',
	backgroundColor: 'var(--ds-surface-sunken, #F7F8F9)',
	borderRadius: 'var(--ds-border-radius-200, 8px)',
});

const lozengeStyle = {
	style: {
		color: 'pink',
	},
};

export default function TagVisualUplifts(): JSX.Element {
	return (
		<div css={containerStyles}>
			<Stack space="space.400">
				{/* Header */}
				<Stack space="space.100">
					<Heading size="large">Tag Visual Refresh Testing</Heading>
					<Text>
						Toggle the feature flag <Code>platform-dst-lozenge-tag-badge-visual-uplifts</Code> to
						see the visual differences.
					</Text>
				</Stack>

				{/* Simple Tags with Old API */}
				<div css={sectionStyles}>
					<Stack space="space.200">
						<Text weight="bold">Simple Tags (Old API - will map to new colors with FF on)</Text>
						<Inline space="space.100" alignBlock="center">
							<SimpleTag text="Standard" color="standard" testId="tag-standard" />
							<SimpleTag text="Grey" color="grey" testId="tag-grey" />
							<SimpleTag text="Blue" color="blue" testId="tag-blue" />
							<SimpleTag text="Red" color="red" testId="tag-red" />
							<SimpleTag text="Green" color="green" testId="tag-green" />
							<SimpleTag text="Yellow" color="yellow" testId="tag-yellow" />
							<SimpleTag text="Purple" color="purple" testId="tag-purple" />
							<SimpleTag text="Lime" color="lime" testId="tag-lime" />
							<SimpleTag text="Magenta" color="magenta" testId="tag-magenta" />
							<SimpleTag text="Orange" color="orange" testId="tag-orange" />
							<SimpleTag text="Teal" color="teal" testId="tag-teal" />
							<SimpleTag
								text="Blue with swatch before"
								color="blue"
								testId="tag-blue-swatch"
								swatchBefore
							/>
							<SimpleTag
								text="Green with custom swatch"
								color="green"
								testId="tag-green-custom-swatch"
								swatchBefore={token('color.background.accent.orange.subtle')}
							/>
						</Inline>
					</Stack>
				</div>

				{/* Removable Tags */}
				<div css={sectionStyles}>
					<Stack space="space.200">
						<Text weight="bold">Removable Tags (with remove button)</Text>
						<Inline space="space.100" alignBlock="center">
							<RemovableTag
								text="Removable Grey"
								color="grey"
								removeButtonLabel="Remove"
								testId="removable-grey"
							/>
							<RemovableTag
								text="Removable Blue"
								color="blue"
								removeButtonLabel="Remove"
								testId="removable-blue"
							/>
							<RemovableTag
								text="Removable Red"
								color="red"
								removeButtonLabel="Remove"
								testId="removable-red"
							/>
							<RemovableTag
								text="Removable Green"
								color="green"
								removeButtonLabel="Remove"
								testId="removable-green"
							/>
						</Inline>
					</Stack>
				</div>

				{/* Link Tags */}
				<div css={sectionStyles}>
					<Stack space="space.200">
						<Text weight="bold">Link Tags (clickable)</Text>
						<Inline space="space.100" alignBlock="center">
							<SimpleTag
								text="Link Tag"
								color="blue"
								href="https://atlassian.com"
								testId="link-tag"
							/>
							<SimpleTag text="Another Link" color="purple" href="#" testId="link-tag-2" />
						</Inline>
					</Stack>
				</div>

				{/* New TagNew Component (Direct Usage) */}
				<div css={sectionStyles}>
					<Stack space="space.200">
						<Text weight="bold">TagNew Component (Direct - New Color Names)</Text>
						<Text size="small">All new color names</Text>
						<Inline space="space.100" alignBlock="center">
							<TagNew color="gray" text="Gray" testId="tag-new-gray" isRemovable={false} />
							<TagNew color="blue" text="Blue" testId="tag-new-blue" isRemovable={false} />
							<TagNew color="red" text="Red" testId="tag-new-red" isRemovable={false} />
							<TagNew color="yellow" text="Yellow" testId="tag-new-yellow" isRemovable={false} />
							<TagNew color="green" text="Green" testId="tag-new-green" isRemovable={false} />
							<TagNew color="teal" text="Teal" testId="tag-new-teal" isRemovable={false} />
							<TagNew color="purple" text="Purple" testId="tag-new-purple" isRemovable={false} />
							<TagNew color="lime" text="Lime" testId="tag-new-lime" isRemovable={false} />
							<TagNew color="orange" text="Orange" testId="tag-new-orange" isRemovable={false} />
							<TagNew color="magenta" text="Magenta" testId="tag-new-magenta" isRemovable={false} />
						</Inline>
					</Stack>
				</div>

				{/* TagNew with elements */}
				<div css={sectionStyles}>
					<Stack space="space.200">
						<Text weight="bold">TagNew with Elements</Text>
						<Inline space="space.100" alignBlock="center">
							<TagNew
								color="blue"
								text="With Icon"
								elemBefore={<span>🚀</span>}
								testId="tag-with-before"
								isRemovable={false}
							/>
							<TagNew
								color="red"
								text="Removable"
								removeButtonLabel="Remove"
								testId="tag-removable"
							/>
							<TagNew
								color="green"
								text="Non-removable"
								isRemovable={false}
								testId="tag-non-removable"
							/>
						</Inline>
					</Stack>
				</div>

				{/* TagNew leading swatch */}
				<div css={sectionStyles}>
					<Stack space="space.200">
						<Text weight="bold">Swatch Before</Text>
						<Text size="small">
							<code>swatchBefore</code> adds a 12×12px block before <code>elemBefore</code>. Use{' '}
							<code>true</code> for the tag color&apos;s accent subtle background, or a design token
							path string (resolved with <code>token()</code> inside the component).
						</Text>
						<Inline space="space.100" alignBlock="center" shouldWrap>
							<TagNew
								color="gray"
								text="Tag"
								swatchBefore
								testId="tag-new-swatch-gray"
								isRemovable={false}
							/>
							<TagNew
								color="blue"
								text="Tag"
								swatchBefore
								testId="tag-new-swatch-blue"
								isRemovable={false}
							/>
							<TagNew
								color="red"
								text="Tag"
								swatchBefore
								testId="tag-new-swatch-red"
								isRemovable={false}
							/>
							<TagNew
								text="Tag link"
								color="teal"
								swatchBefore
								testId="tag-new-swatch-teal"
								href="https://atlassian.com"
								isRemovable={false}
							/>
							<TagNew color="yellow" text="Tag" swatchBefore testId="tag-new-swatch-yellow" />
							<TagNew
								color="gray"
								text="Custom token"
								swatchBefore={token('color.background.accent.purple.subtle')}
								testId="tag-new-swatch-custom-token"
								isRemovable={false}
							/>
							<TagNew
								color="teal"
								text="Swatch + icon"
								swatchBefore
								elemBefore={<span>🚀</span>}
								testId="tag-new-swatch-with-before"
								isRemovable={false}
							/>
						</Inline>
					</Stack>
				</div>

				{/* AvatarTag Component - People */}
				<div css={sectionStyles}>
					<Stack space="space.200">
						<Text weight="bold">AvatarTag Component - People (for users/people)</Text>
						<Text size="small">
							Use AvatarTag with type="user" for user tags. Rounded pill design with circular
							avatar.
						</Text>
						<Inline space="space.100" alignBlock="center">
							<AvatarTag
								type="user"
								text="John Doe"
								avatar={Avatar}
								testId="avatar-tag-1"
								isRemovable={false}
							/>
							<AvatarTag
								type="user"
								text="Jane Smith"
								avatar={Avatar}
								testId="avatar-tag-2"
								isRemovable={false}
							/>
							<AvatarTag
								type="user"
								text="Bob Johnson"
								avatar={Avatar}
								removeButtonLabel="Remove"
								testId="avatar-tag-removable"
							/>
							<AvatarTag
								type="user"
								text="Linked User"
								avatar={Avatar}
								href="https://atlassian.com"
								isRemovable={false}
								testId="avatar-tag-linked"
							/>
							<AvatarTag
								type="user"
								text="Linked + Removable"
								avatar={Avatar}
								href="https://atlassian.com"
								removeButtonLabel="Remove"
								testId="avatar-tag-linked-removable"
							/>
						</Inline>
					</Stack>
				</div>

				{/* AvatarTag Component - Other/Teams */}
				<div css={sectionStyles}>
					<Stack space="space.200">
						<Text weight="bold">AvatarTag Component - Other (for teams/groups)</Text>
						<Text size="small">
							Use AvatarTag with type="other" for team/group tags. Square design with rounded
							corners and team avatar support.
						</Text>
						<Inline space="space.100" alignBlock="center">
							<AvatarTag
								type="other"
								text="Design System Team"
								avatar={TeamAvatar}
								testId="avatar-tag-team-1"
								isRemovable={false}
							/>
							<AvatarTag
								type="other"
								text="Engineering Team"
								avatar={TeamAvatar}
								testId="avatar-tag-team-2"
								isRemovable={false}
							/>
							<AvatarTag
								type="other"
								text="Product Team"
								avatar={TeamAvatar}
								removeButtonLabel="Remove"
								testId="avatar-tag-team-removable"
							/>
							<AvatarTag
								type="other"
								text="Linked Team"
								avatar={TeamAvatar}
								href="https://atlassian.com"
								isRemovable={false}
								testId="avatar-tag-team-linked"
							/>
							<AvatarTag
								type="other"
								text="Linked + Removable Team"
								avatar={TeamAvatar}
								href="https://atlassian.com"
								removeButtonLabel="Remove"
								testId="avatar-tag-team-linked-removable"
							/>
						</Inline>
					</Stack>
				</div>

				{/* AvatarTag Component - Agent */}
				<div css={sectionStyles}>
					<Stack space="space.200">
						<Text weight="bold">AvatarTag Component - Agent (for AI agents)</Text>
						<Text size="small">
							Use AvatarTag with type="agent" for AI agent tags. Hexagonal design for agent
							entities.
						</Text>
						<Inline space="space.100" alignBlock="center">
							<AvatarTag
								type="agent"
								text="Rovo"
								avatar={Avatar}
								testId="avatar-tag-agent-1"
								isRemovable={false}
							/>
							<AvatarTag
								type="agent"
								text="AI Assistant"
								avatar={Avatar}
								testId="avatar-tag-agent-2"
								isRemovable={false}
							/>
							<AvatarTag
								type="agent"
								text="Removable Agent"
								avatar={Avatar}
								removeButtonLabel="Remove"
								testId="avatar-tag-agent-removable"
							/>
						</Inline>
					</Stack>
				</div>

				{/* Color Mapping Reference */}
				<div css={sectionStyles}>
					<Stack space="space.200">
						<Text weight="bold">Color Mapping Reference</Text>
						<Text size="small">
							When feature flag is ON, old color names map to new color names:
						</Text>
						<Stack space="space.050">
							<Text size="small">• standard → gray</Text>
							<Text size="small">• grey → gray</Text>
							<Text size="small">• blue → blue</Text>
							<Text size="small">• green → green</Text>
							<Text size="small">• red → red</Text>
							<Text size="small">• yellow → yellow</Text>
							<Text size="small">• purple → purple</Text>
							<Text size="small">• lime → lime</Text>
							<Text size="small">• magenta → magenta</Text>
							<Text size="small">• orange → orange</Text>
							<Text size="small">• teal → teal</Text>
						</Stack>
					</Stack>
				</div>

				{/* Style Prop Preservation */}
				<div css={sectionStyles}>
					<Stack space="space.200">
						<Text weight="bold">Style Prop Preservation (Lozenge → Tag Migration)</Text>
						<Text size="small">
							When migrating from Lozenge to Tag, the <code>style</code> prop is preserved.
						</Text>
						<Inline space="space.100" alignBlock="center">
							{/* Before: <Lozenge appearance="success" style={{ color: 'pink' }}>With maxWidth</Lozenge> */}
							<Tag
								text="With style prop of color pink"
								color="lime"
								migration_fallback="lozenge"
								testId="migration-style-maxwidth"
								{...lozengeStyle}
							/>
						</Inline>
					</Stack>
				</div>
			</Stack>
		</div>
	);
}
