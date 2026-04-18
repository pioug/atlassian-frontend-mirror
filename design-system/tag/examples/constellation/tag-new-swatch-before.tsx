import React from 'react';

import { Inline, Stack } from '@atlaskit/primitives/compiled';
import { SimpleTag } from '@atlaskit/tag';
import { token } from '@atlaskit/tokens';

export default (): React.JSX.Element => (
	<Stack space="space.100">
		<Inline>
			<SimpleTag text="Project A" color="blue" swatchBefore />
		</Inline>
		<Inline>
			<SimpleTag
				text="Project B"
				color="blue"
				swatchBefore={token('color.background.accent.blue.subtler')}
			/>
		</Inline>
	</Stack>
);
