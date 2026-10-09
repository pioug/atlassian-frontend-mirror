import React, { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives/stack';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';

const centeredFormStyles = xcss({
	height: '100%',
	width: '300px',
	margin: 'auto',
});

export const CenteredForm = ({ children }: { children: ReactNode }): React.JSX.Element => (
	<Stack alignInline="center" alignBlock="center" grow="fill" xcss={centeredFormStyles}>
		<Box>{children}</Box>
	</Stack>
);
