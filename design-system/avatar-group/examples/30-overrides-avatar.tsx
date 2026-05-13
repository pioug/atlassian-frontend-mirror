import React, { Fragment } from 'react';

import AvatarGroup from '@atlaskit/avatar-group';
import { Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { RANDOM_USERS } from '../examples-util/random-users';

export default (): React.JSX.Element => {
	const data = RANDOM_USERS.map((d) => ({
		key: d.email,
		name: d.name,
	}));
	return (
		<Stack space="space.150">
			<AvatarGroup
				testId="overrides"
				appearance="stack"
				data={data}
				size="large"
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				overrides={{
					Avatar: {
						render: (Component, props, index) =>
							index % 2 === 0 ? (
								<Fragment key={`${index}-overridden`}>
									<Component
										{...props}
										key={index}
										appearance="hexagon"
										borderColor={token('color.border.focused')}
									/>
								</Fragment>
							) : (
								<Component {...props} key={index} />
							),
					},
				}}
			/>
		</Stack>
	);
};
