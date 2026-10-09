import React from 'react';

import Lozenge from '@atlaskit/lozenge/lozenge';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives/inline';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';

const wrapperStyles = xcss({
	backgroundColor: 'color.background.accent.red.subtlest',
	display: 'flex',
	blockSize: 'size.600',
	inlineSize: 'size.600',
	padding: 'space.100',
});

export default (): React.JSX.Element => {
	return (
		<Box xcss={wrapperStyles}>
			<Inline alignBlock="stretch" alignInline="center" grow="fill">
				{/* this Lozenge should not stretch vertically */}
				<Lozenge appearance="success" isBold>
					Hi there
				</Lozenge>
			</Inline>
		</Box>
	);
};
