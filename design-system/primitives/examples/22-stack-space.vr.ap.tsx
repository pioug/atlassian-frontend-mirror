import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives/inline';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives/stack';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss';

const blockStyles = xcss({ borderRadius: 'radius.xsmall' });
const spaceItems = [
	'space.0',
	'space.025',
	'space.050',
	'space.075',
	'space.100',
	'space.150',
	'space.200',
	'space.250',
	'space.300',
	'space.400',
	'space.500',
	'space.600',
	'space.800',
	'space.1000',
] as const;

export default (): React.JSX.Element => (
	<Box testId="stack-example" padding="space.100">
		<Inline space="space.100">
			{spaceItems.map((space) => (
				<Stack key={space} alignInline="center">
					{space}
					<Stack space={space}>
						<Box
							xcss={blockStyles}
							padding="space.200"
							backgroundColor="color.background.discovery.bold"
						/>
						<Box
							xcss={blockStyles}
							padding="space.200"
							backgroundColor="color.background.discovery.bold"
						/>
					</Stack>
				</Stack>
			))}
		</Inline>
	</Box>
);
