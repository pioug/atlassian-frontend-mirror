import React from 'react';

import Lozenge from '@atlaskit/lozenge';

export default (): React.JSX.Element => (
	<>
		<div>
			<Lozenge appearance="information">In progress</Lozenge>
		</div>
		<div>
			<Lozenge appearance="information" isBold>
				In progress bold
			</Lozenge>
		</div>
	</>
);
