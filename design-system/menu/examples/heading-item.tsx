import React from 'react';

import { token } from '@atlaskit/tokens';

import { HeadingItem } from '../src';

export default () => (
	<>
		<HeadingItem>Actions</HeadingItem>
		<HeadingItem
			// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
			cssFn={() => ({ color: token('color.text.danger') })}
		>
			Actions
		</HeadingItem>
	</>
);
