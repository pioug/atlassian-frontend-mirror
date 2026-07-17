import React from 'react';

import Lozenge from '@atlaskit/lozenge';

export default (): React.JSX.Element => (
	<>
		<div>
			<Lozenge appearance="discovery">New</Lozenge>
		</div>
		<div>
			<Lozenge appearance="discovery" isBold>
				New bold
			</Lozenge>
		</div>
	</>
);
