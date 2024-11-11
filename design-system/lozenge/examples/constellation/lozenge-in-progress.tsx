import React from 'react';

import Lozenge from '@atlaskit/lozenge';

export default () => (
	<>
		<div>
			<Lozenge appearance="inprogress">In progress</Lozenge>
		</div>
		<div>
			<Lozenge appearance="inprogress" isBold>
				In progress bold
			</Lozenge>
		</div>
	</>
);
