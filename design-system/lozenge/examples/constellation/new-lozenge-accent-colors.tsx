import React from 'react';

import Lozenge from '@atlaskit/lozenge';
import { Inline } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => (
	<Inline space="space.100">
			<Lozenge appearance="accent-red">Red</Lozenge>
			<Lozenge appearance="accent-orange">Orange</Lozenge>
			<Lozenge appearance="accent-yellow">Yellow</Lozenge>
			<Lozenge appearance="accent-lime">Lime</Lozenge>
			<Lozenge appearance="accent-green">Green</Lozenge>
			<Lozenge appearance="accent-teal">Teal</Lozenge>
			<Lozenge appearance="accent-blue">Blue</Lozenge>
			<Lozenge appearance="accent-purple">Purple</Lozenge>
			<Lozenge appearance="accent-magenta">Magenta</Lozenge>
			<Lozenge appearance="accent-gray">Gray</Lozenge>
	</Inline>
);
