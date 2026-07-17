import React from 'react';

import { Inline, Stack } from '@atlaskit/primitives/compiled';
import Tag from '@atlaskit/tag';
import { token } from '@atlaskit/tokens';

export default (): React.JSX.Element => (
	<Stack space="space.100">
		<Inline>
			<Tag text="Project A" color="blue" swatchBefore isRemovable={false} />
		</Inline>
		<Inline>
			<Tag
				text="Project B"
				color="blue"
				swatchBefore={token('color.background.accent.blue.subtler')}
				isRemovable={false}
			/>
		</Inline>
	</Stack>
);
