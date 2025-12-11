import React from 'react';

import Lozenge from '@atlaskit/lozenge';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Stack, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

export default function Example(): React.JSX.Element {
	return (
		<Stack space="space.100">
			<Box>
				<Text>
					default: <Lozenge testId="default-lozenge">Default</Lozenge>
				</Text>
			</Box>

			<Box>
				<Text>
					appearance: new{' '}
					<Lozenge appearance="new" testId="new-lozenge">
						New
					</Lozenge>
				</Text>
			</Box>

			<Box>
				<Text>
					style: {`{ backgroundColor: 'green' }`}{' '}
					<Lozenge
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							backgroundColor: 'green',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							color: token('color.text.inverse'),
						}}
						testId="themed-lozenge"
					>
						Success
					</Lozenge>
				</Text>
			</Box>
		</Stack>
	);
}
