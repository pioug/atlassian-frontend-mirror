import React from 'react';

import Lozenge from '@atlaskit/lozenge';

export default () => (
	<>
		<div>
			<Lozenge appearance="success">Success</Lozenge>
		</div>
		<div>
			<Lozenge appearance="success" isBold>
				Success bold
			</Lozenge>
		</div>
	</>
);
