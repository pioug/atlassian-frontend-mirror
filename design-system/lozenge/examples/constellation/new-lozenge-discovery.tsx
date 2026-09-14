import React from 'react';

import Lozenge from '@atlaskit/lozenge/lozenge';
import { Inline } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => (
	<Inline space="space.100">
		<Lozenge appearance="discovery">New</Lozenge>
		<Lozenge appearance="discovery">Beta</Lozenge>
		<Lozenge appearance="discovery">Premium</Lozenge>
	</Inline>
);
