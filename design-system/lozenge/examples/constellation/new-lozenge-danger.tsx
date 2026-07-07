import React from 'react';

import Lozenge from '@atlaskit/lozenge';
import { Inline } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => (
	<Inline space="space.100">
		<Lozenge appearance="danger">Blocked</Lozenge>
		<Lozenge appearance="danger">Failed</Lozenge>
		<Lozenge appearance="danger">Overdue</Lozenge>
	</Inline>
);
