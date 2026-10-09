import React from 'react';

import Link from '@atlaskit/link/link';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives/inline';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives/stack';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';

import Card from './94-card';

const boxStyles = xcss({
	flexShrink: 0,
	marginBlock: 'space.025',
	width: 'size.100',
	height: 'size.100',
});

const SecondaryCard = (): React.JSX.Element => {
	return (
		<Card>
			<Inline space="space.200">
				<Box xcss={boxStyles} backgroundColor="color.background.neutral" />
				<Stack space="space.050">
					<span>
						<Link href="#id">Kudos in Kudos</Link>
					</span>
					<span>Did a coworker do something you really appreciated or inspire you by...</span>
				</Stack>
			</Inline>
		</Card>
	);
};

export default SecondaryCard;
