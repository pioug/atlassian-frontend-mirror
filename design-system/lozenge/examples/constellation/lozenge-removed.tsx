import React from 'react';

import Lozenge from '@atlaskit/lozenge';

export default (): React.JSX.Element => (
	<>
		<div>
			<Lozenge appearance="removed">Removed</Lozenge>
		</div>
		<div>
			<Lozenge appearance="removed" isBold>
				Removed bold
			</Lozenge>
		</div>
	</>
);
