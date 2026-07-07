import React from 'react';

import Lozenge from '@atlaskit/lozenge';
import { Inline } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => (
	<Inline space="space.100">
		<Lozenge appearance="success">Completed</Lozenge>
		<Lozenge appearance="success">On track</Lozenge>
		<Lozenge appearance="success">Approved</Lozenge>
	</Inline>
);
