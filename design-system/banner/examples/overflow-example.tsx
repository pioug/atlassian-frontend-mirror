import React from 'react';

import Banner from '@atlaskit/banner';
import WarningIcon from '@atlaskit/icon/core/status-warning';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Stack, Text } from '@atlaskit/primitives';

const Padded = ({ children }: { children: React.ReactNode }) => (
	<Box paddingInline="space.200">
		<Text>{children}</Text>
	</Box>
);

export default (): React.JSX.Element => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	<Box as="span" style={{ width: 400 }}>
		<Stack space="space.200">
			<Banner icon={<WarningIcon spacing="spacious" label="Warning"  />}>
				JIRA Service Desk pricing has been updated. Please migrate within 3 months.
			</Banner>
			<Padded>
				There should only be 1 line of text, with ellipsis (…) shown when text overflows.
			</Padded>
		</Stack>
	</Box>
);
