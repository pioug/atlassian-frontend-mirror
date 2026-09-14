import React from 'react';

import Button from '@atlaskit/button/default/button';
import MaximizeIcon from '@atlaskit/icon/core/maximize';
import { Stack } from '@atlaskit/primitives/compiled/stack';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- TODO: migrate to @atlaskit/primitives/compiled
import { Hide } from '@atlaskit/primitives/responsive/hide';

export default function Example(): React.JSX.Element {
	return (
		<Stack alignInline="start" space="space.100">
			Try resizing your browser window
			<Button iconBefore={MaximizeIcon}>
				<Hide below="md">This text is visible only at larger breakpoints</Hide>
			</Button>
		</Stack>
	);
}
