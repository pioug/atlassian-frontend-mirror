import React from 'react';

import Lozenge from '@atlaskit/lozenge';
import { Inline } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => (
	<Inline space="space.100">
		<Lozenge appearance="warning">At risk</Lozenge>
		<Lozenge appearance="warning">Needs review</Lozenge>
	</Inline>
);
