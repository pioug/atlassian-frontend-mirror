import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import Flag from '@atlaskit/flag';
import { type AppearanceTypes } from '@atlaskit/flag/types';
import Stack from '@atlaskit/primitives/stack';

const actions = [
	{ content: 'Understood', onClick: noop },
	{ content: 'No Way!', onClick: noop },
];
const appearances: { [key: string]: { description: string; title: string } } = {
	normal: {
		description: 'We got fun and games. We got everything you want honey, we know the names.',
		title: 'Welcome to the jungle',
	},
	error: {
		description: 'You need to take action, something has gone terribly wrong!',
		title: 'Uh oh!',
	},
	info: {
		description: "This alert needs your attention, but it's not super important.",
		title: 'Hey, did you know...',
	},
	success: {
		description: 'Nothing to worry about, everything is going great!',
		title: 'Good news, everyone',
	},
	warning: {
		description: 'Pay attention to me, things are not going according to plan.',
		title: 'Heads up!',
	},
};

export default (): React.JSX.Element => (
	<Stack space="space.100">
		{Object.keys(appearances).map((type, idx) => (
			<Flag
				actions={actions}
				appearance={type as AppearanceTypes}
				description={appearances[type].description}
				id={type}
				key={type}
				title={appearances[type].title}
				testId={`flag-${type}`}
			/>
		))}
	</Stack>
);
