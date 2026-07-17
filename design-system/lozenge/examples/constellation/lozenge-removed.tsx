import React from 'react';

import Lozenge from '@atlaskit/lozenge';

export default (): React.JSX.Element => (
	<>
		<div>
			<Lozenge appearance="danger">Removed</Lozenge>
		</div>
		<div>
			<Lozenge appearance="danger" isBold>
				Removed bold
			</Lozenge>
		</div>
	</>
);
