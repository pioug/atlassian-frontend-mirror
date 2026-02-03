import React from 'react';

import ImageIcon from '@atlaskit/icon/core/image';
import Lozenge from '@atlaskit/lozenge';
import { Stack } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => (
	<Stack>
		<p>
			<Lozenge appearance="information">Default</Lozenge>
		</p>
		<p>
			<Lozenge appearance="information" spacing="spacious">
				Spacious
			</Lozenge>
		</p>
		<p>
			<Lozenge appearance="information" spacing="spacious" iconBefore={ImageIcon}>
				Spacious with icon
			</Lozenge>
		</p>
	</Stack>
);
