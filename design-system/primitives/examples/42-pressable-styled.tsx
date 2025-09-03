import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Pressable, xcss } from '@atlaskit/primitives';

const pressableStyles = xcss({
	borderRadius: 'radius.small',
	color: 'color.text.inverse',
});

export default function Styled() {
	return (
		<Pressable
			testId="pressable-styled"
			backgroundColor="color.background.brand.bold"
			padding="space.100"
			xcss={pressableStyles}
		>
			Press me
		</Pressable>
	);
}
