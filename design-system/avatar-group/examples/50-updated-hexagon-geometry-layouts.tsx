import React from 'react';

import AvatarGroup, { type AvatarGroupProps } from '@atlaskit/avatar-group/avatar-group';
import { cssMap, cx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

const data: AvatarGroupProps['data'] = [
	{ key: 'human-one', name: 'Human one', appearance: 'circle' },
	{ key: 'agent-one', name: 'Agent one', appearance: 'hexagon' },
	{ key: 'human-two', name: 'Human two', appearance: 'square' },
	{ key: 'agent-two', name: 'Agent two', appearance: 'hexagon' },
];

const variants: Array<{ label: string; UNSAFE_isUpdatedGeometry?: boolean }> = [
	{ label: 'Legacy' },
	{ label: 'Agent avatar', UNSAFE_isUpdatedGeometry: true },
];

const sizes = [
	{ label: 'small', legacySize: '24 x 24', size: 'small', v2Size: '23.25 x 25.875' },
	{ label: 'medium', legacySize: '32 x 32', size: 'medium', v2Size: '31 x 34.5' },
	{ label: 'large', legacySize: '40 x 40', size: 'large', v2Size: '38.75 x 43.125' },
	{ label: 'xlarge', legacySize: '96 x 96', size: 'xlarge', v2Size: '93 x 103.5' },
	{ label: 'xxlarge', legacySize: '128 x 128', size: 'xxlarge', v2Size: '124 x 138' },
] as const;

const styles = cssMap({
	compactWrapper: {
		borderColor: token('color.border.bold'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		boxSizing: 'border-box',
		display: 'inline-flex',
		overflow: 'hidden',
		alignItems: 'center',
	},
	smallCompactWrapper: {
		blockSize: '26px',
	},
	mediumCompactWrapper: {
		blockSize: '34px',
	},
	largeCompactWrapper: {
		blockSize: '42px',
	},
	xlargeCompactWrapper: {
		blockSize: '98px',
	},
	xxlargeCompactWrapper: {
		blockSize: '130px',
	},
});

const compactWrapperStyles = {
	small: styles.smallCompactWrapper,
	medium: styles.mediumCompactWrapper,
	large: styles.largeCompactWrapper,
	xlarge: styles.xlargeCompactWrapper,
	xxlarge: styles.xxlargeCompactWrapper,
};

const onAvatarClick: NonNullable<AvatarGroupProps['onAvatarClick']> = () => undefined;

const AgentAvatarV2GroupSizes = (): React.JSX.Element => (
	<Stack space="space.300">
		<Stack space="space.100">
			<Heading size="medium">Mixed human and agent AvatarGroup geometry</Heading>
			<Text as="p" color="color.text.subtle">
				AvatarGroup supports this POC at 24px, 32px, 40px, 96px, and 128px. It does not support 16px
				or 20px avatars. Each avatar is interactive; enable platform-dst-motion-uplift in the
				example toolbar to inspect its hover motion. Enable
				platform_editor_agent_mentions_drop_one_fixes to inspect the existing corrected border and
				focus-ring widths; this POC only changes layout geometry.
			</Text>
		</Stack>
		{sizes.map(({ label: sizeLabel, legacySize, size, v2Size }) => (
			<Stack key={size} space="space.100">
				<Heading as="h3" size="small">
					{sizeLabel}
				</Heading>
				<Inline space="space.400" alignBlock="center" shouldWrap>
					{variants.map(({ label, UNSAFE_isUpdatedGeometry }) => {
						const renderedSize = UNSAFE_isUpdatedGeometry ? v2Size : legacySize;

						return (
							<Stack key={label} space="space.100" alignInline="center">
								<Text>{`${label} · ${renderedSize}`}</Text>
								<AvatarGroup
									appearance="stack"
									data={data}
									isTooltipDisabled
									label={`${label} mixed avatar group with visible overflow at ${renderedSize}`}
									onAvatarClick={onAvatarClick}
									size={size}
									UNSAFE_isUpdatedGeometry={UNSAFE_isUpdatedGeometry}
								/>
								<Text>Compact wrapper · overflow hidden</Text>
								<Box xcss={cx(styles.compactWrapper, compactWrapperStyles[size])}>
									<AvatarGroup
										appearance="stack"
										data={data}
										isTooltipDisabled
										label={`${label} mixed avatar group in a compact overflow-hidden wrapper at ${renderedSize}`}
										onAvatarClick={onAvatarClick}
										size={size}
										UNSAFE_isUpdatedGeometry={UNSAFE_isUpdatedGeometry}
									/>
								</Box>
							</Stack>
						);
					})}
				</Inline>
			</Stack>
		))}
	</Stack>
);

export default AgentAvatarV2GroupSizes;
