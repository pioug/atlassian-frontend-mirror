import React from 'react';

import { Stack } from '@atlaskit/primitives';
import { Show } from '@atlaskit/primitives/responsive';

export default function Example() {
	return (
		<Stack alignInline="start" space="space.100">
			Try resizing your browser window
			<Show above="md">
				<strong>This text is visible only 1024px and above</strong>
			</Show>
		</Stack>
	);
}
