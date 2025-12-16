import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Anchor, xcss } from '@atlaskit/primitives';

const anchorStyles = xcss({
	borderRadius: 'radius.small',
	color: 'color.text.inverse',
	display: 'inline-block',

	':hover': {
		color: 'color.text.inverse',
	},
});

export default function Default(): React.JSX.Element {
	return (
		<Anchor
			testId="anchor-styled"
			href="/home"
			backgroundColor="color.background.brand.bold"
			padding="space.100"
			xcss={anchorStyles}
		>
			I am an anchor
		</Anchor>
	);
}
