import React from 'react';

import Lozenge from '@atlaskit/lozenge';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

export default function Example() {
	return (
		<Stack space="space.100" testId="test-container">
			<Text>
				default: <Lozenge>default</Lozenge>
			</Text>
			<Text>
				appearance: new <Lozenge appearance="new">New</Lozenge>
			</Text>
			<Text>
				style: {`{ backgroundColor: 'green' }`}{' '}
				<Lozenge
					testId="lozenge-custom-color1"
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						backgroundColor: 'green',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						color: token('color.text.inverse'),
					}}
				>
					Success
				</Lozenge>
			</Text>
			<Text>
				style: {`{ backgroundColor: 'yellow', color: 'blue' }`}{' '}
				<Lozenge
					testId="lozenge-custom-color2"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ backgroundColor: 'yellow', color: 'blue' }}
				>
					Custom
				</Lozenge>
			</Text>
		</Stack>
	);
}
