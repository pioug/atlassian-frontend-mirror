import React from 'react';

import { Stack } from '@atlaskit/primitives';

import { BlockCardLazyIcons, BlockCardLazyIconsFileType } from './utils/block-card-lazy-icons';
import ExampleContainer from './utils/example-container';

export default () => (
	<>
		<ExampleContainer title="Block Lazy Icons">
			<Stack>
				<BlockCardLazyIcons />
			</Stack>
		</ExampleContainer>
		<ExampleContainer title="Block Lazy Icons File Type">
			<Stack>
				<BlockCardLazyIconsFileType />
			</Stack>
		</ExampleContainer>
	</>
);
