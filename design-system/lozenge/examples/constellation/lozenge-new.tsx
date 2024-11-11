import React from 'react';

import Lozenge from '@atlaskit/lozenge';

export default () => (
	<>
		<div>
			<Lozenge appearance="new">New</Lozenge>
		</div>
		<div>
			<Lozenge appearance="new" isBold>
				New bold
			</Lozenge>
		</div>
	</>
);
