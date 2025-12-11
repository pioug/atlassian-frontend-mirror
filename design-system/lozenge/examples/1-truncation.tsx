import React from 'react';

import Lozenge from '@atlaskit/lozenge';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack, Text } from '@atlaskit/primitives';

export default (): React.JSX.Element => (
	<Stack space="space.100">
		<Text>
			<Lozenge appearance="success">very very very wide text which truncates</Lozenge>
		</Text>
		<Text>
			<Lozenge appearance="success" isBold>
				very very very wide text which truncates
			</Lozenge>
		</Text>
	</Stack>
);
