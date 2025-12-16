import React from 'react';

import { Stack } from '@atlaskit/primitives/compiled';
import { Show } from '@atlaskit/primitives/responsive';

export default function Example(): React.JSX.Element {
	return (
		<Stack alignInline="start" space="space.100">
			Try resizing your browser window
			<Show above="md">
				<strong>This text is visible only 1024px and above</strong>
			</Show>
		</Stack>
	);
}
