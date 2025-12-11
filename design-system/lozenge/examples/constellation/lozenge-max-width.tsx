import React from 'react';

import Lozenge from '@atlaskit/lozenge';

export default (): React.JSX.Element => (
	<div>
		<p>
			<Lozenge appearance="success">default max width with long text which truncates</Lozenge>
		</p>
		<p>
			<Lozenge appearance="success" maxWidth={100}>
				custom max width with long text which truncates
			</Lozenge>
		</p>
	</div>
);
