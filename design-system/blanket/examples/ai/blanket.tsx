import React from 'react';

import Blanket from '@atlaskit/blanket';

const Examples = (): React.JSX.Element => (
	<>
		<Blanket />
		<Blanket isTinted onBlanketClicked={() => console.log('Blanket clicked')} />
	</>
);
export default Examples;
