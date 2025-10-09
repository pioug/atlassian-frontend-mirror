import React from 'react';

import AvatarGroup from '@atlaskit/avatar-group';

import { appearances, RANDOM_USERS } from '../examples-util/data';
import { ExampleGroup } from '../examples-util/helpers';

const data = RANDOM_USERS.map((d, i) => ({
	key: d.email,
	name: d.name,
	appearance: appearances[i % appearances.length],
}));

export default () => {
	return (
		<>
			{(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<div style={{ maxWidth: 270 }}>
					<ExampleGroup heading="Display in a Stack">
						<AvatarGroup
							appearance="stack"
							onAvatarClick={console.log}
							data={data}
							size={size}
							testId="stack"
						/>
					</ExampleGroup>
					<ExampleGroup heading="Display as a Grid">
						<AvatarGroup
							appearance="grid"
							onAvatarClick={console.log}
							data={data}
							maxCount={size === 'xlarge' ? 4 : 10}
							size={size}
							testId="grid"
						/>
					</ExampleGroup>
				</div>
			))}
		</>
	);
};
