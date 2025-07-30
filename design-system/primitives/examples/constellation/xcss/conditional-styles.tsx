import React, { useState } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, xcss } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';

const baseStyles = xcss({
	paddingBlock: 'space.500',
	width: '100%',
	borderRadius: 'border.radius.100',
});

const enabledStyles = xcss({
	backgroundColor: 'color.background.accent.green.bolder',
});

const disabledStyles = xcss({
	backgroundColor: 'color.background.accent.gray.bolder',
});

export default function ConditionalStyles() {
	const [isEnabled, setEnabled] = useState(false);

	return (
		<Box testId="example" padding="space.200">
			<Inline alignBlock="center">
				<p>Toggle background color:</p>
				<Toggle onChange={() => setEnabled((current) => !current)} />
			</Inline>
			<Box xcss={[baseStyles, isEnabled ? enabledStyles : disabledStyles]} />
		</Box>
	);
}
