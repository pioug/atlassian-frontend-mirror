import React from 'react';

import { R300 } from '@atlaskit/theme/colors';

import { HeadingItem } from '../src';

const Example = () => (
	<>
		<HeadingItem>Actions</HeadingItem>
		<HeadingItem
			// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
			cssFn={() => ({ color: R300 })}
		>
			Actions
		</HeadingItem>
	</>
);

export default Example;
