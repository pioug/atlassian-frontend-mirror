/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { Code } from '@atlaskit/code';
import Heading from '@atlaskit/heading';
import { Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import Tag from '@atlaskit/tag/new';
import type { NewTagColor } from '@atlaskit/tag/new';
import { token } from '@atlaskit/tokens';

const containerStyles = css({
	display: 'flex',
	gap: token('space.200'),
	flexDirection: 'column',
	paddingBlockEnd: token('space.200'),
	paddingBlockStart: token('space.200'),
	paddingInlineEnd: token('space.200'),
	paddingInlineStart: token('space.200'),
});

const sectionStyles = css({
	backgroundColor: token('color.background.neutral.subtle'),
	borderRadius: token('radius.small', '3px'),
	paddingBlockEnd: token('space.200'),
	paddingBlockStart: token('space.200'),
	paddingInlineEnd: token('space.200'),
	paddingInlineStart: token('space.200'),
});

const colors: NewTagColor[] = [
	'gray',
	'blue',
	'red',
	'yellow',
	'green',
	'teal',
	'purple',
	'lime',
	'orange',
	'magenta',
];

/**
 * Example using the new `/new` entrypoint which exports the new Tag component
 * directly without requiring the `platform-dst-lozenge-tag-badge-visual-uplifts` feature flag.
 *
 * This entrypoint is intended for products that don't have access to feature flags (e.g. Statsig).
 * It will be removed after the visual uplift rollout is complete, which will require cleanup in
 * callsites (updating import paths back to `@atlaskit/tag`).
 * If your app has access to feature flags, please use the default entrypoint instead.
 *
 * Usage: `import Tag from '@atlaskit/tag/new';`
 */
export default function NewEntrypointTagExample(): JSX.Element {
	return (
		<div css={containerStyles}>
			<Stack space="space.400">
				<Stack space="space.100">
					<Heading size="large">Tag — /new entrypoint</Heading>
					<Text>
						These tags are imported from <Code>@atlaskit/tag/new</Code> and render the new visual
						refresh without needing the feature flag. This entrypoint is intended for products that
						don't have access to feature flags. It will be removed after rollout, requiring callsite
						cleanup. If your app has access to feature flags, please use the default entrypoint
						instead.
					</Text>
				</Stack>

				{/* All colors - non-removable */}
				<div css={sectionStyles}>
					<Stack space="space.200">
						<Text weight="bold">All Colors (non-removable)</Text>
						<Inline space="space.100" alignBlock="center">
							{colors.map((color) => (
								<Tag key={color} text={color} color={color} isRemovable={false} />
							))}
						</Inline>
					</Stack>
				</div>

				{/* All colors - removable */}
				<div css={sectionStyles}>
					<Stack space="space.200">
						<Text weight="bold">All Colors (removable)</Text>
						<Inline space="space.100" alignBlock="center">
							{colors.map((color) => (
								<Tag
									key={color}
									text={color}
									color={color}
									isRemovable
									removeButtonLabel={`Remove ${color}`}
								/>
							))}
						</Inline>
					</Stack>
				</div>

				{/* As links */}
				<div css={sectionStyles}>
					<Stack space="space.200">
						<Text weight="bold">As Links</Text>
						<Inline space="space.100" alignBlock="center">
							<Tag
								text="Blue link"
								color="blue"
								href="https://atlassian.design"
								isRemovable={false}
							/>
							<Tag
								text="Green link"
								color="green"
								href="https://atlassian.design"
								isRemovable={false}
							/>
							<Tag
								text="Purple link"
								color="purple"
								href="https://atlassian.design"
								isRemovable={false}
							/>
						</Inline>
					</Stack>
				</div>

				{/* With max width / truncation */}
				<div css={sectionStyles}>
					<Stack space="space.200">
						<Text weight="bold">Truncation</Text>
						<Inline space="space.100" alignBlock="center">
							<Tag
								text="This is a very long tag text that should be truncated"
								color="blue"
								maxWidth="150px"
								isRemovable={false}
							/>
							<Tag text="Short" color="green" isRemovable={false} />
						</Inline>
					</Stack>
				</div>
			</Stack>
		</div>
	);
}
