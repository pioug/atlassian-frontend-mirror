import React from 'react';

import Blanket from '@atlaskit/blanket';

export default [
	<Blanket />,
	<Blanket isTinted onBlanketClicked={() => console.log('Blanket clicked')} />,
];
