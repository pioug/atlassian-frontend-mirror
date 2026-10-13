import React from 'react';

import Link from '@atlaskit/link/link';
import { Pulse } from '@atlaskit/linking-common/pulse/pulse';

export default function PulsePreview(): React.JSX.Element {
	return (
		<div data-testid="component-preview">
			<Pulse showPulse isInline>
				<Link href="https://example.com">New project link</Link>
			</Pulse>
		</div>
	);
}
