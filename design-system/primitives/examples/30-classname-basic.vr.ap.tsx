import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives/inline';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss';
import { token } from '@atlaskit/tokens';

const containerStyles = xcss({ display: 'flex', flexDirection: 'row' });

const boxStyles = xcss({
	backgroundColor: 'color.background.danger',
	border: `${token('border.width.selected')} solid rebeccapurple`,
	padding: 'space.200',
	borderRadius: 'radius.xsmall',
});

const defaultStyles = xcss({
	backgroundColor: 'color.background.success',
	border: `${token('border.width.selected')} solid green`,
	borderRadius: 'radius.xsmall',
	opacity: 'opacity.disabled',
});

export default (): React.JSX.Element => (
	<Box xcss={containerStyles} padding="space.100">
		<Inline space="space.100" testId="classname-examples">
			<Box backgroundColor="color.background.discovery.bold" padding="space.200" xcss={boxStyles} />
			<Box
				backgroundColor="color.background.discovery.bold"
				padding="space.200"
				xcss={defaultStyles}
			/>
		</Inline>
	</Box>
);
