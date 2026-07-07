import React from 'react';

import Lozenge from '@atlaskit/lozenge';
import { Inline } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => (
	<Inline space="space.100">
		<Lozenge appearance="information">In progress</Lozenge>
		<Lozenge appearance="information">Modified</Lozenge>
		<Lozenge appearance="information">Reviewing</Lozenge>
	</Inline>
);
