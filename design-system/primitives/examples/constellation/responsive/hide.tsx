import React from 'react';

import Button from '@atlaskit/button/new';
import MaximizeIcon from '@atlaskit/icon/core/maximize';
import { Stack } from '@atlaskit/primitives/compiled';
import { Hide } from '@atlaskit/primitives/responsive';

export default function Example() {
	return (
		<Stack alignInline="start" space="space.100">
			Try resizing your browser window
			<Button iconBefore={MaximizeIcon}>
				<Hide below="md">This text is visible only at larger breakpoints</Hide>
			</Button>
		</Stack>
	);
}
