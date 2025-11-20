import React from 'react';

import { Stack } from '@atlaskit/primitives/compiled';
import { Card } from '@atlaskit/smart-card';

import { BlockCardLazyIcons, BlockCardLazyIconsFileType } from './utils/block-card-lazy-icons';
import ExampleContainer from './utils/example-container';

export default (): React.JSX.Element => (
	<>
		<ExampleContainer title="Block Lazy Icons">
			<Stack>
				<BlockCardLazyIcons CardComponent={Card} />
			</Stack>
		</ExampleContainer>
		<ExampleContainer title="Block Lazy Icons File Type">
			<Stack>
				<BlockCardLazyIconsFileType CardComponent={Card} />
			</Stack>
		</ExampleContainer>
	</>
);
