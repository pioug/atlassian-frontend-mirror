import React from 'react';

import Heading from '@atlaskit/heading/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives/inline';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives/stack';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss';

const flexContainerStyles = xcss({ display: 'flex' });
const fixedWidthFlexContainerStyles = xcss({ display: 'flex', width: '300px' });
const flex1Styles = xcss({ borderStyle: 'solid', flex: '1' });
const flexGrow0Styles = xcss({ borderStyle: 'solid', flexGrow: '0' });
const flexGrow1Styles = xcss({ borderStyle: 'solid', flexGrow: '1' });

export default (): React.JSX.Element => {
	return (
		<Stack space="space.400" alignInline="start">
			<Stack space="space.200" testId="box-with-flex">
				<Heading size="medium">flex</Heading>
				<Inline space="space.200" alignBlock="center">
					<Box padding="space.400" xcss={flexContainerStyles}>
						<Box xcss={flex1Styles}>flex=1</Box>
						<Box xcss={flex1Styles}>flex=1</Box>
					</Box>
				</Inline>
			</Stack>

			<Stack space="space.200" testId="box-with-flex">
				<Heading size="medium">flexGrow</Heading>
				<Inline space="space.200" alignBlock="center">
					<Box xcss={fixedWidthFlexContainerStyles} padding="space.400">
						<Box xcss={flexGrow0Styles}>flexGrow=0</Box>
						<Box xcss={flexGrow1Styles}>flexGrow=1</Box>
					</Box>
				</Inline>
			</Stack>
		</Stack>
	);
};
