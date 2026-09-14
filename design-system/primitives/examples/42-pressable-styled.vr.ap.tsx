import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Pressable } from '@atlaskit/primitives/pressable';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss';

const pressableStyles = xcss({
	borderRadius: 'radius.small',
	color: 'color.text.inverse',
});

export default function Styled(): React.JSX.Element {
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
