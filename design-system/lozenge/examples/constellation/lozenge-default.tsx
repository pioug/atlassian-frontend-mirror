import React from 'react';

import Lozenge from '@atlaskit/lozenge/lozenge';

export default (): React.JSX.Element => (
	<>
		<div>
			<Lozenge>Default</Lozenge>
		</div>
		<div>
			<Lozenge isBold>Default bold</Lozenge>
		</div>
	</>
);
