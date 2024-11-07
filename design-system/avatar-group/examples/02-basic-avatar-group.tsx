import React from 'react';

import { type AppearanceType, type SizeType } from '@atlaskit/avatar';
import AvatarGroup from '@atlaskit/avatar-group';

import { RANDOM_USERS } from '../examples-util/data';
import { ExampleGroup } from '../examples-util/helpers';

export default () => {
	const data = RANDOM_USERS.map((d) => ({
		key: d.email,
		name: d.name,
		appearance: 'circle' as AppearanceType,
		size: 'medium' as SizeType,
	}));

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ maxWidth: 270 }}>
			<ExampleGroup heading="Display in a Stack">
				<AvatarGroup
					appearance="stack"
					onAvatarClick={console.log}
					data={data}
					size="large"
					testId="stack"
				/>
			</ExampleGroup>
			<ExampleGroup heading="Display as a Grid">
				<AvatarGroup
					appearance="grid"
					onAvatarClick={console.log}
					data={data}
					maxCount={14}
					size="large"
					testId="grid"
				/>
			</ExampleGroup>
		</div>
	);
};
