import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import type { SizeType } from '@atlaskit/avatar/types';
import Heading from '@atlaskit/heading/heading';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

const sizes: Array<{
	label: string;
	legacySize: string;
	size: SizeType;
	v2Size: string;
}> = [
	{ label: 'xxsmall', legacySize: '16 x 16', size: 'xxsmall', v2Size: '15.5 x 17.25' },
	{ label: 'small', legacySize: '24 x 24', size: 'small', v2Size: '23.25 x 25.875' },
	{ label: 'medium', legacySize: '32 x 32', size: 'medium', v2Size: '31 x 34.5' },
	{ label: 'large', legacySize: '40 x 40', size: 'large', v2Size: '38.75 x 43.125' },
	{ label: 'xlarge', legacySize: '96 x 96', size: 'xlarge', v2Size: '93 x 103.5' },
	{ label: 'xxlarge', legacySize: '128 x 128', size: 'xxlarge', v2Size: '124 x 138' },
];

const variants: Array<{ label: string; UNSAFE_isUpdatedGeometry?: boolean }> = [
	{ label: 'Legacy' },
	{ label: 'Updated geometry', UNSAFE_isUpdatedGeometry: true },
];

const AgentAvatarSizes = (): React.JSX.Element => (
	<Stack space="space.300">
		<Stack space="space.100">
			<Heading size="medium">Updated hexagon geometry</Heading>
			<Text as="p" color="color.text.subtle">
				The updated geometry applies only to 16px, 24px, 32px, 40px, 96px, and 128px hexagon
				avatars. The 20px size intentionally retains the legacy geometry. Enable
				platform_editor_agent_mentions_drop_one_fixes in the example toolbar to inspect the existing
				corrected border and focus-ring widths; this POC only changes layout geometry.
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
								<Avatar
									appearance="hexagon"
									name={`${label} agent avatar at ${renderedSize}`}
									size={size}
									UNSAFE_isUpdatedGeometry={UNSAFE_isUpdatedGeometry}
								/>
							</Stack>
						);
					})}
				</Inline>
			</Stack>
		))}
	</Stack>
);

export default AgentAvatarSizes;
